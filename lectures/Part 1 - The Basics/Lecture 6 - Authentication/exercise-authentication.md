1. Create two new routes: `/login` and `/register`
2. Copy and paste the code from the lecture notes into `app/routes/register.tsx`
3. In `login.tsx`, implement the login.
4. In all private routes, add `await requireUserId(request)` to the top of the action/loader
5. In the `root.tsx` route, display the currently logged in user's first and last name in the `<Header>` component.

**Hints**

- Login should be a simplified version of registration
  - You only need to ensure that the form fields where completed, not validate
    any for length
  - You don't need to check if a user exists, just call `login`. (`import {login} from "~/util/users.server"`)
  - If there is a user, then create the user session.
  - Instead of using the `<RegistrationForm>` component, use `<LoginForm>` component.
  - Instead of linking to `/login`, link to `/register`.
