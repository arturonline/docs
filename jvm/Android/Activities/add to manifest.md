# Add Activities to manifest

Adding Activity2:

```xml
<application
...

    <activity
                android:name=".Activity2"
                android:label="@string/title_activity2" >
    </activity>
</application>
```

Changing manifest so Activity2 is the launch activity:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.artur.criminalintent">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        <activity android:name=".Activity2">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        <activity android:name=".Activity">
        </activity>
    </application>


</manifest>
```