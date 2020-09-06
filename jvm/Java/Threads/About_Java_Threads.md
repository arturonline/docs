# Java Concurrency

- Thread is a lightweight sub process
- It is the smallest independent unit of a program
- Every Java program contains at least one thread
- Contains a separate path of execution
- A thread is created and controlled by the `java.lang.Thread` class

## Thread Lifecycle

The `java.lang.Thread` class contains a static State enum – which defines its potential states. During any given point of time, the thread can only be in one of these states:

### New

A newly created thread that has not yet started the execution. It remains in this state until we start it using the `start()` method.

### Running

Either running or ready for execution but it's waiting for resource allocation from the system.

In a multi-threaded environment, the Thread-Scheduler (which is part of JVM) allocates a fixed amount of time to each thread. So it runs for a particular amount of time, then relinquishes the control to other RUNNABLE threads.

### Blocked

A thread is in the BLOCKED state when it's currently not eligible to run. It enters this state when it is waiting for a monitor lock and is trying to access a section of code that is locked by some other thread.

### Waiting

A thread is in WAITING state when it's waiting for some other thread to perform a particular action. According to JavaDocs, any thread can enter this state by calling any one of the following three methods:

- `object.wait()`
- `thread.join()` or
- `LockSupport.park()`

### Timed_waiting

A thread is in TIMED_WAITING state when it's waiting for another thread to perform a particular action within a stipulated amount of time.

According to JavaDocs, there are five ways to put a thread on TIMED_WAITING state:

- `thread.sleep(long millis)`
- `wait(int timeout)` or `wait(int timeout, int nanos)`
- `thread.join(long millis)`
- `LockSupport.parkNanos`
- `LockSupport.parkUntil`

### Terminated

This is the state of a dead thread. It's in the TERMINATED state when it has either finished execution or was terminated abnormally.