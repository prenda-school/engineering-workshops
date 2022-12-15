import { useCatch } from "@remix-run/react"

export const loader = async () => {
  // any status code can be thrown, but tradition dicates you use a 4xx code.
  throw new Response("error message", { status: 400 })
}

export default function HappyPath() {
  return <div>I am the happy path</div>
}

export function CatchBoundary() {
  const caught = useCatch()

  return (
    <div className="container">
      <h1>I caught the known error</h1>
      <pre>{JSON.stringify(caught.data, null, 2)}</pre>
    </div>
  )
}
