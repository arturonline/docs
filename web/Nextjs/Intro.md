# NextJS

**Next.js** is all about pages. We can create a page by exporting a React component, and putting that component inside the pages directory. Then it will have a fixed URL based on the file name.

## Setup

```shell
mkdir hello-next
cd hello-next
npm init -y
npm install --save react react-dom next
mkdir pages
```

```json
// Modify in package.json

"scripts": {
   "dev": "next",
   "build": "next build",
   "start": "next start"
 }
```

Now everything is ready. Run the following command to start the dev server:

```shell
npm run dev
```

Then open `http://localhost:3000` from your favourite browser.

## Navigate Between Pages

In order to support client-side navigation, we need to use Next.js's **Link API**, which is exported via `next/link`.

`<Link />` will prefetch the page and navigation will happen without a page refresh:

```jsx
// imagine we have an about.js page in the same folder

import Link from 'next/link';

const Index = () => (
  <div>
    <Link href="/about">
      <a>About Page</a>
    </Link>
    <p>Hello Next.js</p>
  </div>
);

export default Index;
```

### Link With a Button

```jsx
<Link href="/about">
  <button>Go to About Page</button>
</Link>
```
