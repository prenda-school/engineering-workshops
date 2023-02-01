import { ObjectId } from "mongodb"
import { Presentations } from "./db.server"

export const getScheduleForPresentation = async (
  presentationId: string
): Promise<Date | null> => {
  const presentation = await Presentations.findOne({
    _id: new ObjectId(presentationId),
  })
  return presentation?.dateScheduled ?? null
}

export const upsertScheduleForPresentation = async (
  presentationId: string,
  dateScheduled: Date
) => {
  await Presentations.updateOne(
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
