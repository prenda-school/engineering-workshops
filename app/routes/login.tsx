import { Form, json, LinksFunction, LoaderFunction, useLoaderData } from "remix"
import { authenticator } from "~/utils/google_auth.server"
import { sessionStorage } from "~/utils/users.server"
import stylesUrl from "../styles/login.css"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/presentation",
  })
  const session = await sessionStorage.getSession(request.headers.get("cookie"))
  const error = session.get(authenticator.sessionErrorKey)
  return json({ error })
}

export default function Login() {
  const { error } = useLoaderData()
  return (
    <div className="login-container">
      <div className="content">
        <h1>Login</h1>
        <Form action="/auth/google" method="post">
          {error && (
            <h4 style={{ color: "var(--color-invalid)" }}>*{error.message}</h4>
          )}
          <button id="login-with-google-btn">Login With Google</button>
        </Form>
      </div>
    </div>
  )
}
