# Snippets

## Embed JS

```js
---
const name = "astro";
---

<h1>Hello {name}</h1>
```

```js
---
const style = "purple";
---

<h1 class={style}>Hello world</h1>

<style>
  .purple {
    color: purple;
  }
</style>
```

## Lists

```js
---
const users = ['Astro', 'Remy', 'kelsey'];
---

<ul>
  {users.map(user => <li>{user}</li>)}
</ul>
```

## Conditionals

```js
--- 
const visible = true;
---

{visible && <p>I'm visible</p>}
{visible ? <p>I'm visible</p> : <p>I'm not visible</p>}
```

## fetch data

```js
---
const response = await fetch(https://jsonplaceholder.typicode.com/users?_limit=10');
const users = await response.json(); 
---

<ul>
  {users.map(user => <li>{user}</li>)}
</ul>
```
