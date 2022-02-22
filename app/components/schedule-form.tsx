import { Form, useTransition } from "remix"
import { Spinner } from "./spinner"

export const ScheduleForm = ({
  defaultDate,
  dismiss,
}: {
  defaultDate: string | undefined
  dismiss: () => void
}) => {
  return (
    <Form method="post">
      <input type="date" name="date" defaultValue={defaultDate} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="button button-dark" type="submit">
          schedule
        </button>
        <button
          type="button"
          onClick={dismiss}
          className="button button-light"
          style={{ marginTop: 0 }}
        >
          Cancel
        </button>
      </div>
    </Form>
  )
}
