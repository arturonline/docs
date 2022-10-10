# Styling

Remix associates CSS links to routes it doesn't cascade. When the route is active, the link tag (CSS) on the page applies. When the route is not active (the user navigates away), the link tag is removed and the CSS no longer applies.

You do this by exporting a `links` function in your route module:

```tsx
import type { LinksFunction } from "@remix-run/node";

import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function IndexRoute() {
  return <div>Hello Index Route</div>;
}
```

>NOTE: `root.tsx` i also a normal route, like `IndexRoute`.