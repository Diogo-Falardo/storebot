import { z } from 'zod'

// db product schema
export const schema_PRODUCT = z.object({
  productId: z.uuid(),
  storeId: z.uuid(),
  productName: z
    .string()
    .min(1, { message: 'product name is required' })
    .max(120, { message: 'limit of 120 characters to product name' }),
  productPrice: z.string().regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, {
    message:
      'product price must be a decimal with up to 2 decimal places and max 10 digits (8 before, 2 after decimal).',
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
  productCreatedAt: z.string(),
})
export type type_schema_PRODUCT = z.infer<typeof schema_PRODUCT>

// create a product
export const create_PRODUCT = schema_PRODUCT
  .pick({
    productName: true,
    productPrice: true,
    productDesc: true,
    productVisible: true,
    productCategoryId: true,
  })
  /**
   * the reason of this is because we setting desc to "" it makes
   * the field a string and its never null or undefined somehow there are conflits
   * NEED TO BE MORE INVESTIGATED
   */
  .extend({
    productDesc: z.string(),
  })
export type type_create_PRODUCT = z.infer<typeof create_PRODUCT>

// update a product
export const patch_PRODUCT = schema_PRODUCT
  .pick({
    productName: true,
    productPrice: true,
    productDesc: true,
    productVisible: true,
    productCategoryId: true,
  })
  .partial()
export type type_patch_PRODUCT = z.infer<typeof patch_PRODUCT>
