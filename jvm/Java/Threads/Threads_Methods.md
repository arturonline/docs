# Thread Methods

## Thread Names

```java
Thread t = new Thread("Mi hilo") {
    public void run() {
        System.out.println("run by: " + getName());
      }
};


t.start();
System.out.println(t.getName());

// Hello World!
// Mi hilo
// run by: Mi hilo
```

```java
MyRunnable runnable = new MyRunnable();
Thread thread = new Thread(runnable, "Mi hilo");

thread.start();
System.out.println(thread.getName());

// Mi hilo
```

⚠ Notice however, that since the MyRunnable class is not a subclass of Thread, it does not have access to the `getName()` method of the thread executing it.

## Access current Thread

```java
Thread thread = Thread.currentThread();
```

Example:

```java
public static void main( String[] args ) {
    System.out.println(Thread.currentThread().getName());
    for(int i = 0; i < 10; i++) {
        new Thread("" + i) {
            public void run() {
                System.out.println("Thread: " + getName() + " running");
            }
        }.start();
    }
}

// main
// Thread: 0 running
// Thread: 2 running
// Thread: 3 running
// Thread: 1 running
// Thread: 4 running
// Thread: 5 running
// Thread: 6 running
// Thread: 8 running
// Thread: 7 running
// Thread: 9 running
```

⚠`isAlive()` -> Determine if a thread is still running

## Pause a Thread

A thread can pause itself by calling the static method `Thread.sleep()`:

```java
try {
    Thread.sleep(10L * 1000L);
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

## Stop a Thread

The Java Thread class contains a `stop()` method, but it is deprecated. The original `stop()` method would not provide any guarantees about in what state the thread was stopped.

Instead of calling the `stop()` method you will have to implement your thread code so it can be stopped. Here is an example of a class that implements Runnable which contains an extra method called `doStop()` which signals to the Runnable to stop. The Runnable will check this signal and stop when it is ready to do so.

```java
public class MyRunnable implements Runnable {

    private boolean doStop = false;

    public synchronized void doStop() {
            this.doStop = true;
    }

    private synchronized boolean keepRunning() {
        return this.doStop == false;
    }

    @Override
    public void run() {
        while( keepRunning() ) {
            // keep doing what this thread should do.
            System.out.println("Running");

            try {
                Thread.sleep(3L * 1000L);
            } catch(InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}

//Here is an example of starting a Java thread that executes an instance of the above MyRunnable class, and stopping it again after a delay:

public class MyRunnableMain {

    public static void main(String[] args) {
        MyRunnable myRunnable = new MyRunnable();
        Thread thread = new Thread( myRunnable );
        thread.start();

        try {
            Thread.sleep(10L * 1000L);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        myRunnable.doStop();
    }
}
```

## Wait for a Thread to finish

The `join()` method stops executing until the thread it joins with completes its task.

```java
class TestJoinMethod1 extends Thread {
    public void run() {
        for(int i = 1; i < = 5; i++) {
            try {
                Thread.sleep(500);
            } catch(Exception e) {
                System.out.println(e);
            }
            System.out.println(i);
        }
    }

    public static void main(String args[]) {
        TestJoinMethod1 t1 = new TestJoinMethod1();
        TestJoinMethod1 t2 = new TestJoinMethod1();
        TestJoinMethod1 t3 = new TestJoinMethod1();

        t1.start();
            try {
                t1.join();
            } catch(Exception e) {
                System.out.println(e);
            }

        t2.start();
        t3.start();
    }
}
// 1
// 2
// 3
// 4
// 5
// 1
// 1
// 2
// 2
// 3
// 3
// 4
// 4
// 5
// 5
```

when **t1** completes its task then **t2** and **t3** starts executing.

## Priority of a Thread

3 constants defined in Thread class:

- public static int **MIN_PRIORITY**
- public static int **NORM_PRIORITY**
- public static int **MAX_PRIORITY**

Default priority of a thread is 5 (**NORM_PRIORITY**). The value of **MIN_PRIORITY** is 1 and the value of **MAX_PRIORITY** is 10.

```java
class TestMultiPriority1 extends Thread{
    public void run() {
        System.out.println("running thread name is:" +
                            Thread.currentThread().getName());
        System.out.println("running thread priority is:" +
                            Thread.currentThread().getPriority());
    }

    public static void main(String args[]) {

        TestMultiPriority1 m1 = new TestMultiPriority1();
        TestMultiPriority1 m2 = new TestMultiPriority1();

        m1.setPriority(Thread.MIN_PRIORITY);
        m2.setPriority(Thread.MAX_PRIORITY);

        m1.start();
        m2.start();

    }
}

// running thread name is:Thread-0
// running thread priority is:10
// running thread name is:Thread-1
// running thread priority is:1
```

⚠ `getPriority()` -> Obtain thread’s priority