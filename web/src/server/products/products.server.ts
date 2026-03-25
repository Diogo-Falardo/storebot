import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { serverStore } from '../store/store.server'
import { db } from '@/db'
import { products } from '@/db/schema'
import {
  PRODUCT_SCHEMA,
  VISUALIZE_PRODUCT_SCHEMA,
} from '@/schemas/product.schema'
import {
  schema_PRODUCT,
  type_create_PRODUCT,
  type_patch_PRODUCT,
  type_schema_PRODUCT,
} from '@/db/schemas/product.schema'

const storeServer = new serverStore()

export class serverProduct {
  /**
   * Obtain product by id
   * @param storeId
   * @param productId
   * @returns parsed product
   */
  async get_ProductByProductId(
    storeId: string,
    productId: string,
  ): Promise<type_schema_PRODUCT> {
    try {
      const product = await db
        .select()
        .from(products)
        .where(and(eq(products.storeId, storeId), eq(products.id, productId)))

      if (!product[0]) {
        throw new Error('Product not found!')
      }
      return schema_PRODUCT.parse(product[0])
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING  PRODUCT BY PRODUCT ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching products')
    }
  }

  /**
   * Obtain a produt by name
   * @param storeId
   * @param productName
   * @returns parsed product or "product not found"
   */
  async get_ProductByProductName(
    storeId: string,
    productName: string,
  ): Promise<type_schema_PRODUCT | 'product not found'> {
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

      return schema_PRODUCT.parse(product[0])
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING PRODUCT BY PRODUCT NAME

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching products')
    }
  }

  /**
   * Create a new product
   * @param userId
   * @param storeId
   * @param dto create product
   * @returns "msg"
   */
  async create_Product(
    userId: string,
    storeId: string,
    dto: type_create_PRODUCT,
  ) {
    const ownership = await storeServer.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    // gets the product by name and verify if there is already a product with that names
    const product = await this.get_ProductByProductName(
      storeId,
      dto.productName,
    )

    if (product !== 'product not found')
      throw new Error('Product already inserted!')

    try {
      await db.insert(products).values({
        id: uuidv4(),
        storeId: storeId,
        productName: dto.productName,
        productPrice: dto.productPrice,
        productDesc: dto.productDesc,
        categoryId: dto.productCategoryId,
      })

      return 'product created!'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR CREATING PRODUCT

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error creating product')
    }
  }

  /**
   * Update product
   * @param storeId
   * @param productId
   * @param dto
   * @returns "msg"
   */
  async update_Product(
    storeId: string,
    productId: string,
    dto: type_patch_PRODUCT,
  ) {
    const product = await this.get_ProductByProductId(storeId, productId)

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
      typeof dto.productCategoryId !== 'undefined' &&
      dto.productCategoryId !== product.productCategoryId
    ) {
      if (dto.productCategoryId === 'null') {
        updateObj.categoryId = null
      } else {
        updateObj.categoryId = dto.productCategoryId
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
      console.log(`
        -------------------------
        ERROR UPDATING PRODUCT

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error updating product')
    }
  }

  /**
   * Delete product
   * @param storeId
   * @param productId
   * @returns "msg"
   */
  async delete_Product(storeId: string, productId: string) {
    await this.get_ProductByProductId(storeId, productId)

    try {
      await db
        .delete(products)
        .where(and(eq(products.storeId, storeId), eq(products.id, productId)))

      return 'product deleted!'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR DELETING PRODUCT

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'Error deleting product')
    }
  }

  /**
   * Obtain a list of products from a store
   * @param userId
   * @param storeId
   * @returns parsed list of products
   */
  async get_ProductsFromStoreId(
    userId: string,
    storeId: string,
  ): Promise<Array<PRODUCT_SCHEMA>> {
    const ownership = await storeServer.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
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
      console.log(`
        -------------------------
        ERROR GETTING PRODUCTS FROM STORE ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching products')
    }
  }

  /**
   * toogle product visibility
   * @param productId
   * @param visibility "0" || "1"
   * @returns "msg"
   */
  async toogle_ProductVisibility(productId: string, visibility: number) {
    try {
      await db
        .update(products)
        .set({ visible: visibility })
        .where(eq(products.id, productId))

      return 'Product visibilty changed!'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR CHANGING PRODUCT VISIBILITY

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error changing visibility')
    }
  }

  /**
   * Adds an image to a product
   *
   * @param productId
   * @param imgUrl
   * @returns "msg"
   */
  async add_ProductImage(productId: string, imgUrl: string) {
    try {
      await db
        .update(products)
        .set({ imageUrl: imgUrl })
        .where(eq(products.id, productId))

      return 'image inserted!'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR ADDING PRODUCT IMAGE

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error adding image')
    }
  }

  /**
   * Validates if a product id is still in store
   * @param storeId
   * @param productId
   * @returns
   */
  async validate_IfProductExists(
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
