import { User } from "@prisma/client"
import { Form, useTransition } from "remix"
import { AugmentedPresentation } from "~/types"
import { Spinner } from "./spinner"

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
  presentation?: AugmentedPresentation
  user: User
  users: User[]
  onDismiss: () => void
}) {
  const transition = useTransition()
  const busy = transition.state !== "idle"
  return (
    <Form method="post" id="presentation-form">
      <input
        type="hidden"
        name="presentationId"
        value={presentation?.id || "new"}
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
          defaultValue={presentation?.suggesterId || user.id}
        />
      </label>
      <label>
        Presenter:
        <br />
        <UserSelect
          users={users}
          name="presenter"
          defaultValue={presentation?.presenterId || user.id}
        />
      </label>
      <label>
        Notes:
        <br />
        <textarea
          name="notes"
          defaultValue={presentation?.notes ?? undefined}
        />
      </label>
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
> & { users: User[] }) => (
  <select {...props}>
    {users.map((u) => (
      <option key={u.id} value={u.id}>
        {u.firstname} {u.lastname}
      </option>
    ))}
  </select>
)
