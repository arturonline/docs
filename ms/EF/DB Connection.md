# DB Connection

The database connection to be used is determined by the parameter passed to the constructor of the DbContext class. There are two scenarios exists

1. **No Parameter**
1. **NameOrConnectionString**

## No Parameter

The entity framework will create the database either in localDB or SQL Express. The name of the database will be a fully qualified name of your derived DBContext class.

## Name or ConnectionString

You can pass to the constructor either:

- a string with the **name** of the database
- or the **ConnectionString** to the constructor.

The difference between above and is that the parameter begins with “Name=”. If you omit this the EF will treat the string as the name of the database.

## DB Initializers

The Entity Framework has provided three options to initialize the database.

- Create database if not Exists

  ```cs
     public EFContext() : base("EFDatabase")
    {
        Database.SetInitializer<EFContext>(new CreateDatabaseIfNotExists<EFContext>());
    }
  ```

- Create Database always

    ```cs
     public EFContext() : base("EFDatabase")
    {
        Database.SetInitializer<EFContext>(new DropCreateDatabaseAlways<EFContext>());
    }
  ```

- Drop and Create if Model changes

  ```cs
     public EFContext() : base("EFDatabase")
    {
        Database.SetInitializer<EFContext>(new DropCreateDatabaseIfModelChanges<EFContext>());
    }
  ```