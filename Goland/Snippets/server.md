# Build a Server

Go standard library includes a webserver built in. The net/http package from the standard library contains all functionalities about the HTTP protocol. This includes (among many other things) an HTTP client and an HTTP server.

A basic HTTP server has a few key jobs to take care of.

- **Process dynamic requests**: Process incoming requests from users who browse the website, log into their accounts or post images.
- **Serve static assets**: Serve JavaScript, CSS and images to browsers to create a dynamic experience for the user.
- **Accept connections**: The HTTP Server must listen on a specific port to be able to accept connections from the internet.

## Process dynamic requests: Requests Handlers

First, create a Handler which receives all incomming HTTP connections from browsers, HTTP clients or API requests. A handler in Go is a function with this signature:

```go
func (w http.ResponseWriter, r *http.Request)
```

The function receives two parameters:

1. An `http.ResponseWriter` which is where you write your text/html response to.
1. An `http.Request` which contains all information about this HTTP request including things like the URL or header fields.

Registering a request handler to the default HTTP Server is as simple as this:

```go
http.HandleFunc("/", func (w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, you've requested: %s\n", r.URL.Path)
})
```

## Serving static assets

To serve static assets like JavaScript, CSS and images, we use the inbuilt http.FileServer and point it to a url path. For the file server to work properly it needs to know, where to serve files from. We can do this like so:

```go
fs := http.FileServer(http.Dir("static/"))
```

Once our file server is in place, we just need to point a url path at it, just like we did with the dynamic requests. One thing to note: In order to serve files correctly, we need to strip away a part of the url path. Usually this is the name of the directory our files live in.

```go
http.Handle("/static/", http.StripPrefix("/static/", fs))
```

## Listen for HTTP Connections

The request handler alone can not accept any HTTP connections from the outside. An HTTP server has to listen on a port to pass connections on to the request handler. Because port 80 is in most cases the default port for HTTP traffic, this server will also listen on it.

The following code will start Go’s default HTTP server and listen for connections on port 80. You can navigate your browser to `http://localhost/` and see your server handing your request.

```go
log.Fatal(http.ListenAndServe(":8080", nil))
```

## Example

```go
// Writing a basic HTTP server is easy using the
// `net/http` package.
package main

import (
    "fmt"
    "net/http"
)

// A fundamental concept in `net/http` servers is
// *handlers*. A handler is an object implementing the
// `http.Handler` interface. A common way to write
// a handler is by using the `http.HandlerFunc` adapter
// on functions with the appropriate signature.
func hello(w http.ResponseWriter, req *http.Request) {

    // Functions serving as handlers take a
    // `http.ResponseWriter` and a `http.Request` as
    // arguments. The response writer is used to fill in the
    // HTTP response. Here out simple response is just
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
    http.HandleFunc("/hello", hello)
    http.HandleFunc("/headers", headers)

    log.Fatal(http.ListenAndServe(":8080", nil))
}
```