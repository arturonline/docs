# Fragments Communications

## Communicating with other fragments

## Communicating with activities

Fragments don’t subclass the Context class.

To increase reuse of fragments, they should not directly communicate with each other. Every communication of the fragments should be done via the host activity.

In some cases, you might need a fragment to share events with the activity. A good way to do that is to define a callback interface inside the fragment and require that the host activity implement it.

```Java
public static class FragmentA extends ListFragment {
    ...
    // Container Activity must implement this interface
    public interface OnFragmentInteractionListener {
        public void onArticleSelected(Uri articleUri);
    }
    ...
}
```

Then the activity that hosts the fragment implements the OnFragmentInteractionListener interface and overrides onArticleSelected() to notify fragment B of the event from fragment A.

```Java
public static class FragmentA extends ListFragment {
    OnFragmentInteractionListener mListener;
    ...
    @Override
    public void onAttach(Context context) {
        super.onAttach(context);
        //If the activity has not implemented the interface, then the fragment throws a ClassCastException.
        try {
            mListener = (OnArticleSelectedListener) context;
        } catch (ClassCastException e) {
            throw new ClassCastException(context.toString() + " must implement OnArticleSelectedListener");
        }
    }
    ...
}
```

The mListener member holds a reference to activity's implementation of OnFragmentInteractionListener, so that fragment A can share events with the activity by calling methods defined by the OnArticleSelectedListener interface.