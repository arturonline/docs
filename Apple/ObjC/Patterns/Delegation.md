# Delegation

A very common way to pass data from one view controller to another is to use a delegate method. An example of this would be if you had a modal view with a table that showed over top of your view controller and you needed to know which table cell the user pressed.

```objc
//AddPersonViewController.h (the modal view)

#import
#import "Person.h"

@protocol AddPersonTableViewControllerDelegate 
- (void)didSelectPerson:(Person *)person;
@end

@interface AddPersonTableViewController : UITableViewController

@property (nonatomic, weak) id delegate;

@end
```

```objc
// AddPersonViewController.m
// Other implementation details left out

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    Person *person = [people objectAtIndex:indexPath.row];
    [self.delegate didSelectPerson:person];
}
```

```objc
// GroupViewController.m (the normal view)
// Other implementation details left out, such as showing the modal view
// and setting the delegate to self

#pragma mark - AddPersonTableViewControllerDelegate

- (void)didSelectPerson:(Person *)person
{
    [self dismissViewControllerAnimated:YES completion:nil];

    NSLog(@"Selected person: %@", person.fullName);
}
```

We left out a few implementation details, such as conforming to the `AddPersonTableViewControllerDelegate`, but you are welcome to read the delegation section for those.

Also, notice that we dismiss the modal view controller ( `AddPersonViewController`) in the same class that originally showed it. This is the recommended approach by Apple.