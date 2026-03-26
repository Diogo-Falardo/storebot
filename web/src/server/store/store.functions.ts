import { createServerFn } from '@tanstack/react-start'
import { serverStore } from './store.server'
import {
  type_patch_STORE,
  type_schema_PUBLIC_STORE,
} from '@/db/schemas/store.schema'

const storeServer = new serverStore()

export const sf_get_StoreInfoByStoreId = createServerFn({ method: 'GET' })
  .inputValidator((data: { userId: string; storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.get_StoreInfoByStoreId(data.userId, data.storeId)
  })

export const sf_update_Store = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; dto: type_patch_STORE }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.update_Store(data.userId, data.storeId, data.dto)
  })

export const sf_delete_Store = createServerFn({ method: 'POST' })
  .inputValidator((data: { userId: string; storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.delete_Store(data.userId, data.storeId)
  })

export const sf_get_StoreShippingMethods = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.get_StoreShippingMethods(data.storeId)
  })

export const sf_get_StorePaymentMethods = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.get_StorePaymentMethods(data.storeId)
  })

export const sf_create_StoreShippingMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; shippingMethod: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.create_StoreShippingMethod(
      data.userId,
      data.storeId,
      data.shippingMethod,
    )
  })

export const sf_create_StorePaymentMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; paymentMethod: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.create_StorePaymentMethod(
      data.userId,
      data.storeId,
      data.paymentMethod,
    )
  })

export const sf_delete_StoreShippingMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; methodId: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.delete_StoreShippingMethod(
      data.userId,
      data.storeId,
      data.methodId,
    )
  })

export const sf_delete_StorePaymentMethod = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { userId: string; storeId: string; methodId: string }) => data,
  )
  .handler(async ({ data }) => {
    return await storeServer.delete_StorePaymentMethod(
      data.userId,
      data.storeId,
      data.methodId,
    )
  })

export const sf_get_StoreShippingMethodNameFromMethodId = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { shippingMethodId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.get_StoreShippingMethodNameFromMethodId(
      data.shippingMethodId,
    )
  })

export const sf_get_StorePaymentMethodNameFromMethodId = createServerFn({
  method: 'POST',
})
  .inputValidator((data: { paymentMethodId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.get_StorePaymentMethodNameFromMethodId(
      data.paymentMethodId,
    )
  })

export const sf_validate_IfStoreIsActivated = createServerFn({
  method: 'GET',
})
  .inputValidator((data: { userId: string; storeId: string }) => data)
  .handler(async ({ data }) => {
    return await storeServer.validate_IfStoreIsActivated(data.storeId)
  })

export const sf_validate_ExternalUserAccess = createServerFn({ method: 'GET' })
  .inputValidator((data: { telegramUserId: number; storeId: string }) => data)
  .handler(async ({ data }): Promise<boolean> => {
    return await storeServer.validate_ExternalUserAccess(
      data.telegramUserId,
      data.storeId,
    )
  })

export const sf_get_PublicStoreInfoByStoreId = createServerFn({ method: 'GET' })
  .inputValidator((data: { storeId: string }) => data)
  .handler(async ({ data }): Promise<type_schema_PUBLIC_STORE | null> => {
    return await storeServer.get_PublicStoreInfoByStoreId(data.storeId)
  })
