# Combinators

## Universal selector

The universal selector (`*`) is the ultimate joker. It allows selecting all elements on a page. As it is rarely used to apply a style to every element on a page, it is often used in combination with other selectors (Combinators)

## Descendant Combinator

The descendant selector or, more accurately, the descendant combinator lets you combine two or more selectors so you can be more specific in your selection method. For example:

```css
#container .box {
   float: left;
   padding-bottom: 15px;
}
```

This declaration block will apply to all elements that have a class of **box** that are inside an element with an `ID` of **container**. It’s worth noting that the `.box element` doesn’t have to be an immediate child: there could be another element wrapping `.box`, and the styles would still apply

## Child Combinator

A selector that uses the child combinator is similar to a selector that uses a descendant combinator, except it only targets immediate child elements:

```css
#container > .box {
   float: left;
   padding-bottom: 15px;
}
```

This is the same code from the descendant combinator example, but instead of a space character, we’re using the greater-than symbol.

In this example, the selector will match all elements that have a class of box and that are immediate children of the `#container element`. That means, unlike the descendant combinator, there can’t be another element wrapping `.box`—it has to be a direct child element.

## General Sibling Combinator

A selector that uses a general sibling combinator matches elements based on sibling relationships. That is to say, the selected elements are beside each other in the HTML.

```css
h2 ~ p {
   margin-bottom: 20px;
}
```

This type of selector is declared using the tilde character `(~)`. In this example, all paragraph elements (`<p>`) will be styled with the specified rules, but only if they are siblings of `<h2>` elements. There could be other elements in between the `<h2>` and `<p>`, and the styles would still apply.

## Adjacent Sibling Combinator

A selector that uses the adjacent sibling combinator uses the plus symbol `(+)`, and is almost the same as the general sibling selector. The difference is that the targeted element must be an immediate sibling, not just a general sibling. Let’s see what the CSS code for this looks like:

```css
p + p {
   text-indent: 1.5em;
   margin-bottom: 0;
}
```

This example will apply the specified styles only to paragraph elements that immediately follow other paragraph elements. This means the first paragraph element on a page would not receive these styles. Also, if another element appeared between two paragraphs, the second paragraph of the two wouldn’t have the styles applied.