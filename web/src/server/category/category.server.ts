import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { category } from '@/db/schema'
import {
  schema_CATEGORY,
  type_schema_CATEGORY,
} from '@/db/schemas/category.schema'

export class serverCategory {
  /**
   * Verify if category name is available
   * @param storeId
   * @param categoryName
   * @returns true for available | false for in use
   */
  async verify_CategoryName(
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
      console.log(`
        -------------------------
        ERROR VERIFYING CATEGORY NAME

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching categorys')
    }
  }

  /**
   * Obtains an array of categorys
   * @param storeId
   * @returns parsed category array
   */
  async get_CategorysFromStoreId(
    storeId: string,
  ): Promise<Array<type_schema_CATEGORY>> {
    try {
      const categorys = await db
        .select()
        .from(category)
        .where(eq(category.storeId, storeId))

      return schema_CATEGORY.array().parse(
        categorys.map((c) => ({
          ...c,
          categoryId: c.id,
          categoryName: c.category,
        })),
      )
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING CATEGORYS FROM STORE ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching categorys')
    }
  }

  /**
   * Creates a category
   * @param storeId
   * @param categoryName string
   * @returns "msg" string
   */
  async create_Category(storeId: string, categoryName: string) {
    const categoryVerification = await this.verify_CategoryName(
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
      console.log(`
        -------------------------
        ERROR CREATING CATEGORY

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error creating category')
    }
  }

  /**
   * Deletes a category
   * @param storeId
   * @param categoryId
   * @returns "msg"
   */
  async delete_Category(storeId: string, categoryId: string) {
    try {
      await db
        .delete(category)
        .where(and(eq(category.storeId, storeId), eq(category.id, categoryId)))

      return 'category deleted'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR DELETING CATEGORY

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error deleting category')
    }
  }

  /**
   * Converts category id into name
   * @param storeId
   * @param categoryId
   * @returns category name
   */
  async get_CategoryNameByCategoryId(storeId: string, categoryId: string) {
    try {
      const categoryName = await db
        .select()
        .from(category)
        .where(and(eq(category.storeId, storeId), eq(category.id, categoryId)))

      if (!categoryName[0]) return null

      return categoryName[0].category
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'error fetching categorys')
    }
  }
}
