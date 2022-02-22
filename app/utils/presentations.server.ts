import { AugmentedPresentation } from "~/types"
import { db } from "./db.server"

export const getPresentations = async (
  /**boolean to determine if we want the scheduled presentations or non-scheduled */
  scheduled: boolean = false
): Promise<AugmentedPresentation[]> => {
  const findScheduled = scheduled ? "isNot" : "is"
  const presentations = db.presentation.findMany({
    where: { schedule: { [findScheduled]: null } },
    include: {
      suggester: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      presenter: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      votes: {
        select: {
          userId: true,
        },
      },
      schedule: {
        select: {
          dateScheduled: true,
        },
      },
    },
  })
  return presentations
}

export const getPresentation = async (
  presentationId: string
): Promise<AugmentedPresentation | null> =>
  db.presentation.findUnique({
    where: { id: presentationId },
    include: {
      suggester: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      presenter: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
      votes: {
        select: {
          userId: true,
        },
      },
      schedule: {
        select: {
          dateScheduled: true,
        },
      },
    },
  })

export const createPresentation = async (
  title: string,
  suggesterId: string,
  presenterId: string,
  notes: string
) =>
  db.presentation.create({
    data: { title, suggesterId, presenterId, notes },
  })

export const updatePresentation = async (
  id: string,
  title: string,
  suggesterId: string,
  presenterId: string,
  notes: string
) =>
  db.presentation.update({
    where: { id },
    data: { title, suggesterId, presenterId, notes },
  })

export const deletePresentation = async (presentationId: string) =>
  db.presentation.delete({
    where: { id: presentationId },
  })
