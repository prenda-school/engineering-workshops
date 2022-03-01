import { PrismaClient, User } from "@prisma/client"
import { marked } from "marked"

const prisma = new PrismaClient()

// this function is called after `primsa generate` and `prisma migrate deploy`,
// so it should always work with the current migration
async function migrate() {
  const presentations = await prisma.presentation.findMany({
    where: { AND: [{ NOT: [{ notes: null }] }, { parsedMarkdown: null }] },
  })
  await prisma.$transaction(
    presentations.map((presentation) =>
      prisma.presentation.update({
        where: { id: presentation.id },
        // @ts-expect-error, presentation.notes is as string | null, but is not
        // null here because we queried for not null
        data: { parsedMarkdown: marked(presentation.notes) },
      })
    )
  )
}

migrate()
