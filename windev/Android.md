# Java code from android

## Obtener context y actividad

```java
// Get the current activity
getCurrentActivity()

// Get the current "Context"
getApplicationContext()
```

## Acceder a las propiedades de un control (o vista) windev desde java

```java
// Que no aparezca el "caret" en un EditText
procedure Mi_Procedure

import android.widget.EditText;

public static void New_Procedure() {
	EditText et = (EditText)getView("EDT_NoName1");
	et.setCursorVisible(false);	
}
```

```java
Gobal declarations of WIN_main
PROCEDURE Mywindow()

Mi_procedure()
```
