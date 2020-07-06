# Tests

File to be tested:

```go
package main

import "fmt"

func SayHi(person string) string { //public function
    return fmt.Sprintf("Hi %s", person)
}

func sayHi(person string) string { //private function
    return fmt.Sprintf("Hi %s", person)
}
```

Tests:

```go
main_test.go

package main

import "testing"

func TestSayHi(t *testing.T) {
    expected := "Hi Marco"
    greeting := sayHi("Marco")
    if greeting != expected {
        t.Errorf("Greeting was incorrect, got: '%s', want: '%s'", greeting, expected)
    }
}
```

Run the tests:

```bash
go test ./...
```