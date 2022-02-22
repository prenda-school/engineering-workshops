import React from "react"
import { User } from "@prisma/client"

export const UserContext = React.createContext<User | undefined>(undefined)

export const UserContextProvider = ({
  user,
  children,
}: {
  user: User
  children: React.ReactNode
}) => <UserContext.Provider value={user}>{children}</UserContext.Provider>

export const useUserContext = () => {
  const user = React.useContext(UserContext)

  if (user === undefined) {
    throw new Error("useUserContext must be used in a UserContextProvider")
  }

  return user
}
