# PropTypes

As your app grows, you can catch a lot of bugs with typechecking. React has some built-in typechecking abilities. To run typechecking on the props for a component, you can assign the special propTypes property.

## PropTypes in Classes

```jsx
import React from "react";

export class MessageDisplayer extends React.Component {
  render() {
    return <h1>{this.props.message}</h1>;
  }
}

MessageDisplayer.propTypes = {
  message: React.PropTypes.string
};
```

- The value of propTypes is an object, not a function.
- The name of each property in propTypes should be the name of an expected prop. In our case, `MessageDisplayer` expects a prop named message, so our property’s name is `message`.

## PropTypes in stateless functions

To write propTypes for a stateless functional component, you define a propTypes object as a property of the stateless functional component itself:

```jsx
const Example = props => {
  return <h1>{props.message}</h1>;
};

Example.propTypes = {
  message: React.PropTypes.string.isRequired
};
```

## .isRequired

If you add `.isRequired` to a propType, then you will get a console warning if that prop isn’t sent.

## Objects

You can use `PropTypes.shape` to specifiy the structure of an object.

E.g.

```jsx
Filters.propTypes = {
    context: PropTypes.shape({
        something: PropTypes.number.isRequired,
        anotherThing: PropTypes.string,
        anotherObject: PropTypes.shape({
            foo: PropTypes.arrayOf(PropTypes.number)
        })
    })
}
```

## Example

```jsx
import React from "react";

export class Runner extends React.Component {
  render() {
    let miles = this.props.miles;
    let km = this.props.milesToKM(miles);
    let races = this.props.races.map(function(race, i) {
      return <li key={race + i}>{race}</li>;
    });

    return (
      <div style={this.props.style}>
        <h1>{this.props.message}</h1>
        {this.props.isMetric && <h2>One Time I Ran {km} Kilometers!</h2>}
        {!this.props.isMetric && <h2>One Time I Ran {miles} Miles!</h2>}
        <h3>Races I've Run</h3>
        <ul id="races">{races}</ul>
      </div>
    );
  }
}

Runner.propTypes = {
  message: React.PropTypes.string.isRequired,
  style: React.PropTypes.object.isRequired,
  isMetric: React.PropTypes.bool.isRequired,
  miles: React.PropTypes.number.isRequired,
  milesToKM: React.PropTypes.func.isRequired,
  races: React.PropTypes.array.isRequired
};
```
