import { z } from 'zod'

export const shopTypeEnum = z.enum(['public', 'private', 'telegram_only'], {
  message: 'Please select a shop type',
})

export const shopCreateSchema = z.object({
  shopType: shopTypeEnum,
  shopName: z
    .string()
    .min(3, { message: 'Shop name must be at least 3 characters.' })
    .max(50, { message: 'Shop name max 50 characters.' }),
})
export type shopCreateSchemaType = z.infer<typeof shopCreateSchema>

export const shopViewSchema = shopCreateSchema.extend({
  id: z.uuid(),
  userId: z.uuid(),
})
export type shopViewSchemaType = z.infer<typeof shopViewSchema>
