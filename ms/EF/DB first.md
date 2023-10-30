# Entity Framework DB First

Scaffold a database (Promotions.db) into a c# models and dbContext:

```cs
dotnet ef dbcontext scaffold "Data Source=Promotions/Promotions.db" Microsoft.EntityFrameworkCore.Sqlite --context-dir Data --output-dir Models
```

The preceding command:

- Scaffolds DbContext and model classes by using the provided connection string.
- Specifies to use the Microsoft.EntityFrameworkCore.Sqlite database provider.
- Specifies directories for the resulting DbContext and model classes.