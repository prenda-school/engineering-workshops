import { db } from "./db.server"

export const likePresentation = async (
  userId: string,
  presentationId: string
) =>
  db.votes.upsert({
    where: { userId_presentationId: { presentationId, userId } },
    update: {},
    create: { presentationId, userId },
  })
export const unlikePresentation = async (
  userId: string,
  presentationId: string
) =>
  db.votes.delete({
    where: { userId_presentationId: { userId, presentationId } },
  })
