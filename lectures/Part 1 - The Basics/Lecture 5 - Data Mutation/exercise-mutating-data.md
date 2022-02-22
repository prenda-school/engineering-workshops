Let's add the ability to add a new presentation:

1. Create a new route at `/presentation/new` by adding `new.tsx` to the correct directory.
2. Add a link to the css for this page `presentation-id.css`
3. Create an `action` function to process the submitted form.
4. Since the `<PresentationForm>` component requires a list of users, create a
   `loader` function to get the users.
5. `export default` a `<NewPresentation>` component that get the users and uses the `<PresentationForm>` component.
6. Add a `<Link>` button to `app/routes/presentation/index.tsx` to our new route.
   You can use the text "Create new topic"

**Hints**

- you can `import {createPresentation} from "~/util/presentations.server"`,
  and use it in your `action`
- you can `import {getUsers} from "~/util/users.server"` and use it in your `loader`
- Don't create the form, just `import PresentationForm from "~/components/presentation-form"`
- \*Note you will get a type error for `PresentationForm` because we are not passing
  in a `user` prop. We will fix that later when we get to authentication. So for now pass `users[0]`.
- \*For the `onDismiss` prop, you can pass basic function `() => {}`, or do navigation with the
  `useNavigation` hook and navigate back to `/presentation`.
- style link with `className="className="button button-light create-topic-button"`
