# Fragment transactions

To manage the fragments in your activity, you need to use FragmentManager. To get it, call getSupportFragmentManager() from your activity:

```Java
FragmentManager fragmentManager = getSupportFragmentManager();
FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
```

Each transaction is a set of changes that you want to perform at the same time. You can set up all the changes you want to perform for a given transaction using methods such as `add()`, `remove()`, and `replace()`. Then, to apply the transaction to the activity, you must call `commit()`.

Before you call commit(), however, you might want to call `addToBackStack()`, in order to add the transaction to a back stack of fragment transactions. This back stack is managed by the activity and allows the user to return to the previous fragment state, by pressing the Back button.

For example, here's how you can replace one fragment with another, and preserve the previous state in the back stack:

```Java
// Create new fragment and transaction
Fragment newFragment = new ExampleFragment();
FragmentTransaction transaction = getSupportFragmentManager().beginTransaction();

// Replace whatever is in the fragment_container view with this fragment,
// and add the transaction to the back stack
transaction.replace(R.id.fragment_container, newFragment);
transaction.addToBackStack(null);

// Commit the transaction
transaction.commit();
```

If you add multiple changes to the transaction (such as another add() or remove()) and call addToBackStack(), then all changes applied before you call commit() are added to the back stack as a single transaction and the Back button will reverse them all together.

The order in which you add changes to a FragmentTransaction doesn't matter, except:

- You must call commit() last
- If you're adding multiple fragments to the same container, then the order in which you add them determines the order they appear in the view hierarchy.

Some things that you can do with FragmentManager include:

- Get fragments that exist in the activity, with findFragmentById() (for fragments that provide a UI in the activity layout) or findFragmentByTag() (for fragments that do or don't provide a UI).

- Pop fragments off the back stack, with popBackStack() (simulating a Back command by the user).

- Register a listener for changes to the back stack, with addOnBackStackChangedListener().

For more information about these methods and others, refer to the FragmentManager class documentation.