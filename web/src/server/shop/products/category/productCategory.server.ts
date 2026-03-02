import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { category } from '@/db/schema'
import { VISUALIZE_CATEGORY_SCHEMA } from '@/schemas/category.schema'

export class serverCategory {
  /**
   * Verify if category name is available
   *
   * true: means available
   * false: means already inserted
   * @param shopId uuid
   * @param categoryName string
   * @returns bool
   */
  async verifyCategoryName(
    shopId: string,
    categoryName: string,
  ): Promise<boolean> {
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
      throw new Error(err.message ?? 'Error verifying category')
    }
  }

  /**
   * Obtains an array of categorys
   *
   * @param shopId uuid
   * @returns array
   */
  async getCategorysFromShopId(shopId: string) {
    try {
      const categorys = await db
        .select()
        .from(category)
        .where(eq(category.shopId, shopId))

      return VISUALIZE_CATEGORY_SCHEMA.array().parse(categorys)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error geting categorys')
    }
  }

  /**
   * Creates a category
   *
   * @param shopId uuid
   * @param categoryName string
   * @returns "msg" string
   */
  async createCategory(shopId: string, categoryName: string) {
    const categoryVerification = await this.verifyCategoryName(
      shopId,
      categoryName,
    )

    if (!categoryVerification) {
      throw new Error('Category already exists!')
    }

    try {
      await db.insert(category).values({
        shopId: shopId,
        category: categoryName,
      })

      return 'Category created!'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error creating category')
    }
  }

  /**
   * Deletes a category
   *
   * @param shopId uuid
   * @param categoryId uuid
   * @returns "msg" string
   */
  async deleteCategory(shopId: string, categoryId: string) {
    try {
      await db
        .delete(category)
        .where(and(eq(category.shopId, shopId), eq(category.id, categoryId)))

      return 'category deleted'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error deleting category')
    }
  }
}
