import { z } from 'zod'

export const shopTypeEnum = z.enum(['public', 'private'], {
  message: 'Please select a shop type',
})

export const currencyEnum = z.enum(['USD', 'EUR', 'GBP', 'CHF'], {
  message: 'Please select a currency',
})

export const shopSchema = z.object({
  shopType: shopTypeEnum,
  shopName: z
    .string()
    .min(3, { message: 'Shop name must be at least 3 characters.' })
    .max(50, { message: 'Shop name max 50 characters.' }),
  shopCurrency: currencyEnum,
})
export type shopSchemaType = z.infer<typeof shopSchema>

export const shopExtendedSchema = shopSchema.extend({
  id: z.uuid(),
  userId: z.uuid(),
})

export type shopExtendedSchemaType = z.infer<typeof shopExtendedSchema>
