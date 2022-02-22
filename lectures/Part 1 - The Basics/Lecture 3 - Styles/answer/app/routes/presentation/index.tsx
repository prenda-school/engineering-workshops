import { LinksFunction } from "remix"
import stylesUrl from "~/styles/presentation.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
]

export default function Presentation() {
  return (
    <div className="container">
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
        <tbody></tbody>
      </table>
    </div>
  )
}
