import {
  Form,
  Link,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix"
import type { MetaFunction, LinksFunction } from "remix"
import globalStylesUrl from "~/styles/global.css"
import headerStylesUrl from "~/styles/header.css"
import spinnerStylesUrl from "~/styles/spinner.css"
import { getUser } from "~/utils/users.server"
import { User } from "@prisma/client"
import { NavLink } from "react-router-dom"

export const meta: MetaFunction = () => {
  return { title: "New Remix App" }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet", href: headerStylesUrl },
  { rel: "stylesheet", href: spinnerStylesUrl },
]

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)
  return { user }
}

export default function App() {
  const { user } = useLoaderData<{ user: User | null }>()
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header user={user} />
        <div className="app-container">
          <Outlet />
        </div>
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

const Header = ({ user }: { user: User | null }) => {
  return (
    <header className="app-header">
      <nav>
        <ul>
          <li>
            <NavLink to="presentation" className="header-nav-link">
              Presentations
            </NavLink>
          </li>
          <li>
            <NavLink to="schedule" className="header-nav-link">
              Schedule
            </NavLink>
          </li>
        </ul>
      </nav>
      {user && (
        <div className="user-info">
          <div className="user-name">{`Hi ${user.firstname} ${user.lastname}`}</div>
          <Form id="logout-form" action="/logout" method="post">
            <button type="submit" className="button button-dark">
              Logout
            </button>
          </Form>
        </div>
      )}
    </header>
  )
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="container error-container">
      <h1>{error.message || "There was an error rendering the app."}</h1>
      <Link to="/">Go to home</Link>
      <pre>{error.stack}</pre>
    </div>
  )
}
