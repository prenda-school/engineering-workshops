## Pending UI

A good video on the `useTransition` hook and its use can be viewed at https://www.youtube.com/watch?v=y4VLIFjFq8k

Pending UI is how to convey to a user that the computer is "working" on a request.
This is done natively by the browser with a spinner around the favicon. However,
a better user experience can be had through javascript. And Remix provides a
custom hook, `useTransition` to make this a simple task.

You can view the [docs](https://remix.run/docs/en/v1/api/remix#usetransition)
for details on this hook, but for our purposes we are only going to check the `state` property.
It can be one of three: `idle` -> `submitting` -> `loading`. And we are going to
show a pending UI if our `state !== "idle"`.

```tsx
// in app/components/presentation-form.tsx
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
  // we create a loading flag by checking the transition state.
  const busy = transition.state !== "idle"
  return (
    {/* Note that <Form> must be used instead of the native <form> */}
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
          // Now we can use the flag to create a pending UI
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
```
