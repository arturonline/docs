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
private static void addUser()
{
  Console.WriteLine("adding user ");
  User usr = new User() { Name = "Sachin", Email = "sachin@gmail.com" };
  try
  {
    using (var ctx = new EFContext())
    {
      ctx.Users.Add(usr);
      ctx.SaveChanges();
    }
  }
  catch (Exception ex)
  {
    Console.WriteLine(ex.Message);
  }
}

static void Main(string[] args)
{
  addUser();

  Console.WriteLine("Press any key to close");
  Console.ReadKey();
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
private static void findUser(int id)
{
  Console.WriteLine("finding " + id);
  try
  {
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
    }
  }
  catch (Exception ex)
  {
     Console.WriteLine(ex.Message);
  }
}
```

### Edit

```cs
private static void editUser(int id)
{
  Console.WriteLine("editing " + id);
  try
  {
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
}
  catch (Exception ex)
  {
    Console.WriteLine(ex.Message);
  }

  findUser(id);
}
```

### Delete

```cs
private static void deleteUser(int id)
{
   Console.WriteLine("deleting "+id);

   try
   {
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
  }
  catch (Exception ex)
  {
    Console.WriteLine(ex.Message);
  }
  findUser(id);

}
```
