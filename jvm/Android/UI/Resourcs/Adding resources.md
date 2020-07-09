# Adding resources to a project

You should always save your app resources (images, strings...) in the `res` folder, so that you can maintain them independently. 

Also, you should provide alternative resources for specific device configurations, by grouping them in specially-named resource directories.

When it runs, the OS will choose the best resource file for the specific device running the app.

If an app runs on a device that has a screen density not included in any of the application’s screen density qualifiers, Android will automatically scale the available image to the appropriate size for the device. Thanks to this feature, it is not necessary to provide images for all of the pixel density buckets. To reduce the size of your application, you can focus on one or a few of the higher resolution buckets and selectively optimize for lower resolutions when Android’s automatic scaling provides an image with artifacts on those lower resolution devices.

## Resource directories supported inside project res/ directory

Directory | Resource Type
----------|--------------
animator/ | XML files that define property animations.
anim/ | XML files that define tween animations. (Property animations can also be saved in this directory, but the animator/ directory is preferred for property animations to distinguish between the two types.)
color/ | XML files that define a state list of colors. See Color State List Resource
drawable/ | Bitmap files (.png, .9.png, .jpg, .gif) or XML files that are compiled into the following drawable resource subtypes: <ul><li>Bitmap files</li><li>Nine-Patches (re-sizable bitmaps)</li><li>tate lists</li><li>Shapes</li><li>Animation drawables</li><li>Other drawables</li></ul>
mipmap/ | Drawable files for different launcher icon densities. For more information on managing launcher icons with mipmap/ folders, see Managing Projects Overview.
layout/ | XML files that define a user interface layout. See Layout Resource.
menu/ | XML files that define app menus, such as an Options Menu, Context Menu, or Sub Menu. See Menu Resource.
raw/ | Arbitrary files to save in their raw form. To open these resources with a raw InputStream, call Resources.openRawResource() with the resource ID, which is R.raw.filename.<br>However, if you need access to original file names and file hierarchy, you might consider saving some resources in the assets/ directory (instead of res/raw/). Files in assets/ aren't given a resource ID, so you can read them only using AssetManager.
values/ | XML files that contain simple values, such as strings, integers, and colors.<br>Whereas XML resource files in other res/ subdirectories define a single resource based on the XML filename, files in the values/ directory describe multiple resources. For a file in this directory, each child of the <resources> element defines a single resource. For example, a <string> element creates an R.string resource and a <color> element creates an R.color resource.<br>Because each resource is defined with its own XML element, you can name the file whatever you want and place different resource types in one file. However, for clarity, you might want to place unique resource types in different files. For example, here are some filename conventions for resources you can create in this directory:<ul><li>arrays.xml for resource arrays (typed arrays).</li><li>colors.xml for color values</li><li>dimens.xml for dimension values.</li><li>strings.xml for string values.</li><li>styles.xml for styles.</li></ul>See String Resources, Style Resource, and More Resource Types.
xml/ | Arbitrary XML files that can be read at runtime by calling Resources.getXML(). Various XML configuration files must be saved here, such as a searchable configuration.
font/ | Font files with extensions such as .ttf, .otf, or .ttc, or XML files that include a `<font-family>` element.

## Extra resources

you should include alternative drawable resources for different screen densities and alternative string resources for different languages. At runtime, Android detects the current device configuration and loads the appropriate resources for your app.

To specify configuration-specific alternatives for a set of resources:

Create a new directory in res/ named in the form `<resources_name>-<config_qualifier>`.

- `<resources_name>` is the directory name of the corresponding default resources (defined in table 1).`<qualifier>` is a name that specifies an individual configuration for which these resources are to be used. You can append more than one `<qualifier>`. Separate each one with a dash.

- Save the respective alternative resources in this new directory. The resource files must be named exactly the same as the default resource files.

For example, here are some default and alternative resources:

```xml
res/
    drawable/
        icon.png
        background.png
    drawable-hdpi/
        icon.png
        background.png
```

The hdpi qualifier indicates that the resources in that directory are for devices with a high-density screen. The images in each of these drawable directories are sized for a specific screen density, but the filenames are exactly the same. This way, the resource ID that you use to reference the icon.png or background.png image is always the same, but Android selects the version of each resource that best matches the current device, by comparing the device configuration information with the qualifiers in the resource directory name.

Configuration | Qualifier Values | Description
--------------|------------------|------------
language and region | en, fr, es | 
screen size | small, normal, large, xlarge |
screen orientation | port, land |
UI mode | car, desk, television, watch
Night mode | night, notnight |
screen pixel densitiy | ldpi, mdpi, hdpi, xxhdpi, xxhdpi, xxxhdpi, nodpi, tvdpi,anydpi, nnndpi |
platform version | v3, v4, v7... | 

You can specify multiple qualifiers for a single set of resources, separated by dashes. For example, `drawable-en-rUS-land` applies to US-English devices in landscape orientation.

## Accesing Resources

Once you provide a resource in your application (discussed in Providing Resources), you can apply it by referencing its resource ID. All resource IDs are defined in your project's R class, which the aapt tool automatically generates.

There are two ways you can access a resource:

<ol><li>In code: Using a static integer from a sub-class of your R class, such as:

`R.string.hello`

**string** is the resource type and hello is the resource name. There are many Android APIs that can access your resources when you provide a resource ID in this format.</li>

<li>In XML: Using a special XML syntax that also corresponds to the resource ID defined in your R class, such as:

`@string/hello`

**string** is the resource type and hello is the resource name. You can use this syntax in an **XML** resource any place where a value is expected that you provide in a resource.</li></ol>