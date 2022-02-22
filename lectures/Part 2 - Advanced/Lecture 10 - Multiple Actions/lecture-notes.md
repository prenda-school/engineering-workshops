## Multiple Actions

Since the main component of interacting with the server is the html `form`, how
can we handle multiple forms on a page with different actions?

The current model may be to create resource routes in `app/routes/api/action1.ts` and
`app/routes/api/action2.ts`. And then specify those routes in the form's `action` prop.
That works great! But, ...now your actions are in another file and you have to
go into context switching going between the route file and the resource files.

[Ryan Florence suggests another solution](https://www.youtube.com/watch?v=w2i-9cYxSdc.), HTML.

Consider our presentations table. We want to be able to delete a presention and
like a presentation on the same page: `/presentation`.

#### Concept 1: Buttons can be forms

We are used to creating a button, adding click handler, and `onClick` mutate data
by posting to our server. But, if we create a single button form then we can just
use HTML that works with our `action` function, and saves us from working with
loading state, and aborting multiple clicks because it just works.

```tsx
const VoteButton = () => {
  return (
    <form method="post">
      <button type="submit">Like</button>
    </form>
  )
}
```

#### Concept 2: As a form element, buttons can receive `name` and `value` props.

```tsx
const VoteButton = () => {
  return (
    <form method="post">
      <button type="submit" name="actionType" value="like">
        Like
      </button>
    </form>
  )
}
```

#### Concept 3: We can switch on the `actionType` value in our `action`

```tsx
export const action = async ({request}) => {
  const formData = await request.formData()
  const actionType = formData.get("actionType")
  switch(actionType) {
    case "like":
      doLike()
    case "delete":
      doDelete()
  }
  return { success: true }
}

export default function MultipleActionRoute() {
  const {user, presentation} = useLoaderData()
  return (
    <div>
      <div>
        <PresentationName>
        <DeletePresentation user={user} id={presentation.id}>
        <LikePresentation user={user} id={presentation.id}>
      </div>
    </div>
  )
}
```
