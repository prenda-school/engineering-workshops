import { Link } from "@remix-run/react"
import { TSerializedPresentationDoc } from "~/types"

export const Presentation = ({
  presentation,
}: {
  presentation: TSerializedPresentationDoc
}) => {
  return (
    <div id="presentation-id" className="container">
      <h2>{presentation.title}</h2>
      <h3>
        Suggested by: {presentation.suggester?.firstname}{" "}
        {presentation.suggester?.lastname}
      </h3>
      <h3>
        Presented by: {presentation.presenter?.firstname}{" "}
        {presentation.presenter?.lastname}
      </h3>
      <p style={{ margin: 0 }}>Description</p>
      <hr style={{ margin: 0, borderColor: "var(--color-text-dark)" }} />
      <p
        dangerouslySetInnerHTML={{ __html: presentation.parsedMarkdown ?? "" }}
      ></p>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <Link
          className="button button-dark"
          to="schedule"
          style={{ textDecoration: "none" }}
        >
          Schedule
        </Link>
        <Link
          className="button button-light"
          to="edit"
          style={{ textDecoration: "none" }}
        >
          Edit
        </Link>
      </div>
    </div>
  )
}
