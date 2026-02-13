import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  index,
  foreignKey,
  primaryKey,
  char,
  datetime,
  varchar,
  decimal,
  text,
  mysqlEnum,
  unique,
  bigint,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const linkTokens = mysqlTable(
  "link_tokens",
  {
    tokenHash: char("token_hash", { length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: datetime("expires_at", { mode: "string", fsp: 3 }).notNull(),
    usedAt: datetime("used_at", { mode: "string", fsp: 3 }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
  },
  (table) => [
    index("idx_link_tokens_user_id").on(table.userId),
    primaryKey({ columns: [table.tokenHash], name: "link_tokens_token_hash" }),
  ],
);

export const products = mysqlTable(
  "products",
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull()
      .primaryKey(),
    shopId: char("shop_id", { length: 36 })
      .notNull()
      .references(() => shops.id, { onDelete: "cascade", onUpdate: "cascade" }),
    productName: varchar("product_name", { length: 120 }).notNull(),
    productPrice: decimal("product_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    productDesc: text("product_desc"),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "products_id" })],
);

export const shops = mysqlTable(
  "shops",
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    shopType: mysqlEnum("shop_type", ["public", "private", "telegram_only"])
      .default("public")
      .notNull(),
    shopName: varchar("shop_name", { length: 120 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
  },
  (table) => [
    index("idx_shops_user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "shops_id" }),
  ],
);

export const users = mysqlTable(
  "users",
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    clerkUserId: varchar("clerk_user_id", { length: 191 }),
    telegramUserId: bigint("telegram_user_id", { mode: "number" }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "users_id" }),
    unique("uq_users_clerk_user_id").on(table.clerkUserId),
    unique("uq_users_telegram_user_id").on(table.telegramUserId),
  ],
);
