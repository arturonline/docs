# Entity FrameWork

The Microsoft Entity Framework is Microsoft’s implementation of  ORM Framework.

Before Using the Entity framework, you need to know about the various terms used in the entity framework.

- **Entity**: Represents a row in the database
- Properties: Represents a Column.
- **Entity Type / Entity Sets**: Represents is the table.
- **Association**: Represents the relationship between two entity types.
- **Entity Key**: Represents a Primary key.

## Accesing the Data

In the EF you don’t access the database. You will query the conceptual data model for the data. You can do this using LINQ to Entities or Entity SQL

### LINQ to Entities

LINQ to Entities is a popular query language which enables us to write queries against the conceptual model. It returns entities

### Entity SQL

Entity SQL is another query language that is used.

## Create the model

There are two ways you can create the Entity data model (EDM) using the designer

- Model First
- Database first

### Model First

In this approach models are created first and database later.

### Database First

This is the reverse of the model first approach where models are created first and database later.

## Entity Framework Components

### DbContext

The DbContext is often referred to as the context is the class which is responsible for interacting with the entity model and the database. It allows you to query, insert, update and delete operations on the entities.

### DBSet

A DbSet represents an entity set. An entity set is defined as a set of entities of the same entity type. From the perspective of  the database, it usually represents the table. Each Entity type must expose the DbSet Property to be able to participate in the CRUD Operations. DBSet Provides methods like Add, Attach, remove etc on the Entity Types.

#### Methods Exposed by DbSet

- Add
- AddRange
- Remove
- RemoveRange
- SQLQuery
- Find
- Create()
- Include
- Attach
- AsNoTracking()

### Model(s)

We can configure the models in two ways:

1. **Default Conventions**: Code First Convention maps our POCO classes to the database by making assumptions based on how the domain classes are written.

The database can be further configured using the **data annotations attributes**. These Attributes are applied to the class or property.

1. **Configurations with Fluent API**

## Relationships

https://www.tektutorialshub.com/entity-framework/ef-relationships/