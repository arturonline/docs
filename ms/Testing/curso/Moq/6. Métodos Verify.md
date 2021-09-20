# Métodos Verify

En estos momentos ya tienes el conocimiento para poder utilizar Moq como tu framework de mocking y conseguir unos resultados estupendos.

El problema viene cuando quieres comprobar diferentes pasos intermedios que interaccionan con el objeto mock. Por ejemplo, comprobar que para una entrada de datos concreta se llama a una función del mock con unos datos determinados, y que por su naturaleza no es posible conocer a la salida de la prueba. Otro caso es comprobar que se está accediendo a ciertos métodos un número controlado de veces.

Para estas situaciones existen los métodos **Verify**. Gracias a estos métodos vamos a poder comprobar la interacción con el mock y vamos a poder lanzar una excepción cuando algo esté mal. Esta es una herramienta extra que vamos a tener para, en los Assert de nuestras pruebas, verificar partes internas del código en caso de que interactúen con el mock.

Existen diferentes métodos Verify:

- **Verify**: mediante una expresión, nos va a permitir verificar que se ha llamado a un método.
- **VerifyGet**: indicándole una propiedad vamos a verificar que se ha llamado a su getter.
- **VerifySet**: indicándole una propiedad verificaremos que se ha llamado a su setter.
- **VerifyAdd**: indicándole un evento vamos a verificar que se ha añadido un manejador para gestionarlo (es necesario configurarlo primero con SetupAdd).
- **VerifyRemove**: indicándole un evento vamos a verificar que se ha eliminado un manejador (es necesario configurarlo primero con SetupRemove).
- **VerifyNoOtherCalls**: comprueba que no se hayan hecho más llamadas que las previamente verificadas (es el último verify que se hace).
- **VerifyAll**: verifica que se han hecho llamadas a TODAS las configuraciones que hemos hecho para el mock, y que, por lo tanto, no estamos olvidando de utilizar ninguna.

Si, por ejemplo, queremos hacer una comprobación de cuántas veces se ha llamado a un elemento, utilizaremos el Verify adecuado según su tipo de elemento, de igual modo que hacíamos con el Setup. Por ejemplo, si tenemos esta interfaz:

```cs
public interface ICommunicator
{
    int Propiedad { get; set; }
    void Send(string message);
}
```

Y queremos comprobar que la clase que estamos probando ha llamado al método Send del objeto simulado con el valor "Message1", y que esto lo ha hecho 2 veces exactamente, podríamos escribir algo como esto:

```cs
var com = new Mock<ICommunicator>();
com.Setup(c => c.Send(It.IsAny<string>()));

//Uso durante el test
//....

com.Verify(c=>c.Send("Message1"),Times.Exactly(2));
```

Lo que estamos haciendo es simplemente indicarle el mensaje que queremos filtrar y utilizando un tipo de objeto especializado del que nos provee Moq para este fin. Dicho tipo es Times y nos ofrece estas opciones de validación en función del número de veces correcto:

- **Never**: 0 veces.
- **Once**: 1 vez.
- **Exactly(int x)**: x veces exactamente.
- **AtLeastOnce**: como mínimo 1 vez.
- **AtLeast(int x)**: como mínimo x veces.
- **AtMostOnce**: como mucho una vez.
- **AtMost(int x)**: como mucho x veces.
- **Between(int from, int to,Range rangeType)**: entre from y hasta to veces, incluyéndolos en el rango, o no, en función del valor de rangeType.

Adicionalmente, a esos métodos de verificación de los que dispone el propio objeto mock, existen 2 métodos más que son accesibles a través del tipo estático Mock. Estos dos métodos son:

**Verify**: comprueba que todas las configuraciones indicadas con Verifiable se han ejecutado.
**VerifyAll**: se comporta igual que en el caso de acceder desde el método del objeto.

En este segundo caso de verificación entra en juego un método que estudiamos casi al principio del módulo y que se podía utilizar en todos los Setup y SetupXXX. Este método es Verifiable. Gracias a llamar al método explícitamente durante la configuración del mock le vamos a indicar que cuando llamemos a `Mock.Verify(mock)` esa configuración se tiene que haber usado, o de lo contrario lanzará una excepción. Vamos a ver un ejemplo con la interfaz anterior.

Este código pasará la validación, ya que le estamos indicando que la propiedad tiene que asignarse con el valor 2 y es verificable, cosa que se cumple:

```cs
var com = new Mock<ICommunicator>();
com.SetupSet(c => c.Propiedad = 2).Verifiable();

com.Object.Propiedad = 2;

Mock.Verify(com);
```

En cambio si el código fuese así:

```cs
var com = new Mock<ICommunicator>();
com.SetupSet(c => c.Propiedad = 2).Verifiable();

com.Object.Propiedad = 1;

Mock.Verify(com);
```

Obtendremos una excepción, ya que estamos comprobando que se asigna el valor 2 a la propiedad, pero, en realidad, se está asignando el 1.
