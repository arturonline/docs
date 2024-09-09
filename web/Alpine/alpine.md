# Alpine js

```html
<html>
<head>
    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body>
    <h1 x-data="{ message: 'I ❤️ Alpine' }" x-text="message"></h1>
</body>
</html>
```

## x-text

```html
<!-- Crear Alpine component -->
<div x-data="{ count: 0 }">
<!-- Listening for a 'click' event -->
    <button x-on:click="count++">Increment</button>
 
 <!-- Binding count to the span element -->
    <span x-text="count"></span>
</div>
```