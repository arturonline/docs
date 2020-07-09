# Maven

## Creació de un projecte

```bash
mvn -B archetype:generate \
  -DarchetypeGroupId=org.apache.maven.archetypes \
  -DgroupId=com.artur.app \
  -DartifactId=arturApp
```

- **artifactId** is the name of the jar without version, with lowercase letters and no strange symbols.
- **groupId** uniquely identifies your project across all projects. A group ID should follow Java's package name rules. This means it starts with a reversed domain name you control. For example, `com.artur`.
- **package**: While creating a maven project if you have mentioned both `groupID` and `package` name values then maven will consider the package name to place your java class.

## uso

```bash
mvn compile
# crea la carpeta target amb les classes generades
```

```bash
mvn clean
# This will remove the target directory with all the build data before starting so that it is fresh.
```

```bash
mvn test
```

```bash
mvn package

# Crea .jar final en la carpeta target
```

## Depencencies

The dependencies section of the `pom.xml` lists all of the external dependencies that our project needs in order to build (whether it needs that dependency at compile time, test time, run time, or whatever).

>https://mvnrepository.com/repos/central

We search the dependency and paste it at dependencie section of the `pom.xml`

```xml
<dependency>
  <groupId>commons-math</groupId>
  <artifactId>commons-math</artifactId>
  <version>1.2</version>
</dependency>
```