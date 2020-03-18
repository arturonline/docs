# Java IO

## Read Character Streams

### Read & Write Characters

```java
public class CopiarCaracter {
    public static void main(String[] args) throws IOException {

        FileReader inputStream = null;
        FileWriter outputStream = null;

        try {
            inputStream = new FileReader("xanadu.txt");
            outputStream = new FileWriter("characteroutput.txt");

            int c;
            while ((c = inputStream.read()) != -1) {
                outputStream.write(c);
            }
        } finally {
            if (inputStream != null) {
                inputStream.close();
            }
            if (outputStream != null) {
                outputStream.close();
            }
        }
    }
}
```

## Read Lines

### Read

```java
// The name of the file to open.
String fileName = "filename.txt"

public void leerArchivo(String fileName) {

        // FileReader reads text files in the default encoding.
    try (FileReader reader = new FileReader("filename.txt");
        // Always wrap FileReader in BufferedReader.
         BufferedReader br = new BufferedReader(reader)) {

        // read line by line
        String line = null;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
    }
    //Stream is closed automatically
    catch (IOException e) {
        System.err.format("IOException: %s%n", x);
    }
}
```

### Write

```java
// The name of the file to open.
String file = "filename.txt"

public void escribirArchivo(file) {
    String s = ...;
    try (BufferedWriter writer = Files.newBufferedWriter(file, charset)) {
        writer.write(s, 0, s.length());
        // Note that write() does not automatically
        // append a newline character.
    } catch (IOException x) {
        System.err.format("IOException: %s%n", x);
}
```

