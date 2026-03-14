import { v4 as uuidv4 } from 'uuid'
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
   * @param storeId uuid
   * @param categoryName string
   * @returns bool
   */
  async verifyCategoryName(
    storeId: string,
    categoryName: string,
  ): Promise<boolean> {
    try {
      const row = await db
        .select()
        .from(category)
        .where(
          and(
            eq(category.storeId, storeId),
            eq(category.category, categoryName),
          ),
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
   * @param storeId uuid
   * @returns array
   */
  async getCategorysFromstoreId(storeId: string) {
    try {
      const categorys = await db
        .select()
        .from(category)
        .where(eq(category.storeId, storeId))

      return VISUALIZE_CATEGORY_SCHEMA.array().parse(categorys)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error geting categorys')
    }
  }

  /**
   * Creates a category
   *
   * @param storeId uuid
   * @param categoryName string
   * @returns "msg" string
   */
  async createCategory(storeId: string, categoryName: string) {
    const categoryVerification = await this.verifyCategoryName(
      storeId,
      categoryName,
    )

    if (!categoryVerification) {
      throw new Error('Category already exists!')
    }

    try {
      await db.insert(category).values({
        id: uuidv4(),
        storeId: storeId,
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
   * @param storeId uuid
   * @param categoryId uuid
   * @returns "msg" string
   */
  async deleteCategory(storeId: string, categoryId: string) {
    try {
      await db
        .delete(category)
        .where(and(eq(category.storeId, storeId), eq(category.id, categoryId)))

      return 'category deleted'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error deleting category')
    }
  }

  /**
   * Converts category id into name
   *
   * @param storeId uuid
   * @param categoryId uuid
   */
  async getCategoryName(storeId: string, categoryId: string) {
    try {
      const categoryName = await db
        .select()
        .from(category)
        .where(and(eq(category.storeId, storeId), eq(category.id, categoryId)))

      return categoryName[0].category
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error finding category')
    }
  }
}
