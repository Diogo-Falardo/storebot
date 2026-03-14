import { z } from 'zod'

export const store_TYPE_ENUM = z.enum(['public', 'private'], {
  message: 'Please select a store type',
})

export const store_CURRENCY_ENUM = z.enum(['USD', 'EUR', 'GBP', 'CHF'], {
  message: 'Please select a currency',
})

/**
 * VISUALIZE store
 *
 * Supposed to use when returning a store from the server
 */
export const VISUALIZE_store_SCHEMA = z.object({
  userId: z.uuid(),
  id: z.uuid(),
  storeName: z.string(),
  storeType: store_TYPE_ENUM,
  storeCurrency: store_CURRENCY_ENUM,
})
/**
 * this type shouldnt be used to CREATE, UPDATE or anything related to it
 * should only be used to PROMISE<> the desired returning type
 */
export type store_SCHEMA = z.infer<typeof VISUALIZE_store_SCHEMA>

/**
 * CREATE store
 *
 * Everything is required...
 *
 * storeType and storeCurrency should be defaulted to "public" and "EUR"
 */
export const CREATE_store_SCHEMA = z.object({
  storeType: store_TYPE_ENUM,
  storeName: z
    .string()
    .min(3, { message: 'store name must be at least 3 characters.' })
    .max(50, { message: 'store name max 50 characters.' }),
  storeCurrency: store_CURRENCY_ENUM,
})
export type DTO_CREATE_store = z.infer<typeof CREATE_store_SCHEMA>

/**
 * VISUALIZE SHIPPING METHOD
 * VISUALIZE PAYMENT METHOD
 */
export const VISUALIZE_METHOD_SCHEMA = z.object({
  id: z.uuid(),
  method: z.string(),
})

/**
 * CREATE SHIPPING METHOD
 *
 * only requires a method: that must be a string of max 255
 */
export const CREATE_SHIPPING_METHOD_SCHEMA = z.object({
  method: z
    .string()
    .min(1, { message: 'Shipping method must not be empty' })
    .max(255, { message: 'Shipping method max 255 characters' }),
})
export type DTO_CREATE_SHIPPING_METHOD = z.infer<
  typeof CREATE_SHIPPING_METHOD_SCHEMA
>

/**
 * CREATE PAYMENTS METHOD
 *
 * only requires a method: that must be a string of max 255
 */
export const CREATE_PAYMENT_METHOD_SCHEMA = z.object({
  method: z
    .string()
    .min(1, { message: 'Payment method must have 1 character' })
    .max(255, { message: 'Payment method max 255 characters' }),
})
export type DTO_CREATE_PAYMENT_METHOD = z.infer<
  typeof CREATE_PAYMENT_METHOD_SCHEMA
>
