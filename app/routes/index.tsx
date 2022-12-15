import { LoaderFunction } from "@remix-run/node"
import { authenticator } from "~/utils/google_auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  // authenticator.isAuthenticated will handle redirect to /login if user is not authenticated
  await authenticator.isAuthenticated(request, {
    successRedirect: "/presentation",
    failureRedirect: "/login",
  })
}
