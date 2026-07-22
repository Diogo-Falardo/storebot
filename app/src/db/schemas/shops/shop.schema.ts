import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod"
import { table_shops } from "#/db/schema"

export const selectShopSchema = createSelectSchema(table_shops)
export const insertShopSchema = createInsertSchema(table_shops)

export const updateShopSchema = insertShopSchema.pick({
  name: true,
  description: true,
  currency: true
})
