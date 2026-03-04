import { z } from 'zod'

/**
 * VISUALIZE PRODUCT
 */
export const VISUALIZE_PRODUCT_SCHEMA = z.object({
  id: z.uuid(),
  shopId: z.uuid(),
  productName: z.string(),
  productPrice: z.string(),
  productDesc: z.string().optional().nullable(),
  categoryId: z.uuid().nullable(),
  imageUrl: z.string().nullable(),
  visible: z.number(),
})
/**
 * this type shouldnt be used to CREATE, UPDATE or anything related to it
 * should only be used to PROMISE<> the desired returning type
 */
export type PRODUCT_SCHEMA = z.infer<typeof VISUALIZE_PRODUCT_SCHEMA>

/**
 * CREATE PRODUCT
 *
 * categoryId: pass the uuid as string.
 *
 * visible: should be defaulted to 1 on the FORM.
 */
export const CREATE_PRODUCT_SCHEMA = z.object({
  productName: z
    .string()
    .min(1, { message: 'Product name must not be empty' })
    .max(50, { message: 'Shop name max 50 characters.' }),
  productPrice: z.string().regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, {
    message:
      'Product price must be a decimal with up to 2 decimal places and max 10 digits (8 before, 2 after decimal).',
  }),
  productDesc: z.string(),
  categoryId: z.string(),
  visible: z.number(),
})
export type DTO_CREATE_PRODUCT = z.infer<typeof CREATE_PRODUCT_SCHEMA>
