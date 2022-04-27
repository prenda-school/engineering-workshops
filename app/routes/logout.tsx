import type { ActionFunction, LoaderFunction } from "remix"
import { redirect } from "remix"
import { authenticator } from "~/utils/google_auth.server"

export const action: ActionFunction = async ({ request }) => {
  await authenticator.logout(request, { redirectTo: "/login" })
}

export const loader: LoaderFunction = async () => {
  return redirect("/")
}
