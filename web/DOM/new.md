# new

## 1. Selecting Elements

```js
// Select by ID
document.getElementById("myElement"); 

// Select the first matching element:
document.querySelector(".myClass"); // Selecting an element by class  
document.querySelector("#main-title"); // Selecting an element by ID
document.querySelector("p"); // Selects the first <p> element
document.querySelector("div .btn"); // Selects the first `.btn` inside a <div>
document.querySelector(".item.special"); // Selects an element with both classes
document.querySelector("input[type='email']"); // Selects an input element by attribute
document.querySelector("ul li:last-child"); // Selecting a last child of a parent container
document.querySelector("a:hover"); // Selecting a pseudo-class element
document.querySelector("nav a"); // First <a> inside a <nav>

// Select all matching elements
document.querySelectorAll("p"); // Select all <p> elements      
```

## 2. Changing Content

```js
// Updating text
document.getElementById("myElement").textContent = "New text!";

// Updating html
document.getElementById("myElement").innerHTML = "<strong>Bold text</strong>";
``` 

```js
// Updating an Image Source
<img id="image" src="image1.jpg" alt="First Image">
<button onclick="changeImage()">Change Image</button>

<script>
  function changeImage() {
    document.getElementById("image").src = "image2.jpg";
  }
</script>
```

## 3. Updating Style

```js
document.getElementById("myElement").style.color = "red";
document.getElementById("myElement").style.fontSize = "20px";
```

## 4. Adding or removing classes

```js
document.getElementById("myElement").classList.add("newClass");
document.getElementById("myElement").classList.remove("oldClass");
document.getElementById("myElement").classList.toggle("active");
```

## 5. Creating & appending elements

```js
//  Appending a new div to the body
let newElement = document.createElement("div");
newElement.textContent = "I'm a new div!";
document.body.appendChild(newElement);

// Adding a new li to an existing ul
let listItem = document.createElement("li");
listItem.textContent = "New List Item";
document.querySelector("ul").appendChild(listItem);
```

### 5. 1 Fragments

A DocumentFragment is a lightweight, temporary container that allows you to manipulate multiple elements efficiently before inserting them into the DOM. It doesn't exist in the actual document tree, which makes it faster than directly manipulating the DOM multiple times.

```js
let fragment = document.createDocumentFragment();
for (let i = 1; i <= 3; i++) {
    let newItem = document.createElement("li");
    newItem.textContent = `Item ${i}`;
    fragment.appendChild(newItem);
}
document.querySelector("ul").appendChild(fragment);
```

## 6. Removing elements

```js
let element = document.getElementById("myElement");
element.remove(); // Modern way
element.parentNode.removeChild(element); // Older method
```

## 7 Events

```js
document.getElementById("myButton").addEventListener("click", function() {
    alert("Button clicked!");
});
```