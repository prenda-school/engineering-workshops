import {
  Link,
  LinksFunction,
  LoaderFunction,
  Outlet,
  useCatch,
  useLoaderData,
} from "remix"
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

  const presentation = await getPresentation(presentationId)
  if (presentation === null) {
    throw new Response(
      `Could not find a presentation for id ${presentationId}`,
      {
        status: 400,
      }
    )
  }

  return presentation
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

export function CatchBoundary() {
  const caught = useCatch()

  if (caught.status === 400) {
    return (
      <div className="container error-container">
        <h2>{caught.data}</h2>
        <Link to="/presentation">See all presentations</Link>
      </div>
    )
  }
  return <div className="container error-container"></div>
}
