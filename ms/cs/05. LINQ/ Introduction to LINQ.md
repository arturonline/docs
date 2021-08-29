# Introduction to LINQ

> [Curso](https://mva.microsoft.com/en-US/training-courses/language-integrated-query-linq-17755?l=rfrAg1H3D_1211787177#) de MS

LINQ (Language Integrated Query) is a way to query different types of data sources that support `IEnumerable<T>` or `IQueryable<T>`. It offers an easy and elegant way to access or manipulate data from a database object, XML document, and in-memory objects.

## LINQ Syntax

LINQ provides two ways to to query data sources:

1. Method Syntax
2. Query Syntax

## Method Syntax

Also known as Lambda Syntax Query, as the extension method uses lambda syntax for predicate.

Syntax:

```csharp
result = DataSource.Operator(<lambda expression>);
// OR
result = DataSource.Operator(<lambda expression>).Operator(<optional>);
```

Example:

```csharp
string[] fruits = new string[]
{
    "Apple","Mango","Strawberry","Date",
    "Banana","Avocado","Cherry","Grape",
    "Guava","Melon","Orange","Tomato"
};

int fruitsLength = fruits.Where(p => p.StartsWith("A")).Count();
```

## Query Syntax

It is the same as using SQL for rational database. Query in this syntax always ends with a `select` or `group..by` operator and starts with a `from` keyword.

Syntax:

```csharp
<Returned result’s Type> result = from <range variable> in Data Source
                                            <Query Operators> <lambda expression>
                                    <select or groupBy operator> <result>
```

```csharp
string[] fruits = new string[]
{
    "Apple","Mango","Strawberry","Date",
    "Banana","Avocado","Cherry","Grape",
    "Guava","Melon","Orange","Tomato"
};

int result = (from p in fruits
        where p.StartsWith("A")
        select p).Count();
```

## Working with LINQ

When working with LINQ queries, it always has three steps or actions:

1. Obtain the Data Source
2. Create a Query
3. Execute the Query

```csharp
//1- First Step (Obtaining the Data Source)
string[] fruits = new string[]
{
"Apple","Mango","Strawberry","Date",
"Banana","Avocado","Cherry","Grape",
"Guava","Melon","Orange","Tomato"
};

//2- Second Step (Creation of Query)
var result = from p in fruits
select p;

//3-Third Step (Execution of Query)
foreach (var item in result)
{
Console.WriteLine(item);
}
```

## Deferred Execution

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
    new Person() { ID=1,Name="Ali Asad"},
    new Person() { ID=5,Name="Hamza Ali"},
};

var query = from p in persons
            select p;

int count = 0;
count = query.Count();//Counts 2 records

persons.Add(new Person() { ID = 3, Name = "John Snow" });
count = query.Count();//Count 3 records

Console.WriteLine(query);

// The number of records change depending on where is `Count()` called.
```

## Immediate Execution

```csharp
List<Person> persons = new List<Person>()
{
    new Person() { ID=1,Name="Ali Asad"},
    new Person() { ID=5,Name="Hamza Ali"},
};

var query = (from p in persons
            select p).ToList();

persons.Add(new Person() { ID = 3, Name = "John Snow" });

foreach (var item in query)
{
    Console.WriteLine(item.ID + "\t" + item.Name);
}
```

This code will not display the ID and Name of the last added person (person added after the query is written) as there is an immediate execution of the query by performing the extension method (ToList()) on it and, at that time, the written query performed on the persons variable contained just two records of Person, so the query will return those two persons.