import { z } from 'zod'

// db category schema
export const schema_CATEGORY = z.object({
  categoryId: z.uuid(),
  storeId: z.uuid(),
  categoryName: z
    .string()
    .min(1, { message: 'category must not be empty' })
    .max(255, { message: 'limit of 255 characters for category' }),
})
export type type_schema_CATEGORY = z.infer<typeof schema_CATEGORY>
