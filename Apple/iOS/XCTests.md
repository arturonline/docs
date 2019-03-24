# Como configurar tests

* New project: command line tool
* Creamos un proyecto nuevo sin tests
* Luego vamos a test navigator y en la parte de abajo le damos new ui test target.
* Debajo de import añadimos:

`@testable import nombre_del_proyecto`

* Cada archivo .swift que queramos testear deberemos marcarle en "target membership" los tests.