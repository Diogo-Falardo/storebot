import { pgTable, uuid, text, timestamp, bigint, varchar, pgEnum, boolean, integer, uniqueIndex } from 'drizzle-orm/pg-core'

export const table_users = pgTable("users", {
  id: uuid().defaultRandom().primaryKey(),
  telegramUserId: bigint("telegram_user_id", { mode: "bigint" }).notNull(),
  username: varchar({ length: 64 }),
  lastLogin: timestamp("last_login", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("users_telegram_user_id_uidx").on(t.telegramUserId)
])

export const currencyEnum = pgEnum("currency", [
  "USD",
  "EUR",
  "RUB",
  "UAH",
  "GBP",
  "BRL",
  "TRY",
  "INR",
  "IDR",
  "KZT",
  "PLN",
  "ARS",
])
export const table_shops = pgTable("shops", {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => table_users.id, { onDelete: "cascade" }).unique(),
  name: varchar({ length: 64 }),
  description: text(),
  currency: currencyEnum().notNull().default("EUR")
})


export const roleEnum = pgEnum("role", ["owner", "client"])
export const table_clients = pgTable("shop_clients", {
  id: uuid().defaultRandom().primaryKey(),
  shopId: uuid("shop_id").notNull().references(() => table_shops.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull().references(() => table_users.id, { onDelete: "cascade" }),
  role: roleEnum().default("client").notNull(),
  banned: boolean().default(false).notNull(),
  timeoutUntil: timestamp("timeout_until", { withTimezone: true }),
  memberSince: timestamp("member_since", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  uniqueIndex("shop_clients_shop_user_uindx").on(t.shopId, t.userId)
])

export const table_shippingMethods = pgTable("shop_shipping_methods", {
  id: uuid().defaultRandom().primaryKey(),
  shopId: uuid("shop_id").notNull().references(() => table_shops.id, { onDelete: "cascade" }),
  method: text().notNull()
})

export const table_paymentMethods = pgTable("shop_payment_methods", {
  id: uuid().defaultRandom().primaryKey(),
  shopId: uuid("shop_id").notNull().references(() => table_shops.id, { onDelete: "cascade" }),
  method: text().notNull()
})

export const table_products = pgTable("shop_products", {
  id: uuid().defaultRandom().primaryKey(),
  shopId: uuid("shop_id").notNull().references(() => table_shops.id, { onDelete: "cascade" }),
  name: text().notNull(),
  price: integer().notNull(),
  description: text(),
  images: text(),
  hidden: boolean().default(false).notNull(),
  outOfStock: boolean("out_of_stock").default(false).notNull(),
})
