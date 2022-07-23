# Go Routines

https://phuctm97.com/blog/go-channel-as-async-await

## Javascript

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