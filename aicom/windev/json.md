# REST Api and JSON

```cs
req is httpRequest
res is httpResponse

vJson is Variant
sMessage is string


req.URL = url
res = HTTPSend(req)

IF res.StatusCode <> 200 THEN
	Info("Error al enviar la petición")
ELSE
	
	vJson = JSONToVariant(res.Content)	
	FillUIwithJSON(vJson)
END
```

```cs
PROCEDURE FillUIwithJSON(vJson)

	STC_ID_ANSWER = vJson.id
	STC_CATEGORIA_ANSWER = vJson.Type
	STC_SETUP_ANSWER = vJson.setup
	STC_PUNCHLINE_ANSWER = vJson.punchline

```