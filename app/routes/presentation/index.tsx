import { ActionFunction, LinksFunction, LoaderFunction } from "@remix-run/node"
import {
  Link,
  useFetcher,
  useLoaderData,
  useTransition,
} from "@remix-run/react"
import stylesUrl from "~/styles/presentation.css"
import {
  deletePresentation,
  getPresentations,
} from "~/utils/presentations.server"
import { likePresentation, unlikePresentation } from "~/utils/votes"
import { Spinner } from "~/components/spinner"
import { authenticator } from "~/utils/google_auth.server"
import { TPresentationDoc, TSerializedPresentationDoc, TUserDoc } from "~/types"

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
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const presentations = await getPresentations()
  return {
    user,
    presentations,
  }
}

export default function PresentationsTable() {
  const { presentations, user } = useLoaderData<{
    user: TUserDoc
    presentations: TSerializedPresentationDoc[]
  }>()
  const transition = useTransition()

  return transition.state === "idle" ? (
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
              <tr key={presentation._id}>
                <td>
                  <DeleteButton presentationId={presentation._id} />
                </td>
                <td>
                  <Link to={presentation._id}>{presentation.title}</Link>
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
                <td>{presentation.votes.length}</td>
                <td>
                  <VoteButton userId={user._id} presentation={presentation} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  ) : (
    <div className="container">
      <Spinner />
    </div>
  )
}

const VoteButton = ({
  userId,
  presentation,
}: {
  userId: string
  presentation: TSerializedPresentationDoc
}) => {
  const alreadyLikes = presentation.votes?.find((v) => v.toString() === userId)
  const fetcher = useFetcher()
  const isLiking =
    fetcher.submission?.formData.get("presentationId") ===
    presentation._id.toString()
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="userId" value={userId} />
      <input
        type="hidden"
        name="presentationId"
        value={presentation._id.toString()}
      />
      {isLiking ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Spinner />
        </div>
      ) : (
        <button
          name="actionType"
          value={alreadyLikes ? "unlike" : "like"}
          type="submit"
          className="button button-light"
        >
          {alreadyLikes ? "Unlike" : "Like"}
        </button>
      )}
    </fetcher.Form>
  )
}

const DeleteButton = ({ presentationId }: { presentationId: string }) => {
  const fetcher = useFetcher()
  const isDeleting =
    fetcher.submission?.formData.get("presentationId") === presentationId

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="presentationId" value={presentationId} />
      <button
        name="actionType"
        value="delete"
        type="submit"
        className="button button-light"
        aria-label="delete"
        style={{ borderRadius: "50%", width: 24, height: 24, padding: 0 }}
      >
        {isDeleting ? <Spinner /> : "×"}
      </button>
    </fetcher.Form>
  )
}
