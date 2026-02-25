import { z } from 'zod'

/**
 *
 *
 * THIS FILE NEEDS A BIG REVIEW AND FIX
 *
 *
 */

// base required for product
export const productSchema = z.object({
  productName: z
    .string()
    .min(1, { message: 'Product name must not be empty' })
    .max(50, { message: 'Shop name max 50 characters.' }),
  productPrice: z.string().regex(/^(?:\d{1,8})(?:\.\d{1,2})?$/, {
    message:
      'Product price must be a decimal with up to 2 decimal places and max 10 digits (8 before, 2 after decimal).',
  }),
  visible: z.number(),
})
export type productSchemaType = z.infer<typeof productSchema>

// insert a new product
export const productDto = productSchema.extend({
  productDesc: z.string().min(0),
  categoryId: z.string(),
})
export type productDtoType = z.infer<typeof productDto>
export const productDtoExtend = productDto.extend({
  shopId: z.uuid(),
})
export type productDtoExtendedType = z.infer<typeof productDtoExtend>

export const productExtendedSchema = productDtoExtend.extend({
  id: z.uuid(),
})
export type productExtendedSchemaType = z.infer<typeof productExtendedSchema>

/**
 * update a product
 * everything is optional except IDs
 */
export const productUpdateSchema = productDto
  .extend({
    shopId: z.uuid(),
    id: z.uuid(),
  })
  .partial()
  .required({ shopId: true, id: true })
export type productUpdateType = z.infer<typeof productUpdateSchema>

// form haved some complications so we created this....
export const productUpdateFormSchema = z.object({
  productName: z.string().or(z.undefined()),
  productPrice: z.string().or(z.undefined()),
  productDesc: z.string(),
  categoryId: z.string(),
  id: z.string(),
  shopId: z.string(),
})

// visualization
export const productDisplaySchema = productExtendedSchema.extend({
  productDesc: z.string().min(0).optional().nullable(),
  categoryId: z.string().optional().nullable(),
})
export type productDisplaySchemaType = z.infer<typeof productDisplaySchema>
