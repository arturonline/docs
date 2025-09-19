# UseEffect

## Summary Table

Dependency Array | When Effect Runs                  | Typical Use Case
-----------------|-----------------------------------|------------------------------------
Omitted          | After every render                | Sync with all changes
`[ ]` (empty)    | Once, after initial render        | On mount (init setup)
`[dep1, dep2]`   | On mount and when any dep changes | Watch specific values


## Intro

```js
useEffect(() => {}, [dep1, dep2, dep3]);
```

> 💡NOTE: **dep1**, **dep2**, **dep3** should be elements tracked by react, like Props or Hooks.

`UseEffect` function runs every time the component mounts (begins). `UseEffect` takes 2 params:

* A function: containing side-effect logic.
* An array of elements track by react. The effect re-runs when any value in this array changes. If the array is empty, the effect only runs once, after the initial render.

## Examples

### Example 1: Run Effect on Every Render

```js
useEffect(() => {
  // This code runs after every render
  console.log('Component rendered or updated');
});
```

### Example 2: Run Effect Only Once (on Mount)

```js
useEffect(() => {
  // This code runs only once after the initial render
  console.log('Component mounted');
}, []);

```

### Example 3: Run Effect When Specific State Changes

```js
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(`Count changed: ${count}`);
}, [count]);
```

### Example 4: Cleanup on Unmount

```js
useEffect(() => {
  const timer = setInterval(() => {
    console.log('Tick');
  }, 1000);

  // Cleanup function runs on unmount or before effect re-runs
  return () => clearInterval(timer);
}, []);
```

### Example 5: Data Fetching

```js
useEffect(() => {
  fetch('https://api.example.com/data')
    .then(response => response.json())
    .then(data => setData(data));
}, []);
```

### Example 6: Event Listeners

```js
useEffect(() => {
  function handleResize() {
    console.log('Window resized');
  }
  window.addEventListener('resize', handleResize);

  return () => window.removeEventListener('resize', handleResize);
}, []);
```

## Can I use several useEffects in a component?

Yes, you can use several useEffect hooks in a single React component, and this is not only allowed but also considered a best practice in many cases.

**Separation of Concerns**: Each useEffect should ideally handle a specific side effect or concern. This keeps your code organized, modular, and easier to understand, since unrelated logic doesn't get mixed together in a single effect.

**Independent Dependencies**: Each useEffect can have its own dependency array, so effects only run when their relevant data changes. This avoids unnecessary executions and keeps effects targeted.

**Order Matters**: React executes multiple useEffect hooks in the order they are defined within the component.

**Readability and Maintainability**: Using multiple effects can make it clear what each effect is responsible for, helping future maintainers (or yourself) quickly understand the component's behavior.

```js
useEffect(() => {
  // Runs when propA changes
}, [propA]);

useEffect(() => {
  // Runs when stateB or stateC changes
}, [stateB, stateC]);
```

