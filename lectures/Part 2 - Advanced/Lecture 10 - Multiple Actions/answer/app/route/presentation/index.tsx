import {
  ActionFunction,
  Form,
  Link,
  LinksFunction,
  LoaderFunction,
  useLoaderData,
} from "remix"
import stylesUrl from "~/styles/presentation.css"
import { getUser } from "~/utils/users.server"
import { User } from "@prisma/client"
import {
  deletePresentation,
  getPresentations,
} from "~/utils/presentations.server"
import { AugmentedPresentation } from "~/types"
import { likePresentation, unlikePresentation } from "~/utils/votes"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData()
  const actionType = formData.get("actionType")

  switch (actionType) {
    case "like": {
      const userId = formData.get("userId")
      const presentationId = formData.get("presentationId")
      if (typeof userId !== "string") return { error: "malformed userid" }
      if (typeof presentationId !== "string")
        return { error: "malformed presentationId" }
      await likePresentation(userId, presentationId)
      break
    }
    case "unlike": {
      const userId = formData.get("userId")
      const presentationId = formData.get("presentationId")
      if (typeof userId !== "string") return { error: "malformed userid" }
      if (typeof presentationId !== "string")
        return { error: "malformed presentationId" }
      await unlikePresentation(userId, presentationId)
      break
    }
    case "delete": {
      const presentationId = formData.get("presentationId")
      if (typeof presentationId !== "string")
        return { error: "malformed presentationId" }
      await deletePresentation(presentationId)
      break
    }
  }

  return { success: true }
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request, true)
  const presentations: AugmentedPresentation[] = await getPresentations()
  return {
    user,
    presentations,
  }
}

export default function PresentationsTable() {
  const { presentations, user } =
    useLoaderData<{ user: User; presentations: AugmentedPresentation[] }>()

  return (
    <div className="container">
      <Link to="new" className="button button-light create-topic-button">
        Create New topic
      </Link>
      <table className="presentation-table">
        <thead>
          <tr>
            <th></th>
            <th>Topic</th>
            <th>Suggester</th>
            <th>Presenter</th>
            <th>Notes</th>
            <th>Votes</th>
            <th>+1</th>
          </tr>
        </thead>
        <tbody>
          {presentations.map((presentation) => {
            return (
              <tr key={presentation.id}>
                <td>
                  <DeleteButton presentationId={presentation.id} />
                </td>
                <td>
                  <Link to={presentation.id}>{presentation.title}</Link>
                </td>
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
                <td>
                  <VoteButton userId={user.id} presentation={presentation} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

const VoteButton = ({
  userId,
  presentation,
}: {
  userId: string
  presentation: AugmentedPresentation
}) => {
  const alreadyLikes = presentation.votes?.find((v) => v.userId === userId)
  return (
    <Form method="post">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="presentationId" value={presentation.id} />
      <button
        name="actionType"
        value={alreadyLikes ? "unlike" : "like"}
        type="submit"
        className="button button-light"
      >
        {alreadyLikes ? "No longer interested" : "I'm Interested"}
      </button>
    </Form>
  )
}

const DeleteButton = ({ presentationId }: { presentationId: string }) => {
  return (
    <Form method="post">
      <input type="hidden" name="presentationId" value={presentationId} />
      <button
        name="actionType"
        value="delete"
        type="submit"
        className="button button-light"
        aria-label="delete"
        style={{ borderRadius: "50%", width: 24, height: 24, padding: 0 }}
      >
        &times;
      </button>
    </Form>
  )
}
