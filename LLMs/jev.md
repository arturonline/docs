# Jev

- Jev es un modelo de inteligencia artificial, pero no es un chatbot como ChatGPT o Claude.
- Un modelo de lenguaje normal genera texto palabra a palabra. Jev no.
- No solo te dice la respuesta, sino cuánto se fía de ella.

## Los 3 primitivos

Toda la API se compone de tres tipos de preguntas. Ese es el diseño, no una limitación:

1. **Choice (elección)** — elige una opción de un conjunto (hasta 255). Devuelve la opción, una probabilidad por opción y una puntuación de confianza. Agrega una opción explícita other para que el modelo pueda decir "ninguna de estas encaja."
1. **Score (puntuación)** — una posición en una escala de 2 a 10 niveles que describes con palabras. Devuelve una puntuación que puede caer entre niveles (p. ej., 1.4).
1. **Noul** — una pregunta de sí/no devuelta como una única probabilidad de 0 a 1.

## Ejemplo

Imaginad que llega una incidencia de un cliente: *"Me han cobrado dos veces el pedido. Necesito que lo solucionéis hoy."*. En vez de pedirle a un chatbot *"analiza esto y dime qué hacer"* y luego parsear su respuesta, le pasaríamos a Jev el JSON del pedido y preguntas cerradas del tipo: 

- ¿tiene un error de formato? (sí/no), 
- ¿es urgente? (baja/media/alta), 
- ¿qué departamento debe gestionarlo? (lista de opciones). Nos devuelve cada respuesta con su probabilidad, y nuestro código hace el resto.

## Con código

```js
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

client = TypeSafeClient(
    api_key="local",
    base_url="http://127.0.0.1:8009",
    model="kev-latest",
)
response = client.system_one(
    state="Me han cobrado dos veces el pedido. Necesito que lo solucionéis hoy.",
    questions={
        "error_formato": Noul(instructions="¿Tiene el pedido un error de formato?"),
        "departamento": Choice(
            instructions="¿Qué departamento debe gestionarlo?",
            criteria={"facturacion": None, "logistica": None, "comercial": None},
        ),
        "urgencia": Score(
            instructions="¿Es urgente?",
            criteria=["baja", "media", "alta"],
        ),
    },
)
print(response.nouls["error_formato"].noul)
print(response.choices["departamento"].choice)
print(response.scores["urgencia"].score)
```

## Alternativas

- Laya: Los pesos ocupan unos 1,7 GB y hay que reservar unos 2 GB de RAM. Es decir, funciona en CPU y podría correr en un servidor Windows normal.
- Kev: Hay varios tamaños: desde uno de 0,8B que corre en un portátil hasta uno de 27B que necesita una GPU de centro de datos. El de 27B, por ejemplo, requiere una tarjeta de 80 GB.


En precisión está más cerca de Jev que Laya sin ajustar: con datos que nunca vio en el entrenamiento, Kev-8B saca 79,6% frente a 85,7% de Jev.

Laya es la opción más fácil de probar en nuestra infraestructura: corre en CPU, se integra desde Node y se queda en nuestro servidor.