# Classes

Classes can have two kinds of initilizers: `designated initializers` and `convenience initializers`.

A designated initializer is the primary initializer for the class. It ensures that all properties in the class have a value, and then calls the designated initializer on its superclass.

Convenience initializers always call another initializer on the same class.

You can define a convenience initializer to call a designated initializer from the same class with some of the designated initializer’s parameters set to default values. You can also define a convenience initializer to create an instance of that class for a specific use case or input value type.