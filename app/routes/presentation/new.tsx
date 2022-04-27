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
import { getUsers } from "~/utils/users.server"
import stylesUrl from "~/styles/presentation-id.css"
import formStylesUrl from "~/styles/presentation-form.css"

import { createPresentation } from "~/utils/presentations.server"
import { authenticator } from "~/utils/google_auth.server"

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
    { rel: "stylesheet", href: formStylesUrl },
  ]
}

export const action: ActionFunction = async ({ request }) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const form = await request.formData()
  const title = form.get("title")
  const suggester = form.get("suggester")
  const presenter = form.get("presenter")
  const notes = form.get("notes")
  if (typeof title !== "string" || typeof suggester !== "string") {
    return { formError: "Topic and Suggester are required fields." }
  }
  const presentation = await createPresentation(
    title,
    suggester,
    typeof presenter === "string" ? presenter : null,
    typeof notes === "string" ? notes : null
  )

  return redirect(`/presentation/${presentation.id}`)
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  const users = await getUsers()
  return { user, users }
}

const NewPresentation = () => {
  const { user, users } = useLoaderData<{ user: User; users: User[] }>()
  const navigate = useNavigate()
  const dismiss = () => navigate("/presentation")
  return (
    <div className="container">
      <h1 style={{ textAlign: "center" }}>Workshop Presentation</h1>
      <PresentationForm user={user} users={users} onDismiss={dismiss} />
    </div>
  )
}

export default NewPresentation
