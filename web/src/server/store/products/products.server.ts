import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { serverStore } from '../store.server'
import { db } from '@/db'
import { products } from '@/db/schema'
import {
  DTO_CREATE_PRODUCT,
  PRODUCT_SCHEMA,
  VISUALIZE_PRODUCT_SCHEMA,
} from '@/schemas/product.schema'

const storeServer = new serverStore()

export class serverProduct {
  /**
   * Obtain product by id
   *
   * @param storeId uuid
   * @param productId uuid
   * @returns parsed product
   */
  async getProductById(
    storeId: string,
    productId: string,
  ): Promise<PRODUCT_SCHEMA> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(and(eq(products.storeId, storeId), eq(products.id, productId)))

      if (!product[0]) {
        throw new Error('Product not found!')
      }
      return VISUALIZE_PRODUCT_SCHEMA.parse(product[0])
    } catch (err: any) {
      console.log(err)
      throw new Error(err.message ?? 'Error while loading product...')
    }
  }

  /**
   * Obtain a produt by name
   * @param storeId uuid
   * @param productName string
   * @returns parsed product or "product not found"
   */
  async getProductByName(
    storeId: string,
    productName: string,
  ): Promise<PRODUCT_SCHEMA | string> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(
          and(
            eq(products.storeId, storeId),
            eq(products.productName, productName),
          ),
        )

      if (!product[0]) {
        return 'product not found'
      }

      return VISUALIZE_PRODUCT_SCHEMA.parse(product[0])
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error while loading product...')
    }
  }

  /**
   * Create a new product
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @param dto create product object
   * @returns "product created" if success
   */
  async createProduct(
    userId: string,
    storeId: string,
    dto: DTO_CREATE_PRODUCT,
  ) {
    // validate user ownership
    const ownership = await storeServer.validateUserStoreOwnership(
      userId,
      storeId,
    )
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    // gets the product by name adn verify if there is already a product with that names
    const product = await this.getProductByName(storeId, dto.productName)
    console.log(product)
    if (product !== 'product not found')
      throw new Error('Product already inserted!')

    let productDesc: string | null = null
    if (dto.productDesc.trim() !== '') {
      productDesc = dto.productDesc
    }

    let productCategory: string | null = null
    if (dto.categoryId !== 'none') {
      productCategory = dto.categoryId
    }

    try {
      await db.insert(products).values({
        id: uuidv4(),
        storeId: storeId,
        productName: dto.productName,
        productPrice: dto.productPrice,
        productDesc: productDesc,
        categoryId: productCategory,
      })

      return 'product created!'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error creating product')
    }
  }

  /**
   * Update product
   *
   * @param storeId uuid internal user id
   * @param productId uuid
   * @param dto create product object
   * @returns "msg" string
   */
  async updateProduct(
    storeId: string,
    productId: string,
    dto: DTO_CREATE_PRODUCT,
  ) {
    const product = await this.getProductById(storeId, productId)

    // object for the updated product fields
    const updateObj: Record<string, any> = {}

    if (
      typeof dto.productName !== 'undefined' &&
      dto.productName !== product.productName
    ) {
      updateObj.productName = dto.productName
    }
    if (
      typeof dto.productPrice !== 'undefined' &&
      dto.productPrice !== product.productPrice
    ) {
      updateObj.productPrice = dto.productPrice
    }
    if (
      typeof dto.productDesc !== 'undefined' &&
      dto.productDesc !== product.productDesc
    ) {
      updateObj.productDesc = dto.productDesc
    }
    if (
      typeof dto.categoryId !== 'undefined' &&
      dto.categoryId !== product.categoryId
    ) {
      if (dto.categoryId === 'null') {
        updateObj.categoryId = null
      } else {
        updateObj.categoryId = dto.categoryId
      }
    }

    // if no changes, return
    if (Object.keys(updateObj).length === 0) {
      return 'No changes were applied!'
    }

    try {
      await db
        .update(products)
        .set(updateObj)
        .where(and(eq(products.storeId, storeId), eq(products.id, productId)))

      return 'Product updated!'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error updating product')
    }
  }

  /**
   * Delete product
   * @param storeId uuid
   * @param productId uuid
   * @returns "msg" string
   */
  async deleteProduct(storeId: string, productId: string) {
    await this.getProductById(storeId, productId)

    try {
      await db
        .delete(products)
        .where(and(eq(products.storeId, storeId), eq(products.id, productId)))

      return 'product deleted!'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error deleting product')
    }
  }

  /**
   * Obtain a list of products from a store
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @returns parsed list of products
   */
  async getProductsFromstoreId(
    userId: string,
    storeId: string,
  ): Promise<Array<PRODUCT_SCHEMA>> {
    // validate user ownership
    const ownership = await storeServer.validateUserStoreOwnership(
      userId,
      storeId,
    )
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    try {
      const productsList = await db
        .select()
        .from(products)
        .where(eq(products.storeId, storeId))

      return VISUALIZE_PRODUCT_SCHEMA.array().parse(productsList)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error getting products')
    }
  }

  async toogleVisibility(productId: string, visibility: number) {
    try {
      await db
        .update(products)
        .set({ visible: visibility })
        .where(eq(products.id, productId))

      return 'Product visibilty changed!'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error changing visibility')
    }
  }

  /**
   * Adds an image to a product
   *
   * @param productId uuid
   * @param imgUrl string -> url
   * @returns "msg"
   */
  async insertImage(productId: string, imgUrl: string) {
    try {
      await db
        .update(products)
        .set({ imageUrl: imgUrl })
        .where(eq(products.id, productId))

      return 'image inserted!'
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error adding image')
    }
  }

  /**
   * Validates if a product id is still in store
   *
   * @param storeId uuid
   * @param productId uuid
   * @returns boolean
   */
  async validateIfProductExists(
    storeId: string,
    productId: string,
  ): Promise<boolean> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(and(eq(products.storeId, storeId), eq(products.id, productId)))

      if (!product[0]) {
        return false
      }

      return true
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error validating product')
    }
  }
}

/**
 * Obtains all the products related to a store
 * @param storeId uuid
 * @returns list of products
 */
export async function getProductsFromPublicstore(
  storeId: string,
): Promise<Array<PRODUCT_SCHEMA>> {
  try {
    const productsList = await db
      .select()
      .from(products)
      .where(eq(products.storeId, storeId))

    return VISUALIZE_PRODUCT_SCHEMA.array().parse(productsList)
  } catch (err: any) {
    console.error(err)
    throw new Error('Error while getting products')
  }
}
