### Data mutations

To mutate data in a Remix route module, you use an `action` function in conjuction
with a form.

The `action` is simply an async function you export that should process the form data,
mutate the data, and returns a response for error types or redirects on success.

Here is an example:

```tsx
import type { ActionFunction } from "remix"

import {
  createUser,
  checkUserExists,
  createUserSession,
} from "~/utils/user.server"

/**
 * this gets moved to the server by remix compiler. A good mental model is this
 * becomes:
 * app.post("/register", (req, res) => {
 *   // do register with request
 * })
 */

export const action: ActionFunction = async ({ request }) => {
  // get the data submitted from the form
  const form = await request.formData()
  const username = form.get("username")
  const password = form.get("password")
  const redirectTo = form.get("redirectTo") || "/"

  // basic data validation
  const fields = { username, password }
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return { formError: `Form not submitted correctly.` }
  }

  // check if the username is available
  const userExists = await checkUserExists(username)
  if (userExists) {
    return {
      fields,
      formError: `User with username ${username} already exists`,
    }
  }

  // create the user
  const user = await register(username, firstname, lastname, password)
  if (!user) {
    return { fields, formError: "Something went wrong when creating user." }
  }
  // create their session and redirect to /
  return createUserSession(user.id, redirectTo)
}

export default function Register() {
  const actionData = useActionData<ActionData>()
  const [searchParams] = useSearchParams()
  return (
    <div>
      <div>
        <h1>Register</h1>
        <form
          method="post"
          aria-describedby={
            actionData?.formError ? "form-error-message" : undefined
          }
        >
          <input
            type="hidden"
            name="redirectTo"
            value={searchParams.get("redirectTo") ?? undefined}
          />
          <div>
            <label htmlFor="username-input">Username</label>
            <input
              type="text"
              id="username-input"
              name="username"
              // Notice we are using defaultValue. We don't want to control with React.
              // We are using good ol' HTML
              defaultValue={actionData?.fields?.username}
            />
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <input
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              type="password"
            />
          </div>
          <div id="form-error-message">
            {actionData?.formError ? (
              <p className="form-validation-error" role="alert">
                {actionData?.formError}
              </p>
            ) : null}
          </div>
          <button
            type="submit"
            className="button button-dark"
            style={{ margin: "auto" }}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}
```
