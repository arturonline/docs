# Working with files

Java has two file APIs.

1. The original `java.io.File` API, available since Java 1.0 (1996).
1. The newer `java.nio.file.Path` API, available since Java 1.7 (2011).

If you are starting a new Java project, it is highly recommended to use the Paths API over the File API.

## Paths

To work with files in Java, you first need a reference to a file.

```java
Path path = Path.of("c:\\dev\\licenses\\windows\\readme.txt");
System.out.println(path);

path = Path.of("c:/dev/licenses/windows/readme.txt");
System.out.println(path);

path = Path.of("c:" , "dev", "licenses", "windows", "readme.txt");
System.out.println(path);

path = Path.of(new URI("file:///c:/dev/licenses/windows/readme.txt"));
System.out.println(path);

// Old version: Java < 11
path = Paths.get("c:/dev/licenses/windows/readme.txt");
System.out.println(path);

// All lines produce:
//c:\dev\licenses\windows\readme.txt
```

⚠️ Constructing a path object or resolving a child, does not mean the file or directory actually exists. The path is merely a reference to a potential file. So, you’ll have to separately verify its existence.

```java
Path path = Path.of("c:\\dev\\licenses\\windows\\readme.txt");
boolean exists = Files.exists(path);
System.out.println("exists = " + exists);
```

## Absolute, relative & canonical files

### Relative Paths

Here, you’re constructing a new path, based on the current directory (.), even including a (..) at some point. Hence, the path is relative to your current directory, and path.isAbsolute will return false.

```java
Path p = Paths.get("./src/main/java/../resources/some.properties");
System.out.println("p.isAbsolute() = " + p.isAbsolute());
```

### Absolute Paths

```java
Path p2 = p.toAbsolutePath();
System.out.println("p2 = " + p2);
System.out.println("p2.isAbsolute() = " + p2.isAbsolute());
```

When you call toAbsolutePath on the path, it will get converted to an..well…​absolute path, in my case containing C:\dev\java-files. Note, the absolute path still contains the dots, for current directory and upper-directory!

```java
p2 = C:\dev\java-file-article\.\src\main\java\..\resources\some.properties
p2.isAbsolute() = true
```

### Normalized Paths

How to get rid of the dots? You’ll need to call normalize.

```java
Path p3 = p.normalize().toAbsolutePath();
System.out.println("p3 = " + p3);
System.out.println("p3.isAbsolute() = " + p3.isAbsolute());
This normalized, absolute path, is also what you could have called the canonical path.
```

### Relativizing paths

Last but not least, you can also go the other way. Instead of making relative paths absolute, you can make absolute paths relative.

```java
Path relativizedPath = Paths.get("C:\\dev\\java-file-article\\").relativize(p3);
System.out.println("relativizedPath = " + relativizedPath);
```

## Create Files and Directories

```java
Path newDirectory = Files.createDirectories(path.getParent().resolve("some/new/dir"));
System.out.println("newDirectory = " + newDirectory);
// newDirectory = c:\dev\licenses\windows\some\new\dir

Path newFile = Files.createFile(newDirectory.resolve("emptyFile.txt"));
System.out.println("newFile = " + newFile);
//newFile = c:\dev\licenses\windows\some\new\dir\emptyFile.txt
```

## Move files

```java
Path utfFile = Files.createTempFile("some", ".txt");

try {
Files.move(utfFile, Path.of("c:\\dev").resolve(utfFile.getFileName().toString()));
} catch (FileAlreadyExistsException e) {
    // welp, that din't work!
}
```

⚠️ You don’t move files to folders, but you "move" them to their full new path, including the filename and extension.

## Delete files

There is the `Files.delete` method, which allows you to delete files and directories, but directories only if they are empty.

```java
try {
    Files.delete(tmpDir);
} catch (DirectoryNotEmptyException e) {
    e.printStackTrace();
}
```

if you want to use a plain Java version to delete a non-empty directory tree, this is what you’ll want to do:

```java
try (Stream<Path> walk = Files.walk(tmpDir)) {
    walk.sorted(Comparator.reverseOrder()).forEach(path -> {
        try {
            Files.delete(path);
        } catch (IOException e) {
            // something could not be deleted..
            e.printStackTrace();
        }
    });
}
```

## List files in the same directory

```java
// Exemple1
try (var files = Files.list(tmpDirectory)) {
    files.forEach(System.out::println);
}

// Exemple2
try (var files = Files.newDirectoryStream(tmpDirectory, "*.txt")) {
    files.forEach(System.out::println);
}
```

If you want to recursively list all files of a file tree, you’ll need to employ the method we used for deleting directories: Files.walk.

```java
try (var files = Files.walk(tmpDirectory)) {
    files.forEach(System.out::println);
}
```