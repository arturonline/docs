# fs

## Binding

Inmutability:

```FSharp
let a = 2
a <- 3 //error

let mutable a = 2
a <- 3
```

## Partial Application

Call a function but not give it all of his parameters.

```fsharp
let prefix pstr bstr =
    pstr + ", " + bstr

let names = ["David"; "maria"; "Alex"]

let prefixwithHello = prefix "Hello"

names |> Seq.map prefixwithHello

// ["Hello, David"; "Hello, maria"; "Hello, Alex"]
```

## Function Composition

```fsharp
let prefix pstr bstr =
    pstr + ", " + bstr

let names = ["David"; "maria"; "Alex"]

let prefixwithHello = prefix "Hello"

let exclaim s = s + "!"

let bigHello = prefixwithHello >> exclaim

let result = names
            |> Seq.map bigHello

result
```

## Seq evaluation

`Seq` are lazy evaluated. You can Force evaluation with `Seq.iter`:

```fsharp
let result = names
            |> Seq.map (fun x -> printfn "Mapped over %s" x; bigHello x)
            |> Seq.iter (printf "%s")

result
```