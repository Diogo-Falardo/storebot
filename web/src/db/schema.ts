import {
  mysqlTable,
  mysqlSchema,
  tinyint,
  AnyMySqlColumn,
  foreignKey,
  primaryKey,
  char,
  varchar,
  index,
  decimal,
  text,
  datetime,
  mysqlEnum,
  unique,
  bigint,
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
