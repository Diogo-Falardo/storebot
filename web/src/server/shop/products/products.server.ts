import { db } from '@/db'
import { products } from '@/db/schema'
import {
  productDisplaySchema,
  productDisplaySchemaType,
  productDtoType,
  productExtendedSchema,
  productExtendedSchemaType,
  productUpdateType,
} from '@/db/schemas/product.schema'
import { validateUserShopOwnership } from '@/server/user/user.server'
import { and, eq } from 'drizzle-orm'

/**
 * Function to get all the products from a shop Id
 * @param userId
 * @param shopId
 * @returns Array of products or empty array
 */
export async function getProductsFromShopId(
  userId: string,
  shopId: string,
): Promise<Array<productDisplaySchemaType>> {
  const ownership = await validateUserShopOwnership({ userId, shopId })

  if (!ownership) {
    throw new Error('Ups... This is restricted area!')
  }

  try {
    const productsList = await db
      .select()
      .from(products)
      .where(eq(products.shopId, shopId))

    return productDisplaySchema.array().parse(productsList)
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error while getting products...')
  }
}

/**
 * Function to get the product where shopId and Name
 * @param shopId
 * @param productName
 * @returns the product or false
 */
export async function getProductByName(shopId: string, productName: string) {
  try {
    const product = await db
      .select()
      .from(products)
      .where(
        and(eq(products.shopId, shopId), eq(products.productName, productName)),
      )

    if (product[0]) {
      return product[0]
    }

    return null
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error while loading product...')
  }
}

/**
 * Function to get a product from its id
 * @param shopId
 * @param productId
 * @returns
 */
export async function getProductById(shopId: string, productId: string) {
  try {
    const product = await db
      .select()
      .from(products)
      .where(and(eq(products.shopId, shopId), eq(products.id, productId)))

    if (product[0]) {
      return product[0]
    }

    return null
  } catch (err: any) {
    console.log(err)
    throw new Error(err.message ?? 'Error while loading product...')
  }
}

/**
 * Function to add a product to a shop
 * @param userId
 * @param shopId
 * @param dto
 * @returns
 */
export async function addProductToShop(
  userId: string,
  shopId: string,
  dto: productDtoType,
) {
  const ownership = await validateUserShopOwnership({ userId, shopId })

  if (!ownership) {
    throw new Error('Ups... This is restricted area!')
  }

  const productExists = await getProductByName(shopId, dto.productName)

  if (productExists) throw new Error('Product already inserted!')

  let productDesc: string | null = null
  if (dto.productDesc.trim() !== '') {
    productDesc = dto.productDesc
  }

  try {
    await db.insert(products).values({
      shopId: shopId,
      productName: dto.productName,
      productPrice: dto.productPrice,
      productDesc: productDesc,
    })

    return 'product created'
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error while creating product')
  }
}

/**
 * Function to delete a product by its id
 * @param shopId
 * @param productId
 * @returns
 */
export async function deleteProductFromShop(shopId: string, productId: string) {
  const productExists = await getProductById(shopId, productId)

  if (!productExists) throw new Error('Product not found!')

  try {
    await db
      .delete(products)
      .where(and(eq(products.shopId, shopId), eq(products.id, productId)))

    return 'product deleted'
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error while deleting shop')
  }
}

export async function updateProductFromShop(dto: productUpdateType) {
  const product = await getProductById(dto.shopId, dto.id)

  if (!product) throw new Error('Product not found!')

  // object for updated fields
  const updateObj: Record<string, any> = {}

  if (
    typeof dto.productName !== 'undefined' &&
    dto.productName !== product.productName
  ) {
    updateObj.producName = dto.productName
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

  // if no changes, return
  if (Object.keys(updateObj).length === 0) {
    return 'No changes were applied!'
  }

  try {
    await db
      .update(products)
      .set(updateObj)
      .where(and(eq(products.shopId, dto.shopId), eq(products.id, dto.id)))

    return 'Product Updated'
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error while updating product')
  }
}

// function to toogle the visibily from
export async function toogleVisibiltyFromProduct(
  productId: string,
  visibility: number,
) {
  try {
    await db
      .update(products)
      .set({ visible: visibility })
      .where(eq(products.id, productId))

    return 'Product visibilty changed'
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error while changing visibility')
  }
}

// function to get all products from a shop
export async function getProductsFromShopPublic(
  shopId: string,
): Promise<Array<productDisplaySchemaType>> {
  try {
    const productsList = await db
      .select()
      .from(products)
      .where(eq(products.shopId, shopId))

    return productDisplaySchema.array().parse(productsList)
  } catch (err: any) {
    console.error(err)
    throw new Error('Error while getting products')
  }
}
