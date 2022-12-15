import { ObjectId } from "mongodb"
import MongoDB from "./db.server"

export const getScheduleForPresentation = async (
  presentationId: string
): Promise<Date | null> => {
  const { Presentations } = await MongoDB
  const presentation = await Presentations.findOne({
    _id: new ObjectId(presentationId),
  })
  return presentation?.dateScheduled ?? null
}

export const upsertScheduleForPresentation = async (
  presentationId: string,
  dateScheduled: Date
) => {
  const { Presentations } = await MongoDB
  Presentations.updateOne(
    {
      _id: new ObjectId(presentationId),
    },
    {
      $set: {
        dateScheduled,
      },
    }
  )
}
