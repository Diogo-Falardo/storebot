import { z } from 'zod'

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
})
export type productSchemaType = z.infer<typeof productSchema>

// insert a new product
export const productDto = productSchema.extend({
  productDesc: z.string().min(0),
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

// visualization
export const productDisplaySchema = productExtendedSchema.extend({
  productDesc: z.string().min(0).optional().nullable(),
})
export type productDisplaySchemaType = z.infer<typeof productDisplaySchema>
