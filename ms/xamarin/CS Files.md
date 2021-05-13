# CS Files n Folders

```cs
using System.IO;

File.SomeFileMethod();
```

C# provides the following classes to work with the File system:

| class           | Type     | Usage                                                                                                                                                |
| --------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `File`          | static   | copy, create, move, delete, open, encrypt, exists                                                                                                    |
| `FileInfo`      | Instance | Same functionality as a `File` File class                                                                                                            |
| `Directory`     | static   | creating, moving, deleting, accessing...                                                                                                             |
| `directoryInfo` | Instace  | Same functionality as `Directory`                                                                                                                    |
| `Path`          | static   | retrieving the extension of a file, changing the extension of a file, retrieving the absolute physical path, and other path related functionalities. |

A file is a collection of data stored in a disk with a specific name and a directory path. When a file is opened for reading or writing, it becomes a stream.

The stream is basically the sequence of bytes passing through the communication path. There are two main streams: the input stream and the output stream. The input stream is used for reading data from file (read operation) and the output stream is used for writing into the file (write operation).

## Usefull

```cs
// Get parent directory

// Modo 1:
string parentDirectoryName = Path.GetFileName(Path.GetDirectoryName(fullPath));

// Modo 2:
var fileInfo = new FileInfo(fileWithPath);
var parentName = fileInfo.Directory.Name;
```
