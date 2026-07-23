import type { z } from "zod"
import type { createUserSchema, insertUserSchema, outputUserSchema, selectUserSchema } from "./user.schema"

export type InsertUser = z.infer<typeof insertUserSchema>
export type SelectUser = z.infer<typeof selectUserSchema>


export type OutputUser = z.infer<typeof outputUserSchema>
export type CreateUser = z.infer<typeof createUserSchema>
