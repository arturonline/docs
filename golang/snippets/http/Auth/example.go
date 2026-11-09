// JWT authentication example: sign up, sign in and role-protected routes.
//
// Requires Go 1.22+ (method and wildcard patterns in http.ServeMux).
//
//	go mod init authdemo
//	go get gorm.io/gorm gorm.io/driver/postgres github.com/golang-jwt/jwt/v5 golang.org/x/crypto/bcrypt
//	export DATABASE_URL="postgres://postgres:secret@localhost/userdb?sslmode=disable"
//	export JWT_SECRET="$(openssl rand -hex 32)"
//	go run .
package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"slices"
	"strings"
	"syscall"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

//------------CONFIG----------------------

const (
	bcryptCost    = 12               // ~250ms per hash; raise it as hardware gets faster
	tokenTTL      = 30 * time.Minute // short-lived access tokens
	maxBodySize   = 1 << 20          // 1 MiB
	allowedOrigin = "http://localhost:3000"
)

//------------STRUCTS---------------------

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

// Error is the JSON error body.
type Error struct {
	IsError bool   `json:"isError"`
	Message string `json:"message"`
}

// Claims are the fields stored in the JWT.
type Claims struct {
	Email string `json:"email"`
	Role  string `json:"role"`
	jwt.RegisteredClaims
}

// App holds the dependencies shared by the handlers (no globals).
type App struct {
	db        *gorm.DB
	secret    []byte
	dummyHash []byte
}

type ctxKey struct{}

//--------------HELPER FUNCTIONS---------------------

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
	r.Body = http.MaxBytesReader(w, r.Body, maxBodySize)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	return dec.Decode(dst)
}

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}

// GenerateHashPassword hashes a plain password with bcrypt (salt included).
func GenerateHashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcryptCost)
	return string(bytes), err
}

// CheckPasswordHash compares a plain password with a bcrypt hash (constant time).
func CheckPasswordHash(password, hash string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

// GenerateJWT creates a signed HS256 token that expires after tokenTTL.
func (a *App) GenerateJWT(email, role string) (string, error) {
	now := time.Now()
	claims := Claims{
		Email: email,
		Role:  role,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   email,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(tokenTTL)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(a.secret)
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

//---------------------MIDDLEWARE FUNCTIONS-----------------------

// IsAuthorized checks the "Authorization: Bearer <token>" header and,
// if roles are given, that the user has one of them.
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

// cors allows a browser app on allowedOrigin to call the API.
func cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowedOrigin)
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

//----------------------ROUTES-------------------------------

// Routes registers all the routes.
func (a *App) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /signup", a.SignUp)
	mux.HandleFunc("POST /signin", a.SignIn)
	mux.HandleFunc("GET /admin", a.IsAuthorized(AdminIndex, "admin"))
	mux.HandleFunc("GET /user", a.IsAuthorized(UserIndex, "user"))
	mux.HandleFunc("GET /{$}", Index)
	return cors(mux)
}

//----------------------ROUTES HANDLERS-----------------------

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

func Index(w http.ResponseWriter, r *http.Request) {
	w.Write([]byte("HOME PUBLIC INDEX PAGE"))
}

func AdminIndex(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome, Admin %s.", claimsFrom(r.Context()).Email)
}

func UserIndex(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Welcome, User %s.", claimsFrom(r.Context()).Email)
}

//----------------------MAIN-------------------------------

func main() {
	slog.SetDefault(slog.New(slog.NewTextHandler(os.Stderr, nil)))
	if err := run(); err != nil {
		slog.Error("fatal", "err", err)
		os.Exit(1)
	}
}

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

	// Create/update the users table
	if err := db.AutoMigrate(&User{}); err != nil {
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

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	errCh := make(chan error, 1)
	go func() {
		slog.Info("server started", "addr", "http://localhost:8080")
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
	}

	slog.Info("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return srv.Shutdown(shutdownCtx)
}
