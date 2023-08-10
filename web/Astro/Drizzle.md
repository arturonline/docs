# Drizzle

Hi, thank you for your question. Drizzle ORM is a type-safe ORM for SQL databases that follows the SQL-like syntax and philosophy. Astro is a framework for building fast, modern websites with your favorite JavaScript framework. To use Drizzle ORM with Astro, you need to install the Drizzle driver for your database and the Astro middleware for Drizzle. For example, if you are using PostgreSQL, you can run the following commands:

```sh
yarn add drizzle-orm/pg-core pg
yarn add -D @astrojs/middleware-drizzle
```

Then, you need to create a `db.ts` file in your `src` folder and export a `db` object that connects to your database using Drizzle. For example:

```ts
import { drizzle } from 'drizzle-orm/pg-core';
import * as schema from './schema';

const db = drizzle(client, { schema });

export { db };
```

The `schema` module contains the definitions of your data models using Drizzle. You can learn more about how to create data models with Drizzle from [this article](^2^).

Next, you need to configure Astro to use the Drizzle middleware in your `astro.config.mjs` file. For example:

```js
export default {
  // ...
  middleware: [
    // ...
    '@astrojs/middleware-drizzle',
  ],
};
```

The Drizzle middleware will automatically inject the `db` object into the Astro props, so you can access it from any Astro component. For example, you can use the `db.query` method to fetch data from your database and render it in your Astro page. For example:

```astro
---
import { db } from '../db.ts';

const posts = await db.query('SELECT * FROM posts');
---

<html>
<head>
  <title>Posts</title>
</head>
<body>
  <h1>Posts</h1>
  <ul>
    {posts.map((post) => (
      <li key={post.id}>
        <h2>{post.title}</h2>
        <p>{post.content}</p>
      </li>
    ))}
  </ul>
</body>
</html>
```

You can also use the `db.execute` method to perform mutations on your database, such as inserting, updating, or deleting data. For example, you can create a form that allows users to create new posts and use the `db.execute` method to insert them into the database. For example:

```astro
---
import { db } from '../db.ts';

let title = '';
let content = '';

const handleSubmit = async (event) => {
  event.preventDefault();
  await db.execute('INSERT INTO posts (title, content) VALUES ($1, $2)', [title, content]);
  window.location.reload();
};
---

<html>
<head>
  <title>New Post</title>
</head>
<body>
  <h1>New Post</h1>
  <form onSubmit={handleSubmit}>
    <label for="title">Title:</label>
    <input type="text" id="title" name="title" value={title} onInput={(event) => (title = event.target.value)} />
    <label for="content">Content:</label>
    <textarea id="content" name="content" value={content} onInput={(event) => (content = event.target.value)} />
    <button type="submit">Create Post</button>
  </form>
</body>
</html>
```

For more information on how to use Drizzle ORM with Astro, please refer to the documentation¹ and the integrations page³. I hope this helps you with your project. Have a nice day! 😊

Origen: Conversación con Bing, 8/10/2023
(1) Getting started with Drizzle: A type-safe ORM - LogRocket Blog. https://blog.logrocket.com/getting-started-drizzle-type-safe-orm/.
(2) GitHub - drizzle-team/drizzle-orm: TypeScript ORM that feels like .... https://github.com/drizzle-team/drizzle-orm.
(3) Integrations | Astro. https://astro.build/integrations/.