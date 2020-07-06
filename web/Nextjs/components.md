# Using Shared Components

We don't need to put our components in a special directory; the directory can be named anything. The only special directory is the **pages** directory.

You can even create the Component inside the **pages** directory.

## Method #1

```jsx
// components/Header.js

import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const Header = () => (
  <div>
    <Link href="/">
      <a style={linkStyle}>Home</a>
    </Link>
    <Link href="/about">
      <a style={linkStyle}>About</a>
    </Link>
  </div>
);

export default Header;
```

we can create a common Layout component and use it for each of our pages.

```jsx
// components/MyLayout.js

import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    {props.children}
  </div>
);

export default Layout;
```

```jsx
// pages/index.js

import Layout from '../components/learn/MyLayout.js';

export default function Index() {
  return (
    <Layout>
      <p>Hello Next.js</p>
    </Layout>
  );
}
```

## Method #2: Layout as a Higher Order Component

```jsx
// components/MyLayout.js

import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const withLayout = Page => {
  return () => (
    <div style={layoutStyle}>
      <Header />
      <Page />
    </div>
  );
};

export default withLayout;
```

```jsx
// pages/index.js

import withLayout from '../components/learn/MyLayout';

const Page = () => <p>Hello Next.js</p>;

export default withLayout(Page);
```

## Method #3: Page content as a prop

```jsx
// components/MyLayout.js

import Header from './Header';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const Layout = props => (
  <div style={layoutStyle}>
    <Header />
    {props.content}
  </div>
);

export default Layout;
```

```jsx
// pages/index.js

import Layout from '../components/learn/MyLayout.js';

const indexPageContent = <p>Hello Next.js</p>;

export default function Index() {
  return <Layout content={indexPageContent} />;
}
```
