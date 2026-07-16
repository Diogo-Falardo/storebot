import { createInsertSchema, createSelectSchema } from "drizzle-orm/zod"
import { table_users } from "../../schema"

export const selectUserSchema = createSelectSchema(table_users)

export const insertUserSchema = createInsertSchema(table_users, {
  telegramUserId: (schema) =>
    schema.positive("telegramUserId must be a positive bigint"),
  username: (schema) =>
    schema.min(2, "username is too short!").max(64, "username is too long!"),
})

export const createUserInputSchema = insertUserSchema.pick({
  telegramUserId: true,
  username: true,
})
