## Error Handling

Error boundaries were introduced in React 16, and made an awesome way to gracefully
handle errors in your app. Instead of the page crashing, it will render the nearest
`<ErrorBoundary>` of your app.

Remix builds on this by exporting two components from your route: `<CatchBoundary>` and `<ErrorBoundary>`

### `<CatchBoundary>`

When your `loader` or `action` function throws a `Response` object, Remix will
know to render your `<CatchBoundary>` component.

```tsx
export const loader = async () => {
  // any status code can be thrown, but tradition dicates your use a 4xx code.
  throw new Response("error message", {status: 4xx})
}

export default function HappyPath() {
  return <div>I am the happy path</div>
}

export function CatchBoundary() {
  return <div>I caught the known error</div>
}
```

Will result in `I caught the known error` when the route is visited.

#### useCatch()

You can use the hook `useCatch()` in your `<CatchBoundary>` to get data about the
error.

```tsx
export function CatchBoundary() {
  const caught = useCatch()
  return (
    <div>
      <h1>{caught.statusText}</h1>
      <pre>{JSON.stringify(caught.data, null, 2)}</pre>
    </div>
  )
}
```

### `<ErrorBoundary>`

When your app throws any other error, Remix will render the closest `<ErrorBoundary>`.

```tsx
export const loader = async () => {
  const dontDoThis = undefined.property
  return dontDoThis
}

export default function HappyPath() {
  return <div>I am the happy path</div>
}

export function ErrorBoundary() {
  return <div>Something terrible happened</div>
}
```

Will result in `Something terrible happened` when the route is visited.

#### `error` prop

You can use the `error` prop in your `<ErrorBoundary>` to get data about the
error.

```tsx
export function ErrorBoundary({ error }) {
  return (
    <div>
      <h1>{error.message}</h1>
      <pre>{JSON.stringify(error.stack, null, 2)}</pre>
    </div>
  )
}
```

### Gotcha

Since a resource route does not return a component, there is no "nearest" boundary,
so be sure to handle errors just as you would if it were an API resource
(because, technically that is what it is)
