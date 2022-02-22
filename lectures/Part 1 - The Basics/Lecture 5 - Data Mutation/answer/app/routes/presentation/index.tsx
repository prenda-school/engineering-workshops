import { Link, LinksFunction, LoaderFunction, useLoaderData } from "remix"
import stylesUrl from "~/styles/presentation.css"
import { AugmentedPresentation } from "~/types"

import { getPresentations } from "~/utils/presentations.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
]

export const loader: LoaderFunction = async () => {
  const presentations = await getPresentations()
  return presentations
}

export default function Presentation() {
  const presentations = useLoaderData<AugmentedPresentation[]>()
  return (
    <div className="container">
      <Link to="new" className="button button-light create-topic-button">
        Create New topic
      </Link>
      <table className="presentation-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Suggester</th>
            <th>Presenter</th>
            <th>Notes</th>
            <th>Votes</th>
            <th>+1</th>
          </tr>
        </thead>
        <tbody>
          {presentations.map((presentation) => (
            <tr key={presentation.id}>
              <td>{presentation.title}</td>
              <td>
                {presentation.suggester?.firstname}{" "}
                {presentation.suggester?.lastname}
              </td>
              <td>
                {presentation.presenter?.firstname}{" "}
                {presentation.presenter?.lastname}
              </td>
              <td>{presentation.notes}</td>
              <td>{presentation.votes.length}</td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
