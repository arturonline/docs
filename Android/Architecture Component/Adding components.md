# Adding Architecture components

To use architecture components in your project follow 2 steps:

## 1. Add the Google Maven repository

To add it to your project, open the `build.gradle` file for your **project** (not the ones for your app or module) and add the highlighted line as shown below:

```Java
allprojects {
    repositories {
        jcenter()
        google()
    }
}
```

## 2. Add Architecture Components

Open the `build.gradle` file for your **app** or **module** and add the artifacts that you need as dependencies. You can add all dependencies, or choose a subset.

```Java
dependencies {
    // ViewModel and LiveData
    implementation "android.arch.lifecycle:extensions:1.1.0"
    // alternatively, just ViewModel
    implementation "android.arch.lifecycle:viewmodel:1.1.0"
    // alternatively, just LiveData
    implementation "android.arch.lifecycle:livedata:1.1.0"

    annotationProcessor "android.arch.lifecycle:compiler:1.1.0"

    // Room (use 1.1.0-alpha3 for latest alpha)
    implementation "android.arch.persistence.room:runtime:1.0.0"
    annotationProcessor "android.arch.persistence.room:compiler:1.0.0"

    // Paging
    implementation "android.arch.paging:runtime:1.0.0-alpha6"

    // Test helpers for LiveData
    testImplementation "android.arch.core:core-testing:1.1.0"

    // Test helpers for Room
    testImplementation "android.arch.persistence.room:testing:1.0.0"
}
```

## Java 8 Support for Lifecycles

If your app uses Java 8, we recommend using this library instead of android.arch.lifecycle:compiler.

```Java
dependencies {
    // Java8 support for Lifecycles
    implementation "android.arch.lifecycle:common-java8:1.1.0"
}
```