import {
  Form,
  Links,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  ScrollRestoration,
  useLoaderData,
} from "remix"
import type { MetaFunction, LinksFunction } from "remix"
import globalStylesUrl from "./styles/global.css"
import headerStylesUrl from "./styles/header.css"
import { getUser } from "~/utils/users.server"
import { User } from "@prisma/client"
import { NavLink } from "react-router-dom"

export const meta: MetaFunction = () => {
  return { title: "Engineering Workshops" }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet", href: headerStylesUrl },
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
        {user && <Header user={user} />}
        <div className={user ? "app-container" : ""}>
          <Outlet />
        </div>

        <ScrollRestoration />
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
