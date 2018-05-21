# Camera

Taking pictures

`UIImagePickerController` is a view controller that manages the system interfaces for taking pictures, recording movies, and choosing items from the user's media library.

To take a picture instantiate a `UIImagePickerController` and present it on screen.

But before that, you need to do some set-up work.

## 1. Setting the image picker's sourceType

```Swift
let imagePicker = UIImagePickerController()

// If the device has a camera, take a picture, otherwise, just pick from library
if UIImagePickerController.isSourceTypeAvailable(.camera) {
    imagePicker.sourceType = .camera
} else {
    imagePicker.sourceType = .photoLibrary
}
```

## 2. Setting the image picker's delegate

- Make you viewController to conform to `UINavigationControllerDelegate` and `UIImagePickerControllerDelegate`. 

```Swift
let imagePicker = UIImagePickerController()

// If the device has a camera, take a picture, otherwise, just pick from library
if UIImagePickerController.isSourceTypeAvailable(.camera) {
        imagePicker.sourceType = .camera
    } else {
        imagePicker.sourceType = .photoLibrary
    }
imagePicker.delegate = self
}
```

## 3. Present the imager picker modally

```Swift
 let imagePicker = UIImagePickerController()

        // If the device has a camera, take a picture, otherwise, just pick from library
        if UIImagePickerController.isSourceTypeAvailable(.camera) {
            imagePicker.sourceType = .camera
        } else {
            imagePicker.sourceType = .photoLibrary
        }
        imagePicker.delegate = self

        // Place image picker on the screen
        present(imagePicker, animated: true, completion: nil)
    }
```

## 4. Permissions

In the project navigator, select the project at the top and open the *info* tab.

1. Hover over the last entry in this list. A plus button appears. click the + button and write:

    `NSCameraUsageDescription` for the key field.

2. And then edit the value fiedl with a description:

    `"This app uses the camera to associate photos with items"`

Now repete for the photos library:

`NSPhotoLibraryUsageDescription` - `"This apps uses..."`

## 5. Saving the image

You do not have a reference to the photo once the image picker is dismissed. To fix this, you are going to implement the delegate method:

`imagePickerController(_:didFinishPickingMediaWithInfo:)`

This method is called when a photo has been selected:

```Swift
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        // Get picked image from info dictionary
        let image = info[UIImagePickerControllerOriginalImage] as! UIIMage

        // Put that image on the screen in the image view
        imageView.image = image

        //Take image picker off the screen - you must call this:
        dismiss(animated: true, completion: nil)
    }
```

## Create a store for the images

```Swift
class ItemStore {
    var allItems = [Item]()

    @discardableResult func createItem() -> Item {
        let newItem = Item(random: true)

        allItems.append(newItem)

        return newItem
    }

    func removeItem(_ item: Item) {
        if let index = allItems.index(of: item) {
            allItems.remove(at: index)
        }
    }

    func moveItem(from fromIndex: Int, to toIndex: Int) {
        if fromIndex == toIndex {
            return
        }
        // Get reference to object being moved so you can reinsert it
        let movedItem = allItems[fromIndex]

        // Remove item from array
        allItems.remove(at: fromIndex)

        // Insert item in array at new location
        allItems.insert(movedItem, at: toIndex)
    }
}
```