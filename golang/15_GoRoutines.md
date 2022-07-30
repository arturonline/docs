# Go Routines

## Create an async method: go routine

The `go` keyword allow a function to run asynchronous

```go
package main

import "fmt"

// declare a normal function
func speak(arg string) {
	fmt.Println(arg)
}

func main() {
	go speak("Hello World") // the prefix 'go' keyword makes the funcion async 
}
```
It prints nothing because the main program exited and did not wait for the goroutine (go speak);

## await for results: channels

A channel is a communications pipe: things go in one end and come out another in the same order until the channel is closed.

We can send data using the `channel<-data` and receive data using the `data := <-channel` syntax.

```go
package main

import "fmt"

func speak(arg string, ch chan string) {
	ch <- arg // Send
}

func main() {
	ch := make(chan string) // channels must be initialized (like slices)

	go speak("Hello World", ch)

	data := <-ch // Receive
	fmt.Println(data)

    close(ch) // channels must be closed
}
// Hello World
```

## Javascript example:

https://phuctm97.com/blog/go-channel-as-async-await

```javascript
const longRunningTask = async () => {
  // simulate a workload
  sleep(3000);
  return Math.floor(Math.random() * Math.floor(100));
};

const r = await longRunningTask();
console.log(r);
```

## Go version

```go
func longRunningTask() <-chan int32 {
    r := make(chan int32)

    go func() { // async
        defer close(r)

        // simulate a workload
        time.Sleep(time.Second * 3)
        r <- rand.Int31n(100)
    }()

    return r
}

func main() {
    r := <-longRunningTask() // await
    fmt.Println(r)
}
```

## Buffered Channels

a Buffered channel accept a limited number of values without a corresponding receiver for those values.

```go
func main() {
	ch := make(chan string, 2)

	go speak("Hello World", ch)
	go speak("Hi again", ch)

	data1 := <-ch
	fmt.Println(data1)

	data2 := <-ch
	fmt.Println(data2)
}
```
When a channel is buffered, we can send values without a corresponding concurrent receiver. This means sends to a buffered channel block only when the buffer is full and receives block when the buffer is empty.


## Directional channels

When using channels as function parameters, we can specify if a channel is meant to only send or receive values. 

```go
func speak(arg string, ch chan<- string) {
	ch <- arg // Send Only
}
```

Here, `chan<-` can only be used for sending values and will panic if we try to receive values.