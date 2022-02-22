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

  const fields = { username, password, firstname, lastname }
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  }
  if (Object.values(fieldErrors).some(Boolean)) return { fieldErrors, fields }

  const userExists = await checkUserNameAvailable(username)
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
