# Writing & Reading Files

## Writing Strings to files

You should be using the `Files.writeString` method to write string content to a file. By default, it will write a UTF-8 file, which you can, however, override by specifying a different encoding.

```java
Path utfFile = Files.createTempFile("some", ".txt");
Files.writeString(utfFile, "this is my string ää öö üü"); // UTF 8
System.out.println("utfFile = " + utfFile);

Path iso88591File = Files.createTempFile("some", ".txt");
Files.writeString(iso88591File, "this is my string ää öö üü", StandardCharsets.ISO_8859_1); // otherwise == utf8
System.out.println("iso88591File = " + iso88591File);
```

## Writing bytes to files

When calling the write method, the file will automatically be created (and truncated if it already exists).

```java
Path anotherIso88591File = Files.createTempFile("some", ".txt");
Files.write(anotherIso88591File, "this is my string ää öö üü".getBytes(StandardCharsets.ISO_8859_1));
System.out.println("anotherIso88591File = " + anotherIso88591File);
```

## Using Writers and OutputStreams (large files)

If you want to work directly with writers or output streams, make sure to call the corresponding Files methods and not construct the writers or streams by hand.

```java
try (BufferedWriter bufferedWriter = Files.newBufferedWriter(utfFile)) {
    // handle reader
}

try (OutputStream os = Files.newOutputStream(utfFile)) {
    // handle outputstream
}
```

## How to read strings from files

On Java11+, you should be using the `Files.readString` method to read a string from a file. Make sure to pass in the appropriate file encoding; by default, Java will use the UTF-8 encoding to read in files.

```java
String s = Files.readString(utfFile);// UTF 8
System.out.println("s = " + s);

s = Files.readString(utfFile, StandardCharsets.ISO_8859_1); // otherwise == utf8
System.out.println("s = " + s);
```

## How to read bytes from files

If you want to read bytes from a file (and in older Java versions < 11 you’d have to use the same API for reading strings), you need to call `Files.readAllBytes`.

```java
s = new String(Files.readAllBytes(utfFile), StandardCharsets.UTF_8);
System.out.println("s = " + s);
```

## Using Readers and InputStreams (large files)

As always, you can fall back to using readers or inputstreams directly. For that, use the corresponding Files methods:

```java
try (BufferedReader bufferedReader = Files.newBufferedReader(utfFile)) {
    // handle reader
}

try (InputStream is = Files.newInputStream(utfFile)) {
    // handle inputstream
}
```
