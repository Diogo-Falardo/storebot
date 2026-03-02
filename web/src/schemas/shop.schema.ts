import { uuid, z } from 'zod'

export const SHOP_TYPE_ENUM = z.enum(['public', 'private'], {
  message: 'Please select a shop type',
})

export const SHOP_CURRENCY_ENUM = z.enum(['USD', 'EUR', 'GBP', 'CHF'], {
  message: 'Please select a currency',
})

/**
 * VISUALIZE SHOP
 *
 * Supposed to use when returning a shop from the server
 */
export const VISUALIZE_SHOP_SCHEMA = z.object({
  userId: z.uuid(),
  id: uuid(),
  shopName: z.string(),
  shopType: SHOP_TYPE_ENUM,
  shopCurrency: SHOP_CURRENCY_ENUM,
})
/**
 * this type shouldnt be used to CREATE, UPDATE or anything related to it
 * should only be used to PROMISE<> the desired returning type
 */
export type SHOP_SCHEMA = z.infer<typeof VISUALIZE_SHOP_SCHEMA>

/**
 * CREATE SHOP
 *
 * Everything is required...
 *
 * shopType and shopCurrency should be defaulted to "public" and "EUR"
 */
export const CREATE_SHOP_SCHEMA = z.object({
  shopType: SHOP_TYPE_ENUM,
  shopName: z
    .string()
    .min(3, { message: 'Shop name must be at least 3 characters.' })
    .max(50, { message: 'Shop name max 50 characters.' }),
  shopCurrency: SHOP_CURRENCY_ENUM,
})
export type DTO_CREATE_SHOP = z.infer<typeof CREATE_SHOP_SCHEMA>
