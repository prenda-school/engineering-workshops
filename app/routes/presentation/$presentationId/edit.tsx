import { User } from "@prisma/client"
import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from "remix"
import { Modal } from "~/components/modal"
import PresentationForm from "~/components/presentation-form"
import { AugmentedPresentation } from "~/types"
import styleUrl from "~/styles/presentation-form.css"
import {
  getPresentation,
  updatePresentation,
} from "~/utils/presentations.server"
import { getUsers } from "~/utils/users.server"
import { authenticator } from "~/utils/google_auth.server"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styleUrl },
]

export const action: ActionFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const form = await request.formData()
  const presentationId = form.get("presentationId")
  if (typeof presentationId !== "string") {
    return { formError: "form submitted without a presentationId" }
  }
  const title = form.get("title")
  const suggester = form.get("suggester")
  const presenter = form.get("presenter")
  const notes = form.get("notes")
  if (typeof title !== "string" || typeof suggester !== "string") {
    return { formError: "Topic and Suggester are required fields." }
  }
  const presentation = await updatePresentation(
    presentationId,
    title,
    suggester,
    typeof presenter === "string" ? presenter : null,
    typeof notes === "string" ? notes : null
  )

  return redirect(`/presentation/${presentation.id}`)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const users = await getUsers()
  const { presentationId } = params
  if (presentationId !== undefined) {
    const presentation: AugmentedPresentation | null = await getPresentation(
      presentationId
    )
    return { user, users, presentation }
  }
  return redirect("/presentation")
}

export default function EditPresentation() {
  const { user, users, presentation } = useLoaderData<{
    user: User
    users: User[]
    presentation: AugmentedPresentation
  }>()
  const navigate = useNavigate()
  const dismiss = () => navigate(`/presentation/${presentation.id}`)
  return (
    <Modal>
      <PresentationForm
        presentation={presentation}
        user={user}
        users={users}
        onDismiss={dismiss}
      />
    </Modal>
  )
}
