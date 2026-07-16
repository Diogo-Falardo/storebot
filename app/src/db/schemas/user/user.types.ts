import type { z } from "zod"
import type { createUserInputSchema, insertUserSchema, selectUserSchema } from "./user.schema"

export type InsertUser = z.infer<typeof insertUserSchema>
export type SelectUser = z.infer<typeof selectUserSchema>

export type CreateUser = z.infer<typeof createUserInputSchema>
