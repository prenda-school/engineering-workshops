import { Users } from "./db.server"
import { createCookieSessionStorage, redirect } from "@remix-run/node"
import { OptionalUnlessRequiredId } from "mongodb"
import { TUserDoc } from "~/types"

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set!")
}

// Use the createCookieSessionStorage function from remix to create session functions
export const sessionStorage =
  // docs at https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage
  createCookieSessionStorage({
    cookie: {
      name: "engineering-workshops-session",
      secure: process.env.NODE_ENV === "production",
      secrets: [sessionSecret],
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  })

export const findOrCreateUser = async (
  googleId: string,
  firstname: string,
  lastname: string
): Promise<TUserDoc> => {
  const user = await Users.findOne({ googleId })
  if (user) return user

  const newUser = {
    googleId,
    firstname,
    lastname,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as OptionalUnlessRequiredId<TUserDoc>

  return await Users.create(newUser)
}

// Use the session functions to create a session
export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await sessionStorage.getSession()
  // set a key-value pair for the session cookie
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      // This header will tell the browser to set the cookie, which we can retrieve later
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  })
}

//--------helper functions to wrap database requests to get user/s -----------//
export async function getUsers(): Promise<TUserDoc[]> {
  return Users.find({})
}
