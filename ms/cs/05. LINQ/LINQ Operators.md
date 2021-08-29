# LINQ Operators

| Operator | Description                                                        | Syntax                                                     |
| -------- | ------------------------------------------------------------------ | ---------------------------------------------------------- |
| Where    | Filter data based on predicate or condition                        | `Where`                                                    |
| Select   | Select an obtained result from a data source                       | `Select`                                                   |
| Join     | Join sequence on the basis of a matching key                       | `join..in..on.equals`                                      |
| GroupBy  | Return a sequence of items in groups as an `IGroup<key,element>`   | `group…..by` or `group…by..into` or `GroupBy(<predicate>)` |
| Skip     | Skip the supplied number of records and return the remaining ones. | `Skip<T>(<count>)`                                         |
| Take     | Take the supplied number of records and skip the remaining ones.   | `Take<T>(<count>)`                                         |
| Average  | Take the average of a numeric collection.                          | `Average<T>(<param>)`                                      |
| Count    | Count the number of elements in a collection.                      | `Count<T>(<param>)`                                        |
| Max      | Return the highest value from the collection of numeric values.    | `Max<T>(<param>)`                                          |
| Min      | Return the highest value from the collection of numeric values.    | `Min<T>(<param>)`                                          |
| Sum      | Compute the sum of numeric values in a collection.                 | `Sum<T>(<param>)`                                          |
