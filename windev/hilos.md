# hilos

```java
PROCEDURE MetodoAEjecutar() 
    // Codi
END

ActivaHourglass()

ThreadExecute( "ThreadPrueba", threadNormal, MetodoAEjecutar )

WHILE ThreadState( "ThreadPrueba" ) = threadRunning
    Multitask( -1 )
END

//En este punt ja ha acabat el fil
DesactivaHourglass()
```

⚠ Sense el WHILE eixe, es desactivaria el hourglass antes de que acabara el metode del fil.

Amb lambdas:

```java
ActivaHourglass()

ThreadExecute( "ThreadPrueba", threadNormal, ()=>{
    // Codi
})

WHILE ThreadState( "ThreadPrueba" ) = threadRunning
    Multitask( -1 )
END

//En este punt ja ha acabat el fil
DesactivaHourglass()
```