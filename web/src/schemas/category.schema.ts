import { z } from 'zod'

/**
 * VISUALIZE CATEGORY
 */
export const VISUALIZE_CATEGORY_SCHEMA = z.object({
  id: z.uuid(),
  category: z.string(),
})

/**
 * CREATE CATEGORY
 */
export const CREATE_CATEGORY = z.object({
  category: z.string().min(1, { message: 'Category must not be empty' }),
})
