import { db } from "./db.server"

export const getScheduleForPresentation = async (presentationId: string) =>
  db.schedule.findUnique({
    where: { presentationId },
  })

export const upsertScheduleForPresentation = async (
  presentationId: string,
  dateScheduled: Date
) =>
  db.schedule.upsert({
    where: { presentationId },
    update: { dateScheduled },
    create: { presentationId, dateScheduled },
  })
