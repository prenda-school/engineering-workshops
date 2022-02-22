## Resource Routes

A resource route, in its simplest form, is just a route that doesn't export a
React component. In that case, a get to this route provides whatever the `loader`
returns, and a post to this route provides whatever the `action` returns.

### Okay, but why?

Maybe you want to provide an image generator route, an API for a mobile version
of the app, a csv export, or in our case, a logout route to destroy the session.

### Example

We can create a route at `app/routes/logout` that just destroys the user session
and redirects to `/`.

```tsx
import type { ActionFunction, LoaderFunction } from "remix"
import { redirect } from "remix"
import { logout } from "~/utils/users.server"

/**
 * the logout function just looks like:
 * export async function logout(request: Request) {
 *   const userSession = await getUserSession(request)
 *   return redirect("/login", {
 *     headers: {
 *       "Set-Cookie": await destroySession(userSession),
 *     },
 *   })
 * }
 */
export const action: ActionFunction = async ({ request }) => {
  return logout(request)
}

// Why include a loader function? because if someone `gets` here via the browser
// we don't want them to experience an error.
export const loader: LoaderFunction = async () => {
  return redirect("/")
}
```
