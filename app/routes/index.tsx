import { LoaderFunction, redirect } from "remix"
import { requireUserId } from "~/utils/users.server"

export const loader: LoaderFunction = async ({ request }) => {
  // requireUserId will handle redirect to /login if user is not authenticated
  await requireUserId(request)
  return redirect("/presentation")
}
