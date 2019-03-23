# Declaration Modifiers

Directive | Purpose
:---: | ---
| dynamic | Marks a member declaration so that access is always dynamically dispatched using the Objective-C runtime and never inlined or devirtualized by the compiler
| final | Specifies that a class can’t be subclassed, or that a property, function, or subscript of a class can’t be overridden in any subclass
| lazy | Indicates that the property’s initial value is calculated and stored at most once, when the property is first accessed
| optional | Specifies that a protocol’s property, function, or subscript isn’t required to be implemented by conforming members
| required | Marks the initializer so that every subclass must implement it
| weak | Indicates that the variable or property has a weak reference to the object stored as its value
