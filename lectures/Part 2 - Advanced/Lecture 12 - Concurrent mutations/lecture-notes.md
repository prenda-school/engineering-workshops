## Concurrent Mutations

One of the issues you will see with pending UI when you have multiple forms on a
page is that the `useTransition` hook works any time there is a transition. So
anytime a form is submitting, all the forms using `useTransition` will be in a
busy state. This is a limitation of the browser. But, Remix provides another
hook that let's us tap directly into the `fetch` side of Remix with the `useFetcher`
hook.

```tsx
// app/routes/presentation/index
...
// We try to add pending UI to our vote button just like our <PresentationForm> component
const VoteButton = ({
  userId,
  presentation,
}: {
  userId: string
  presentation: AugmentedPresentation
}) => {
  const alreadyLikes = presentation.votes?.find((v) => v.userId === userId)
  const transition = useTransition()
  // transition has a `submission` property with the form data on it.
  // We can use that to see if it is `this` form that is submitting.
  // Everything looks logical
  const isLiking =
    transition.submission?.formData.get("presentationId") === presentation.id
  return (
    <Form method="post">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="presentationId" value={presentation.id} />
      {/* Adding the flag just like we did in the <PresentationForm> */}
      {isLiking ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      ) : (
        <button
          name="actionType"
          value={alreadyLikes ? "unlike" : "like"}
          type="submit"
          className="button button-light"
        >
          {alreadyLikes ? "No longer interested" : "I'm Interested"}
        </button>
      )}
    </Form>
  )
}
```

When we try the code change above, we observe strange behavior. If you click all
the vote buttons quickly, only the most recently clicked has Pending UI. Try it
by throttling the network and observing your self.

**check your understanding**: What would happen if we used `const isLiking = transition.state !== "idle"`?

This can be fixed with the `useFetcher` hook:

```tsx
const VoteButton = ({
  userId,
  presentation,
}: {
  userId: string
  presentation: AugmentedPresentation
}) => {
  const alreadyLikes = presentation.votes?.find((v) => v.userId === userId)
  // this is like saying "I want to get more control of the Remix fetch"
  const fetcher = useFetcher()
  // fetcher's api is almost identical to transition, but it is more aware of `this`
  // request
  const isLiking =
    fetcher.submission?.formData.get("presentationId") === presentation.id
  return (
    // We have to use the <fetcher.Form> component to work with fetcher
    <fetcher.Form method="post">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="presentationId" value={presentation.id} />
      {isLiking ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      ) : (
        <button
          name="actionType"
          value={alreadyLikes ? "unlike" : "like"}
          type="submit"
          className="button button-light"
        >
          {alreadyLikes ? "No longer interested" : "I'm Interested"}
        </button>
      )}
    </fetcher.Form>
  )
}
```
