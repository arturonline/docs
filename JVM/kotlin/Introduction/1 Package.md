# Package declaration and imports

## Packages

Packages allow us to split code into namespaces.

- Package specification should be at the top of the source.
- Source files can be placed arbitrarily in the file system
- If the package is not specified, the contents of such a file belong to "default" package that has no name.

## Imports

To enable classes, objects, interfaces and functions to be used outside of the declared package we must import the requiered class, object, interface, or function.

Unlike Java, Kotlin does not have a separate "import static" syntax; all of these declarations are imported using the regular import keyword.

### Same name imports

If two different packages each use the same name, then we can use the as keyword to alias the name:

```Kotlin
import foo.Bar // Bar is accessible
import bar.Bar as bBar // bBar stands for 'bar.Bar'
```