1. Add an `<ErrorBoundary>` to `app/root.tsx` to act as a catch all.
2. Add a `<CatchBoundary>` to `app/routes/presentation/$presentationId.tsx` to
   handle the case when no presentation of id `presentationId` can be found, i.e.
   what to do when someone goes to `/presentation/a-bad-id`.

Hint:

- Use `className="container error-container"` if you want to have your errors show up in a nice
  container.
