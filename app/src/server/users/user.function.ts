import { createServerFn } from "@tanstack/react-start";
import { fetchUser } from "./user.server";

export const useFetchUser = createServerFn({ method: "GET" }).validator((userId: string) => userId).handler(async ({ data }) => await fetchUser(data))
