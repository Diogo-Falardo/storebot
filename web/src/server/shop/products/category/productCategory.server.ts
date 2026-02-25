import { db } from '@/db'
import { category } from '@/db/schema'
import { viewCategorySchema } from '@/db/schemas/category.schema'
import { and, eq } from 'drizzle-orm'
import { th } from 'zod/v4/locales'

// function to verify if category already exist
export async function VerifyCategoryName(shopId: string, categoryName: string) {
  try {
    const row = await db
      .select()
      .from(category)
      .where(
        and(eq(category.shopId, shopId), eq(category.category, categoryName)),
      )

    if (!row[0]) {
      return true
    }

    return false
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Couldnt verify category name')
  }
}

export async function getCategoryFromShopId(shopId: string) {
  try {
    const categorys = await db
      .select()
      .from(category)
      .where(eq(category.shopId, shopId))

    return viewCategorySchema.array().parse(categorys)
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Coulnt get Categorys')
  }
}

export async function addCategory(shopId: string, categoryName: string) {
  const categoryVerification = await VerifyCategoryName(shopId, categoryName)

  if (!categoryVerification) {
    throw new Error('Category already exists!')
  }

  console.log(shopId)
  try {
    await db.insert(category).values({
      shopId: shopId,
      category: categoryName,
    })

    return 'Category added with success'
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Couldnt add category')
  }
}

export async function deleteCategory(shopId: string, categoryId: string) {
  try {
    await db
      .delete(category)
      .where(and(eq(category.shopId, shopId), eq(category.id, categoryId)))

    return 'category deleted'
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Couldnt delete category')
  }
}
