import {
  mysqlTable,
  mysqlSchema,
  AnyMySqlColumn,
  foreignKey,
  primaryKey,
  char,
  varchar,
  index,
  bigint,
  datetime,
  decimal,
  text,
  tinyint,
  mysqlEnum,
  unique,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const category = mysqlTable(
  "category",
  {
    id: char({ length: 36 }).notNull(),
    storeId: char("store_id", { length: 36 })
      .notNull()
      .references(() => stores.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    category: varchar({ length: 255 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: "category_id" })],
);

export const orders = mysqlTable(
  "orders",
  {
    id: char({ length: 36 }).notNull(),
    storeId: char("store_id", { length: 36 })
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    orderStatus: varchar("order_status", { length: 120 }).notNull(),
    orderIdentifier: varchar("order_identifier", { length: 255 }).notNull(),
    telegramUserId: bigint("telegram_user_id", { mode: "number" }).notNull(),
    orderDeliveryInstruction: varchar("order_delivery_instruction", {
      length: 1000,
    }).notNull(),
    orderCustomMessage: varchar("order_custom_message", { length: 2500 }),
    orderShippingMethod: char("order_shipping_method", { length: 36 })
      .notNull()
      .references(() => shippingMethods.id, { onDelete: "cascade" }),
    orderPaymentMethod: char("order_payment_method", { length: 36 })
      .notNull()
      .references(() => paymentMethods.id, { onDelete: "cascade" }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(now(3))`)
      .notNull(),
  },
  (table) => [
    index("idx_orders_store_id").on(table.storeId),
    index("idx_orders_status").on(table.orderStatus),
    index("idx_orders_shipping_method").on(table.orderShippingMethod),
    index("idx_orders_payment_method").on(table.orderPaymentMethod),
    primaryKey({ columns: [table.id], name: "orders_id" }),
  ],
);

export const paymentMethods = mysqlTable(
  "payment_methods",
  {
    id: char({ length: 36 }).notNull(),
    storeId: char("store_id", { length: 36 })
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    method: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index("idx_paymentMethods_store_id").on(table.storeId),
    primaryKey({ columns: [table.id], name: "payment_methods_id" }),
  ],
);

export const products = mysqlTable(
  "products",
  {
    id: char({ length: 36 }).notNull(),
    storeId: char("store_id", { length: 36 })
      .notNull()
      .references(() => stores.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    productName: varchar("product_name", { length: 120 }).notNull(),
    productPrice: decimal("product_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    productDesc: text("product_desc"),
    imageUrl: varchar("image_url", { length: 512 }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(now(3))`)
      .notNull(),
    visible: tinyint().default(1),
    categoryId: char("category_id", { length: 36 }),
  },
  (table) => [
    index("fk_category").on(table.categoryId),
    primaryKey({ columns: [table.id], name: "products_id" }),
  ],
);

export const productsOrders = mysqlTable(
  "products_orders",
  {
    id: char({ length: 36 }).notNull(),
    orderId: char("order_id", { length: 36 })
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: char("product_id", { length: 36 })
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("idx_orders_id").on(table.orderId),
    index("idx_orders_product_id").on(table.productId),
    primaryKey({ columns: [table.id], name: "products_orders_id" }),
  ],
);

export const shippingMethods = mysqlTable(
  "shipping_methods",
  {
    id: char({ length: 36 }).notNull(),
    storeId: char("store_id", { length: 36 })
      .notNull()
      .references(() => stores.id, { onDelete: "cascade" }),
    method: varchar({ length: 255 }).notNull(),
  },
  (table) => [
    index("idx_shippingMethods_store_id").on(table.storeId),
    primaryKey({ columns: [table.id], name: "shipping_methods_id" }),
  ],
);

export const stores = mysqlTable(
  "stores",
  {
    id: char({ length: 36 }).notNull(),
    userId: char("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    storeType: mysqlEnum("store_type", ["public", "private"])
      .default("public")
      .notNull(),
    storeName: varchar("store_name", { length: 120 }).notNull(),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(now(3))`)
      .notNull(),
    storeCurrency: varchar("store_currency", { length: 3 }).default("EUR"),
    storeExpireDate: datetime("store_expire_date", { fsp: 3 }),
  },
  (table) => [
    index("idx_stores_user_id").on(table.userId),
    primaryKey({ columns: [table.id], name: "stores_id" }),
  ],
);

export const users = mysqlTable(
  "users",
  {
    id: char({ length: 36 }).notNull(),
    telegramUserId: bigint("telegram_user_id", { mode: "number" }),
    createdAt: datetime("created_at", { mode: "string", fsp: 3 })
      .default(sql`(now(3))`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: "users_id" }),
    unique("uq_users_telegram_user_id").on(table.telegramUserId),
  ],
);
