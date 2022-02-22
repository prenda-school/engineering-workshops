import { Links, LiveReload, Meta, Outlet, ScrollRestoration } from "remix"
import type { MetaFunction, LinksFunction } from "remix"
import globalStylesUrl from "~/styles/global.css"
import headerStylesUrl from "~/styles/header.css"
import spinnerStylesUrl from "~/styles/spinner.css"
import { NavLink } from "react-router-dom"

export const meta: MetaFunction = () => {
  return { title: "New Remix App" }
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: globalStylesUrl },
  { rel: "stylesheet", href: headerStylesUrl },
  { rel: "stylesheet", href: spinnerStylesUrl },
]

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Header />
        <div className="app-container">
          <Outlet />
        </div>
        <ScrollRestoration />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  )
}

const Header = () => {
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
    </header>
  )
}
