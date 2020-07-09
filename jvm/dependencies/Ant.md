# Ant

## build.xml

Este archivo va en el directorio raiz del proyecto:

```java
Project
    |
    `---project_folder
    `---build.xml
```

## Syntaxis

```xml
<project name="Calculadora">
    <target name="clean">
        <delete dir="classes" />
    </target>
    <target name="compile" depends="clean">
        <mkdir dir="classes" />
        <javac includeantruntime="false" srcdir="calc" destdir="classes" />
    </target>
    <target name="run" depends="compile">
        <java classpath="classes" classname="calc.Calcula">
            <arg value="$(arg0}" />
            <arg value="$(arg1}" />
        </java>
    </target>
</project>
```