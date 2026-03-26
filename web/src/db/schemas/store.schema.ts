import { z } from 'zod'

export const enum_STORE_TYPE = z.enum(['public', 'private'])

// db store schema
export const schema_STORE = z.object({
  storeId: z.uuid(),
  userId: z.uuid(),
  storeType: enum_STORE_TYPE,
  storeName: z
    .string()
    .min(1, { message: 'store name is required' })
    .max(120, { message: 'store name max characters 120' }),
  storeCurrency: z.string(),
  storeExpireDate: z.date().nullable(),
  storeCreatedAt: z.date(),
})
export type type_schema_STORE = z.infer<typeof schema_STORE>

/**
 * public store -> INFO
 *
 * created with the intention of retrieving store info that is
 * not sensitive
 */
export const schema_PUBLIC_STORE = z.object({
  storeId: z.uuid(),
  storeName: z.string(),
  storeCurrency: z.string(),
})
export type type_schema_PUBLIC_STORE = z.infer<typeof schema_PUBLIC_STORE>

// create a store
export const create_STORE = schema_STORE.pick({
  storeName: true,
  storeType: true,
  storeCurrency: true,
})
export type type_create_STORE = z.infer<typeof create_STORE>

// update a store
export const patch_STORE = schema_STORE
  .pick({
    storeName: true,
    storeType: true,
    storeCurrency: true,
  })
  .partial()
export type type_patch_STORE = z.infer<typeof patch_STORE>

// used to fetch store (products) categorys
export const select_STORE_CATEGORY = z.object({
  categoryId: z.uuid(),
  category: z.string(),
})
export type type_select_STORE_CATEGORY = z.infer<typeof select_STORE_CATEGORY>

/**
 * used to fetch:
 *
 * store shipping & payment methods
 */
export const select_STORE_METHODS = z.object({
  methodId: z.string(),
  method: z.string(),
})
export type type_select_STORE_METHODS = z.infer<typeof select_STORE_METHODS>
