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
import { TSerializedPresentationDoc, TUserDoc } from "~/types"
import { useEffect, useState } from "react"
import { Modal } from "~/components/modal"

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
  const [showDelete, setShowDelete] = useState<string | null>(null)
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
                  <DeleteButton
                    onClick={() => setShowDelete(presentation._id)}
                    presentationId={presentation._id}
                  />
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
      {showDelete && (
        <DeleteModal
          presentationId={showDelete}
          handleClose={() => setShowDelete(null)}
          title={presentations.find((p) => p._id === showDelete)?.title ?? ""}
        />
      )}
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
  let alreadyLikes = !!presentation.votes?.find((v) => v === userId)
  const fetcher = useFetcher()
  const isLiking =
    fetcher.submission?.formData.get("presentationId") === presentation._id
  alreadyLikes = isLiking ? !alreadyLikes : alreadyLikes
  return (
    <fetcher.Form method="post">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="presentationId" value={presentation._id} />

      <button
        name="actionType"
        value={alreadyLikes ? "unlike" : "like"}
        type="submit"
        className="button button-light"
      >
        {alreadyLikes ? "Unlike" : "Like"}
      </button>
    </fetcher.Form>
  )
}

const DeleteButton = ({
  presentationId,
  onClick,
}: {
  presentationId: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const fetcher = useFetcher()
  const isDeleting =
    fetcher.submission?.formData.get("presentationId") === presentationId

  return (
    <button
      className="button button-light"
      aria-label="delete"
      style={{ borderRadius: "50%", width: 24, height: 24, padding: 0 }}
      onClick={onClick}
    >
      {isDeleting ? <Spinner /> : "×"}
    </button>
  )
}

const DeleteModal = ({
  presentationId,
  title,
  handleClose,
}: {
  presentationId: string
  title: string
  handleClose: () => void
}) => {
  const fetcher = useFetcher()
  const isDeleting =
    fetcher.submission?.formData.get("presentationId") === presentationId
  useEffect(() => {
    if (fetcher.type === "done" && fetcher.data.success) {
      handleClose()
    }
  }, [fetcher])
  console.dir(fetcher, { depth: null })
  return (
    <Modal>
      <fetcher.Form method="post">
        <input type="hidden" name="presentationId" value={presentationId} />
        <h3 style={{ textAlign: "center" }}>
          <span style={{ fontWeight: "normal" }}>
            Are you sure you want to delete:
          </span>
          <br />
          {title}
        </h3>
        {isDeleting ? (
          <Spinner />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}
          >
            <button
              className="button button-error"
              name="actionType"
              value="delete"
              type="submit"
            >
              Yes
            </button>
            <button
              style={{ marginTop: 0 }}
              onClick={handleClose}
              className="button button-dark"
            >
              No
            </button>
          </div>
        )}
      </fetcher.Form>
    </Modal>
  )
}
