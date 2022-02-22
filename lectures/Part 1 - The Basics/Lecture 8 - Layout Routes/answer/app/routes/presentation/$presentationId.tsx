import { LinksFunction, LoaderFunction, Outlet, useLoaderData } from "remix"
import { requireUserId } from "~/utils/users.server"
import stylesUrl from "~/styles/presentation-id.css"
import { getPresentation } from "~/utils/presentations.server"
import { AugmentedPresentation } from "~/types"
import { Presentation } from "~/components/presentation"

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }]
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  // we can do this safely because presentationId must be defined for this route
  const { presentationId } = params as { presentationId: string }

  return await getPresentation(presentationId)
}

export default function PresentationId() {
  const presentation = useLoaderData<AugmentedPresentation>()

  return (
    <div>
      <Presentation presentation={presentation} />
      <Outlet />
    </div>
  )
}
