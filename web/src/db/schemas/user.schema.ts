import { z } from 'zod'

export const schema_SIMPLE_USER = z.object({
  userTelegramId: z.string(),
  userId: z.string(),
  userCreatedAt: z.string(),
})
export type type_schema_SIMPLE_USER = z.infer<typeof schema_SIMPLE_USER>

// user info + shop info
export const schema_USER = z.object({
  userId: z.uuid(),
  storeId: z.uuid(),
  storeName: z.string(),
  storeType: z.string(),
  storeCurrency: z.string().nullable(),
  storeExpireDate: z.string().nullable(),
  storeCategorys: z.array(z.string()),
  storeShippingMethods: z.array(z.string()),
  storePaymentMethods: z.array(z.string()),
  storeCreatedAt: z.string(),
})
export type type_schema_USER = z.infer<typeof schema_USER>
