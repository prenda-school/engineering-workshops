import { db } from "./db.server"
import bcrypt from "bcrypt"
import { createCookieSessionStorage, redirect } from "@remix-run/server-runtime"

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set!")
}

// Use the createCookieSessionStorage function from remix to create session functions
const { getSession, commitSession, destroySession } =
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

// basic login function
export const login = async (username: string, password: string) => {
  const user = await db.user.findUnique({ where: { username } })
  if (!user) {
    return null
  }
  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) {
    return null
  }
  return user
}

// destroys session cookie by sending correct cookie to browser
export async function logout(request: Request) {
  const userSession = await getUserSession(request)
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(userSession),
    },
  })
}

export const register = async (
  username: string,
  firstname: string,
  lastname: string,
  password: string
) => {
  const passwordHash = await bcrypt.hash(password, 12)
  return db.user.create({
    data: { username, firstname, lastname, passwordHash },
  })
}

// Use the session functions to create a session
export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await getSession()
  // set a key-value pair for the session cookie
  session.set("userId", userId)
  return redirect(redirectTo, {
    headers: {
      // This header will tell the browser to set the cookie, which we can retrieve later
      "Set-Cookie": await commitSession(session),
    },
  })
}

export function getUserSession(request: Request) {
  // this pulls the cookie out of headers and uses it to find a session. If no
  // session if found, it will return an empty session wherein session.get(*) === undefined
  return getSession(request.headers.get("Cookie"))
}

export async function getUserId(request: Request) {
  // if the session exists, this will have a key `userId` from the createUserSession
  // that should have been called previously. Otherwise, it will be an empty session.
  const userSession = await getUserSession(request)

  const userId = userSession.get("userId")
  if (!userId || typeof userId !== "string") return null
  return userId
}

/**
 * Useful for authenticated routes. Use in the loader/action functions like
 * export const loader = async ({request}) => {
 *   await requireUserId(request)
 *   ...continue with authenticated user
 * }
 *
 * Note that it automatically redirects to login when not authenticated
 */
export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request)
  if (userId === null) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
    throw redirect(`/login?${searchParams}`)
  }
  return userId
}

//--------helper functions to wrap database requests to get user/s -----------//

export async function getUser(
  /** the fetch request */
  request: Request,
  /** can pass this boolean to avoid calling `await requireUserId` in your action/loaders */
  required = false
) {
  const userId = required
    ? await requireUserId(request)
    : await getUserId(request)
  if (typeof userId !== "string") {
    return null
  }
  try {
    const user = await db.user.findUnique({ where: { id: userId } })
    return user
  } catch {
    throw logout(request)
  }
}

export async function getUsers() {
  return db.user.findMany()
}

export async function checkUserNameAvailable(username: string) {
  const user = db.user.findFirst({
    where: { username },
  })
  return !user
}
