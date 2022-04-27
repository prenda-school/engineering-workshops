import { ActionFunction, LoaderFunction } from "remix"
import { authenticator } from "~/utils/google_auth.server"

export const loader: LoaderFunction = ({ request }) =>
  authenticator.authenticate("google", request, {
    successRedirect: "/presentation",
    failureRedirect: "/login",
  })
