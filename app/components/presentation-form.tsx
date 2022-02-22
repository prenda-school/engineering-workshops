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
  return (
    <Form method="post">
      <input
        type="hidden"
        name="presentationId"
        value={presentation?.id || "new"}
      />
      <label>
        Topic:
        <br />
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={presentation?.title}
        />
      </label>
      <label>
        Suggester:
        <br />
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
          type="submit"
          className="button button-dark"
          style={{ width: 130 }}
        >
          Submit
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
