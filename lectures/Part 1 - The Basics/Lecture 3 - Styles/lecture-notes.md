If you know HTML, you know that to get to get CSS on the page you add `<link rel="stylesheet" href="/path-to-file.css" />` to the head.

Remix does this as well, but instead of loading a lot of style sheets onto the page, it brings the power of its Nested Routing support to CSS and allows you to associate links to routes. When the route is active, the link is on the page and the CSS applies. When the route is not active (the user navigates away), the link tag is removed and the CSS no longer applies.

You do this by exporting a links function in your route module.

```typescript
// in app/route/component.tsx

// import types and stylesheet
import type {LinksFunction} from "remix"
import someStyleUrl from '../path/to/styles.css"

// make a `links` function. Remember, this gets moved to the server by Remix compiler
// The links function returns an array of link objects. The objects are spread as
// props on the link component <link {...props}>, so see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/link
// for details
export const links: LinksFunction = () => [
 { rel: "stylesheet", href: stylesUrl }
]
```

Note that in this app we have a directory called `styles` at the root of our app.
We will try to follow the convention of naming the css similar to the route.
