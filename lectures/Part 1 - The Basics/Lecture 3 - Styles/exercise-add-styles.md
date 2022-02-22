Add styles to the `/presentation` route by bringing in the styles from `app/styles/presentation.css`

1. `import` the LinkFunction type from remix (optional, but good for typescript)
2. `import` the stylesheet from `app/styles/presentation.css`. Hint: the default import is a url.
3. `export` a `links` function that takes no arguments and returns an array of links objects.

```typescript
export function links(): LinkObject[]
```
