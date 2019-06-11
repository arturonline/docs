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
