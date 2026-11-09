# Go Routines

## Create an async method: go routine

The `go` keyword runs a function concurrently in a new **goroutine** (a lightweight thread managed by the Go runtime, starting with a few KB of stack).

```go
package main

import "fmt"

// declare a normal function
func speak(arg string) {
    fmt.Println(arg)
}

func main() {
    go speak("Hello World") // the prefix 'go' keyword runs the function concurrently
}
```

It (usually) prints nothing: when `main` returns the program exits and does not wait for the goroutine (`go speak`). We need a way to wait: channels or `sync.WaitGroup`.

Anonymous functions are common too:

```go
go func(msg string) {
    fmt.Println(msg)
}("hi")
```

## await for results: channels

A channel is a typed communications pipe: values go in one end and come out the other in the same order (FIFO).

We send data using `channel <- data` and receive data using `data := <-channel`.

```go
package main

import "fmt"

func speak(arg string, ch chan string) {
    ch <- arg // Send
}

func main() {
    ch := make(chan string) // channels must be created with make (the zero value is nil)

    go speak("Hello World", ch)

    data := <-ch // Receive: blocks until a value arrives
    fmt.Println(data)
}
// Hello World
```

On an **unbuffered** channel a send blocks until another goroutine receives (and vice versa): both goroutines synchronize at that point.

Closing is **not** required to free a channel (the GC does that). Close only to tell receivers "no more values", and only from the sender side.

## Javascript example

Link: [Go channel as async await](https://phuctm97.com/blog/go-channel-as-async-await)

```javascript
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const longRunningTask = async () => {
  // simulate a workload
  await sleep(3000);
  return Math.floor(Math.random() * 100);
};

const r = await longRunningTask();
console.log(r);
```

## Go version

```go
package main

import (
    "fmt"
    "math/rand/v2"
    "time"
)

func longRunningTask() <-chan int32 {
    r := make(chan int32, 1) // buffered: the goroutine never blocks, even if nobody reads

    go func() { // async
        defer close(r)

        // simulate a workload
        time.Sleep(3 * time.Second)
        r <- rand.Int32N(100)
    }()

    return r
}

func main() {
    r := <-longRunningTask() // await
    fmt.Println(r)
}
// 42 (random number between 0 and 99, after 3 seconds)
```

## Buffered Channels

A buffered channel accepts a limited number of values without a corresponding receiver for those values.

```go
package main

import "fmt"

func speak(arg string, ch chan<- string) {
    ch <- arg
}

func main() {
    ch := make(chan string, 2) // capacity 2

    go speak("Hello World", ch)
    go speak("Hi again", ch)

    data1 := <-ch
    fmt.Println(data1)

    data2 := <-ch
    fmt.Println(data2)
}
// Hello World
// Hi again
// (the order may be swapped: both goroutines race to send)
```

Sends to a buffered channel block only when the buffer is full, and receives block when the buffer is empty. `len(ch)` = values queued, `cap(ch)` = buffer size.

Without goroutines:

```go
ch := make(chan int, 2)
ch <- 1
ch <- 2
// ch <- 3 // would block forever: "fatal error: all goroutines are asleep - deadlock!"
fmt.Println(<-ch, <-ch) // 1 2
```

## Directional channels

When using channels as function parameters, we can specify if a channel is meant to only send or only receive values. A bidirectional `chan T` converts implicitly to either direction.

```go
func produce(ch chan<- string) { // send-only
    ch <- "data"
    // v := <-ch // compile error: receive from send-only channel
}

func consume(ch <-chan string) { // receive-only
    fmt.Println(<-ch)
    // ch <- "x" // compile error: send to receive-only channel
}
```

Misusing a directional channel is a **compile-time error**, not a panic. Only the sender should close, so `close` on a receive-only channel is also a compile error.

## Close and range

```go
package main

import "fmt"

func main() {
    ch := make(chan int)

    go func() {
        defer close(ch) // signal: no more values
        for i := range 3 {
            ch <- i * i
        }
    }()

    for v := range ch { // loops until the channel is closed and drained
        fmt.Println(v)
    }

    v, ok := <-ch // receiving from a closed channel never blocks
    fmt.Println(v, ok)
}
// 0
// 1
// 4
// 0 false
```

Channel rules:

| Operation | nil channel | closed channel |
| --- | --- | --- |
| send `ch <- v` | blocks forever | **panic** |
| receive `<-ch` | blocks forever | zero value, `ok == false` |
| `close(ch)` | **panic** | **panic** |

## sync.WaitGroup

Wait for a group of goroutines to finish.

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    var wg sync.WaitGroup

    for i := 1; i <= 3; i++ {
        wg.Add(1) // before starting the goroutine
        go func() {
            defer wg.Done()
            fmt.Println("worker", i) // OK since Go 1.22: each iteration has its own i
        }()
    }

    wg.Wait() // blocks until the counter is 0
    fmt.Println("all done")
}
// worker 3
// worker 1
// worker 2
// all done
// (worker lines in any order; "all done" is always last)
```

Go 1.25 added `wg.Go`, which does `Add(1)` + `go` + `defer Done()` for you:

```go
var wg sync.WaitGroup
for i := 1; i <= 3; i++ {
    wg.Go(func() {
        fmt.Println("worker", i)
    })
}
wg.Wait()
```

Pass a `WaitGroup` by pointer (`*sync.WaitGroup`), never by value.

## select

`select` waits on several channel operations and runs the first one ready (random choice if several are ready).

### Timeout with time.After

```go
package main

import (
    "fmt"
    "time"
)

func main() {
    ch := make(chan string, 1) // buffered so the goroutine can finish even after a timeout (no leak)

    go func() {
        time.Sleep(2 * time.Second) // slow work
        ch <- "result"
    }()

    select {
    case r := <-ch:
        fmt.Println(r)
    case <-time.After(1 * time.Second):
        fmt.Println("timeout")
    }
}
// timeout
```

Since Go 1.23 unstopped timers created by `time.After`/`time.NewTimer` are garbage collected, so `time.After` in loops no longer leaks. For cancellation, prefer `context` (below).

### Non-blocking with default

```go
select {
case msg := <-ch:
    fmt.Println("received", msg)
default:
    fmt.Println("no message ready") // runs immediately if nothing is ready
}
```

### nil channel in select

A case with a nil channel is never selected. Setting a channel to `nil` disables its case, useful when merging channels that close at different times:

```go
func merge(a, b <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for a != nil || b != nil {
            select {
            case v, ok := <-a:
                if !ok {
                    a = nil // a is closed: stop selecting it
                    continue
                }
                out <- v
            case v, ok := <-b:
                if !ok {
                    b = nil
                    continue
                }
                out <- v
            }
        }
    }()
    return out
}
```

Without `a = nil`, a closed `a` would be selected constantly returning `0, false` (busy loop).

## sync.Mutex / sync.RWMutex

Protect shared memory accessed by several goroutines.

```go
package main

import (
    "fmt"
    "sync"
)

type Counter struct {
    mu sync.Mutex
    n  int
}

func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.n++
}

func (c *Counter) Value() int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.n
}

func main() {
    var c Counter
    var wg sync.WaitGroup

    for range 1000 {
        wg.Add(1)
        go func() {
            defer wg.Done()
            c.Inc()
        }()
    }

    wg.Wait()
    fmt.Println(c.Value())
}
// 1000
```

`sync.RWMutex` allows many readers **or** one writer, good for read-heavy data:

```go
type Cache struct {
    mu   sync.RWMutex
    data map[string]string
}

func (c *Cache) Get(k string) (string, bool) {
    c.mu.RLock() // many goroutines can hold RLock at once
    defer c.mu.RUnlock()
    v, ok := c.data[k]
    return v, ok
}

func (c *Cache) Set(k, v string) {
    c.mu.Lock() // exclusive
    defer c.mu.Unlock()
    c.data[k] = v
}
```

Don't copy a struct containing a mutex (use pointer receivers); `go vet` warns about it. For simple counters, `sync/atomic` types (`atomic.Int64`, Go 1.19) are lighter: `var n atomic.Int64; n.Add(1); n.Load()`.

## sync.Once

Run something exactly once, even if called from many goroutines (lazy init).

```go
package main

import (
    "fmt"
    "sync"
)

var (
    once   sync.Once
    config map[string]string
)

func getConfig() map[string]string {
    once.Do(func() {
        fmt.Println("loading config")
        config = map[string]string{"env": "dev"}
    })
    return config
}

func main() {
    for range 3 {
        fmt.Println(getConfig()["env"])
    }
}
// loading config
// dev
// dev
// dev
```

Go 1.21 shortcuts: `sync.OnceFunc`, `sync.OnceValue`, `sync.OnceValues`:

```go
var getConfig = sync.OnceValue(func() map[string]string {
    return map[string]string{"env": "dev"}
})
// getConfig()["env"] == "dev"
```

## context.Context: cancellation and timeouts

A `context.Context` carries a cancellation signal (and deadline) across goroutines and API calls. By convention it is the first parameter, named `ctx`.

```go
package main

import (
    "context"
    "fmt"
    "time"
)

func work(ctx context.Context) error {
    for i := 1; ; i++ {
        select {
        case <-ctx.Done(): // closed when canceled or the deadline passes
            return ctx.Err()
        case <-time.After(300 * time.Millisecond):
            fmt.Println("tick", i)
        }
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), time.Second)
    defer cancel() // always call cancel to release resources

    err := work(ctx)
    fmt.Println("stopped:", err)
}
// tick 1
// tick 2
// tick 3
// stopped: context deadline exceeded
// (timing-based: ticks at ~300/600/900ms, deadline at 1s)
```

| Function | Cancels when |
| --- | --- |
| `context.WithCancel(parent)` | `cancel()` is called |
| `context.WithTimeout(parent, d)` | after duration `d` (or `cancel()`) |
| `context.WithDeadline(parent, t)` | at time `t` (or `cancel()`) |
| `context.WithCancelCause(parent)` (1.20) | `cancel(err)`; read it with `context.Cause(ctx)` |

- Canceling a parent cancels all its children.
- `ctx.Err()` is `context.Canceled` or `context.DeadlineExceeded`.
- Most I/O APIs accept a context: `http.NewRequestWithContext`, `db.QueryContext`, ...
- `context.AfterFunc` (1.21) runs a function when ctx is done; `context.WithoutCancel` (1.21) detaches from the parent's cancellation.

## Worker pool (fan-out)

A fixed number of goroutines consume jobs from a shared channel.

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    jobs := make(chan int)
    results := make(chan int)

    var wg sync.WaitGroup
    for w := 1; w <= 3; w++ { // 3 workers
        wg.Add(1)
        go func() {
            defer wg.Done()
            for j := range jobs { // each worker takes jobs until jobs is closed
                results <- j * j
            }
        }()
    }

    go func() { // producer
        for i := 1; i <= 5; i++ {
            jobs <- i
        }
        close(jobs)
    }()

    go func() { // close results when all workers are done
        wg.Wait()
        close(results)
    }()

    sum := 0
    for r := range results { // results arrive in any order
        sum += r
    }
    fmt.Println("sum:", sum)
}
// sum: 55
```

## Pipeline: fan-out / fan-in

- **Fan-out**: several goroutines read from the same channel (distribute work).
- **Fan-in**: merge several channels into one.

```go
package main

import (
    "fmt"
    "sync"
)

func gen(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for _, n := range nums {
            out <- n
        }
    }()
    return out
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in {
            out <- n * n
        }
    }()
    return out
}

func fanIn(chans ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    for _, c := range chans {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for v := range c {
                out <- v
            }
        }()
    }
    go func() {
        wg.Wait()
        close(out)
    }()
    return out
}

func main() {
    in := gen(1, 2, 3, 4)

    // fan-out: two workers read from the same input
    c1 := square(in)
    c2 := square(in)

    // fan-in: merge their outputs
    for v := range fanIn(c1, c2) {
        fmt.Println(v)
    }
}
// 1
// 4
// 9
// 16
// (in any order)
```

## errgroup

`golang.org/x/sync/errgroup` = WaitGroup + first error + context cancellation.

```bash
go get golang.org/x/sync
```

```go
package main

import (
    "context"
    "fmt"

    "golang.org/x/sync/errgroup"
)

func fetch(ctx context.Context, url string) (string, error) {
    if err := ctx.Err(); err != nil {
        return "", err // another task failed: give up
    }
    if url == "bad" {
        return "", fmt.Errorf("fetch %s: failed", url)
    }
    return "ok:" + url, nil
}

func main() {
    g, ctx := errgroup.WithContext(context.Background())
    g.SetLimit(2) // optional: at most 2 goroutines at a time

    urls := []string{"a", "b", "bad", "c"}
    results := make([]string, len(urls)) // each goroutine writes its own index: no race

    for i, u := range urls {
        g.Go(func() error {
            r, err := fetch(ctx, u)
            if err != nil {
                return err // the first error cancels ctx
            }
            results[i] = r
            return nil
        })
    }

    if err := g.Wait(); err != nil { // waits for all, returns the first error
        fmt.Println("error:", err)
        return
    }
    fmt.Println(results)
}
// error: fetch bad: failed
```

## Data races and -race

A data race happens when two goroutines access the same variable concurrently and at least one writes. The result is undefined.

```go
package main

import (
    "fmt"
    "sync"
)

func main() {
    count := 0
    var wg sync.WaitGroup
    for range 1000 {
        wg.Add(1)
        go func() {
            defer wg.Done()
            count++ // RACE: read-modify-write without synchronization
        }()
    }
    wg.Wait()
    fmt.Println(count)
}
// a number <= 1000, may differ between runs
```

```bash
go run -race main.go
go test -race ./...
# WARNING: DATA RACE
# Read at 0x00c000012345 by goroutine 8: ...
# Previous write at 0x00c000012345 by goroutine 7: ...
```

Fix with a `sync.Mutex`, `atomic.Int64`, or by communicating through channels ("Don't communicate by sharing memory; share memory by communicating"). The race detector only finds races that actually happen during the run, so use it in tests/CI. On some platforms it needs cgo (`CGO_ENABLED=1` and a C compiler, e.g. gcc on Windows).

## Goroutine leaks

A goroutine blocked forever (on a channel nobody will use) is never collected: it leaks memory.

```go
// LEAK: if the caller times out and stops listening, the goroutine blocks forever on ch <- ...
func search(query string) <-chan string {
    ch := make(chan string) // unbuffered
    go func() {
        ch <- slowSearch(query)
    }()
    return ch
}
```

Fixes:

- Use a buffered channel of size 1 when there is exactly one result (`make(chan string, 1)`).
- Pass a `context.Context` and `select` on `ctx.Done()` when sending/receiving.
- Always make sure someone closes the channels the `for range` loops wait on.
- Detect leaks: `runtime.NumGoroutine()`, the `pprof` goroutine profile, or `go.uber.org/goleak` in tests.

```go
func search(ctx context.Context, query string) <-chan string {
    ch := make(chan string)
    go func() {
        select {
        case ch <- slowSearch(query):
        case <-ctx.Done(): // caller gave up: exit instead of blocking forever
        }
    }()
    return ch
}
```
