# Objectives

- In this chapter, you saw that Java classes consist of members called felds and methods. An object is an instance of a Java class.

- There are three styles of comment: a single-line comment `//`, a multiline comment `/* */`, and a Javadoc comment `/** */`.

- Java begins program execution with a `main()` method. The most common signature for this method run from the command line is `public static void main(String[] args)`. Arguments are passed in after the class name, as in java NameOfClass firstArgument. Arguments are indexed starting with 0.

- Java code is organized into folders called packages. To reference classes in other packages, you use an import statement. A wildcard ending an import statement means you want to import all classes in that package. It does not include packages that are inside that one. `java.lang` is a special package that does not need to be imported.

- For some class elements, order matters within the file. The package statement comes first if present. Then comes the import statements if present. Then comes the class declaration. Fields and methods are allowed to be in any order within the class.

- Constructors create Java objects. A constructor is a method matching the class name and omitting the return type. When an object is instantiated, felds and blocks of code are initialized first. Then the constructor is run.

- Primitive types are the basic building blocks of Java types. They are assembled into reference types. Reference types can have methods and be assigned to null. In addition to “normal” numbers, numeric literals are allowed to begin with 0 (*octal*), 0x (*hex*), 0X (*hex*), 0b (*binary*), or 0B (*binary*). Numeric literals are also allowed to contain underscores as long as they are directly between two other numbers.

- Declaring a variable involves stating the data type and giving the variable a name. Variables that represent felds in a class are automatically initialized to their corresponding “zero” or null value during object instantiation. Local variables must be specifcally initialized. Identifers may contain *letters*, *numbers*, *$,* or *_*. Identifers may not begin with *numbers*.

- Scope refers to that portion of code where a variable can be accessed. There are three kinds of variables in Java, depending on their scope: instance variables, class variables, and local variables. Instance variables are the nonstatic fields of your class. Class variables are the static fields within a class. Local variables are declared within a method.

- Garbage collection is responsible for removing objects from memory when they can never be used again. An object becomes eligible for garbage collection when there are no more references to it or its references have all gone out of scope. The `finalize()` method will run once for each object if/when it is frst garbage collected.
