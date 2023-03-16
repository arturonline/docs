# Events

## v-if

`v-if` directive would remove / insert the `<p>` element based on the truthiness of the value of the expression seen.

```vue
<p v-if="seen">Now you see me</p>
```

## listen to dom events

```vue
<a v-on:click="doSomething"> ... </a>

<!-- shorthand -->
<a @click="doSomething"> ... </a>


<!-- with dynamic arguments -->
<a :[attributeName]="url"> ... </a>
```

>* Dynamic arguments are expected to evaluate to a string, with the exception of null.


## v-else

```vue
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

## v-else-if

```vue
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

https://vuejs.org/guide/essentials/conditional.html#v-if-on-template