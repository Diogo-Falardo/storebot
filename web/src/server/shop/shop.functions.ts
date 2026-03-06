import { createServerFn } from '@tanstack/react-start'
import { publicShop, serverShop } from './shop.server'
import { getProductsFromPublicShop } from './products/products.server'
import { DTO_CREATE_SHOP } from '@/schemas/shop.schema'
import { PRODUCT_SCHEMA } from '@/schemas/product.schema'

const shopServer = new serverShop()

/**
 * "GET"
 * user shop info
 *
 * required: userId & shopId
 */
export const sf_ShopInfo = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; shopId: string }) => data)
  .handler(async ({ data }) => {
    return await shopServer.getShopById(data.userId, data.shopId)
  })

/**
 * "POST"
 * create a new shop
 *
 * required: userId & dto [create shop]
 */
export const sf_CreateShop = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; createShop: DTO_CREATE_SHOP }) => data,
  )
  .handler(async ({ data }) => {
    return await shopServer.createShop(data.userId, data.createShop)
  })

/**
 * "POST"
 * update a shop
 *
 * required: userId, shopId & dto [create shop]
 */
export const sf_UpdateShop = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; shopId: string; dto: DTO_CREATE_SHOP }) => data,
  )
  .handler(async ({ data }) => {
    return await shopServer.updateShop(data.userId, data.shopId, data.dto)
  })

/**
 * "POST"
 * delete shop
 *
 * required: userId & shopId
 */
export const sf_DeleteShop = createServerFn({ method: 'POST' })
  .inputValidator((data: { shopId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    return await shopServer.deleteShop(data.userId, data.shopId)
  })

type PublicShopResponse = {
  shop: {
    shopName: string
    shopCurrency: string | null
  }
  products: Array<PRODUCT_SCHEMA>
}
/**
 * "GET"
 * public shop
 *
 * required: shopId
 */

export const sf_PublicShop = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string }) => data)
  .handler(async ({ data }): Promise<PublicShopResponse> => {
    const shop = await publicShop(data.shopId)
    const products = await getProductsFromPublicShop(data.shopId)

    return {
      shop: shop,
      products: products,
    }
  })

/**
 * "GET"
 * obtain the shipping methods from a shop
 *
 * required: shopId
 */
export const sf_GetShopShippingMethods = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string }) => data)
  .handler(async ({ data }) => {
    return await shopServer.getShopShippingMethods(data.shopId)
  })

/**
 * "GET"
 * obtain the payment methods from a shop
 *
 * required: shopId
 */
export const sf_GetShopPaymentMethods = createServerFn({ method: 'GET' })
  .inputValidator((data: { shopId: string }) => data)
  .handler(async ({ data }) => {
    return await shopServer.getShopPaymentMethods(data.shopId)
  })

/**
   * "POST"
   * create a shipping method to a shop

   */
export const sf_CreateShopShippingMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; shopId: string; shippingMethod: string }) => data,
  )
  .handler(async ({ data }) => {
    return await shopServer.addShippingMethod(
      data.userId,
      data.shopId,
      data.shippingMethod,
    )
  })

/**
 * "POST"
 * create a payment method to a shop
 */
export const sf_CreateShopPaymentMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; shopId: string; paymentMethod: string }) => data,
  )
  .handler(async ({ data }) => {
    return await shopServer.addPaymentMethod(
      data.userId,
      data.shopId,
      data.paymentMethod,
    )
  })

/**
 * "POST"
 * delete a shipping method from a shop
 *
 * required: userId, shopId, methodId
 */
export const sf_DeleteShopShippingMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; shopId: string; methodId: string }) => data,
  )
  .handler(async ({ data }) => {
    return await shopServer.deleteShippingMethod(
      data.userId,
      data.shopId,
      data.methodId,
    )
  })

/**
 * "POST"
 * delete a payment method from a shop
 *
 * required: userId, shopId, methodId
 */
export const sf_DeleteShopPaymentMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; shopId: string; methodId: string }) => data,
  )
  .handler(async ({ data }) => {
    return await shopServer.deleteShippingMethod(
      data.userId,
      data.shopId,
      data.methodId,
    )
  })
