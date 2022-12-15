import { Authenticator } from "remix-auth"
import { GoogleStrategy } from "remix-auth-google"
import { TUserDoc } from "~/types"
import { findOrCreateUser, sessionStorage } from "./users.server"

export const authenticator = new Authenticator<TUserDoc>(sessionStorage)

const host =
  process.env.NODE_ENV === "production"
    ? "https://engineering-workshops.vercel.app"
    : "http://localhost:3000"

const { GOOGLE_CLIENT, GOOGLE_SECRET } = process.env

if (GOOGLE_CLIENT === undefined || GOOGLE_SECRET === undefined) {
  throw new Error("The GOOGLE_CLIENT and/or GOOGLE_SECRET have not been set")
}

const googleStrategy = new GoogleStrategy(
  {
    clientID: GOOGLE_CLIENT,
    clientSecret: GOOGLE_SECRET,
    callbackURL: `${host}/auth/google/callback`,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    // Get the user data from your DB or API using the tokens and profile
    const fromPrenda = profile.emails.some(
      ({ value }) =>
        value.toLowerCase().endsWith("prenda.co") ||
        value.toLowerCase().endsWith("prenda.com")
    )
    if (!fromPrenda) {
      throw new Error("invalid domain")
    }
    const {
      name: { familyName: lastname, givenName: firstname },
      id: googleId,
    } = profile
    return findOrCreateUser(googleId, firstname, lastname)
  }
)

authenticator.use(googleStrategy)
