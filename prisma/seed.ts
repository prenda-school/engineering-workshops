import { PrismaClient, User } from "@prisma/client"
import { faker } from "@faker-js/faker"
const prisma = new PrismaClient()

// this is a hashed version of "twixrox"
const passwordHash =
  "$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u"
const users = Array.from({ length: 5 }).map((u) => ({
  username: faker.internet.userName(),
  firstname: faker.name.firstName(),
  lastname: faker.name.lastName(),
  passwordHash,
}))

async function seed() {
  if (process.env.NODE_ENV === "production") return
  const newUsers = await Promise.all(
    users.map((data) => prisma.user.create({ data }))
  )

  await Promise.all(
    getPresentations(newUsers).map((data) =>
      prisma.presentation.create({ data })
    )
  )
}

seed()

function getPresentations(users: User[]) {
  const userIds = users.map((u) => u.id)
  const getRandomUserId = () =>
    userIds[Math.floor(Math.random() * (userIds.length - 1))]
  return Array.from({ length: 10 }).map(() => ({
    title: faker.company.bs(),
    suggesterId: getRandomUserId(),
    presenterId: getRandomUserId(),
    notes: faker.lorem.paragraph(),
  }))
}
