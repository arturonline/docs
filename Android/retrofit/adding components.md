# Adding Components

Add these two lines to the `build.gradle` file:

```Java
// Retrofit
compile 'com.squareup.retrofit2:retrofit:2.0.2'

// JSON Parsing
compile 'com.squareup.retrofit2:converter-gson:2.0.2'
compile 'com.google.code.gson:gson:2.6.1'
```

Then, given that we want our application to access the network we need to declare the INTERNET permission in the Android manifest file. This is pretty straightforward, just add this line to the `app/src/main/AndroidManifest.xml` file:

```Java
<uses-permission android:name="android.permission.INTERNET" />
```
