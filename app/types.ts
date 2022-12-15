import { ObjectId } from "mongodb"

export type PresentationUser = {
  _id: ObjectId
  firstname: string
  lastname: string
}

export type SerializedPresentationUser = {
  _id: string
} & Omit<PresentationUser, "_id">

export type TUserDoc = {
  _id: ObjectId
  createdAt: Date
  updatedAt: Date
  firstname: string
  lastname: string
  googleId: string
}

export type TPresentationDoc = {
  _id: ObjectId
  suggester?: PresentationUser
  presenter?: PresentationUser
  title: string
  notes: string | null
  parsedMarkdown: string | null
  dateScheduled?: Date | null
  votes: ObjectId[]
}

export type TSerializedUserDoc = {
  _id: string
  createdAt: string
  updatedAt: string
} & Omit<TUserDoc, "_id" | "createdAt" | "updatedAt">

export type TSerializedPresentationDoc = {
  _id: string
  suggester?: SerializedPresentationUser
  presenter?: SerializedPresentationUser
  dateScheduled?: string | null
  votes: string[]
} & Omit<
  TPresentationDoc,
  "_id" | "suggester" | "presenter" | "dateScheduled" | "votes"
>
