import { LoaderFunction } from "remix"
import { authenticator } from "~/utils/google_auth.server"

export const loader: LoaderFunction = async ({ request }) => {
  // authenticator.isAuthenticated will handle redirect to /login if user is not authenticated
  await authenticator.isAuthenticated(request, {
    // @ts-ignore
    successRedirect: "/presentation",
    failureRedirect: "/login",
  })
}
