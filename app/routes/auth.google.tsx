import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node"
import { authenticator } from "~/utils/google_auth.server"

export const loader: LoaderFunction = () => redirect("/login")

export const action: ActionFunction = ({ request }) =>
  authenticator.authenticate("google", request)
