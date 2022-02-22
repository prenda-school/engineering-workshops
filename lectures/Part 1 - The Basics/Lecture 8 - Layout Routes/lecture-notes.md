## Layout routes

A layout route is a route that is nested inside its parent. For example, you could
have a sidebar that you want to remain constant, but the content of the main
area would change. The sidebar would be in the layout route, and main area would
change based on the route.

A good example can be seen at https://remix-routing-demo.netlify.app/invoices/5436564/activity/66565

Basically, to create a layout route you use the `<Outlet>` component in the route.
The route will become the layout, and the leafs will render in place of `<Outlet>`

```tsx
// at routes/presentation.tsx
import { Outlet } from "remix"

export default function Layout() {
  return (
    <div>
      <Header>I always want to show for each presentation</Header>
      {/** My leaves will replace the Outlet **/}
      <Outlet />
    </div>
  )
}
```

You may have already seen this used in `root.tsx`

### Gotchas

It is not a good practice to use `index.tsx` as a layout route. Essentially, your
route would have to be `layout/index/leaf` instead of `layout/leaf`. Instead create
`layout.tsx` as the layout route.

### Patterns

Directory pattern

```
routes
├── layout.tsx
└── layout
│   ├── leaf1.tsx
│   └── leaf2.tsx
```

matches:  
`/layout/leaf1`  
`/layout/leaf2`

Double underscore pattern (won't add segments to the url, use with caution)

```
routes
├── __layout.tsx
└── __layout
    └── leaf.tsx
```

matches:  
`/leaf1`  
`/leaf2`

### Example

You can even use a modal without javascript by means of a layout route.

```tsx
// in app/routes/presentation/$presentationId.tsx (our layout)
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
```

```tsx
// app/routes/$presentationId/schedule.tsx (our leaf)
import { Schedule } from "@prisma/client"
import {
  ActionFunction,
  LoaderFunction,
  redirect,
  useLoaderData,
  useNavigate,
  useParams,
} from "remix"
import { Modal } from "~/components/modal"
import { ScheduleForm } from "~/components/schedule-form"
import {
  getScheduleForPresentation,
  upsertScheduleForPresentation,
} from "~/utils/schedules.server"
import { requireUserId } from "~/utils/users.server"

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData()
  const { presentationId } = params
  const date = form.get("date")

  if (typeof date !== "string") {
    return { errors: "Form not submitted correctly." }
  }

  if (presentationId === undefined) {
    throw new Error("missing route param `presentationId`")
  }

  const dateScheduled = new Date(date)
  await upsertScheduleForPresentation(presentationId, dateScheduled)
  return redirect(`/presentation/${presentationId}`)
}

export const loader: LoaderFunction = async ({ request, params }) => {
  await requireUserId(request)
  const { presentationId } = params as { presentationId: string }
  const schedule = await getScheduleForPresentation(presentationId)
  return schedule
}

export default function SchedulePresentationModal() {
  const { presentationId } = useParams<{ presentationId: string }>()
  const schedule = useLoaderData<Schedule>()
  const navigate = useNavigate()
  const dismiss = () => navigate(`/presentation/${presentationId}`)
  const defaultDate = schedule?.dateScheduled
    ? new Date(schedule.dateScheduled).toISOString().split("T")[0]
    : undefined
  return (
    <Modal>
      <h3 style={{ textAlign: "center" }}>Schedule a date to present</h3>
      <ScheduleForm defaultDate={defaultDate} dismiss={dismiss} />
    </Modal>
  )
}
```
