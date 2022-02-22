import { ActionFunction, Form, LinksFunction } from "remix"
import { useActionData, Link, useSearchParams } from "remix"
import { LoginActionData, LoginForm } from "~/components/login-form"
import { createUserSession, login } from "~/utils/users.server"
import stylesUrl from "../styles/login.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const action: ActionFunction = async ({
  request,
}): Promise<Response | LoginActionData> => {
  const form = await request.formData()
  const username = form.get("username")
  const password = form.get("password")
  const redirectTo = form.get("redirectTo") || "/"
  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return { formError: `Form not submitted correctly.` }
  }

  const fields = { username, password }

  const user = await login(username, password)
  if (!user) {
    return {
      fields,
      formError: "Username/Password combination is incorrect",
    }
  }
  // if there is a user, create their session and redirect to /
  return createUserSession(user.id, redirectTo)
}

export default function Login() {
  const actionData = useActionData<LoginActionData>()
  const [searchParams] = useSearchParams()
  return (
    <div className="login-container">
      <div className="content">
        <h1>Login</h1>
        <LoginForm actionData={actionData} searchParams={searchParams} />
        <div>
          Need an account? <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  )
}
