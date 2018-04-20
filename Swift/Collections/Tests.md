# Tests

## Configuration

On Xcode:

1. Select the Test Navigator in the left pane (⌘6)
2. Click the + button at the bottom left and select `New Unit Test Target…`
3. In the dialog that appears, click Finish. All the defaults are fine.

Product > Scheme > Edit Scheme

On the vertical menu, choose test
Click on the + Button and add the test.swift file.

On the test.swift file add at the top:

```Swift
import XCTest
@testable import ProjectName
```

Now that you have the unit test target in your project, you can run the tests from
the menu bar with Product > Test or just use the keyboard shortcut: ⌘U