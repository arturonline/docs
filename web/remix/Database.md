# Database

In Remix, each route module is responsible for getting its own data. So if we want data on the /jokes route, then we'll be updating the app/routes/jokes.tsx file.

To load data in a Remix route module, you use a loader. This is simply an async function you export that returns a response, and is accessed on the component through the useLoaderData hook. Here's a quick example:

```tsx
// this is just an example. No need to copy/paste this 😄
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { Sandwich } from "@prisma/client";

import { db } from "~/utils/db.server";

type LoaderData = { sandwiches: Array<Sandwich> };

export const loader: LoaderFunction = async () => {
  const data: LoaderData = {
    sandwiches: await db.sandwich.findMany(),
  };
  return json(data);
};

export default function Sandwiches() {
  const data = useLoaderData<LoaderData>();
  return (
    <ul>
      {data.sandwiches.map((sandwich) => (
        <li key={sandwich.id}>{sandwich.name}</li>
      ))}
    </ul>
  );
}
```