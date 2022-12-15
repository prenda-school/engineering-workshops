import { MongoClient } from "mongodb"
import { TPresentationDoc, TUserDoc } from "~/types"

const { MONGODB_URI, MONGODB_DATABASE } = process.env
if (!MONGODB_DATABASE || !MONGODB_URI)
  throw new Error("MONGODB_URI or MONGODB_DATABASE is not defined")

const client = new MongoClient(MONGODB_URI)

const setUpDb = async () => {
  await client.connect()
  console.info("Connected to MongoDB")
  const db = client.db(process.env.MONGODB_DATABASE)
  return {
    Users: db.collection<TUserDoc>("users"),
    Presentations: db.collection<TPresentationDoc>("presentations"),
  }
}

export default setUpDb()
