### Data fetching

To load data in a Remix route module, you use a `loader` function.
This is simply an async function you export that returns a response (generally an object),
and is accessed on the component through the useLoaderData hook. Here's a quick example:

```typescript
import { LoaderFunction, useLoaderData } from "remix"
import type { User } from "@prisma/client"

import { db } from "~/utils/db.server"

/**
 * this gets moved to the server by remix compiler. A good mental model for this
 * could be:
 * app.get("/my/route", (req, res) => {
 *   const users = await db.user.findMany()
 *   res.json(users) // or res.send for other data types
 * })
 */
export const loader: LoaderFunction = async () => {
  const users = await db.user.findMany()
  return users
}

export default function Users() {
  const users = useLoaderData<User[]>()
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

In this simple example, we are fetching data from the database. But I hope that
is not deceptively simple. Note that we could have gotten our data from anywhere:
a REST api, GraphQL, even loaded it off a csv file. The point is, the possibilities
are numerous. And since we are doing this on the server, we don't have to worry
ourselves with credentials stored in the browser and all that related stuff.

### A note on data overfetching

One issue in API development is the concept of overfetching data, like getting
all the user demographics when you only needed the first name. This causes problems
with load speeds because you have to move all that data across the wire.

I hope you can see how this model solves this problem of overfetching because in
our `loader` we can resolve the data to exactly what our component needs.
Big win for Remix!!

### Gotcha

While it is true the `loader` function is moved to the server by the compiler,
the imports may not be because they don't have `"sideEffects": false` in the `package.json`
of their package. For example, you can't `import fs from "fs-extra"`, so the
solution is move it to a server file `fs-extras.server.ts` that just has `export * from "fs-extra"`,
and import that into your route. See more details [here](https://remix.run/docs/en/v1/pages/gotchas)
