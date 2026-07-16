import { pgTable, uuid, text, timestamp, bigint, varchar } from 'drizzle-orm/pg-core'

export const table_users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  telegramUserId: bigint("telegram_user_id", { mode: "bigint" }).notNull(),
  username: varchar({ length: 64 }),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  createdAt: timestamp("create_at", { withTimezone: true }).notNull().defaultNow(),
})

export const table_shops = pgTable("shops", {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid("user_Id").notNull().references(() => table_users.id, { onDelete: "cascade" }),
  name: varchar({ length: 64 }),
  description: text()
})
