# Control Flow

## if else statement

```javascript
if (stopLight === 'green' && pedestrians === 0) {
  console.log('Go!');
} else {
  console.log('Stop');
}
```

## if else if else statement

```javascript
let season = 'summer';

if (season === 'spring') {
  console.log('It\'s spring! The trees are budding!');
} else if (season === 'winter'){
  console.log('It\'s winter! Everything is covered in snow.');
} else if (season === 'fall') {
  console.log('It\'s fall! Leaves are falling!');
} else if (season === 'summer'){
  console.log('It\'s sunny and warm because it\'s summer!');
} else {
  console.log('Invalid season.');
}
```

## Ternary operator

```javascript
let isNightTime = true;

if (isNightTime) {
  console.log('Turn on the lights!');
} else {
  console.log('Turn off the lights!');
}
```

Use a ternary operator to perform the same functionality:

```javascript
isNightTime ? console.log('Turn on the lights!') : console.log('Turn off the lights!');
```

## short-circuit evaluation

```javascript
let defaultName = username || 'Stranger';
```