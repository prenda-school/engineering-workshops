import { ObjectId } from "mongodb"
import { Presentations } from "./db.server"

export const likePresentation = async (
  userId: string,
  presentationId: string
) => {
  console.log({ userId, presentationId })
  await Presentations.updateOne(
    {
      _id: new ObjectId(presentationId),
    },
    {
      $addToSet: {
        votes: new ObjectId(userId),
      },
    }
  )
}

export const unlikePresentation = async (
  userId: string,
  presentationId: string
) => {
  await Presentations.updateOne(
    {
      _id: new ObjectId(presentationId),
    },
    {
      $pull: {
        votes: new ObjectId(userId),
      },
    }
  )
}
