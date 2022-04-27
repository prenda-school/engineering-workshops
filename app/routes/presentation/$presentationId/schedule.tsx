import { Schedule } from "@prisma/client"
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "remix"
import { Modal } from "~/components/modal"
import { ScheduleForm } from "~/components/schedule-form"
import { authenticator } from "~/utils/google_auth.server"
import {
  getScheduleForPresentation,
  upsertScheduleForPresentation,
} from "~/utils/schedules.server"

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const { presentationId } = params
  const date = form.get("date")

  if (typeof date !== "string") {
    return { errors: "Form not submitted correctly." }
  }

  if (presentationId === undefined) {
    throw new Error("missing route param `presentationId`")
  }

  const dateScheduled = new Date(date)
  await upsertScheduleForPresentation(presentationId, dateScheduled)
  return redirect(`/presentation/${presentationId}`)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const { presentationId } = params as { presentationId: string }
  const schedule = await getScheduleForPresentation(presentationId)
  return schedule
}

export default function SchedulePresentationModal() {
  const { presentationId } = useParams<{ presentationId: string }>()
  const schedule = useLoaderData<Schedule>()
  const navigate = useNavigate()
  const dismiss = () => navigate(`/presentation/${presentationId}`)
  const defaultDate = schedule?.dateScheduled
    ? new Date(schedule.dateScheduled).toISOString().split("T")[0]
    : undefined
  return (
    <Modal>
      <h3 style={{ textAlign: "center" }}>Schedule a date to present</h3>
      <ScheduleForm defaultDate={defaultDate} dismiss={dismiss} />
    </Modal>
  )
}
