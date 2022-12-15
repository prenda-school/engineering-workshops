import { marked } from "marked"
import { Filter, ObjectId, OptionalId, OptionalUnlessRequiredId } from "mongodb"
import { TPresentationDoc } from "~/types"
import MongoDB from "./db.server"

export const getPresentations = async (
  /**boolean to determine if we want the scheduled presentations or non-scheduled */
  scheduled: boolean = false
): Promise<TPresentationDoc[]> => {
  const { Presentations } = await MongoDB
  const query = (
    scheduled
      ? {
          $and: [
            { dateScheduled: { $exists: true } },
            { dateScheduled: { $ne: null } },
          ],
        }
      : { dateScheduled: null }
  ) as Filter<TPresentationDoc>
  return Presentations.find(query).toArray()
}

export const getPresentation = async (
  presentationId: string
): Promise<TPresentationDoc | null> => {
  const { Presentations } = await MongoDB
  return Presentations.findOne({ _id: new ObjectId(presentationId) })
}

export const createPresentation = async (
  title: string,
  suggesterId: string,
  presenterId: string | null,
  notes: string | null
): Promise<ObjectId> => {
  const { Presentations, Users } = await MongoDB
  const userIds = [suggesterId, presenterId].filter(Boolean) as string[]

  const users = await Users.find({
    _id: { $in: userIds.map((id: string) => new ObjectId(id)) },
  }).toArray()
  const suggester = users.find((u) => u._id.equals(new ObjectId(suggesterId)))
  const presenter =
    presenterId && users.find((u) => u._id.equals(new ObjectId(presenterId)))
  const presentationDoc = {
    title,
    ...(suggester
      ? {
          suggester: {
            _id: new ObjectId(suggesterId),
            firstname: suggester.firstname,
            lastname: suggester.lastname,
          },
        }
      : undefined),
    ...(presenter
      ? {
          presenter: {
            _id: new ObjectId(presenterId),
            firstname: presenter.firstname,
            lastname: presenter.lastname,
          },
        }
      : undefined),
    notes,
    parsedMarkdown: notes ? marked(notes) : null,
    votes: [] as ObjectId[],
  } as TPresentationDoc
  return (await Presentations.insertOne(presentationDoc)).insertedId
}

export const updatePresentation = async (
  _id: string,
  title: string,
  suggesterId: string,
  presenterId: string | null,
  notes: string | null
): Promise<string> => {
  const { Presentations } = await MongoDB
  await Presentations.updateOne(
    { _id: new ObjectId(_id) },
    {
      $set: {
        title,
        suggesterId,
        presenterId,
        notes,
        parsedMarkdown: notes ? marked(notes) : null,
      },
    }
  )
  return _id
}

export const deletePresentation = async (
  presentationId: string
): Promise<string> => {
  const { Presentations } = await MongoDB
  await Presentations.deleteOne({ _id: new ObjectId(presentationId) })
  return presentationId
}
