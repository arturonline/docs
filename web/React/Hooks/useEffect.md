# UseEffect

`UseEffect` function runs everytime the component mounts (begins). `UseEffect` takes 2 params:
* A function
* An array


```jsx
import React, { useState, useEffect } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);

    useEffect(()=> {}, [])

    return (
        <div>
            <h6>Counter</h6>
            <p>Current count: {count}</p>
            <button onClick={() => setCount(count + 1)}>increment the count</button>
        </div>
    )
}
export default Counter
```

## Always update

If you don't pass an array, the `useEffect` component function will run everytime anything changes.

```jsx
useEffect(()=> {
    console.log("The use effect run");
})
```

Don't use this, is very ineficient.


## Component Did Mount

If you pass an **Empty array** as second parameter the `useEffect` function only runs when the component mounts (begins):

```jsx
useEffect(()=> {
    console.log("The use effect run");
}, [])
```

## Component Did Update

If you pass an **array**, every time the values in the array change, the `useEffect` function will run:

```jsx
useEffect(()=> {
    console.log("The use effect run");
}, [count])
```

## Component Did Unmount

If you return a function inside the `useEffect`, that function will run when the whole component is remove (unmount):

```jsx
useEffect(()=> {
    console.log("The use effect run");
    return () => {
        console.log("The return is being run")
    }
}, [])
```

## Component Variable changes

If you return a function inside the `useEffect` and an array, that return function will run everytime a variable in the array changes.

```jsx
useEffect(()=> {
    console.log("The use effect run");
    return () => {
        console.log("The return is being run")
    }
}, [count])
```
It will no longer run when the whole component is removed (unmount), only when the variables in the array change.