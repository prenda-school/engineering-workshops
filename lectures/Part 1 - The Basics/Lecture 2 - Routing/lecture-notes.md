## Routing

Remix uses file-based routing. So all files in the `app/routes` directory will
become routes.
\*technically, you can do it programatically in the remix.config.js file, but let's not

### Conventions:

Each file can export functions that will be moved to the server:

- `loader`: think of it like the function in `app.get("/my/route", loader)`, but
  idiomatic to remix.
- `action`: think of it like the function to `app.post("my/route", action)`, but
  idiomatic to remix.
- `meta`: function to indicate which `meta` tags to set on page.
- `headers`: function to indicate which http headers to set on page.
- `links`: function to indicate which `link` tags to set on page.

Also, each file can export functions for the client side:

- `ErrorBoundary` A react error boundary to render on the client if there is an
  error during rendering or loading. Conventionally, this should be for unknown errors.
- `CatchBoundary` Similar to `ErrorBoundary`, but renders when you throw with a
  `Response` type in your `loader` or `action` function. In other words, you thought
  about what to do when leave the "happy path".
- `export default ...` This is the layout component that renders on the client.

### Basic routes

```
app/
├── routes/
│   ├── presentation.tsx
│   └── index.tsx
└── root.tsx
```

Will create routes at
| **url**| **Matched file** |
|--------|----------------------|
| / | app/routes/index.tsx |
| /presentation | app/routes/presentation.tsx |

### Dynamic routes

```
app/
├── routes/
│   ├── presentation/
│   │   ├── $presentationId.tsx
│   │   ├── new.tsx
│   │   ├── index.tsx
│   └── index.tsx
└── root.tsx
```

Will create routes at
| **url**| **Matched file** |
|--------|----------------------|
| / | app/routes/index.tsx |
| /presentation | app/routes/presentation/index.tsx |
| /presentation/new | app/routes/presentation/new.tsx
| /presentation/my-presentation | app/routes/presentation/$presentationId.tsx

There can be multiple params active at a time, like `/presentation/:presentationId/:userId`, and all params are accesible in the component via `useParams` hook.

### Layout route

```
app/
├── routes/
│   ├── presentation/
│   │   ├── $presentationId.tsx
│   │   ├── new.tsx
│   │   ├── index.tsx
│   └── presentation.tsx
└── root.tsx
```

You create a layout route by using the same name for a route and its directory. In this example, all the components in the `presentation` directory will render in the `<Outlet>` component in the `presentation.tsx` route.

\*Note, don't use an `<Outlet>` in an `index` file. A layout route is what to reach for to accomplish that purpose.
