# Java Threads

## Creating and starting a thread

Creating a thread in Java is done like this:

```java
Thread thread = new Thread();
```

To start the Java thread you will call its `start()` method, like this:

```java
thread.start();
```

This example doesn't specify any code for the thread to execute. Therfore the thread will stop again right away after it is started.

## Specify code to run in a thread

There are two ways:

1. By Extending the Thread class (`java.lang.Thread`)
1. Implement the Runnable interface (`java.lang.Runnable`)

### #1: Create a Thread by extending a Thread Class

```java
public class MyThread extends Thread {

    public void run(){
       System.out.println("MyThread running");
       System.out.println("MyThread finished");
    }
  }

public static void main(Strings[] args) {
    MyThread myThread = new MyThread();
    myTread.start();
}

// myThread running
// myThread finished
```

### #2: Create a Thread by extending the `Runnable` Interface

*Prefered way

```java
public class MyRunnable implements Runnable {

@override
    public void run(){
        System.out.println("MyRunnable running");
        System.out.println("MyRunnable finished");
    }
}

public static void main(Strings[] args) {
    Thread thread = new Thread( new MyRunnable() );
    thread.start();
}

// MyRunnable running
// MyRunnable finished
```

#### Extending Runnable as an anonymous class

```java
public static void main(Strings[] args) {
    Runnable runnable = new Runnable() {
        @override
        public void run() {
            System.out.println("MyRunnable running");
            System.out.println("MyRunnable finished");
        }
    };

    Thread thread = new Thread( runnable );
    thread.start();
}

// MyRunnable running
// MyRunnable finished
```

#### Extending Runnable with a Lambda

```java
public static void main(Strings[] args) {
    Runnable runnnable = () -> {
        System.out.println("Lambda running");
        System.out.println("Lambda finished");
    };
    Thread thread = new Thread(runnable);
    thread.start();
}

// Lambda running
// Lambda finished
```

>⚠ **Common Pitfall:** Calling `run()` Instead of `start()` At first you may not notice anything because the Runnable's `run()` method is executed like you expected. However, it is NOT executed by the new thread you just created, but the thread that executed the above two lines of code.
