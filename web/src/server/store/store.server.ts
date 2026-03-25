import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { get_InternalUserIdByTelegramUserId } from '../user/user.server'
import { db } from '@/db'
import { paymentMethods, shippingMethods, stores } from '@/db/schema'
import {
  schema_STORE,
  select_STORE_METHODS,
  type_patch_STORE,
  type_schema_STORE,
  type_select_STORE_METHODS,
} from '@/db/schemas/store.schema'

export class serverStore {
  /**
   * Obtain store info from its store id
   * @param userId
   * @param storeId
   * @returns parsed store info
   */
  async get_StoreInfoByStoreId(
    userId: string,
    storeId: string,
  ): Promise<type_schema_STORE> {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)))
        .limit(1)

      if (!store[0]) throw new Error('Store was not found!')

      const info = {
        storeId: store[0].id,
        ...store[0],
        storeCreatedAt: new Date(store[0].createdAt),
      }

      return schema_STORE.parse(info)
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING STORE BY STORE ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * Obtain the store expire date by a store id
   * @param storeId
   * @returns expire date
   */
  async get_StoreExpireDateByStoreId(storeId: string) {
    try {
      const expireDate = await db
        .select({ storeExpireDate: stores.storeExpireDate })
        .from(stores)
        .where(eq(stores.id, storeId))
        .limit(1)

      if (!expireDate[0]) throw new Error('Store not found')

      return expireDate[0].storeExpireDate
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING STORE EXIPRE DATE

        ${err}

        -------------------------
        `)
      throw new Error(err.message ?? 'Error fetching store')
    }
  }

  /**
   * Update a store
   * @param userId
   * @param storeId
   * @param dto patch store schema
   * @returns "msg"
   */
  async update_Store(userId: string, storeId: string, dto: type_patch_STORE) {
    const ownership = await this.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized!')
    }

    // obtains the current store info
    const store = await this.get_StoreInfoByStoreId(userId, storeId)

    // object to compare what data have changed
    const updateObj: Record<string, any> = {}

    // store name
    if (
      typeof dto.storeName !== 'undefined' &&
      dto.storeName !== store.storeName
    ) {
      updateObj.storeName = dto.storeName
    }

    // store type
    if (
      typeof dto.storeType !== 'undefined' &&
      dto.storeType !== store.storeType
    ) {
      updateObj.storeType = dto.storeType
    }

    // store currency
    if (
      typeof dto.storeCurrency !== 'undefined' &&
      dto.storeCurrency !== store.storeCurrency
    ) {
      updateObj.storeCurrency = dto.storeCurrency
    }

    // if no changes, return
    if (Object.keys(updateObj).length === 0) {
      return 'No changes were applied!'
    }

    try {
      await db
        .update(stores)
        .set(updateObj)
        .where(and(eq(stores.id, storeId), eq(stores.userId, userId)))

      return 'Store has been updated!'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR UPDATING STORE

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error updating store')
    }
  }

  /**
   * Delete a store
   * @param userId
   * @param storeId
   * @returns "msg"
   */
  async delete_Store(userId: string, storeId: string) {
    const ownership = await this.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }
    try {
      await db
        .delete(stores)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)))

      return 'store deleted'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR DELETING STORE

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error deleting store')
    }
  }

  /**
   * Obtain the list of shipping methods from a store
   * @param storeId
   * @returns null || array of methods
   */
  async get_StoreShippingMethods(
    storeId: string,
  ): Promise<Array<type_select_STORE_METHODS> | null> {
    try {
      const methods = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.storeId, storeId))

      if (methods.length === 0) {
        return null
      }

      return select_STORE_METHODS.array().parse(methods)
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING STORE SHIPPING METHODS

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * Validate if a shipping method already exists on db
   *
   * valid means its availables
   * invalid means its already in use
   *
   * @param storeId
   * @param shippingMethodName
   * @returns valid | invalid
   */
  async validate_StoreShippingMethodName(
    storeId: string,
    shippingMethodName: string,
  ): Promise<'valid' | 'invalid'> {
    try {
      const method = await db
        .select()
        .from(shippingMethods)
        .where(
          and(
            eq(shippingMethods.storeId, storeId),
            eq(shippingMethods.method, shippingMethodName),
          ),
        )
        .limit(1)

      if (method[0]) return 'invalid'
      return 'valid'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR VALIDATING STORE SHIPPING METHOD NAME

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * Add a shipping method to a store
   * @param userId
   * @param storeId
   * @param shippingMethod
   * @returns "msg"
   */
  async create_StoreShippingMethod(
    userId: string,
    storeId: string,
    shippingMethod: string,
  ) {
    const ownership = await this.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    const validMethod = await this.validate_StoreShippingMethodName(
      storeId,
      shippingMethod,
    )

    if (validMethod === 'invalid') {
      throw new Error('Shipping Method already exists!')
    }

    try {
      await db.insert(shippingMethods).values({
        id: uuidv4(),
        storeId: storeId,
        method: shippingMethod,
      })

      return `New shipping method: ${shippingMethod}`
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR CREATING STORE SHIPPING METHOD

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error adding shipping method')
    }
  }

  /**
   * Delete a shipping method
   * @param userId
   * @param storeId
   * @param methodId
   * @returns "msg"
   */
  async delete_StoreShippingMethod(
    userId: string,
    storeId: string,
    methodId: string,
  ) {
    const ownership = await this.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }
    try {
      await db
        .delete(shippingMethods)
        .where(
          and(
            eq(shippingMethods.storeId, storeId),
            eq(shippingMethods.id, methodId),
          ),
        )

      return `Shipping method deleted!`
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR DELETING STORE SHIPPING METHOD

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error deleting shipping method')
    }
  }

  /**
   * Returns the method name from its method id
   * @param shippingMethodId
   * @returns method name
   */
  async get_StoreShippingMethodNameFromMethodId(shippingMethodId: string) {
    try {
      const method = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.id, shippingMethodId))
        .limit(1)

      if (!method[0]) throw new Error('Shipping method not found!')

      return method[0].method
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING STORE SHIPPING METHOD FROM METHOD ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * Obtain the list of payment methods from a store
   * @param storeId
   * @returns nulls || array of methods
   */
  async get_StorePaymentMethods(
    storeId: string,
  ): Promise<Array<type_select_STORE_METHODS> | null> {
    try {
      const methods = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.storeId, storeId))

      if (methods.length === 0) {
        return null
      }

      return select_STORE_METHODS.array().parse(methods)
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING STORE PAYMENT METHODS

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * Validate if a payment method already exists on db
   *
   * valid means its available
   * invalid means its already in use
   *
   * @param storeId
   * @param shippingMethodName
   * @returns valid | invalid
   */
  async validate_StorePaymentMethodName(
    storeId: string,
    shippingMethodName: string,
  ): Promise<'valid' | 'invalid'> {
    try {
      const method = await db
        .select()
        .from(paymentMethods)
        .where(
          and(
            eq(paymentMethods.storeId, storeId),
            eq(paymentMethods.method, shippingMethodName),
          ),
        )
        .limit(1)

      if (method[0]) return 'invalid'
      return 'valid'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR VALIDATING STORE PAYMENT METHOD NAME

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * add a payment method to a store
   * @param userId
   * @param storeId
   * @param paymentMethod
   * @returns "msg"
   */
  async create_StorePaymentMethod(
    userId: string,
    storeId: string,
    paymentMethod: string,
  ) {
    const ownership = await this.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    const validMethod = await this.validate_StorePaymentMethodName(
      storeId,
      paymentMethod,
    )

    if (validMethod === 'invalid') {
      throw new Error('Payment Method already exists!')
    }

    try {
      await db.insert(paymentMethods).values({
        id: uuidv4(),
        storeId: storeId,
        method: paymentMethod,
      })

      return `New shipping method: ${paymentMethod}`
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR CREATING STORE PAYMENT METHOD 

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error adding payment method')
    }
  }

  /**
   * Delete a Payment method
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @param methodId uuid
   * @returns "msg"
   */
  async delete_StorePaymentMethod(
    userId: string,
    storeId: string,
    methodId: string,
  ) {
    const ownership = await this.validate_IfUserIsOwnerOfTheStore(
      userId,
      storeId,
    )
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }
    try {
      await db
        .delete(paymentMethods)
        .where(
          and(
            eq(paymentMethods.storeId, storeId),
            eq(paymentMethods.id, methodId),
          ),
        )

      return `Payment method deleted!`
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR DELETING STORE PAYMENT METHOD 

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error deleting payment method')
    }
  }

  /**
   * Returns the method name from its id
   * @param paymentMethodId
   * @returns method name
   */
  async get_StorePaymentMethodNameFromMethodId(paymentMethodId: string) {
    try {
      const method = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, paymentMethodId))
        .limit(1)

      if (!method[0]) throw new Error('Payment method not found!')

      return method[0].method
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING STORE PAYMENT METHOD FROM METHOD ID 

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * Validates if a user is owner of the store
   *
   * true: means its the owner
   * false: means its not the user or simply the store was not found...
   * @param userId internal user id
   * @param storeId
   * @returns boolean ("owner" | "not owner")
   */
  async validate_IfUserIsOwnerOfTheStore(
    userId: string,
    storeId: string,
  ): Promise<boolean> {
    try {
      await this.get_StoreInfoByStoreId(userId, storeId)
      return true
    } catch (err: any) {
      // if server.getstoreById
      // returned the error store not found, means user is trying to access something that its not his..
      if (err.message === 'store not found') {
        return false
      }
      console.log(`
          -------------------------
          ERROR VALIDATING USER STORE OWNERSHIP
  
          ${err}
  
          -------------------------
       `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * validate if the store is activated
   * @param userId
   * @param storeId
   * @returns "msg" active || inactive
   */
  async validate_IfStoreIsActivated(
    storeId: string,
  ): Promise<'active' | 'inactive'> {
    try {
      const storeExperireDate = await this.get_StoreExpireDateByStoreId(storeId)

      if (
        storeExperireDate &&
        new Date(storeExperireDate).getTime() < Date.now()
      ) {
        return 'inactive'
      }

      return 'active'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR VALIDATING STORE

        ${err}

        -------------------------
        `)
      throw new Error(err.message ?? 'error fetching store')
    }
  }

  /**
   * created with the intention of validating any user access to the store.$id.tsx "page"
   *
   * In this page every user should be treated as an "external user" for security reasons
   * this method cames to solve this problem by trying to match the telegramUserId with a internal_userId
   * if telegramUserId is in db and its owner of this store -> return true
   * if telegramUserId is in db but its not the owner of this store is treated as "external user"
   *
   * @param telegramUserId
   * @param storeId
   * @returns true if store is active || false if store is not active
   */
  async validate_ExternalUserAccess(
    telegramUserId: number,
    storeId: string,
  ): Promise<boolean> {
    try {
      const isStoreActivated = await this.validate_IfStoreIsActivated(storeId)
      const internalUserId =
        await get_InternalUserIdByTelegramUserId(telegramUserId)
      if (internalUserId) {
        const isOwner = await this.validate_IfUserIsOwnerOfTheStore(
          internalUserId,
          storeId,
        )
        // if user is the owner access is allowed
        if (isOwner) {
          return true
        } else {
          if (isStoreActivated === 'active') {
            return true
          } else return false
        }
      } else {
        if (isStoreActivated === 'active') {
          return true
        } else return false
      }
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR VALIDATING EXTERNAL USER ACCESS

        ${err}

        -------------------------
        `)
      throw new Error(err.message ?? 'error authenticating....')
    }
  }
}
