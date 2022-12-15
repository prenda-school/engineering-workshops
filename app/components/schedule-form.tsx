import { Form, useTransition } from "@remix-run/react"
import { Spinner } from "./spinner"

export const ScheduleForm = ({
  defaultDate,
  dismiss,
}: {
  defaultDate: string | undefined
  dismiss: () => void
}) => {
  const transition = useTransition()
  const busy = transition.state !== "idle"
  return (
    <Form method="post">
      <input type="date" name="date" defaultValue={defaultDate} />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="button button-dark" type="submit">
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
              scheduling
            </span>
          ) : (
            "schedule"
          )}
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
