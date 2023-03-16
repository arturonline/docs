# Template


## Text interpolation

```js
    <span>Message: {{ msg }}</span>
``` 

## javascript expressions

Each binding can only contain one single expression. An expression is a piece of code that can be evaluated to a value.

```js
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

## html

The double mustaches interpret the data as plain text, not HTML. In order to output real HTML, you will need to use the `v-html` directive:

```js
<p>Using text interpolation: {{ rawHtml }}</p>
// Using text interpolation: <span style="color: red">This should be red.</span>

<p>Using v-html directive: <span v-html="rawHtml"></span></p>
// Using v-html directive: This should be red.
```

## Attributes Binding

Mustaches cannot be used inside HTML attributes. Instead, use a `v-bind` directive:

```js
<div v-bind:id="dynamicId"></div>
```

In case of multiple attributes we can use:

```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper'
}

<div v-bind="objectOfAttrs"></div>
```

## Shorthand

Because v-bind is so commonly used, it has a dedicated shorthand syntax:


```js
<div :id="dynamicId"></div>
```

## Boolean Attributes

```js
<button :disabled="isButtonDisabled">Button</button>

<div :class="{ active: isActive }"></div>
```

The above syntax means the presence of the `active` class will be determined by the truthiness of the data property `isActive`.
