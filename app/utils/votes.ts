import { ObjectId } from "mongodb"
import MongoDB from "./db.server"

export const likePresentation = async (
  userId: string,
  presentationId: string
) => {
  const { Presentations } = await MongoDB

  Presentations.updateOne(
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
  const { Presentations } = await MongoDB
  Presentations.updateOne(
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
