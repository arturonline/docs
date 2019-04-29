# Kotlin extensions

Integrating Kotlin Android Extensions in our code
Though the plugin comes integrated into the regular one (you don’t need to install a new one), if you want to use it you have to add an extra apply in the Android module's `build.gradle`:

```Java
apply plugin: 'kotlin-android-extensions'
```

And that’s all you need. You’re now ready to start working with it.

## Recovering views from the XML

To be able to use it, you need an special import (the one I write below), but the IDE is able to auto-import it.

```Java
import kotlinx.android.synthetic.main.activity_main.*
```

Couldn't be easier!

```java
android:text="Hello World!"
...
welcomeMessage.text = "Hello Kotlin!"
```