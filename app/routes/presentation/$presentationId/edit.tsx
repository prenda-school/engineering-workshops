import { User } from "@prisma/client"
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from "remix"
import { Modal } from "~/components/modal"
import PresentationForm from "~/components/presentation-form"
import { AugmentedPresentation } from "~/types"

import {
  getPresentation,
  updatePresentation,
} from "~/utils/presentations.server"
import { getUser, getUsers } from "~/utils/users.server"

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const id = form.get("presentationId")
  const title = form.get("title")
  const suggesterId = form.get("suggester")
  const presenterId = form.get("presenter")
  const notes = form.get("notes")
  if (
    typeof id !== "string" ||
    typeof title !== "string" ||
    typeof suggesterId !== "string" ||
    typeof presenterId !== "string" ||
    typeof notes !== "string"
  ) {
    return { formError: `Form not submitted correctly.` }
  }
  const presentation = await updatePresentation(
    id,
    title,
    suggesterId,
    presenterId,
    notes
  )

  return redirect(`/presentation/${presentation.id}`)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const user = await getUser(request, true)
  const users = await getUsers()
  const { presentationId } = params
  if (presentationId !== undefined) {
    const presentation: AugmentedPresentation | null = await getPresentation(
      presentationId
    )
    return { user, users, presentation }
  }
  redirect("/presentation")
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
