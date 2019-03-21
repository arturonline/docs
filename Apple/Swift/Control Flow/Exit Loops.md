# Exit loops

You can exit a loop at any time using the break keyword:

```swift
while countDown >= 0 {
    print(countDown)

    if countDown == 4 {
        print("I'm bored. Let's go now!")
        break
    }

    countDown -= 1
}
```

As soon as countDown reaches 4 the astronaut’s message will be printed, and the rest of the loop gets skipped.

## Exiting multiple loops

If you put a loop inside a loop it’s called a nested loop, and it’s not uncommon to want to break out of both the inner loop and the outer loop at the same time.

As an example, we could write some code to calculate the times tables from 1 through 10 like this:

```swift
for i in 1...10 {
    for j in 1...10 {
        let product = i * j
        print ("\(i) * \(j) is \(product)")
    }
}
```

If we wanted to exit part-way through we need to do two things. First, we give the outside loop a `label`, like this:

```swift
outerLoop: for i in 1...10 {
    for j in 1...10 {
        let product = i * j
        print ("\(i) * \(j) is \(product)")
    }
}
```

Second, add our condition inside the inner loop, then use `break outerLoop` to exit both loops at the same time:

```swift
outerLoop: for i in 1...10 {
    for j in 1...10 {
        let product = i * j
        print ("\(i) * \(j) is \(product)")

        if product == 50 {
            print("It's a bullseye!")
            break outerLoop
        }
    }
}
```

With a regular `break`, only the inner loop would be exited – the outer loop would continue where it left off.

## Skipping items

As you’ve seen, the break keyword exits a loop. But if you just want to skip the current item and continue on to the next one, you should use continue instead:

```swift
for i in 1...10 {
    if i % 2 == 1 {
        continue
    }

    print(i)
}
```