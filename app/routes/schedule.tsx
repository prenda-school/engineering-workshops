import { LinksFunction, LoaderFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import stylesUrl from "~/styles/presentation.css"
import { getPresentations } from "~/utils/presentations.server"
import { authenticator } from "~/utils/google_auth.server"
import { TSerializedPresentationDoc } from "~/types"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const loader: LoaderFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const presentations = await getPresentations(true)
  presentations.sort((a, b) => {
    if (a.dateScheduled && b.dateScheduled) {
      return a.dateScheduled > b.dateScheduled ? -1 : 1
    } else if (a.dateScheduled) {
      return -1
    } else {
      return 1
    }
  })
  return presentations
}

export default function ScheduleTable() {
  const presentations = useLoaderData<TSerializedPresentationDoc[]>()
  return (
    <div className="container">
      <table className="presentation-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Suggester</th>
            <th>Presenter</th>
            <th>Notes</th>
            <th>Present Date</th>
          </tr>
        </thead>
        <tbody>
          {presentations.map((presentation) => {
            const date = presentation.dateScheduled
              ? new Date(presentation.dateScheduled)
              : null
            const dateString = date
              ? date.toUTCString().split(" ").slice(1, 4).join(" ")
              : null
            return (
              <tr key={presentation._id}>
                <td>
                  <Link to={`/presentation/${presentation._id}`}>
                    {presentation.title}
                  </Link>
                </td>
                <td>
                  {presentation.suggester?.firstname}{" "}
                  {presentation.suggester?.lastname}
                </td>
                <td>
                  {presentation.presenter?.firstname}{" "}
                  {presentation.presenter?.lastname}
                </td>
                <td
                  dangerouslySetInnerHTML={{
                    __html: presentation.parsedMarkdown ?? "",
                  }}
                ></td>
                <td style={{ minWidth: 120 }}>{dateString}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
