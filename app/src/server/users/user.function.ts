import { createServerFn } from "@tanstack/react-start";
import { verifyAuthenticationToken } from "../authentication";
import { fetchUser } from "./user.server";

export const fetchCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const userId = await verifyAuthenticationToken()
  return fetchUser(userId)
})
