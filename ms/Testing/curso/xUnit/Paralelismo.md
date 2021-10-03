# xUnit Paralelismo

Al hablar de las colecciones, también hablamos de cómo trabaja la paralelización en xUnit. Recordemos que lo que va a hacer el runner es ejecutar en paralelo todas las colecciones, y dentro de cada colección ejecutará las pruebas en serie. Además, todas las clases que no pertenecen a una colección de manera explícita son una colección en sí mismas.

Este comportamiento está pensado para poder ejecutar el máximo número de pruebas en el menor tiempo posible. Pero, puede darse el caso de que esto sea un problema. Por ejemplo, dos o más pruebas accediendo al mismo archivo simultáneamente nos van a provocar problemas, por el bloqueo del archivo.

Como sabemos, la manera correcta de evitar estos problemas de paralelización es agrupar todas esas pruebas dentro de una única colección, garantizando que no existe dicho problema ya que se ejecutarán en serie. Como agrupar las pruebas no siempre es posible por razones de diseño, xUnit nos proporciona una opción para controlar el modo en el que va a paralelizar las pruebas. Se trata del atributo `[assembly: CollectionBehavior()]` que debemos aplicar sobre el propio ensamblado. Con él vamos a poder indicar cosas como:

- Comportamiento por defecto para clases sin colección usando `CollectionBehavior.CollectionPerAssembly: [assembly: CollectionBehavior(CollectionBehavior.CollectionPerAssembly)]`.
- Cantidad de hilos con los que se va a paralelizar usando `MaxParallelThreads: [assembly: CollectionBehavior(MaxParallelThreads = n)]`.
- Deshabilitar la paralelización de colecciones usando DisableTestParallelization : `[assembly: CollectionBehavior(DisableTestParallelization = true)]`.

Solo podemos tener un atributo *CollectionBehavior* por ensamblado, pero podemos combinar las tres opciones dentro del mismo atributo:

`[assembly: CollectionBehavior(CollectionBehavior.CollectionPerAssembly, DisableTestParallelization = true, MaxParallelThreads = 2)]`