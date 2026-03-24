import { z } from 'zod'

export const PRODUCT_SCHEMA = z.object({
  productId: z.uuid(),
  storeId: z.uuid(),
  productName: z
    .string()
    .min(1, { message: 'product name is required' })
    .max(120, { message: 'limit of 120 characters to product name' }),
  productPrice: z.string().regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, {
    message:
      'Product price must be a decimal with up to 2 decimal places and max 10 digits (8 before, 2 after decimal).',
  }),
  productDesc: z
    .string()
    .min(1, { message: 'valid description is required' })
    .max(2500, { message: 'limit of 2500 characters to product description' })
    .optional()
    .nullable(),
  productImageUrl: z.string().optional().nullable(),
  productVisible: z.number(),
  productCategoryId: z.string(),
  productCreated_at: z.string(),
})
