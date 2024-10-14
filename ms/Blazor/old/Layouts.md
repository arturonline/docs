---
title: Layouts
author: Artur Badenes Puig 
date: 05/10/2022
---

# Layouts

A layout is a template that acts as an HTML wrapper around the current page's content, the template contains a place-holder indicating where the wrapped page's content should appear.

## Creating a Blazor layout

1. Crear un componente `.razor`
2. Hacer que dicho componente herede de `LayoutComponentBase`
3. Usa la directiva `@Body` para especificar el lugar donde se renderizará el contenido

```html
<!-- /shared/MyLayout -->
@inherits LayoutComponentBase

<div class="main">
  <header>
    <h1>This is the header</h1>
  </header>

  <div class="content">
    @Body
  </div>

  <footer>
    This is the footer
  </footer>
</div>
```

## Using a layout

```html
@layout MyLayout

<span> this is my content </span>
```

El resultado que se produce es:

```html
<div class="main">
  <header>
    <h1>This is the header</h1>
  </header>

  <div class="content">

    <span> this is my content </span>

  </div>

  <footer>
    This is the footer
  </footer>
</div>
```
