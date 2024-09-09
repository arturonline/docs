# Añadir tailwind a Blazor

To add Tailwind CSS to your Blazor project, follow these steps.  

## 1. Install Tailwind

Open a terminal in your project directory and run the following command to install Tailwind CSS and its dependencies:  

```sh
npm install -D tailwindcss postcss autoprefixer
```

## 2. Configure Tailwind

Initialize Tailwind CSS: Create the `tailwind.config.js` and `postcss.config.js` files by running:  

```cs
npx tailwindcss init -p
```

Update the `tailwind.config.js` file to include your Blazor components:  

```json
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.razor',
    './**/*.html',
    './**/*.cshtml',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 3. Create CSS Files

Create a CSS config file in `wwwroot/tailwind/tailwind.css` with the following content:  

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Create an empty ouput CSS file in `wwwroot/css/tailwind.css`. Add a reference to the generated Tailwind CSS file in your `App.razor`, `index.html` or `_Host.cshtml` file:  

```cs
<link href="css/tailwind.css" rel="stylesheet">
```

## 4. test it

To begin a watch session:

```sh
npm tailwindcss -i .\wwwroot\tailwind\tailwind.css -o .\wwwroot\css\tailwind.css --watch
```

Use Tailwind CSS in your Blazor components: You can now use Tailwind CSS classes in your Blazor components, Ex: 

```html
<p class="h3 text-blue-500">Welcome to <strong>Rutaswin</strong></p>
```

## 5. Extras 

### Create npm script

Build Tailwind CSS: Add a script to your **package.json** to build the Tailwind CSS file:  

```json
"scripts": {
"build:css": "tailwindcss -i ./wwwroot/tailwind/tailwind.css -o ./wwwroot/css/tailwind.css --watch"
}
```

And we can run: `npm run build:css`

### Compile final version

```sh
npx tailwindcss -i .\wwwroot\tailwind\tailwind.css -o .\wwwroot\css\tailwind.css --minify
```


