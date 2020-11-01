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

## WorkFlow

El més habitual serà emmagatzemar els diferents threads en un vector en lloc de fer-ho en un objecte solt. Llançar el thread amb `start()` i esperar-lo amb `join()`.

## Join

Tots els programes multifil tenen un fil principal que ha d’esperar que
acaben els fils associats, per a la qual cosa utilitzem el mètode join . Pe què s’anomena així? Quan creem un thread, es produeix una bifurcació, es creen dos camins d’execució diferents, pel que quan un procés acaba i ha d’esperar a l’altre, es produeix una unificació, un join.

## Exemples

**Exemple1:**

```java

/*
Exemple tipus "Hola Món" amb threads
*/
public class exemple1 implements Runnable {
    String nom;

    // Constructors
    exemple1() {
        this.nom = "Anònim";
    }
    exemple1(String nom) {
        this.nom = nom;
    }

    // Aquest és el métode que s'exeutarà quan
    // s'invoque al métode start del thread.
    @Override
    public void run() {
        try{
            // Agafem la referéncia al thread actual
            Thread filActual = Thread.currentThread();

            // I imprimim informació sobre el seu nom i algunes propietats
            System.out.println("Hola Món dels threads. Sóc " + this.nom + ":"
                + "\n\tEl meu id de thread és " + filActual.getId()
                + "\n\tEl nom de thread és " + filActual.getName()
                + "\n\tLa meua prioritat és " + filActual.getPriority() + "\n");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static void main(String[] args) {
        try{
            // Creem alguns objectes d'exemple
            exemple1 ex1 = new exemple1("C3PO");
            exemple1 ex2 = new exemple1("R2D2");
            exemple1 ex3 = new exemple1("BB8");

            // I els fils corresponents
            Thread fil1 = new Thread(ex1);
            Thread fil2 = new Thread(ex2);
            Thread fil3 = new Thread(ex3);

            // Llancem els fils
            fil1.start();
            fil2.start();
            fil3.start();

            // I els juntem amb l'actual quan acaben
            fil1.join();
            fil2.join();
            fil3.join();

        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}
```

**Exemple2**

En aquest exemple, hem fet una variació de l’anterior, per tal que reba una llista de noms com a arguments, i cree tants fils com hem indicat, fent ús de vectors per emmagatzemar els objectes i els threads.

```java
/*
Exemple tipus "Hola Món" amb threads i vectors
*/
public class exemple2 implements Runnable {
    String nom;

    // Constructors
    exemple2(){
        this.nom = "Anònim";
    }
    exemple2(String nom){
        this.nom = nom;
    }

    @Override
    // Aquest és el métode que s'exeutarà quan
    // s'invoque al métode start del thread.
    public void run() {
        try{
            // Agafem la referéncia al thread actual
            Thread filActual = Thread.currentThread();

            // I imprimim informació sobre el seu nom i algunes propietats
            System.out.println("Hola Món dels threads. Sóc " + this.nom + "
            :"
            + "\n\tEl meu id de thread és " + filActual.getId()
            + "\n\tEl nom de thread és " + filActual.getName()
            + "\n\tLa meua prioritat és " + filActual.getPriority() + "\n");

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) {
        try{
            // Definim un vector per emmagatzemar els threads
            Thread[] LlistaThreads = new Thread[args.length];
            for (int i = 0; i < args.length; i++) {

                // Creem l'objecte
                exemple2 nom = new exemple2(args[i]);

                // I el thread que l'utilitza
                LlistaThreads[i] = new Thread(nom);

                // I el llancem
                LlistaThreads[i].start();
            }

            // Una vegada llançats, els juntem tots
            for (int i = 0; i < args.length; i++) {
                LlistaThreads[i].join();
            }
        } catch(Exception e){
            e.printStackTrace();
        }
    }
}
```
