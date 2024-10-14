# Cheatsheet

## nuggets

```sh
npgsql.EntityFrameworkCore.PostgreSQL
Microsoft.EntityFrameworkCore.Design
```

## tools

```sh
dotnet tool install --global dotnet-ef
```

## asp config

Program.cs

```cs
builder.Services.AddDbContext<AppDbContext>(optionsBuilder => {
    optionsBuilder.UseNpgsql(builder.Configuration["ConnectionString"]!);
});


AppDbContext.cs:

```cs
public class AppDbContext: DbContext
    public AppDbContext(DbContextOptions<AppDbContext> options): base(options) {}
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) {}

    public DbSet<Movie> Movies { get; set; }
```

## Docker DBs

### SqlServer

```sh
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=123456" -p 1433:1433 -d -v sqlvolume:/var/opt/mssql --rm --name mssql mcr.microsoft.com/mssql/server:2022-latest
```

### Postgres

ProgresSQl with docker.

1. Directly

```sh
docker pull postgres

docker run --name myContainer -e POSTGRES_DB=mydb POSTGRES_USER=sa POSTGRES_PASSWORD=mysecretpassword -d postgres
```

2. With Compose

```yml
services:
  db:
    image: postgres
    restart: always
    environment:
      POSTGRES_PASSWORD: example
    volumes:
      - pgdata:/var/lib/postgresql/data 
 
  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
 
volumes:
  pgdata:
```