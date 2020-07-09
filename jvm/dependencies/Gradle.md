# Gradle

## Creació de un projecte

```bash
gradle init
```

```bash
gradleinit  --type java-application \
            --test-framework junit \
            --dsl groovy \
            --project-name helloWorld \
            --package com.artur
```

## Use

```bash
gradle build

gradle build -i # si volem veure les diferents fases de construcció de l'aplicació.
```

Amb açò, compila, processa els recursos i genera les classes i l’empaquetat jar de l’aplicació. Si ens fixem, tenim una nova carpeta build amb el resultat de la construcció del paquet.

```bash
gradle clean
```

## Dependencies

Editarem el fitxer `build.gradle`, la secció de repositoris, per tal d’afegir el repositori de Maven:

```java
repositories {
    // Use jcenter for resolving your dependencies.
    // You can declare any Maven/Ivy/file repository here.
    jcenter()
    mavenCentral()
}
```

Busquem la llibreria que volem afegir al projecte, (ex: [Commons Math](https://mvnrepository.com/artifact/org.ddahl/commonsmath_2.13/1.2.2)) i afegim el codi proporcionat pel repositori a la secció dependencies:

```java
dependencies {
    // This dependency is found on compile classpath of this component and consumers.
    implementation 'com.google.guava:guava:26.0-jre'

    // Use JUnit test framework
    testImplementation 'junit:junit:4.12'

    // https://mvnrepository.com/artifact/org.apache.commons/commonsmath3
    compile group: 'org.apache.commons', name: 'commons-math3', version : '3.6.1'
}
```

Ara, quan construïm el projecte, automàticament es descarregarà la llibreria commons-math3 i estarà preparada per utilitzar-se al projecte. Quan fem un clean, aquesta s’esborrarà, per tornar a descarregar-se en una nova construcció.