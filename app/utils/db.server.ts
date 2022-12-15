import mongoose, { Mongoose } from "mongoose"
import { TUserDoc, TPresentationDoc, TPresentationUser } from "~/types"

const { MONGODB_URI } = process.env

let db: Mongoose

connect()

async function connect() {
  if (db) return db

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI must be set!")
  }
  if (process.env.NODE_ENV === "production") {
    db = await mongoose.connect(MONGODB_URI, {
      dbName: "engineering-workshops",
    })
  } else {
    // in development, need to store the db connection in a global variable
    // this is because the dev server purges the require cache on every request
    // and will cause multiple connections to be made
    // @ts-expect-error
    if (!global.__db) {
      // @ts-expect-error
      global.__db = await mongoose.connect(MONGODB_URI, {
        dbName: "engineering-workshops",
      })
    }
    // @ts-expect-error
    db = global.__db
  }
  return db
}

const userSchema = new mongoose.Schema<TUserDoc>({
  googleId: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
})

const Users =
  mongoose.models["User"] ?? mongoose.model("User", userSchema, "users")

const presentationUserSchema = new mongoose.Schema<TPresentationUser>({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
})

const presentationSchema = new mongoose.Schema<TPresentationDoc>({
  title: { type: String, required: true },
  notes: { type: String, required: false },
  parsedMarkdown: { type: String, required: false },
  suggester: {
    type: presentationUserSchema,
    required: false,
  },
  presenter: {
    type: presentationUserSchema,
    required: false,
  },
  dateScheduled: { type: Date, required: false },
  votes: [{ type: mongoose.Schema.Types.ObjectId, required: true }],
})

const Presentations =
  mongoose.models["Presentation"] ??
  mongoose.model("Presentation", presentationSchema, "presentations")

export { Users, Presentations }
