import { z } from 'zod'

export const SELECT_SIMPLE_USER = z.object({
  userTelegramId: z.string(),
  userId: z.string(),
  userCreatedAt: z.string(),
})
export type SELECT_SIMPLE_USER_type = z.infer<typeof SELECT_SIMPLE_USER>
4

// user info + shop info
export const SELECT_ENTIRE_USER = z.object({
  userId: z.uuid(),
  storeId: z.uuid(),
  storeName: z.string(),
  storeType: z.string(),
  storeCurrency: z.string().nullable(),
  storeExpireDate: z.string().nullable(),
  categorys: z.array(z.string()),
  shippingMethods: z.array(z.string()),
  paymentMethods: z.array(z.string()),
  storeCreatedAt: z.string(),
})
export type SELECT_ENTIRE_USER_type = z.infer<typeof SELECT_ENTIRE_USER>
