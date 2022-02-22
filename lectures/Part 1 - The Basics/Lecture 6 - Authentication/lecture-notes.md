### Authenticateion

We can't just create presentations with seeded user data. We actually need a way
to create and authenticate users.

We will just use a basic username/password authentication system, store an authentication
cookie in the browser, and pass around a `requireUserId` function in our loaders/actions.

Remix provides some http helpers to create user sessions, which are implemented
in `app/utils/users.server.ts`

We can use these to create a simple registration form. Copy and paste into
`app/routes/register.tsx`

```tsx
import { ActionFunction, Link, LinksFunction } from "remix"
import { useActionData, useSearchParams } from "remix"
import { ActionData, RegistrationForm } from "~/components/registration-form"
import {
  checkUserNameAvailable,
  createUserSession,
  register,
} from "~/utils/users.server"
import stylesUrl from "../styles/login.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`
  }
}

export const action: ActionFunction = async ({
  request,
}): Promise<Response | ActionData> => {
  // generic form parsing
  const form = await request.formData()
  const username = form.get("username")
  const firstname = form.get("firstname")
  const lastname = form.get("lastname")
  const password = form.get("password")
  const redirectTo = form.get("redirectTo") || "/"
  if (
    typeof username !== "string" ||
    typeof firstname !== "string" ||
    typeof lastname !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return { formError: `Form not submitted correctly.` }
  }

  // let's validate these fields
  const fields = { username, password, firstname, lastname }
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  }
  if (Object.values(fieldErrors).some(Boolean)) return { fieldErrors, fields }

  // all valid, now check that the username is available
  const userExists = await checkUserNameAvailable(username)
  if (userExists) {
    return {
      fields,
      formError: `User with username ${username} already exists`,
    }
  }
  // everthing checks out, create the user
  const user = await register(username, firstname, lastname, password)
  if (!user) {
    // What! how could this happen?
    return { fields, formError: "Something went wrong when creating user." }
  }
  // create their session and redirect to /
  return createUserSession(user.id, redirectTo)
}

export default function Register() {
  const actionData = useActionData<ActionData>()
  const [searchParams] = useSearchParams()
  return (
    <div className="login-container">
      <div className="content" data-light="">
        <h1>Register</h1>
        <RegistrationForm actionData={actionData} searchParams={searchParams} />
        <div>
          Already have an account? <Link to="/login">login</Link>
        </div>
      </div>
    </div>
  )
}
```
