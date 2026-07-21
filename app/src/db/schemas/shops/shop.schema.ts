import { createSelectSchema } from "drizzle-orm/zod"
import { table_shops } from "#/db/schema"

export const selectShopSchema = createSelectSchema(table_shops)


