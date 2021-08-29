# Java Streams

[Link](https://winterbe.com/posts/2014/07/31/java8-stream-tutorial-examples/)

A `java.util.Stream` represents a sequence of elements on which one or more operations can be performed.

```java
List<String> myList =
    Arrays.asList("a1", "a2", "b1", "c2", "c1");

myList
    .stream()
    .filter(s -> s.startsWith("c"))
    .map(String::toUpperCase)
    .sorted()
    .forEach(System.out::println);

// C1
// C2
```

⚠ A stream does not store data and, in that sense, is not a data structure. It also never modifies the underlying data source.

## Stream creation

Streams can be created from various data sources, especially collections. **Lists** and **Sets** support new methods `stream()` and `parallelStream()` to either create a **sequential** or a **parallel stream**.

But we don't have to create collections in order to work with streams, we can just use `Stream.of()` to create a stream from a bunch of object references.

Besides regular object streams Java 8 ships with special kinds of streams for working with the primitive data types *int*, *long* and double. As you might have guessed it's `IntStream`, `LongStream` and `DoubleStream`.

```java
IntStream.range(1, 4)
    .forEach(System.out::println);

// 1
// 2
// 3
```

```java
Stream<String> stream = Stream.of("A$B$C".split("\\$"));
        stream.forEach(p -> System.out.println(p));
```

## Stream Operations

Stream operations are either **intermediate** or **terminal**. While terminal operations return a result of a certain type, intermediate operations return the stream itself so you can chain multiple method calls in a row.

[List of all available stream operations](http://docs.oracle.com/javase/8/docs/api/java/util/stream/Stream.html)

## Intermediate operations

When you add a non-terminal operation to a stream, you get a new stream back as result. The new stream represents the stream of elements resulting from the original stream with the non-terminal operation applied.

### Filter

Filter accepts a predicate to filter all elements of the stream. This operation is intermediate which enables us to call another stream operation (forEach) on the result. ForEach accepts a consumer to be executed for each element in the filtered stream. ForEach is a terminal operation. It's void, so we cannot call another stream operation.

```java
stringCollection
    .stream()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa2", "aaa1"
```

### Sorted

Sorted is an intermediate operation which returns a sorted view of the stream. The elements are sorted in natural order unless you pass a custom Comparator.

```java
stringCollection
    .stream()
    .sorted()
    .filter((s) -> s.startsWith("a"))
    .forEach(System.out::println);

// "aaa1", "aaa2"
```

Keep in mind that sorted does only create a sorted view of the stream without manipulating the ordering of the backed collection. The ordering of stringCollection is untouched:

```java
System.out.println(stringCollection);
// ddd2, aaa2, bbb1, aaa1, bbb3, ccc, bbb2, ddd1
```

### Map

The intermediate operation map converts each element into another object via the given function. The following example converts each string into an upper-cased string. But you can also use map to transform each object into another type. The generic type of the resulting stream depends on the generic type of the function you pass to map.

```java
stringCollection
    .stream()
    .map(String::toUpperCase)
    .sorted((a, b) -> b.compareTo(a))
    .forEach(System.out::println);

// "DDD2", "DDD1", "CCC", "BBB3", "BBB2", "AAA2", "AAA1"
```

## Terminal Operations

Once the terminal operation is invoked on a Stream, the iteration of the Stream and any of the chained streams will get started. Once the iteration is done, the result of the terminal operation is returned. The terminal operations typically return a single value.

### Collect

Collect is an operation to transform the elements of the stream into a different kind of result, e.g. a *List*, *Set* or *Map*. Collect accepts a `Collector` which consists of four different operations: a *supplier*, an *accumulator*, a *combiner* and a *finisher*. Java 8 supports various built-in collectors via the `Collectors class`, so for the most common operations you don't have to implement a collector yourself.

```java
List<Person> filtered =
    persons
        .stream()
        .filter(p -> p.name.startsWith("P"))
        .collect(Collectors.toList());

System.out.println(filtered);    // [Peter, Pamela]
```

```java
List<Integer> doubleOfEven2 =
    numbers.stream()
            .filter(e -> e % 2 == 0)
            .map(e -> e * 2)
            .collect(toList());
```

In order to transform the stream elements into a **map**, we have to specify how both the **keys** and the **values** should be mapped. Keep in mind that the mapped keys must be unique:

```java
List<Book> bookList = new ArrayList<>();
bookList.add(new Book("The Fellowship of the Ring", 1954, "0395489318"));
bookList.add(new Book("The Two Towers", 1954, "0345339711"));
bookList.add(new Book("The Return of the King", 1955, "0618129111"));

public Map<String, String> listToMap(List<Book> books) {
    return books.stream()
                .collect(toMap(
                    Book::getIsbn,
                    Book::getName
                    )
                );
}
```

### Reduce

The reduction operation combines all elements of the stream into a single result.

Java 8 supports three different kind of reduce methods:

#### Reduce #1

The first one reduces a stream of elements to exactly one element of the stream:

```java
persons
    .stream()
    .reduce((p1, p2) -> p1.age > p2.age ? p1 : p2)
    .ifPresent(System.out::println);    // Pamela
```

The reduce method accepts a `BinaryOperator accumulator function`. That's actually a `BiFunction` where both operands share the same type, in that case *Person*. `BiFunctions` are like Function but accept two arguments. The example function compares both persons *ages* in order to return the person with the maximum age.

#### Reduce #2

The second reduce method accepts both an `identity value` and a `BinaryOperator accumulator`. This method can be utilized to construct a new *Person* with the aggregated names and ages from all other persons in the stream:

```java
Person result =
    persons
        .stream()
        .reduce(new Person("", 0), (p1, p2) -> {
            p1.age += p2.age;
            p1.name += p2.name;
            return p1;
        });

System.out.format("name=%s; age=%s", result.name, result.age);
// name=MaxPeterPamelaDavid; age=76
```

#### Reduce #3

The third reduce method accepts three parameters: `an identity value,` a `BiFunction accumulator` and a combiner function of type `BinaryOperator`:

```java
Integer ageSum = persons
    .stream()
    .reduce(0, (sum, p) -> sum += p.age, (sum1, sum2) -> sum1 + sum2);

System.out.println(ageSum);  // 76
```

### Match

Various matching operations can be used to check whether a certain predicate matches the stream. All of those operations are terminal and return a boolean result.

```java
boolean anyStartsWithA =
    stringCollection
        .stream()
        .anyMatch((s) -> s.startsWith("a"));

System.out.println(anyStartsWithA);      // true

boolean allStartsWithA =
    stringCollection
        .stream()
        .allMatch((s) -> s.startsWith("a"));

System.out.println(allStartsWithA);      // false

boolean noneStartsWithZ =
    stringCollection
        .stream()
        .noneMatch((s) -> s.startsWith("z"));

System.out.println(noneStartsWithZ);      // true
```

### Count

Count is a terminal operation returning the number of elements in the stream as a long.

```java
long startsWithB =
    stringCollection
        .stream()
        .filter((s) -> s.startsWith("b"))
        .count();

System.out.println(startsWithB);    // 3
```

### Grouping

```java
//people is a list of persons (name, age)

people.stream()
        .collect(groupingBy(Person::getName));
```

## Reusing Streams

Java 8 streams cannot be reused. As soon as you call any terminal operation the stream is closed:

```java
Stream<String> stream =
    Stream.of("d2", "a2", "b1", "b3", "c")
        .filter(s -> s.startsWith("a"));

stream.anyMatch(s -> true);    // ok
stream.noneMatch(s -> true);   // exception
```

Calling noneMatch after anyMatch on the same stream results in the following exception:

```java
java.lang.IllegalStateException: stream has already been operated upon or closed
    at java.util.stream.AbstractPipeline.evaluate(AbstractPipeline.java:229)
    at java.util.stream.ReferencePipeline.noneMatch(ReferencePipeline.java:459)
    at com.winterbe.java8.Streams5.test7(Streams5.java:38)
    at com.winterbe.java8.Streams5.main(Streams5.java:28)
```

To overcome this limitation we have to to create a new stream chain for every terminal operation we want to execute, e.g. we could create a *stream supplier* to construct a new stream with all intermediate operations already set up:

```java
Supplier<Stream<String>> streamSupplier =
    () -> Stream.of("d2", "a2", "b1", "b3", "c")
            .filter(s -> s.startsWith("a"));

streamSupplier.get().anyMatch(s -> true);   // ok
streamSupplier.get().noneMatch(s -> true);  // ok
```

Each call to `get()` constructs a new stream on which we are save to call the desired terminal operation.

## Parallel Streams

Streams can be executed in parallel to increase runtime performance on large amount of input elements.

Collections support the method `parallelStream()` to create a parallel stream of elements. Alternatively you can call the intermediate method `parallel()` on a given stream to convert a sequential stream to a parallel counterpart.
