# JWT Authentication

Link: <https://github.com/architanayak/golang-jwt-authentication/blob/main/main.go>

Full runnable code: [example.go](example.go). It is an updated version of the linked repo:

- `github.com/golang-jwt/jwt/v5` (the original used the old v3 import `github.com/golang-jwt/jwt`), `gorm.io/gorm` v2 (instead of `jinzhu/gorm`) and the standard `http.ServeMux` with Go 1.22 patterns (instead of `gorilla/mux` + `gorilla/handlers`).
- Security fixes: secrets from env vars, password hash never returned in JSON, the client can't choose its role, token in `Authorization: Bearer`, algorithm pinned to HS256, claims passed in the request context (not in a request header), proper HTTP status codes, one DB pool instead of opening a connection per request, no `log.Fatal` inside handlers.

```bash
go mod init authdemo
go get gorm.io/gorm gorm.io/driver/postgres github.com/golang-jwt/jwt/v5 golang.org/x/crypto/bcrypt
export DATABASE_URL="postgres://postgres:secret@localhost/userdb?sslmode=disable"
export JWT_SECRET="$(openssl rand -hex 32)"
go run .
```

## 1. models

```go
// User is for storing User details.
type User struct {
	gorm.Model
	Name         string `json:"name"`
	Email        string `gorm:"uniqueIndex;not null" json:"email"`
	PasswordHash string `gorm:"not null" json:"-"` // never serialized
	Role         string `gorm:"not null;default:user" json:"role"`
}

// SignUpRequest is the sign up payload (the role is NOT accepted from the client).
type SignUpRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Authentication is for login data.
type Authentication struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Token is returned for correct login credentials.
type Token struct {
	Role        string `json:"role"`
	Email       string `json:"email"`
	TokenString string `json:"token"`
}

// Claims are the fields stored in the JWT.
type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims // exp, iat, sub...
}

// App holds the dependencies shared by the handlers (no globals).
type App struct {
	db        *gorm.DB
	secret    []byte
	dummyHash []byte
}
```

Helpers used by the handlers:

```go
func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		slog.Error("encode response", "err", err)
	}
}

func writeError(w http.ResponseWriter, status int, message string) {
	writeJSON(w, status, Error{IsError: true, Message: message})
}

func decodeJSON(w http.ResponseWriter, r *http.Request, dst any) error {
	r.Body = http.MaxBytesReader(w, r.Body, maxBodySize) // limit the body size
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	return dec.Decode(dst)
}
```

## 2. Sign Up process

```go
func (a *App) SignUp(w http.ResponseWriter, r *http.Request) {
	var req SignUpRequest
	if err := decodeJSON(w, r, &req); err != nil {
		writeError(w, http.StatusBadRequest, "Error in reading payload")
		return
	}
	req.Email = normalizeEmail(req.Email)
	if req.Email == "" || len(req.Password) < 8 {
		writeError(w, http.StatusBadRequest, "Email and a password of at least 8 characters are required")
		return
	}

	hash, err := GenerateHashPassword(req.Password)
	if errors.Is(err, bcrypt.ErrPasswordTooLong) {
		writeError(w, http.StatusBadRequest, "Password too long (max 72 bytes)")
		return
	}
	if err != nil {
		slog.Error("hash password", "err", err)
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	// Never trust a role sent by the client: new users are always "user".
	user := User{Name: req.Name, Email: req.Email, PasswordHash: hash, Role: "user"}

	// The unique index is the real check (no race between "exists?" and "insert").
	err = a.db.WithContext(r.Context()).Create(&user).Error
	if errors.Is(err, gorm.ErrDuplicatedKey) { // needs gorm.Config{TranslateError: true}
		writeError(w, http.StatusConflict, "Email already in use")
		return
	}
	if err != nil {
		slog.Error("create user", "err", err)
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	writeJSON(w, http.StatusCreated, user) // PasswordHash is not serialized (json:"-")
}
```

### Generate password hash

bcrypt generates a random salt and stores it inside the hash (`$2a$12$<salt><hash>`). Cost `12` takes ~250ms; the original `14` takes ~1s per login, which is an easy DoS. bcrypt only uses the first **72 bytes**; since 2023 `golang.org/x/crypto/bcrypt` returns `bcrypt.ErrPasswordTooLong` instead of silently truncating. (Argon2id, `golang.org/x/crypto/argon2`, is the modern alternative.)

```go
func GenerateHashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	return string(bytes), err
}
```

### Check password

`CompareHashAndPassword` is already constant-time. Never compare hashes with `==`.

```go
func CheckPasswordHash(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}
```

### Generate JWT

```go
func (a *App) GenerateJWT(email, role string) (string, error) {
	now := time.Now()
	claims := Claims{
		Email: email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   email,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(tokenTTL)), // 30 minutes
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(a.secret)
}
```

The JWT payload is only base64-encoded, **not encrypted**: anyone can read it. Don't put secrets in it.

## 3. Sign In process

```go
func (a *App) SignIn(w http.ResponseWriter, r *http.Request) {
	var authDetails Authentication
	if err := decodeJSON(w, r, &authDetails); err != nil {
		writeError(w, http.StatusBadRequest, "Error in reading payload")
		return
	}

	var authUser User
	err := a.db.WithContext(r.Context()).
		Where("email = ?", normalizeEmail(authDetails.Email)).
		First(&authUser).Error
	switch {
	case errors.Is(err, gorm.ErrRecordNotFound):
		// Spend the same time as a real check so attackers can't detect valid emails.
		_ = bcrypt.CompareHashAndPassword(a.dummyHash, []byte(authDetails.Password))
		writeError(w, http.StatusUnauthorized, "Username or Password is incorrect")
		return
	case err != nil:
		slog.Error("find user", "err", err)
		writeError(w, http.StatusInternalServerError, "Internal error")
		return
	}

	if !CheckPasswordHash(authDetails.Password, authUser.PasswordHash) {
		// Same message as above: don't reveal which part was wrong.
		writeError(w, http.StatusUnauthorized, "Username or Password is incorrect")
		return
	}

	validToken, err := a.GenerateJWT(authUser.Email, authUser.Role)
	if err != nil {
		slog.Error("generate token", "err", err)
		writeError(w, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	slog.Info("user signed in", "email", authUser.Email) // never log passwords or tokens
	writeJSON(w, http.StatusOK, Token{Email: authUser.Email, Role: authUser.Role, TokenString: validToken})
}
```

## 4. Middleware function

`IsAuthorized()` verifies the token and, if it is valid, checks that the role stored in the token is one of the allowed roles for the route. The claims are stored in the request **context** so the handler can read them.

There are two roles: **admin** and **user**.

```go
func (a *App) IsAuthorized(next http.HandlerFunc, roles ...string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tokenString, ok := strings.CutPrefix(r.Header.Get("Authorization"), "Bearer ")
		if !ok || tokenString == "" {
			w.Header().Set("WWW-Authenticate", "Bearer")
			writeError(w, http.StatusUnauthorized, "No token found")
			return
		}

		claims, err := a.parseJWT(tokenString)
		if errors.Is(err, jwt.ErrTokenExpired) {
			writeError(w, http.StatusUnauthorized, "Your token has expired")
			return
		}
		if err != nil {
			writeError(w, http.StatusUnauthorized, "Invalid token")
			return
		}

		if len(roles) > 0 && !slices.Contains(roles, claims.Role) {
			writeError(w, http.StatusForbidden, "Not authorized")
			return
		}

		// Pass the claims in the request context, not in a header the client could forge.
		ctx := context.WithValue(r.Context(), ctxKey{}, claims)
		next(w, r.WithContext(ctx))
	}
}

// parseJWT validates signature, algorithm and expiration.
func (a *App) parseJWT(tokenString string) (*Claims, error) {
	claims := &Claims{}
	_, err := jwt.ParseWithClaims(tokenString, claims,
		func(*jwt.Token) (any, error) { return a.secret, nil },
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}), // reject "none", RS256...
		jwt.WithExpirationRequired(),
	)
	if err != nil {
		return nil, err
	}
	return claims, nil
}

// claimsFrom returns the claims stored by IsAuthorized.
func claimsFrom(ctx context.Context) *Claims {
	c, _ := ctx.Value(ctxKey{}).(*Claims)
	return c
}
```

`401 Unauthorized` = not authenticated (no/invalid token). `403 Forbidden` = authenticated but not allowed.

## 5. routes

```go
func (a *App) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /signup", a.SignUp)
	mux.HandleFunc("POST /signin", a.SignIn)
	mux.HandleFunc("GET /admin", a.IsAuthorized(AdminIndex, "admin"))
	mux.HandleFunc("GET /user", a.IsAuthorized(UserIndex, "user"))
	mux.HandleFunc("GET /{$}", Index)
	return cors(mux)
}

func Index(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("HOME PUBLIC INDEX PAGE"))
}

func AdminIndex(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome, Admin %s.", claimsFrom(r.Context()).Email)
}

func UserIndex(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome, User %s.", claimsFrom(r.Context()).Email)
}
```

CORS: only needed if a browser app on another origin calls the API. Never combine `Access-Control-Allow-Origin: *` with credentials; list the allowed origin:

```go
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin) // "http://localhost:3000"
		w.Header().Set("Vary", "Origin")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type")
		if r.Method == http.MethodOptions { // preflight
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}
```

## 6. Initialize and start the server

```go
func run() error {
	// Secrets come from the environment, never from the source code.
	dsn := os.Getenv("DATABASE_URL")
	secret := os.Getenv("JWT_SECRET")
	if dsn == "" || len(secret) < 32 {
		return errors.New("DATABASE_URL and JWT_SECRET (at least 32 chars) must be set")
	}

	// Open the database once and share the pool (not once per request).
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{TranslateError: true})
	if err != nil {
		return fmt.Errorf("open database: %w", err)
	}
	sqlDB, err := db.DB()
	if err != nil {
		return err
	}
	defer sqlDB.Close()

	if err := db.AutoMigrate(&User{}); err != nil { // create/update the users table
		return fmt.Errorf("migrate: %w", err)
	}

	dummyHash, err := bcrypt.GenerateFromPassword([]byte("dummy-password"), bcryptCost)
	if err != nil {
		return err
	}
	app := &App{db: db, secret: []byte(secret), dummyHash: dummyHash}

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           app.Routes(),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	// ... ListenAndServe in a goroutine + graceful srv.Shutdown on SIGINT/SIGTERM
	// (full code in example.go, explained in ../server.md)
}
```

## 7. Try it

```bash
curl -X POST localhost:8080/signup -d '{"name":"Ana","email":"ana@example.com","password":"s3cret-pass"}'
# {"ID":1,"CreatedAt":"...","UpdatedAt":"...","DeletedAt":null,"name":"Ana","email":"ana@example.com","role":"user"}

curl -X POST localhost:8080/signin -d '{"email":"ana@example.com","password":"s3cret-pass"}'
# {"role":"user","email":"ana@example.com","token":"eyJhbGciOiJIUzI1NiIs..."}

TOKEN="eyJhbGciOiJIUzI1NiIs..."
curl -H "Authorization: Bearer $TOKEN" localhost:8080/user
# Welcome, User ana@example.com.
curl -H "Authorization: Bearer $TOKEN" localhost:8080/admin
# {"isError":true,"message":"Not authorized"}      (403)
curl localhost:8080/user
# {"isError":true,"message":"No token found"}      (401)
```

Admins are promoted directly in the database: `UPDATE users SET role = 'admin' WHERE email = '...';` (the user must sign in again to get a token with the new role).

## Basic auth / API keys: constant-time comparison

For simple internal endpoints, HTTP Basic auth or a static API key may be enough. Compare secrets with `crypto/subtle.ConstantTimeCompare`, never with `==` (which returns as soon as a byte differs and leaks timing information). Hashing both sides first makes the inputs the same length, because `ConstantTimeCompare` returns immediately when lengths differ.

```go
package main

import (
	"crypto/sha256"
	"crypto/subtle"
	"fmt"
	"log"
	"net/http"
	"os"
)

func basicAuth(next http.Handler, user, pass string) http.Handler {
	wantUser := sha256.Sum256([]byte(user))
	wantPass := sha256.Sum256([]byte(pass))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u, p, ok := r.BasicAuth()
		gotUser := sha256.Sum256([]byte(u))
		gotPass := sha256.Sum256([]byte(p))

		// Evaluate both comparisons always (no short-circuit on the user)
		userOK := subtle.ConstantTimeCompare(gotUser[:], wantUser[:]) == 1
		passOK := subtle.ConstantTimeCompare(gotPass[:], wantPass[:]) == 1

		if !ok || !userOK || !passOK {
			w.Header().Set("WWW-Authenticate", `Basic realm="restricted", charset="UTF-8"`)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	user, pass := os.Getenv("ADMIN_USER"), os.Getenv("ADMIN_PASS")
	if user == "" || pass == "" {
		log.Fatal("ADMIN_USER and ADMIN_PASS must be set")
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /admin", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "secret stuff")
	})

	log.Fatal(http.ListenAndServe("localhost:8080", basicAuth(mux, user, pass)))
}
```

```bash
curl -u admin:wrong localhost:8080/admin   # Unauthorized (401)
curl -u admin:right localhost:8080/admin   # secret stuff
```

Basic auth sends the password on every request (base64, not encrypted): only use it over **HTTPS**.

## Security checklist

- Secrets (JWT key, DB password) from env vars / a secret manager; at least 32 random bytes for HS256.
- Store only password hashes (bcrypt/argon2id); never return them in responses.
- Never log passwords, tokens, `Authorization` headers or cookies.
- Same error message and similar timing for "unknown user" and "wrong password".
- Pin the JWT algorithm (`jwt.WithValidMethods`) and always set `exp`; keep access tokens short-lived.
- Use HTTPS; rate-limit `/signin` to slow down brute force.
- JWTs can't be revoked before `exp`: for logout/ban you need short TTLs + refresh tokens or a denylist.
