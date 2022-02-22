1. Create a `LikeButton` component in `app/routes/presentation/index.tsx`
2. Create a `DeleteButton` component in `app/routes/presentation/index.tsx`
3. Create an `action` function to handle the `like` and `delete` actions.
4. Add the delete button as the first column, and the like button as the last
   column in our table.

Hints:

- You may be used to passing a body to a post route with multiple values like a
  `presentationId` and `userId`, but how to pass that to `action`? Simple, HTML. Use
  a `<input type="hidden" name="userId" value={userId} />` component.

Extra credit:

- Create another action to "unlike" a presentation.
