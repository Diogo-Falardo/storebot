import { db } from '@/db'
import { products } from '@/db/schema'
import {
  productDisplaySchema,
  productDisplaySchemaType,
  productDtoType,
  productExtendedSchema,
  productExtendedSchemaType,
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
      return product
    }

    return false
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error while getting product...')
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
