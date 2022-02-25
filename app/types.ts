import { Presentation } from "@prisma/client"

export type AugmentedPresentation = Presentation & {
  suggester: {
    id: string
    firstname: string
    lastname: string
  } | null
  presenter: {
    id: string
    firstname: string
    lastname: string
  } | null
  votes: {
    userId: string
  }[]
  schedule: {
    dateScheduled: Date
  } | null
  /** html version of notes */
  parsedMarkdown: string
}
