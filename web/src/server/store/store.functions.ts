import { createServerFn } from '@tanstack/react-start'
import { publicStore, serverStore } from './store.server'
import { getProductsFromPublicstore } from './products/products.server'
import { PRODUCT_SCHEMA } from '@/schemas/product.schema'
import { DTO_CREATE_store } from '@/schemas/store.schema'

const storeServer = new serverStore()

/**
 * "GET"
 * user store info
 *
 * required: userId & storeId
 */
export const sf_StoreInfo = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.getStoreById(data.userId, data.storeId)
  })

/**
 * "POST"
 * create a new store
 *
 * required: userId & dto [create store]
 */
export const sf_CreateStore = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; createstore: DTO_CREATE_store }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.createstore(data.userId, data.createstore)
  })

/**
 * "POST"
 * update a store
 *
 * required: userId, storeId & dto [create store]
 */
export const sf_Updatestore = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; dto: DTO_CREATE_store }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.updatestore(data.userId, data.storeId, data.dto)
  })

/**
 * "POST"
 * delete store
 *
 * required: userId & storeId
 */
export const sf_Deletestore = createServerFn({ method: 'POST' })
  .inputValidator((data: { storeId: string; userId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.deletestore(data.userId, data.storeId)
  })

type PublicstoreResponse = {
  store: {
    storeName: string
    storeCurrency: string | null
  }
  products: Array<PRODUCT_SCHEMA>
}
/**
 * "GET"
 * public store
 *
 * required: storeId
 */

export const sf_PublicStore = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }): Promise<PublicstoreResponse> => {
    const store = await publicStore(data.storeId)
    const products = await getProductsFromPublicstore(data.storeId)

    return {
      store: store,
      products: products,
    }
  })

/**
 * "GET"
 * obtain the shipping methods from a store
 *
 * required: storeId
 */
export const sf_GetstoreShippingMethods = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.getStoreShippingMethods(data.storeId)
  })

/**
 * "GET"
 * obtain the payment methods from a store
 *
 * required: storeId
 */
export const sf_GetStorePaymentMethods = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.getStorePaymentMethods(data.storeId)
  })

/**
   * "POST"
   * create a shipping method to a store

   */
export const sf_CreateStoreShippingMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; shippingMethod: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.addShippingMethod(
      data.userId,
      data.storeId,
      data.shippingMethod,
    )
  })

/**
 * "POST"
 * create a payment method to a store
 */
export const sf_CreatestorePaymentMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; paymentMethod: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.addPaymentMethod(
      data.userId,
      data.storeId,
      data.paymentMethod,
    )
  })

/**
 * "POST"
 * delete a shipping method from a store
 *
 * required: userId, storeId, methodId
 */
export const sf_DeletestoreShippingMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; methodId: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.deleteShippingMethod(
      data.userId,
      data.storeId,
      data.methodId,
    )
  })

/**
 * "POST"
 * delete a payment method from a store
 *
 * required: userId, storeId, methodId
 */
export const sf_DeletestorePaymentMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; methodId: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.deletePaymentMethod(
      data.userId,
      data.storeId,
      data.methodId,
    )
  })

/**
 * "GET"
 * from an shipping method id return the method name
 */
export const sf_GetShippingMethodName = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { shippingMethodId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.getStoreShippingMethodFromId(data.shippingMethodId)
  })

/**
 * "GET"
 * from an payment method id return the method name
 */
export const sf_GetPaymentMethodName = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { paymentMethodId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.getstorePaymentMethodFromId(data.paymentMethodId)
  })

export const sf_ValidateStore = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { userId: string; storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.ValidateStore(data.userId, data.storeId)
  })

export const sf_IsStoreValid = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    const storeExperireDate = await storeServer.getStoreExpireDate(data.storeId)

    if (
      storeExperireDate &&
      new Date(storeExperireDate).getTime() < Date.now()
    ) {
      return false
    }

    return true
  })
