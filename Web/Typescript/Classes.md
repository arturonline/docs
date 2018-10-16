# Classes & Inheritance

```Typescript
class Person {
    firstName = "";
    lastName = "";
    debt: Map<string, number>;

    constructor(firstName, lastName) {  
        this.firstName = firstName;
        this.lastName = lastName;
        this.debt = new Map();

    }

    name() {
        return `${this.firstName} ${this.lastName}`;
    }

    whoAreYou() {
        return `Hi i'm ${this.name()}`;
    }
}
```

## Class Instance

We instantiate a class by using the new keyword and when that happens javascript calls the constructor function. We can pass to the constructer arguments which it uses to initialise properties or call other function, like so:

```Typescript
let asim = new Person("Asim","Hussain");
asim.whoAreYou()
// "Hi i'm Asim Hussain"
```

## Inheritance

A class can inherit from another class. We can create a class blue-print that extends an existing class blue-print by adding other methods or properties.

We do this by using the extends keyword, like so:

```Typescript
class Student extends Person {
    course;

    constructor(firstName, lastName, course) {
        super(firstName, lastName);
        this.course = course;
    }

    whoAreYou() {
        return `${super.whoAreYou()} and i'm studying ${this.course}`;
    }
}
```

## Access Modifiers

There are 3 access modifiers:

* public

This is the default and means its visible everywhere.

* private

Only member functions of the class it’s declared in can see this.

* protected

Only the class it’s declared in and any class that inherits from that class can see this.

## Interfaces

TypeScript has another feature called an interface. An interface can be used in a number of scenarios but by far the most common is when used with classes.

When used with classes the syntax looks like this:

```Typescript
class Person implements Human {
}
```

Human in the example above is an interface. An interface lets you describe the minimum set of public facing properties or methods that a class has.

Another way interfaces are explained is that they describe a set of rules the class has to follow, a contract it has to adhere to.

So for us a Human interface might look like:

```Typescript
interface Human {
    firstName: string;
    lastName: string;
}
```

### Important

Since interfaces are all about the public interface of a class they can’t have access modifiers, the properties above have to be public.
If the Person class then doesn’t implement at least a firstName and a lastName then typescript throws an error like so:

```Typescript
error TS2420: Class 'Person' incorrectly implements interface 'Human'. Property 'firstName' is missing in type 'Person'.
```

Sometimes however we might want an interface to describe an optional contract. We can append ? to the name of the property or function to mark it as optional, like so:

```Typescript
interface Human {
    firstName: string;
    lastName: string;
    name?: Function;
    isLate?(time: Date): Function;
```