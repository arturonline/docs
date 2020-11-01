# Mètodes sincronitzats: Synchronized

Multi-threaded programs may often come to a situation where multiple threads try to access the same resources and finally produce erroneous and unforeseen results.

So it needs to be made sure by some synchronization method that only one thread can access the resource at a given point of time.

Java provides a way of creating threads and synchronizing their task by using synchronized blocks. Synchronized blocks in Java are marked with the synchronized keyword. A synchronized block in Java is synchronized on some object. All synchronized blocks synchronized on the same object can only have one thread executing inside them at a time. All other threads attempting to enter the synchronized block are blocked until the thread inside the synchronized block exits the block.

Exemple:

Here is a synchronized instance method:

```java
public class MyCounter {

  private int count = 0;

  public synchronized void add(int value){
      this.count += value;
  }
}
```

Notice the use of the `synchronized` keyword in the `add()` method declaration. This tells Java that the method is synchronized.

## Coordinació de threads: Productors y Consumidors

Si existeix un thread que produeix dades i un thread que les consumeix pot apareixer un problema de sincronisme si el consumidor consumeix més de pressa que el que produeix el productor.

Per evitar açò, el desitjable seria que quan el **productor** escriu en l’**objecte compartit**, avisara al **consumidor**, i quan l’**objecte compartit** estigués disponible per guardar valors, que avisara el productor.

Açò s’aconsegueix amb els mètodes `wait()` , `notify()` i `notiftAll()`.

Mètode | Descripció
-|-
`void wait()` | Fa que el fil que l’invoque quede suspés fins que altre fil invoque al mètode `notify()` o `notiftAll()`.
`void notify()` | Desperta a un dels fils que ha realitzat una crida a `wait()` . Si han segut diversos fils, només se’n tria un.
`void notifyAll()` | Desperta tots els fils que estiguen esperant l’objecte.

---

## Exemple

Com a exemple, veiem el següent programa, on disposarem d’un **objecte compartit**, al qual, una classe **productora** escriu valors i són consumits per una classe **consumidora**:

La classe `ObjecteCompartit` tindrà:

- Un atribut enter on guardarà un valor.
- Un booleà que indique la disponibilitat d’aquest.
- Un mètode `get`, que retorna el valor que conté l’objecte i deixa en fals la disponibilitat d’aquest, ja que aquest ha estat consumit.
- Un mètode `set` per establir aquest valor, i indicar que està disponible.

```java
class ObjecteCompartit{
    int valor;
    boolean disponible = false; // Inicialment no tenim valor

    public synchronized int get() {

        // Mentre no tingam dades disponibles ens esperem
        while (disponible == false){
            try {
                wait();
            } catch (InterruptedException e) {}
        }

        // Quan es desperte, tornem a establir la
        // disponibilitat a fals, notifiquem a tots
        // els productors de la disponibilitat i
        // retornem el valor.
        this.disponible = false;
        notifyAll();
        return this.valor;
    }
    public synchronized void set(int val) {
        // Mentre queden dades ens esperem
        while (disponible == true) {
            try {
            wait();
            } catch (InterruptedException e) {}
        }

        // Quan es desperte, tornem a establir la
        // disponibilitat a cert, establim el valor
        // generat pel productor, i notifiquem a tots
        // els consumidors de la disponibilitat.
        this.valor = val;
        this.disponible = true;
        notifyAll();
    }
}
```

Per la seua banda, les classes **Productor** i **Consumidor** , que seràn `Runnable` , s’inicialitzaran amb un **objecte compartit**, i en el seu mètode `run()` , tindran un bucle que escriurà i llegirà, respectivament, cinc valors en l’**objecte compartit**. Com podem veure, la classe **Productor**, farà una pausa de *500ms* després de produir cada element, mentre que la classe **Consumidor** , la farà de *100ms*.

```java
class Productor implements Runnable{

    // Referéncia a un objecte compartit
    ObjecteCompartit compartit;

    Productor(ObjecteCompartit oc) {
        this.compartit = oc;
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++){
            System.out.println("El productor produeix: " + i);
            this.compartit.set(i);
            try {
            Thread.currentThread().sleep(500);
            } catch (InterruptedException e){}
        }
    }
}
```

```java
class Consumidor implements Runnable{
    // Referéncia a un objecte compartit
    private ObjecteCompartit compartit;

    Consumidor(ObjecteCompartit oc) {
        this.compartit = oc;
    }

    @Override
    public void run() {
        for (int i = 0; i < 5; i++){
            System.out.println("El consumidor consumeix: " + this.
            compartit.get());
            try {
                Thread.currentThread().sleep(100);
            } catch (InterruptedException e){}
        }
    }
}
```

Finalment, la classe principal `exempleProdCons` crearà un thread amb el productor i altre amb el consumidor, i els llançarà:

```java
public class exempleProdCons {
    public static void main(String[] args) {
        ObjecteCompartit oc = new ObjecteCompartit();

        Thread p = new Thread(new Productor(oc));
        Thread c = new Thread(new Consumidor(oc));

        p.start();
        c.start();
    }  
}
```
