# Simulaciones con Moq

No debemos instanciar ningún objeto "complejo" dentro de las clases. Lo correcto es recibir esa dependencia como una interfaz inyectada.

```cs
public class TaxCalculator
{
    private readonly IDatabase _database;
    public TaxCalculator(IDatabase database)
    {
        _database = database;
    }

    public double CalculateTotalValueForPerson(double amount, int id)
    {
        var tax = _database.GetTaxPercentageByPersonId(id);
        return Math.Round(amount * (1 + tax),2);
    }
}

public interface IDatabase
{
    double GetTaxPercentageByPersonId(int id);
}

public class Database : IDatabase
{
    public double GetTaxPercentageByPersonId(int id)
    {
        //Valor obtenido de la base de datos
    }
}
```

A través de las lecciones de este módulo vamos a ver qué son los **mock u objetos simulado**s, los cuales nos van a permitir sustituir elementos de nuestro código por otros cuya respuesta controlamos. En el caso anterior, reemplazando la base de datos por un mock que nos devuelva un dato controlado que nos facilite hacer las pruebas.

## mocks u objectos simulados

Un Mock es un código que simula otro código.

Siguiendo el ejemplo anterior:

```cs
public class MockDatabase : IDatabase
{
    public double GetTaxPercentageByPersonId(int id)
    {
        switch(id)
        {
            case 0:
                return 0.12;
            case 1:
                return 0.27;
            case 2:
                return 0.04;
            default:
                return 0.18;
        }
    }
}
```

Cuando vayamos a hacer nuestro test, simplemente le pasaremos una instancia de MockDatabase en el constructor, en lugar de un objeto que use la base de datos real. Así, vamos a poder llevar a cabo el test sin ningún problema:

```cs
public class TaxCalculatorTests
{
    private readonly TaxCalculator _taxCalculator;
    public TaxCalculatorTests()
    {
        _taxCalculator = new TaxCalculator(new MockDatabase());
    }

    [Theory]
    [InlineData(112,100,0)]
    [InlineData(127,100,1)]
    [InlineData(104,100,2)]
    [InlineData(118,100,6)]
    public void CalculateTotalValueForPeron_ShouldBeExpectedValue(double expected, double amount, int personId)
    {
        //Arrange

        //Act
        var result = _taxCalculator.CalculateTotalValueForPeron(amount, personId);

        //Assert
        Assert.Equal(expected,result);
    }
}
```

Como puedes comprobar, el inyectar las dependencias está empezando a cobrar sentido, ya que nos permite redefinir comportamientos para poder hacer pruebas.

## Libreria Moq

El mismo ejemplo del caso anterior hecho a mano, se reduce con Moq a algo como esto:

```cs
public class TaxCalculatorTests
{
    private readonly TaxCalculator _taxCalculator;
    public TaxCalculatorTests()
    {
        var mock = new Mock<IDatabase>(MockBehavior.Default);
        mock.Setup(db => db.GetTaxPercentageByPersonId(It.IsAny<int>())).Returns(0.18);
        mock.Setup(db => db.GetTaxPercentageByPersonId(0)).Returns(0.12);
        mock.Setup(db => db.GetTaxPercentageByPersonId(1)).Returns(0.27);
        mock.Setup(db => db.GetTaxPercentageByPersonId(2)).Returns(0.04);

        _taxCalculator = new TaxCalculator(mock.Object);
    }

    [Theory]
    [InlineData(112, 100, 0)]
    [InlineData(127, 100, 1)]
    [InlineData(104, 100, 2)]
    [InlineData(118, 100, 6)]
    public void CalculateTotalValueForPeron_ShouldBeExpectedValue(double expected, double amount, int personId)
    {
        //Arrange

        //Act
        var result = _taxCalculator.CalculateTotalValueForPeron(amount, personId);

        //Assert
        Assert.Equal(expected, result);
    }
}

```