# Grid Basics

To get started you have to define a container element as a grid with `display: grid`, set the column and row sizes with `grid-template-columns` and `grid-template-rows`, and then place its child elements into the grid with `grid-column` and `grid-row`. 


```css
.container {
  display: grid | inline-grid;

  grid-template-columns: ...  ...;
  /* e.g. 
      1fr 1fr
      minmax(10px, 1fr) 3fr
      repeat(5, 1fr)
      50px auto 100px 1fr
  */

  grid-template-rows: ... ...;
  /* e.g. 
      min-content 1fr min-content
      100px 1fr max-content
  */
}
}
```

## Grid Columns 

`grid-template-columns` Specifies the size of columns

With fractions:

```css
/* 2 columns: 1st (1/4) 25%, 2nd (3/4) 75% */
grid-template-columns: 1fr 3fr;

/* 3 columns: 1st (1/4) 25%, 2nd (2/4) 50% 3rd (1/4) 25% */
grid-template-columns: 1fr 2fr 1fr;

/* columns: 1st 1/4, 2nd 1/4, 3rd 1/4, 4th 1/4 */
grid-template-columns: 1fr 1fr 1fr 1fr;
grid-template-columns: repeat(4, 1fr); /* Same as above: 4 columns of 1fr (1/4) */
```

With pixels:

```css
/* 2 columns: 1st (width: 200px), 2nd (width: 400px) */
grid-template-columns: 100px 200px; 

/* 3 columns: 1st 100px, 2nd 200px, 3rd 300px*/
grid-template-columns: 100px 200px 300px;
```

With %:

```css
grid-template-columns: 40% 50% 10%;
```

## Grid Rows

`grid-template-rows` Specifies the size of rows

```cs
/* 3 rows: 1st 1/4, 2nd 2/4, 3rd 1/4 */
grid-template-rows: 1fr 2fr 1fr
```


## gaps

```css
gap: 10px
row-gap: 10px
column-gap: 10px;
```

## Specify the size

```cs
grid-auto-rows: 200px;
grid-auto-columns: 200px;
grid-auto-rows: minmax(200px, auto)
```

## Alignment

Align container:

```cs
justify-content: start | center | end ... /* horizontal */
align-items: start | center | end | stretch; /* vertical */
```

align container items:

```cs
justify-self: start | center | end ... /* horizontal */
align-self: start | center | end | stretch; /* vertical */
```

## span

```cs
.item:nth-of-type(1) {
    /* span from start 1 to end 3 */
    grid-column-start: 1
    grid-column-end: 3

    /* span from start 1 to end 3 */
    grid-column: 1/3

    /* span from start 1 to end 3 */
    grid-column: 1 / span 2
}
```

## responsiveness

```css
/* fires at 500px or lower */
@media(max-width: 500px) {
   .container {
    grid-template-columns: 1fr;
   } 
}
```

```cs
/* at >200px per column than column goes down */
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr))
```

## Areas

see [html2]("./../example/index2.html") and [style2]("./../example/style2.css).

https://youtu.be/0xMQfnTU6oo?t=1387