# Linq examples

More examples [here](https://linqsamples.com/linq-to-objects/element/First-conditional)

## Query Data

```csharp
class Person
{
    public int ID { get; set; }
    public string Name { get; set; }
    public string Address { get; set; }
    public decimal Salary { get; set; }
}

List<Person> persons = new List<Person>()
{
    new Person() { ID=1,Name="Ali Asad",Address="Pakistan",Salary=10000},
    new Person() { ID=5,Name="Hamza Ali",Address="Pakistan",Salary=20000},
    new Person() { ID=3,Name="John Snow",Address="Canada",Salary=15000},
    new Person() { ID=2,Name="Lakhtey",Address="Pakistan",Salary=5000},
    new Person() { ID=4,Name="Umar",Address="UK",Salary=25000},
    new Person() { ID=6,Name="Mubashar",Address="Pakistan",Salary=8000},
};
```

### Filtering Operator: Where

```csharp
IEnumerable<Person> result = from p in persons
                            where p.Name.Length > 4
                            select p;
foreach (var item in result)
{
    Console.WriteLine(item.ID + "\t" + item.Name + "\t" + item.Address);
}

// 1       Ali Asad        Pakistan
// 5       Hamza Ali       Pakistan
// 3       John Snow       Canada
// 2       Lakhtey Pakistan
// 6       Mubashar        Pakistan
```

### Projection Operators: Select, SelectMany

```csharp
// Select
IEnumerable<string> result = from p in persons
                            where p.Name.Length > 4
                            select p.Name;
foreach (var name in result)
{
    Console.WriteLine(name);
}

// Ali Asad
// Hamza Ali
// John Snow
// Lakhtey
// Mubashar
```

```csharp
// SelectMany
var result = (from p in persons
            where p.Name.Length > 4
            select new
            {
                PersonID = p.ID,
                PersonName = p.Name,
                PersonAddress=p.Address
            });
foreach (var item in result)
{
    Console.WriteLine(item.PersonID + "\t" + item.PersonName );
}

// 1       Ali Asad
// 5       Hamza Ali
// 3       John Snow
// 2       Lakhtey
// 6       Mubashar
```

### Joining Operator: Join

```csharp
class Class
{
    public int ClassID { get; set; }
    public string ClassName { get; set; }
}

class Student
{
    public int StudentID { get; set; }
    public string StudentName { get; set; }
    public int ClassID { get; set; }
}

List<Class> classes = new List<Class>();
classes.Add(new Class { ClassID = 1, ClassName = "BSCS" });
classes.Add(new Class { ClassID = 2, ClassName = "BSSE" });
classes.Add(new Class { ClassID = 3, ClassName = "BSIT" });

List<Student> students = new List<Student>();
students.Add(new Student { ClassID = 1, StudentID = 1, StudentName = "Hamza" });
students.Add(new Student { ClassID = 2, StudentID = 2, StudentName = "Zunaira" });
students.Add(new Student { ClassID = 1, StudentID = 3, StudentName = "Zeeshan" });

var result = (from std in students
            join class in classes on std.ClassID equals clas.ClassID
            select new
            {
            _Student = std.StudentName,
            _Class = class.ClassName
            });

foreach (var item in result)
{
Console.WriteLine(item._Student + "\t" + item._Class);
}

// Hamza   BSCS
// Zunaira BSSE
// Zeeshan BSCS
```

### Grouping Operator: GroupBy

```csharp
var result = from p in persons
            group p by p.Address;
foreach (var student in result)
{
    Console.WriteLine("Address:" + student.Key);
    foreach (var st in student)
    {
        Console.WriteLine(st.ID + "\t" + st.Name);
    }
}


// Address:Pakistan
// 1       Ali Asad
// 5       Hamza Ali
// 2       Lakhtey
// 6       Mubashar
// Address:Canada
// 3       John Snow
// Address:UK
// 4       Umar
```

### Partition Operator: Take, Skip

```csharp
// Take
var result = (from p in persons
            where p.Address.StartsWith("P")
            select p).Take(2);

foreach (var item in result)
{
    Console.WriteLine(item.ID + "\t" + item.Name);
}

// 1       Ali Asad
// 5       Hamza Ali
```

```csharp
// Skip
var result = (from p in persons
            where p.Address.StartsWith("P")
            select p).Skip(2);

foreach (var item in result)
{
    Console.WriteLine(item.ID + "\t" + item.Name);
}

// 2       Lakhtey
// 6       Mubashar
```

### Aggregation: Average, Count, Max, Min

```csharp
// Average
var averageSalary = (from p in persons
                select p.Salary).Average();
Console.WriteLine(averageSalary);

// 13833.333333333333333333333333
```

```csharp
// Count
var noOfPersons = (from p in persons
                where p.Address.StartsWith("P")
                select p).Count();
Console.WriteLine(noOfPersons);

// 4
```

```csharp
// Max
var maximumSalary = (from p in persons
                select p.Salary).Max();
Console.WriteLine(maximumSalary);

// 25000
```

```csharp
// Min
var minimumSalary = (from p in persons
                select p.Salary).Min();
Console.WriteLine(minimumSalary);

// 5000
```

## Other

### Distinct()

Returns an unordered sequence of distinct elements.

```csharp
// Distinct
Product[] products = { new Product { Name = "apple", Code = 9 }, 
                       new Product { Name = "orange", Code = 4 }, 
                       new Product { Name = "apple", Code = 9 }, 
                       new Product { Name = "lemon", Code = 12 } };

//Exclude duplicates.

IEnumerable<Product> noduplicates =
    products.Distinct();

foreach (var product in noduplicates)
    Console.WriteLine(product.Name + " " + product.Code);

/*
    This code produces the following output:
    apple 9
    orange 4
    lemon 12
*/
```