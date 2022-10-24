# Entity FrameWork

Entity Framework is an ORM Framework.

Before Using the Entity framework, you need to know about the various terms used in the entity framework.

- **Entity**: Represents a row in the database
- Properties: Represents a Column.
- **Entity Type / Entity Sets**: Represents is the table.
- **Association**: Represents the relationship between two entity types.
- **Entity Key**: Represents a Primary key.

## Accesing the Data

In the EF you don’t access the database. You will query the conceptual data model for the data. You can do this using LINQ to Entities or Entity SQL:

- **LINQ to Entities**
- **Lambdas**

## Models

There are two ways you can create the Entity data model (EDM) using the designer

- **Model First** => In this approach models are created first and database later.
- **Database first** =>  models are created first and database later.

## Entity Framework Components

### DbContext

The DbContext is often referred to as the context is the class which is responsible for interacting with the entity model and the database. It allows you to query, insert, update and delete operations on the entities.

### DBSet

A DbSet represents an entity set, or, from the perspective of the database a table.

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


## Relationships

https://www.tektutorialshub.com/entity-framework/ef-relationships/

https://docs.microsoft.com/en-us/ef/core/modeling/relationships?tabs=fluent-api%2Cfluent-api-simple-key%2Csimple-key