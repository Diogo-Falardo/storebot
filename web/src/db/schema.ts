import { table } from 'console'
import {
  AnyMySqlColumn,
  bigint,
  char,
  datetime,
  decimal,
  index,
  foreignKey,
  tinyint,
  unique,
  varchar,
  text,
  primaryKey,
  mysqlSchema,
  mysqlTable,
  mysqlEnum,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

export const category = mysqlTable(
  'category',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    shopId: char('shop_id', { length: 36 })
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    category: varchar({ length: 255 }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.id], name: 'category_id' })],
)

export const products = mysqlTable(
  'products',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    shopId: char('shop_id', { length: 36 })
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .references(() => shops.id, { onDelete: 'cascade' }),
    productName: varchar('product_name', { length: 120 }).notNull(),
    productPrice: decimal('product_price', {
      precision: 10,
      scale: 2,
    }).notNull(),
    productDesc: text('product_desc'),
    imageUrl: varchar('image_url', { length: 512 }),
    createdAt: datetime('created_at', { mode: 'string', fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    visible: tinyint().default(1),
    categoryId: char('category_id', { length: 36 }),
  },
  (table) => [
    index('fk_category').on(table.categoryId),
    primaryKey({ columns: [table.id], name: 'products_id' }),
  ],
)

export const shops = mysqlTable(
  'shops',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    userId: char('user_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    shopType: mysqlEnum('shop_type', ['public', 'private'])
      .default('public')
      .notNull(),
    shopName: varchar('shop_name', { length: 120 }).notNull(),
    createdAt: datetime('created_at', { mode: 'string', fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    shopCurrency: varchar('ShopCurrency', { length: 3 }).default('EUR'),
  },
  (table) => [
    index('idx_shops_user_id').on(table.userId),
    primaryKey({ columns: [table.id], name: 'shops_id' }),
  ],
)

export const users = mysqlTable(
  'users',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    telegramUserId: bigint('telegram_user_id', { mode: 'number' }),
    createdAt: datetime('created_at', { mode: 'string', fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'users_id' }),
    unique('uq_users_telegram_user_id').on(table.telegramUserId),
  ],
)

export const shippingMethods = mysqlTable(
  'shipping_methods',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    shopId: char('shop_id', { length: 36 })
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade' }),
    method: varchar('method', { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'shippingMethods_id' }),
    index('idx_shippingMethods_shop_id').on(table.shopId),
  ],
)

export const paymentMethods = mysqlTable(
  'payment_methods',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    shopId: char('shop_id', { length: 36 })
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade' }),
    method: varchar('method', { length: 255 }).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'paymentMethods_id' }),
    index('idx_paymentMethods_shop_id').on(table.shopId),
  ],
)

export const orders = mysqlTable(
  'orders',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    shopId: char('shop_id', { length: 36 })
      .notNull()
      .references(() => shops.id, { onDelete: 'cascade' }),
    orderStatus: varchar('order_status', { length: 120 }).notNull(),
    orderCustomMessage: varchar('order_custom_message', { length: 2500 }),
    orderShippingMethod: char('order_shipping_method', { length: 36 })
      .notNull()
      .references(() => shippingMethods.id, { onDelete: 'cascade' }),
    orderPaymentMethod: char('order_payment_method', { length: 36 })
      .notNull()
      .references(() => paymentMethods.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'orders_id' }),
    index('idx_orders_shop_id').on(table.shopId),
    index('idx_orders_status').on(table.orderStatus),
    index('idx_orders_shipping_method').on(table.orderShippingMethod),
    index('idx_orders_payment_method').on(table.orderPaymentMethod),
  ],
)

export const productsOrders = mysqlTable(
  'products_orders',
  {
    id: char({ length: 36 })
      .default(sql`(uuid())`)
      .notNull(),
    orderId: char('order_id', { length: 36 })
      .notNull()
      .references(() => orders.id, { onDelete: 'cascade' }),
    productId: char('product_id', { length: 36 })
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.id], name: 'productsOrders_id' }),
    index('idx_orders_id').on(table.orderId),
    index('idx_orders_product_id').on(table.productId),
  ],
)
