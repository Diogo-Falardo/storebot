import { createServerFn } from "@tanstack/react-start"
import { createShop } from "./shops.server"

export const sfCreateShop = createServerFn({ method: "POST" }).validator((userId: string) => userId).handler(async ({ data }) => await createShop(data))
