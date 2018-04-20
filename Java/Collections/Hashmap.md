# HashMap

Java HashMap class implements the map interface by using a hashtable.
The important points about Java HashMap class are:

- A HashMap contains values based on the key.
- It contains only unique elements.
- It may have one null key and multiple null values.
- It maintains no order.

## Constructors

Num | Constructor                            | Description
----|----------------------------------------|-------------------------------------------------------------------------------------------------------
1   | HashMap( )                             | This constructor constructs a default HashMap.
2   | HashMap(Map m)                         | This constructor initializes the hash map by using the elements of the given Map object m.
3   | HashMap(int capacity)                  | This constructor initializes the capacity of the hash map to the given integer value, capacity.
4   | HashMap(int capacity, float fillRatio) | This constructor initializes both the capacity and fill ratio of the hash map by using its arguments.

## Methods

Apart from the methods inherited from its parent classes, HashMap defines following methods:

Method                               | Description
-------------------------------------|--------------------------------------------------------------------------------------------------------------
void **clear()**                         | It is used to remove all of the mappings from this map.
boolean **containsKey(Object key)**      | It is used to return true if this map contains a mapping for the specified key.
boolean **containsValue(Object value)**  | It is used to return true if this map maps one or more keys to the specified value.
boolean **isEmpty()**                    | It is used to return true if this map contains no key-value mappings.
Object **clone()**                       | It is used to return a shallow copy of this HashMap instance: the keys and values themselves are not cloned.
Set **entrySet()**                       | It is used to return a collection view of the mappings contained in this map.
Set **keySet()**                         | It is used to return a set view of the keys contained in this map.
Object **put(Object key, Object value)** | It is used to associate the specified value with the specified key in this map.
int **size()**                           | It is used to return the number of key-value mappings in this map.
Collection **values()**                  | It is used to return a collection view of the values contained in this map.

## Exemples

```Java
import java.util.*;
public class HashMapDemo {

   public static void main(String args[]) {

      // Create a hash map
      HashMap hm = new HashMap();

      // Put elements to the map
      hm.put("Zara", new Double(3434.34));
      hm.put("Mahnaz", new Double(123.22));
      hm.put("Ayan", new Double(1378.00));
      hm.put("Daisy", new Double(99.22));
      hm.put("Qadir", new Double(-19.08));

      // Get a set of the entries
      Set set = hm.entrySet();

      // Get an iterator
      Iterator i = set.iterator();

      // Display elements
      while(i.hasNext()) {
         Map.Entry me = (Map.Entry)i.next();
         System.out.print(me.getKey() + ": ");
         System.out.println(me.getValue());
      }
      System.out.println();

      // Deposit 1000 into Zara's account
      double balance = ((Double)hm.get("Zara")).doubleValue();
      hm.put("Zara", new Double(balance + 1000));
      System.out.println("Zara's new balance: " + hm.get("Zara"));
   }
}

// Daisy: 99.22
// Ayan: 1378.0
// Zara: 3434.34
// Qadir: -19.08
// Mahnaz: 123.22

// Zara's new balance: 4434.34
```