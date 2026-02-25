import { z } from 'zod'

export const addCategorySchema = z.object({
  category: z.string().min(1, { message: 'Category must not be empty' }),
})
export type addCategorySchemaType = z.infer<typeof addCategorySchema>

export const viewCategorySchema = z.object({
  id: z.uuid(),
  category: z.string(),
})
export type viewCategorySchemaType = z.infer<typeof viewCategorySchema>
