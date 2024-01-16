# Media queries

```css
@media media-type and (media-feature-rule) {
  /* CSS rules go here */
}
```

media-type: 

- all
- print
- screen

Media-feature-rule:

- width
- max-width
- orientation
- hover


## Without media queries

Una linia con todos los "items" que quepan siempre que midan como minino 200px. Si bajan de ese tamaño, la ultima se pasa a la siguiente fila. Por encima de 200px ocupa 1fr.

```css
/* The columns will automatically break when each one gets below 200px */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
```

## breakpoints

```cs
/* No media query necessary for xs breakpoint as it's effectively `@media (min-width: 0) { ... }` */
.some-class {
  color: red;
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
  .some-class {
    color: green;
  }
}

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) {
  .some-class {
    color: blue;
  }
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
  .some-class {
    font-weight: bold;
  }
}

// X-Large devices (large desktops, 1200px and up)
@media (min-width: 1200px) {
  .some-class {
    font-style: italic;
  }
}

// XX-Large devices (larger desktops, 1400px and up)
@media (min-width: 1400px) {
  .some-class {
    text-decoration: underline;
  }
}
```