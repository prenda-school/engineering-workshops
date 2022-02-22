import { User } from "@prisma/client"
import {
  ActionFunction,
  LinksFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from "remix"
import PresentationForm from "~/components/presentation-form"
import stylesUrl from "~/styles/presentation-id.css"
import { createPresentation } from "~/utils/presentations.server"
import { getUsers } from "~/utils/users.server"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData()
  const title = form.get("title")
  const suggester = form.get("suggester")
  const presenter = form.get("presenter")
  const notes = form.get("notes")
  if (
    typeof title !== "string" ||
    typeof suggester !== "string" ||
    typeof presenter !== "string" ||
    typeof notes !== "string"
  ) {
    return { formError: `Form not submitted correctly.` }
  }
  const presentation = await createPresentation(
    title,
    suggester,
    presenter,
    notes
  )

  return redirect(`/presentation/${presentation.id}`)
}

export const loader: LoaderFunction = async () => {
  const users = await getUsers()
  return { users }
}

const NewPresentation = () => {
  const { users } = useLoaderData<{ users: User[] }>()
  const navigate = useNavigate()
  const dismiss = () => navigate("/presentation")
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Workshop Presentation</h1>
      <PresentationForm user={users[0]} users={users} onDismiss={dismiss} />
    </div>
  )
}

export default NewPresentation
