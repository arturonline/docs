# Create Projects and solutions via shell

## Create a solution

```sh
dotnet new sln -o My_project_name
```

## Create a project

```sh
cd My_project_name
dotnet new webapi -o My_webapi.API
```

```sh
dotnet new xunit -o My_webapi.UnitTests
```

## Add projects to solution

```sh
dotnet sln add **/*.csproj
```

## result

```sh
My_project_name
    - My_weapi.API
    - My_weapi.UnitTests
```