# Java IO Files

La lectura i escriptura de **fitxers** en Java es realitza a través de fluxos de dades o streams, que podran ser bé orientats a bytes o bé considerats com un conjunt de caràcters.

## Fluxos orientats a bytes

Les superclasses pare per a la gestió d’streams orientats a bytes són `InputStream` i `OutputStream`.

```java
InputStream -> FileInputStream
OutputStream -> FileOutputStream
```

### Exemple a bytes

Per a la gestió de fitxers gasten dos derivades de les anteriors: `FileInputStream` i `FileOutputStream`.

```java
// Realitza la còpia byte a byte d'un fitxer.

// Sintaxi:
// FileCopy FitxerOrigen FitxerDestí.

import java.io.*;

class FileCopy {
    public static void main(Strings[] args) throws Exception {
        int bytes; // bytes llegits en cada lectura
        int bytesCopied = 0; // acumulador de bytes copiats

        FileInputStream fin = null; // orige
        FileOutputStream fout = null; // destí


        // Comprovem nombre arguments entrada
        if (args.length! = 2) {
            System.out.println("Nombre d'arguments erroni");
            return;
        }

        try {
            fin = new FileInputStream(args[0]); // creem fluxe i fitxer origen
            fout = new FileOutputStream(args[1]); // creem fluxe i fitxer destí

            do {
                bytes = fin.read(); // Llegim byte des del fitxer orige
                if (bytes != -1)
                    fout.write(bytes); // Escrivim el byte al fitxer destí

            } while(bytes != -1);
            System.out.println("Fet");

        } catch (IOException e) {
            System.out.println("Error d'entrada i exida: " + e);
        } finally {
            //tanquem els fitxers oberts
            try {
                if (fin != null) fin.close();
            } catch (IOException e) {
                System.out.println("Error en tancar el fitxer d'origen");
            }
             try {
                if (fout != null) fin.close();
            } catch (IOException e) {
                System.out.println("Error en tancar el fitxer d'destí");
            }
        }
    }
}
```

## Fluxos orientats a caràcters

Les classes abstractes per a la gestió d’streams orientats a caràcters són `Reader`
i `Writer`. D’aquestes se’n deriven d’altres, però per a la gestió de fitxers ens interessen dues: `FileReader` i `FileWriter`.

### Exemple a caràcters

```java
// El següent exemple realitzarà una concatenació de tots els fitxers de text de dins un directori en un sol.
// Sintaxi serà:
// $ mergeTexts directori FitxerEixida

package com.ieseljust.ad.fitxers;

import java.io.*;

class mergeTexts {
    public static void main(String[] args) throws Exception {

        File dir; // Per llegir el directory
        File[] files; // vector per emmagatzemar la llista de fitxers del directory
        int caracters; // caràcters llegits en cada lectura

        FileReader fin = null; // Orige
        FileWriter fout = null; // destí

        // Comprovem nombre arguments entrada
        if (args.length! = 2) {
            System.out.println("Nombre d'arguments erroni");
            return;
        }

        try {

            // Obtenim llistat de fitxers
            dir = new File(args[0]);
            files = dir.listFiles();

            // Obrim stream i tanquem per crear fitxer.
            fout = new FileWriter(args[1]);
            fout.close();

            // Obrim el fitxer creat abans en modo append
            fout = new FileWriter(args[1], true);

            // Recorrem la llista, llegint fitxer a fitxer
            for (int i = 0; i < files.length; i++) {
                fin = new FileReader(args[0] + "/" + files[i].getName());
                System.out.println("Merging: " + args[0] + "/" + files[i].getName());

                do {
                    caracters = fin.read();
                    if (caracters != -1)
                        fout.write(caracters); // escrivim al destí
                } while (caracters != -1);
                fin.close;
            }
            fout.close;
        } catch (Exception e) {
            System.out.println("Error d'entrada i eixida");
        }
    }
}
```

## Decorators

Les classes decoradores ens aporten una funcionalitat afegida a l’original. En el cas dels fluxos d’entrada i eixida, disposem de decoradors que ens permeten llegir o escriure línies completes, en lloc de byte a byte, o guardar determinat format
de dades.

### Decoradors a bytes

| classe               | descripció                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| `DataInputStream`    | Permet llegir desde qualsevol tipus (int, boolean...)                    |
| `DataOutputStream`   | Permet escriure deades de qualsevol tipus (int, boolean...)              |
| `ObjectInputStream`  | Permet llegit tot un objecte.                                            |
| `ObjectOutputStream` | Permet escriure (serialitzar) objectes.                                  |
| `PrintStream`        | Permet escriure dades de qualsevol tipus i accepta `printf` i `println`. |

### Decoradors a caràcters

| classe           | descripció                                                                    |
| ---------------- | ----------------------------------------------------------------------------- |
| `BufferedReader` | Permet llegir linies completes.                                               |
| `BufferedWriter` | Permet escriure linies completes.                                             |
| `PrintWriter`    | Permet escriptura de dades de diferents tipus i accepta `printf` i `println`. |

### metodes interessants

La classe `BufferedReader`, entre d’altres, disposa del mètode `readLine()` , que permet llegir una línia sencera del fitxer fins el final de la línia, molt útil en fitxers de text.

Per la seua banda, el mètode `BufferedWriter`, aporta el mètode `newLine()` per introduir al caràcter de retorn de carro, i el mètode `write(String cadena, int inici, int longitud)`, per escriure un string o una part concreta.

L’altre decorador pe a l’escriptura és el `PrintWriter`, que ens ofereix els mètodes `print(dades)`, `println(dades)` i `printf()` , per donar format.

### Exemple copia fitxer numerant les línies

```java
package com.ieseljust.ad.fitxers;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;


public class numberLines {
    public static void main(String[] args) throws Exception {

        BufferedReader fin; // Per llegir l'entrada
        PrintWriter fout; // Per escriur
        int num_linia; // Comptador de línies
        String linia; // Línia llegida

        // Comprovem els arguments:
        if(args.length != 2){
            System.out.println("Nombre d'arguments erroni. Sintaxi:\n
            numberLines fitxer eixida");
            return;
        }

        // Construim les classes decoradores
        fin=new BufferedReader(new FileReader(args[0]));
        fout=new PrintWriter(new FileWriter(args[1]));

        num_linia=1;

        do {
            // Anem llegint les línies
            linia = fin.readLine();
            if (linia != null) fout.println(num_linia + ". " + linia);
            num_linia++;
        } while (linia != null); // Repetim mentre queden línies
        // Tanquem els fitxers
        fin.close();
        fout.close();
    }
}
```