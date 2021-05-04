# js

```js
web is string = [
	<html>
	<head>
	<title> Editor
	</title>
		<h1>This is an HTML page </h1>
	</head>
	<body>
		<p id="demo">A paragraph</p>
		<button type="button" onclick="jscode()">Try</button>
		<script>
			function jscode() {			
				var Now = new Date();
				alert('Today is: ' + Now); }
		</script>			
	</body>
	</html>
]

HTML1 = web
```


```python
PROCEDURE ChangeThemeHTMLControl()

gbThemeDark = NOT gbThemeDark

sJavascript is string 
sJavascript= [
	(function() { 
	document.body.style.color = "%1";
	document.body.style.backgroundColor = "%2";
	})(); 
]

sBackgroundColor is string = "#FFFFFF"
sTextColor is string = "#212121"
IF  gbThemeDark THEN
	// dark
	sBackgroundColor = "#2A292F"
	sTextColor = "#FFFFFF"
	
END
sJavascript = StringBuild(sJavascript,sTextColor,sBackgroundColor)


//////////////////////////////////
// Run the Javascript code
HTM_Simple.ExecuteJS(sJavascript)
```