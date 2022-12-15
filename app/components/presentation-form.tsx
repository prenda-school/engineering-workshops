import { useRef, useState } from "react"
import { Form, useActionData, useTransition } from "@remix-run/react"
import { Spinner } from "./spinner"
import { TSerializedPresentationDoc, TSerializedUserDoc } from "~/types"

/**
 * will post to route of consuming component with form values:
 * {
 *   title: string,
 *   suggester: string, id of suggester
 *   presenter?: string, id of presenter,
 *   notes: string, a description of the topic
 *   presentationId: string | "new", the id of the presentation being edited
 * }
 */
export default function PresentationForm({
  presentation,
  user,
  users,
  onDismiss,
}: {
  presentation?: TSerializedPresentationDoc
  user: TSerializedUserDoc
  users: TSerializedUserDoc[]
  onDismiss: () => void
}) {
  const actionData = useActionData<{ formError: string }>()
  const transition = useTransition()
  const busy = transition.state !== "idle"
  const ref = useRef<null | HTMLTextAreaElement>(null)
  const [previewMarkdown, setPreviewMarkdown] = useState(false)
  return (
    <Form method="post" id="presentation-form">
      <input
        type="hidden"
        name="presentationId"
        value={presentation?._id || "new"}
      />
      <label>
        <div>Topic:</div>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={presentation?.title}
        />
      </label>
      <label>
        <div>Suggester:</div>
        <UserSelect
          users={users}
          name="suggester"
          defaultValue={presentation?.suggester?._id || user._id}
        />
      </label>
      <label>
        <div>Presenter:</div>
        <UserSelect
          users={users}
          name="presenter"
          defaultValue={presentation?.presenter?._id || user._id}
        />
      </label>
      <label>
        <div>
          Notes: <span style={{ opacity: 0.5 }}>(Markdown)</span>
        </div>
        <textarea
          ref={ref}
          name="notes"
          defaultValue={presentation?.notes ?? undefined}
        />
      </label>
      <div id="form-error-message">
        {actionData?.formError ? (
          <p className="form-validation-error" role="alert">
            {actionData?.formError}
          </p>
        ) : null}
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          disabled={busy}
          type="submit"
          className="button button-dark"
          style={{ width: 130 }}
        >
          {busy ? (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Spinner
                color="var(--color-light-text)"
                style={{ borderLeftColor: "#fff" }}
              />{" "}
              submitting
            </span>
          ) : (
            "submit"
          )}
        </button>
        <button
          type="button"
          style={{ marginTop: 0, width: 130 }}
          onClick={onDismiss}
          className="button button-light"
        >
          Cancel
        </button>
        <button type="button" onClick={() => setPreviewMarkdown((pm) => !pm)}>
          Preview
        </button>
      </div>
    </Form>
  )
}

const UserSelect = ({
  users,
  ...props
}: React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & { users: TSerializedUserDoc[] }) => (
  <select {...props}>
    {props.name === "presenter" && <option value={undefined}></option>}
    {users.map((u) => (
      <option key={u._id} value={u._id}>
        {u.firstname} {u.lastname}
      </option>
    ))}
  </select>
)
