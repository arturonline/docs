---
title: Crear Librerias en dotnet
author: Artur Badenes Puig 
date: 26/10/2022
---

# Librerias

- [Librerias](#librerias)
  - [Crear Librerias en dotnet](#crear-librerias-en-dotnet)
  - [Añadir libreria a proyecto (referencia)](#añadir-libreria-a-proyecto-referencia)
  - [Links](#links)


## Crear Librerias en dotnet

1. Crear una carpeta donde guardaremos todo:

```pwsh
mdkir "miLibreria"
```

2. Entrar en la carpeta y crear una solución:

```pwsh
dotnet new sln
```

3. Crear una .NET class Library:

```pwsh
dotnet new classlib -o StringLibrary
```

4. Añadir la libreria al proyecto:

```pwsh
dotnet sln add .\StringLibrary\StringLibrary.csproj
```

Con esto ya podremos remplazar el codigo en `Class1.cs` o crear nuestras clases.

## Añadir libreria a proyecto (referencia)

Para poder usar la libreria recien creada en un proyecto deberemos referenciarla en dicho proyecto:

```pwsh
dotnet add proyecto.csproj reference Library.csproj
```
En visual studio sería click Izq en la solución y elegir: **Add Project Reference**

## Links

- [Crear Librería con VS](https://learn.microsoft.com/en-us/dotnet/core/tutorials/library-with-visual-studio?pivots=dotnet-6-0)
- [Crear Librería en terminal](https://learn.microsoft.com/en-us/dotnet/core/tutorials/library-with-visual-studio-code?pivots=dotnet-6-0)