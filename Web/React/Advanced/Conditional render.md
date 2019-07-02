# Conditional render

To render a specific HTML element or React component depending on a prop or state value we can use several techniques:

## #1: Inline If with logical operator

```jsx
const SampleComponent = () => {

  //Show message state
  const [yellAtPerson, setYellAtPerson] = React.useState(false);

  return (
    <>
      {yellAtPerson && <h1>AAAHHHH</h1> || 'Hi there!'}
    </>
  );
};
```

## #2: Inline if-else with conditional operator

```jsx
const SampleComponent = () => {

  //Show message state
  const [yellAtPerson, setYellAtPerson] = React.useState(false);

  return (
    <>
      {yellAtPerson ? <h1>AAAHHHH</h1> : 'Hi there!'}
    </>
  );
};
```

You may also add more HTML or React components by wrapping parenthesis around them:

```jsx
const SampleComponent = () => {

  //Show message state
  const [yellAtPerson, setYellAtPerson] = React.useState(false);

  return (
    <>
      {yellAtPerson ? (
        <h1>AAAHHHH</h1>
      ) : ( <span>'Hi there!'</span>
      )};
    </>
  );
};
```

## #3: if-else statement

```jsx
const SampleComponent = () => {

  //Show message state
  const [yellAtPerson, setYellAtPerson] = React.useState(false);

  if (yellAtPerson) {
    return <h1>AAAHHHH</h1>;
  }

  return <span>Hi, there!</span>
};
```

## #4: React Component returning null

```jsx
const Modal = props => {

  //Check if it show the component
  if (!props.show) {
    return null;
  }
  return <h1>AAAHHHH!</h1>;


const SampleComponent = () =>{

  //Show message state
  const [yellAtPerson, setYellAtPerson] = React.useState(false);

  return (
    <>
      <Modal show={showModal} />
      <button onClick={() => setShowModal(!showModal)}>Click</button>
    </>
  );
};
```
