# Tests

Go has a built-in test framework: the `testing` package plus the `go test` command.

- Test files end with `_test.go` and are ignored by `go build`.
- Test functions are `func TestXxx(t *testing.T)` (name must start with `Test` followed by a non-lowercase char).
- Tests in the same package (`package greet`) can access private (unexported) identifiers.
- Tests in `package greet_test` (black-box) only see the exported API.

## Basic test

File to be tested, `greet.go`:

```go
package greet

import "fmt"

func SayHi(person string) string { // public (exported) function
    return fmt.Sprintf("Hi %s", person)
}

func sayHi(person string) string { // private function
    return fmt.Sprintf("Hi %s", person)
}
```

Tests, `greet_test.go`:

```go
package greet

import "testing"

func TestSayHi(t *testing.T) {
    expected := "Hi Marco"
    greeting := sayHi("Marco") // private functions are visible from the same package
    if greeting != expected {
        t.Errorf("Greeting was incorrect, got: '%s', want: '%s'", greeting, expected)
    }
}
```

Run the tests:

```bash
go test ./...
# ok      example.com/greet       0.002s
```

## Running tests: useful flags

```bash
go test                         # current package
go test ./...                   # all packages in the module
go test -v                      # verbose: show every test (=== RUN / --- PASS)
go test -run TestSayHi          # only tests whose name matches the regexp
go test -run 'TestReverse/unicode'  # a single subtest (Test/Subtest)
go test -count=1                # disable the test cache (force re-run)
go test -race                   # enable the data race detector
go test -short                  # tests can skip slow parts with testing.Short()
go test -timeout 30s            # fail if tests take longer (default 10m)
go test -failfast               # stop after the first failing test
```

`go test -v` output:

```bash
=== RUN   TestSayHi
--- PASS: TestSayHi (0.00s)
PASS
ok      example.com/greet       0.002s
```

## t.Errorf vs t.Fatalf

| Method | Marks failed | Stops the test |
| --- | --- | --- |
| `t.Error` / `t.Errorf` | yes | no, keeps running |
| `t.Fatal` / `t.Fatalf` | yes | yes (`runtime.Goexit`) |
| `t.Log` / `t.Logf` | no (printed only on failure or with `-v`) | no |
| `t.Skip` / `t.Skipf` | no (skipped) | yes |

Use `Fatal` when continuing makes no sense (e.g. setup failed, a nil value would panic). `Fatal` must be called from the test goroutine, not from goroutines started by the test.

```go
data, err := os.ReadFile("testdata/input.txt")
if err != nil {
    t.Fatalf("cannot read input: %v", err) // stop: nothing to check without data
}
if len(data) == 0 {
    t.Errorf("input is empty") // report and keep checking other things
}
```

## Table-driven tests and subtests

The idiomatic way to test many cases. `t.Run` creates a named subtest.

`reverse.go`:

```go
package greet

func Reverse(s string) string {
    r := []rune(s)
    for i, j := 0, len(r)-1; i < j; i, j = i+1, j-1 {
        r[i], r[j] = r[j], r[i]
    }
    return string(r)
}
```

`reverse_test.go`:

```go
package greet

import "testing"

func TestReverse(t *testing.T) {
    tests := []struct {
        name string
        in   string
        want string
    }{
        {"empty", "", ""},
        {"ascii", "abc", "cba"},
        {"unicode", "Hola, 世界", "界世 ,aloH"},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            t.Parallel() // subtests run in parallel with each other
            if got := Reverse(tt.in); got != tt.want {
                t.Errorf("Reverse(%q) = %q, want %q", tt.in, got, tt.want)
            }
        })
    }
}
```

> Since Go 1.22 each loop iteration has its own `tt`, so the old `tt := tt` copy before `t.Parallel()` is no longer needed.

```bash
go test -v -run TestReverse
# === RUN   TestReverse
# === RUN   TestReverse/empty
# === PAUSE TestReverse/empty
# ...
# --- PASS: TestReverse (0.00s)
#     --- PASS: TestReverse/empty (0.00s)
#     --- PASS: TestReverse/ascii (0.00s)
#     --- PASS: TestReverse/unicode (0.00s)
# (order of parallel subtests may vary)
```

## t.Helper

Marks a function as a helper: failures are reported at the caller's line, not inside the helper.

```go
func assertEqual[T comparable](t *testing.T, got, want T) {
    t.Helper()
    if got != want {
        t.Errorf("got %v, want %v", got, want)
    }
}

func TestSayHiHelper(t *testing.T) {
    assertEqual(t, SayHi("Marco"), "Hi Marco")
    assertEqual(t, len("abc"), 3)
}
```

## t.Parallel

`t.Parallel()` pauses the test and resumes it in parallel with other parallel tests (of the same level). Limit with `-parallel n` (default `GOMAXPROCS`).

```go
func TestSlowA(t *testing.T) {
    t.Parallel()
    time.Sleep(time.Second)
}

func TestSlowB(t *testing.T) {
    t.Parallel()
    time.Sleep(time.Second)
}
// both together take ~1s instead of ~2s
```

Do not use `t.Parallel()` with `t.Setenv` or `t.Chdir` (they panic) or with shared global state.

## t.Cleanup, t.TempDir, t.Setenv, t.Context

```go
package greet

import (
    "os"
    "path/filepath"
    "testing"
)

func TestWriteFile(t *testing.T) {
    dir := t.TempDir() // new temp dir, removed automatically when the test ends

    t.Setenv("APP_ENV", "test") // restored after the test (Go 1.17)

    t.Cleanup(func() { // runs after the test (and its subtests), LIFO order
        t.Log("cleanup done")
    })

    path := filepath.Join(dir, "out.txt")
    if err := os.WriteFile(path, []byte("hello"), 0o644); err != nil {
        t.Fatalf("write: %v", err)
    }

    data, err := os.ReadFile(path)
    if err != nil {
        t.Fatalf("read: %v", err)
    }
    if string(data) != "hello" {
        t.Errorf("got %q, want %q", data, "hello")
    }
}
```

`t.Cleanup` is ideal inside helpers, so the caller doesn't need `defer`:

```go
func newTestServer(t *testing.T) *httptest.Server {
    t.Helper()
    srv := httptest.NewServer(http.HandlerFunc(helloHandler))
    t.Cleanup(srv.Close)
    return srv
}
```

Go 1.24 added `t.Context()` (a context canceled just before cleanup functions run) and `t.Chdir(dir)`.

## Setup and teardown: TestMain

Optional; runs once per package instead of the tests directly.

```go
func TestMain(m *testing.M) {
    // setup (e.g. start a DB container)
    code := m.Run() // run all tests
    // teardown
    os.Exit(code)
}
```

## testdata directory

- `go test` runs with the working directory set to the package directory, so relative paths work.
- The `testdata` directory is ignored by the go tool (not a package): put fixtures, golden files and fuzz corpora there.

```bash
greet/
├── greet.go
├── greet_test.go
└── testdata/
    ├── input.txt
    └── expected.golden
```

```go
func TestGolden(t *testing.T) {
    want, err := os.ReadFile("testdata/expected.golden")
    if err != nil {
        t.Fatal(err)
    }
    got := SayHi("Marco") + "\n"
    if got != string(want) {
        t.Errorf("got %q, want %q", got, want)
    }
}
```

## HTTP handlers: httptest

`net/http/httptest` provides a fake `ResponseWriter` (`NewRecorder`) and a real local server (`NewServer`).

```go
// handler.go
func helloHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hi %s", r.URL.Query().Get("name"))
}
```

```go
// handler_test.go
package greet

import (
    "io"
    "net/http"
    "net/http/httptest"
    "testing"
)

func TestHelloHandler(t *testing.T) {
    req := httptest.NewRequest(http.MethodGet, "/hello?name=Marco", nil)
    rec := httptest.NewRecorder()

    helloHandler(rec, req) // call the handler directly

    if rec.Code != http.StatusOK {
        t.Errorf("status = %d, want %d", rec.Code, http.StatusOK)
    }
    if got := rec.Body.String(); got != "Hi Marco" {
        t.Errorf("body = %q, want %q", got, "Hi Marco")
    }
}

func TestHelloServer(t *testing.T) {
    srv := httptest.NewServer(http.HandlerFunc(helloHandler)) // real server on 127.0.0.1:random
    defer srv.Close()

    resp, err := http.Get(srv.URL + "/?name=Ana")
    if err != nil {
        t.Fatal(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    if string(body) != "Hi Ana" {
        t.Errorf("body = %q", body)
    }
}
```

## Benchmarks

Functions `func BenchmarkXxx(b *testing.B)`. They only run with `-bench`.

Go 1.24+ (`b.Loop()`): setup before the loop is excluded from the timing automatically, and the body is not optimized away.

```go
func BenchmarkSayHi(b *testing.B) {
    for b.Loop() {
        SayHi("Marco")
    }
}
```

Classic style (before Go 1.24, still valid): the framework adjusts `b.N` until timing is stable.

```go
func BenchmarkReverse(b *testing.B) {
    s := strings.Repeat("abc", 1000) // expensive setup
    b.ResetTimer()                   // don't count the setup
    for i := 0; i < b.N; i++ {
        Reverse(s)
    }
}
```

```bash
go test -bench=.                  # run all benchmarks (and tests)
go test -bench=SayHi -benchmem    # show allocations (B/op, allocs/op)
go test -run=^$ -bench=. -count=5 # skip tests, repeat 5 times (useful for benchstat)
# BenchmarkSayHi-8    20000000    60.1 ns/op    16 B/op    1 allocs/op
# (numbers depend on the machine; -8 = GOMAXPROCS)
```

`b.ReportAllocs()` enables allocation stats for one benchmark. Compare runs with `golang.org/x/perf/cmd/benchstat`.

## Examples (documentation tests)

`func ExampleXxx()` functions are compiled, shown in `go doc`/pkg.go.dev, and executed by `go test` if they have an `// Output:` comment. The test fails if stdout differs.

```go
package greet_test

import (
    "fmt"

    "example.com/greet"
)

func ExampleSayHi() {
    fmt.Println(greet.SayHi("Marco"))
    // Output: Hi Marco
}

func ExampleReverse() {
    fmt.Println(greet.Reverse("abc"))
    fmt.Println(greet.Reverse("Go"))
    // Output:
    // cba
    // oG
}
```

Naming: `Example` (package), `ExampleSayHi` (function), `ExampleStack_Push` (method), `ExampleSayHi_second` (extra example). Use `// Unordered output:` when line order is not deterministic. Without an output comment the example is compiled but not run.

## Fuzzing (Go 1.18)

The fuzzer generates random inputs from a seed corpus looking for failures (panics or `t.Error`). Fuzz functions are `func FuzzXxx(f *testing.F)`.

```go
package greet

import (
    "testing"
    "unicode/utf8"
)

func FuzzReverse(f *testing.F) {
    f.Add("hello") // seed corpus
    f.Add("Hola, 世界")

    f.Fuzz(func(t *testing.T, s string) {
        if !utf8.ValidString(s) {
            t.Skip("Reverse works on runes: invalid UTF-8 is not round-tripped")
        }
        rev := Reverse(s)
        if Reverse(rev) != s {
            t.Errorf("Reverse(Reverse(%q)) = %q", s, Reverse(rev))
        }
        if !utf8.ValidString(rev) {
            t.Errorf("Reverse produced invalid UTF-8: %q", rev)
        }
    })
}
```

```bash
go test                              # runs only the seed corpus (like a normal test)
go test -fuzz=FuzzReverse            # fuzz until a failure or Ctrl+C
go test -fuzz=FuzzReverse -fuzztime=30s
```

- Failing inputs are saved to `testdata/fuzz/FuzzReverse/` and are re-run by every later `go test` (commit them as regression tests).
- Allowed argument types: `string`, `[]byte`, ints, uints, floats, `bool`, `rune`, `byte`.
- Only one fuzz target can be fuzzed at a time (`-fuzz` must match exactly one).

## Coverage

```bash
go test -cover ./...                       # coverage % per package
# ok      example.com/greet   0.003s  coverage: 85.7% of statements

go test -coverprofile=cover.out ./...      # write a profile
go tool cover -func=cover.out              # coverage per function
go tool cover -html=cover.out              # open an HTML report in the browser
go test -covermode=atomic -coverprofile=cover.out ./...  # needed/accurate with -race
```

Since Go 1.20 you can also build binaries with coverage: `go build -cover` and collect data with `GOCOVERDIR`.

## Testing concurrent code: testing/synctest (Go 1.25)

`synctest.Test` runs a function in an isolated "bubble" with a fake clock, so tests with `time.Sleep`, timers or timeouts run instantly and deterministically.

```go
func TestTimeout(t *testing.T) {
    synctest.Test(t, func(t *testing.T) {
        ctx, cancel := context.WithTimeout(t.Context(), 5*time.Second)
        defer cancel()
        time.Sleep(5 * time.Second) // returns immediately: fake time advances
        synctest.Wait()             // wait until all goroutines in the bubble are blocked
        if ctx.Err() != context.DeadlineExceeded {
            t.Fatalf("ctx.Err() = %v", ctx.Err())
        }
    })
}
```
