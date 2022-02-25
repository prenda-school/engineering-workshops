import {
  ActionFunction,
  Link,
  LinksFunction,
  LoaderFunction,
  useLoaderData,
} from "remix"
import { db } from "~/utils/db.server"
import stylesUrl from "~/styles/presentation.css"
import { AugmentedPresentation } from "~/types"
import { requireUserId } from "~/utils/users.server"
import { getPresentations } from "~/utils/presentations.server"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const userId = formData.get("userId")
  const presentationId = formData.get("presentationId")
  const actionType = formData.get("actionType")

  if (typeof userId !== "string") return { error: "malformed userid" }
  if (typeof presentationId !== "string")
    return { error: "malformed presentationId" }

  if (actionType === "create") {
    await db.votes.create({ data: { userId, presentationId } })
  } else {
    await db.votes.delete({
      where: { userId_presentationId: { userId, presentationId } },
    })
  }
  return { success: true }
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request)
  const presentations = await getPresentations(true)
  presentations.sort((a, b) => {
    if (a.schedule && b.schedule) {
      return a.schedule?.dateScheduled > b.schedule?.dateScheduled ? -1 : 1
    } else if (a.schedule) {
      return -1
    } else {
      return 1
    }
  })
  return presentations
}

export default function ScheduleTable() {
  const presentations = useLoaderData<AugmentedPresentation[]>()
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
            const date = presentation.schedule?.dateScheduled
              ? new Date(presentation.schedule?.dateScheduled)
              : null
            const dateString = date
              ? date.toUTCString().split(" ").slice(1, 4).join(" ")
              : null
            return (
              <tr key={presentation.id}>
                <td>
                  <Link to={`/presentation/${presentation.id}`}>
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
                    __html: presentation.parsedMarkdown,
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
