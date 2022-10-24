# CRUD Operations

We need a model, a DbContext and a DBSet:

- **Model**(s):

```cs
public class User
{
    public int UserID { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}
```

- **DbContext** (datasource): The DbContext (often referred to as context) is the class which is responsible for interacting with the entity model and the data store. It allows you to query, insert, update and delete operations on the entities.

```cs
using System.Data.Entity;
namespace EFGettingStarted
{
    public class EFContext :DbContext
    {
    }
  }
```

- **DBSet**: Represents the collection of entities (entity set) and provides the methods to manage the entity set.

```cs
using System.Data.Entity;
namespace EFGettingStarted
{
    public class EFContext :DbContext
    {
    }
    public DbSet<User> Users { get; set; };
  }
```

## Crud Operations

### Create

Example, create a new user and add him to the database:

```cs
using (var ctx = new EFContext())
{
  User usr = new User() { Name = "Sachin", Email = "sachin@gmail.com" };
  ctx.Users.Add(usr);
  ctx.SaveChanges();
}
```

#### Adding Multiple Records

The AddRange method is used for adding multiple objects to the database in one method call.

```cs
var books = new List<Book> {
    new Book { Title = "It", Author = author },
    new Book { Title = "Carrie", Author = author },
    new Book { Title = "Misery", Author = author }
};
context.AddRange(books);
context.SaveChanges();
```

### Query

```cs
using (var ctx = new EFContext())
{
  var user = ctx.Users.Find(id);

  if (user != null)
  {
    Console.WriteLine("found " + user.UserID + " " + user.Name);
  }
  else
  {
    Console.WriteLine("user not found");
  }
```

### Edit

```cs
using (var ctx = new EFContext())
{
  var user = ctx.Users.Find(id);
  if (user!=null)
  {
    user.Name = "Sachin Tendulkar";
    ctx.SaveChanges();
  }
  else
  {
    Console.WriteLine("user not found");
  }
}
```

### Delete

```cs
using (var ctx = new EFContext())
{
    var user = ctx.Users.Find(id);
    if (user != null)
    {
      Console.WriteLine("deleting " + user.UserID + " " + user.Name);
      ctx.Users.Remove(user);
      ctx.SaveChanges();
    }
    else
    {
      Console.WriteLine("user not found");
    }
}
```
