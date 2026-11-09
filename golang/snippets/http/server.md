# Build a Server

Go standard library includes a webserver built in. The `net/http` package from the standard library contains all functionalities about the HTTP protocol. This includes (among many other things) an HTTP client and an HTTP server.

A basic HTTP server has a few key jobs to take care of.

- **Process dynamic requests**: Process incoming requests from users who browse the website, log into their accounts or post images.
- **Serve static assets**: Serve JavaScript, CSS and images to browsers to create a dynamic experience for the user.
- **Accept connections**: The HTTP Server must listen on a specific port to be able to accept connections from the internet.

## Process dynamic requests: Requests Handlers

First, create a Handler which receives all incoming HTTP connections from browsers, HTTP clients or API requests. A handler in Go is a function with this signature:

```go
func (w http.ResponseWriter, r *http.Request)
```

The function receives two parameters:

1. An `http.ResponseWriter` which is where you write your text/html response to.
1. An `*http.Request` which contains all information about this HTTP request including things like the URL or header fields.

Registering a request handler on a router (`http.ServeMux`) is as simple as this:

```go
mux := http.NewServeMux()
mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you've requested: %s\n", r.URL.Path)
})
```

`http.HandleFunc(...)` (without a mux) registers on the global `http.DefaultServeMux`; it works, but an explicit mux is easier to test and avoids handlers registered by imported packages (e.g. `net/http/pprof`).

Order matters in a handler: set headers, then `w.WriteHeader(status)` (optional, default 200), then write the body. Headers set after the first `Write` are ignored.

## Routing patterns (Go 1.22+)

Since Go 1.22 `ServeMux` supports **methods** and **wildcards** (requires `go 1.22` or later in `go.mod`):

```go
package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	mux := http.NewServeMux()

	// Exact match for "/" only ({$} = end of path). A plain "/" would match everything.
	mux.HandleFunc("GET /{$}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "home")
	})
	mux.HandleFunc("GET /items/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id") // always a string: validate/convert it (strconv.Atoi)
		fmt.Fprintf(w, "item %s\n", id)
	})
	mux.HandleFunc("POST /items", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintln(w, "created")
	})
	// {name...} matches the rest of the path
	mux.HandleFunc("GET /files/{path...}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "file %s\n", r.PathValue("path"))
	})

	log.Fatal(http.ListenAndServe(":8080", mux))
}
```

```bash
curl localhost:8080/items/42           # item 42
curl -X POST localhost:8080/items      # created (status 201)
curl localhost:8080/files/css/app.css  # file css/app.css
curl -i -X DELETE localhost:8080/items/42
# HTTP/1.1 405 Method Not Allowed
# Allow: GET, HEAD
curl -i localhost:8080/nope            # HTTP/1.1 404 Not Found
```

- `GET` patterns also match `HEAD`.
- When two patterns match, the **most specific** wins (`/items/new` beats `/items/{id}`); conflicting patterns panic at registration.
- A pattern ending in `/` (e.g. `/static/`) matches the whole subtree.

## Serving static assets

To serve static assets like JavaScript, CSS and images, we use the inbuilt `http.FileServer` and point it to a url path. For the file server to work properly it needs to know where to serve files from. We can do this like so:

```go
fs := http.FileServer(http.Dir("static/"))
```

Once our file server is in place, we just need to point a url path at it, just like we did with the dynamic requests. One thing to note: In order to serve files correctly, we need to strip away a part of the url path. Usually this is the name of the directory our files live in.

```go
mux.Handle("GET /static/", http.StripPrefix("/static/", fs))
```

`http.Dir` prevents `../` escapes, but it lists directory contents when there is no `index.html`, and serves dotfiles. Don't point it at a folder containing secrets.

Embedded in the binary (Go 1.22 `http.FileServerFS`); embedded paths keep the `static/` prefix, so no `StripPrefix` is needed:

```go
//go:embed static
var staticFS embed.FS

mux.Handle("GET /static/", http.FileServerFS(staticFS))
```

## Listen for HTTP Connections

The request handler alone can not accept any HTTP connections from the outside. An HTTP server has to listen on a port to pass connections on to the request handler. Port 80 is the default port for HTTP traffic, but it needs admin/root privileges, so in development we use 8080.

The following code will start the HTTP server and listen for connections on port 8080. You can navigate your browser to `http://localhost:8080/` and see your server handling your request.

```go
log.Fatal(http.ListenAndServe(":8080", mux)) // nil instead of mux = http.DefaultServeMux
```

`ListenAndServe` always returns a non-nil error. `":8080"` listens on all interfaces; use `"localhost:8080"` to accept only local connections.

⚠️ `http.ListenAndServe` uses a server **without timeouts** (slow clients can keep connections open forever). For anything exposed, use an `http.Server` (next section).

## Example

```go
// Writing a basic HTTP server is easy using the
// `net/http` package.
package main

import (
	"fmt"
	"log"
	"net/http"
)

// A fundamental concept in `net/http` servers is
// *handlers*. A handler is an object implementing the
// `http.Handler` interface. A common way to write
// a handler is by using the `http.HandlerFunc` adapter
// on functions with the appropriate signature.
func hello(w http.ResponseWriter, req *http.Request) {
	// Functions serving as handlers take a
	// `http.ResponseWriter` and a `*http.Request` as
	// arguments. The response writer is used to fill in the
	// HTTP response. Here our simple response is just
	// "hello\n".
	fmt.Fprintf(w, "hello\n")
}

func headers(w http.ResponseWriter, req *http.Request) {
	// This handler does something a little more
	// sophisticated by reading all the HTTP request
	// headers and echoing them into the response body.
	for name, headers := range req.Header {
		for _, h := range headers {
			fmt.Fprintf(w, "%v: %v\n", name, h)
		}
	}
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello", hello)
	mux.HandleFunc("GET /headers", headers)

	log.Fatal(http.ListenAndServe(":8080", mux))
}
```

```bash
curl localhost:8080/hello
# hello
curl localhost:8080/headers
# User-Agent: curl/8.5.0
# Accept: */*
# (map order: lines may come in any order)
```

## Production-ready server: timeouts, logging and graceful shutdown

- `http.Server` with timeouts.
- Request logging with `log/slog` via a middleware.
- On Ctrl+C / `SIGTERM`, stop accepting connections and let in-flight requests finish (`Shutdown`).

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// statusRecorder captures the status code written by the handler.
type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

// logRequests is a middleware: it wraps a handler and returns another one.
func logRequests(logger *slog.Logger, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		logger.Info("request",
			"method", r.Method,
			"path", r.URL.Path,
			"status", rec.status,
			"duration", time.Since(start),
		) // never log Authorization headers, cookies, passwords or tokens
	})
}

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))

	mux := http.NewServeMux()
	mux.HandleFunc("GET /hello/{name}", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "hello, %s\n", r.PathValue("name"))
	})

	srv := &http.Server{
		Addr:              ":8080",
		Handler:           logRequests(logger, mux),
		ReadHeaderTimeout: 5 * time.Second,  // mitigates Slowloris
		ReadTimeout:       10 * time.Second, // whole request, including body
		WriteTimeout:      10 * time.Second, // from end of headers read to end of response
		IdleTimeout:       120 * time.Second,
		ErrorLog:          slog.NewLogLogger(logger.Handler(), slog.LevelError),
	}

	// ctx is cancelled on Ctrl+C (os.Interrupt) or SIGTERM (docker stop, Kubernetes)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		logger.Info("listening", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			logger.Error("listen failed", "err", err)
			stop() // wake up main to exit
		}
	}()

	<-ctx.Done()
	logger.Info("shutting down")

	// Give in-flight requests up to 10s to finish
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Error("shutdown", "err", err)
		return
	}
	logger.Info("bye")
}
```

```bash
curl localhost:8080/hello/artur
# hello, artur
# server log:
# {"time":"...","level":"INFO","msg":"request","method":"GET","path":"/hello/artur","status":200,"duration":41250}
```

(`duration` is a `time.Duration`, which the JSON handler writes as nanoseconds.)

## JSON handlers

```go
type Item struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		slog.Error("encode response", "err", err)
	}
}

func createItem(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // limit the body to 1 MiB
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()

	var it Item
	if err := dec.Decode(&it); err != nil {
		http.Error(w, "invalid JSON: "+err.Error(), http.StatusBadRequest)
		return
	}
	writeJSON(w, http.StatusCreated, it)
}

// mux.HandleFunc("POST /items", createItem)
```

```bash
curl -X POST -d '{"id":1,"name":"pizza"}' localhost:8080/items
# {"id":1,"name":"pizza"}
```

## Testing handlers

`net/http/httptest` runs a handler without a real network:

```go
func TestHello(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/hello", nil)
	rec := httptest.NewRecorder()

	hello(rec, req)

	if rec.Code != http.StatusOK || rec.Body.String() != "hello\n" {
		t.Fatalf("got %d %q", rec.Code, rec.Body.String())
	}
}
```
