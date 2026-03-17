import { v4 as uuidv4 } from 'uuid'
import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { paymentMethods, shippingMethods, stores } from '@/db/schema'
import {
  DTO_CREATE_store,
  VISUALIZE_METHOD_SCHEMA,
  VISUALIZE_store_SCHEMA,
  store_SCHEMA,
} from '@/schemas/store.schema'

export class serverStore {
  async ValidateStore(userId: string, storeId: string): Promise<boolean> {
    try {
      const isOwner = await this.validateUserStoreOwnership(userId, storeId)
      if (isOwner) {
        return true
      }

      const storeExperireDate = await this.getStoreExpireDate(storeId)

      if (
        storeExperireDate &&
        new Date(storeExperireDate).getTime() < Date.now()
      ) {
        return false
      }

      return true
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR VALIDATING STORE

        ${err}

        -------------------------
        `)
      throw new (err.message ?? 'Error validating store')()
    }
  }

  async getStoreExpireDate(storeId: string) {
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
      throw new (err.message ?? 'Error fetching store')()
    }
  }

  /**
   * Validates if a user is owner of the store
   *
   * true: means its the owner
   * false: means its not the user or simply the store was not found...
   * @param userId uuid internal user id
   * @param storeId uuid
   * @returns boolean
   */
  async validateUserStoreOwnership(
    userId: string,
    storeId: string,
  ): Promise<boolean> {
    try {
      await this.getStoreById(userId, storeId)
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
      throw new Error(err.message ?? 'Error validating store ownership')
    }
  }

  /**
   * Obtain a store by its storeId
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @returns parsed store schema
   */
  async getStoreById(userId: string, storeId: string): Promise<store_SCHEMA> {
    try {
      const store = await db
        .select()
        .from(stores)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)))
        .limit(1)

      if (!store[0]) throw new Error('Store was not found!')

      return VISUALIZE_store_SCHEMA.parse(store[0])
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR GETTING STORE BY STORE ID

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'Error getting store')
    }
  }

  /**
   * Create a store to a user
   *
   * @param userId uuid internal user id
   * @param dto create store object
   */
  async createstore(userId: string, dto: DTO_CREATE_store) {
    try {
      await db.insert(stores).values({
        id: uuidv4(),
        userId: userId,
        storeName: dto.storeName,
        storeType: dto.storeType,
      })

      return 'Store created'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR CREATING STORE

        ${err}

        -------------------------
     `)
      throw new Error('Error creating store')
    }
  }

  /**
   * Update a store related to an user
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @param dto create store object
   * @returns
   */
  async updatestore(userId: string, storeId: string, dto: DTO_CREATE_store) {
    // validate user ownership
    const ownership = await this.validateUserStoreOwnership(userId, storeId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    // obtains the current store info
    const store = await this.getStoreById(userId, storeId)

    // object to compare what data have changed
    const updateObj: Record<string, any> = {}

    // storeName
    if (
      typeof dto.storeName !== 'undefined' &&
      dto.storeName !== store.storeName
    ) {
      updateObj.storeName = dto.storeName
    }

    // storeCurrency
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

      return 'Store has been updated'
    } catch (err: any) {
      console.log(`
        -------------------------
        ERROR UPDATING STORE

        ${err}

        -------------------------
     `)
      throw new Error(err.message ?? 'Error updating store')
    }
  }

  /**
   * ANNIQUILATION OF A store......
   * GOODBYEstore NEVER SEEN AGAIN
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @returns bool
   */
  async deletestore(userId: string, storeId: string) {
    // validate user ownership
    const ownership = await this.validateUserStoreOwnership(userId, storeId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }
    try {
      await db
        .delete(stores)
        .where(and(eq(stores.userId, userId), eq(stores.id, storeId)))

      return true
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error deleting store')
    }
  }

  /**
   * Obtain the list of shipping methods from a store
   *
   * @param storeId uuid
   * @returns "0" methods string || array of methods
   */
  async getStoreShippingMethods(storeId: string) {
    try {
      const methods = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.storeId, storeId))

      if (methods.length === 0) {
        return `There are a total of 0 Shipping Methods...`
      }

      return VISUALIZE_METHOD_SCHEMA.array().parse(methods)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error finding methods')
    }
  }

  /**
   * Validate if a shipping method already exists on db
   *
   * valid means its availables
   * invalid means its already in use
   *
   * @param storeId uuid
   * @param shippingMethodName string
   * @returns valid | invalid
   */
  async ValidateShippingMethodName(
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
      console.error(err)
      throw new Error(err.message ?? 'Error validating shipping method')
    }
  }

  /**
   * Add a shipping method to a store
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @param shippingMethod string
   * @returns "msg"
   */
  async addShippingMethod(
    userId: string,
    storeId: string,
    shippingMethod: string,
  ) {
    // validate user ownership
    const ownership = await this.validateUserStoreOwnership(userId, storeId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    const validMethod = await this.ValidateShippingMethodName(
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
      console.error(err)
      throw new Error(err.message ?? 'Error adding shipping method')
    }
  }

  /**
   * Delete a shipping method
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @param methodId uuid
   * @returns "msg"
   */
  async deleteShippingMethod(
    userId: string,
    storeId: string,
    methodId: string,
  ) {
    // validate user ownership
    const ownership = await this.validateUserStoreOwnership(userId, storeId)
    // returned false
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
      console.log(err)
      throw new Error(err.message ?? 'Error deleting shipping method')
    }
  }

  /**
   * Returns the method name from its id
   *
   * @param shippingMethodId
   * @returns method name
   */
  async getStoreShippingMethodFromId(shippingMethodId: string) {
    try {
      const method = await db
        .select()
        .from(shippingMethods)
        .where(eq(shippingMethods.id, shippingMethodId))
        .limit(1)

      if (!method[0]) throw new Error('Shipping method not found!')

      return method[0].method
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error retrieving shipping method')
    }
  }

  /**
   * Obtain the list of  payment methods from a store
   *
   * @param storeId uuid
   * @returns "0" methods string || array of methods
   */
  async getStorePaymentMethods(storeId: string) {
    try {
      const methods = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.storeId, storeId))

      if (methods.length === 0) {
        return `There are a total of 0 Payment Methods...`
      }

      return VISUALIZE_METHOD_SCHEMA.array().parse(methods)
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error finding methods')
    }
  }

  /**
   * Validate if a payment method already exists on db
   *
   * valid means its availables
   * invalid means its already in use
   *
   * @param storeId uuid
   * @param shippingMethodName string
   * @returns valid | invalid
   */
  async ValidatePaymentMethodName(
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
      console.error(err)
      throw new Error(err.message ?? 'Error validating payment method')
    }
  }

  /**
   * add a payment method to a store
   *
   * @param userId uuid internal user id
   * @param storeId uuid
   * @param paymentMethod storeid
   * @returns "msg"
   */
  async addPaymentMethod(
    userId: string,
    storeId: string,
    paymentMethod: string,
  ) {
    // validate user ownership
    const ownership = await this.validateUserStoreOwnership(userId, storeId)
    // returned false
    if (!ownership) {
      throw new Error('Ups... This is restricted area! - not authorized')
    }

    const validMethod = await this.ValidatePaymentMethodName(
      storeId,
      paymentMethod,
    )

    if (validMethod === 'invalid') {
      throw new Error('Shipping Method already exists!')
    }

    try {
      await db.insert(paymentMethods).values({
        id: uuidv4(),
        storeId: storeId,
        method: paymentMethod,
      })

      return `New shipping method: ${paymentMethod}`
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error adding shipping method')
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
  async deletePaymentMethod(userId: string, storeId: string, methodId: string) {
    // validate user ownership
    const ownership = await this.validateUserStoreOwnership(userId, storeId)
    // returned false
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
      console.log(err)
      throw new Error(err.message ?? 'Error deleting payment method')
    }
  }

  /**
   * Returns the method name from its id
   *
   * @param paymentMethodId
   * @returns method name
   */
  async getstorePaymentMethodFromId(paymentMethodId: string) {
    try {
      const method = await db
        .select()
        .from(paymentMethods)
        .where(eq(paymentMethods.id, paymentMethodId))
        .limit(1)

      if (!method[0]) throw new Error('Payment method not found!')

      return method[0].method
    } catch (err: any) {
      console.error(err)
      throw new Error(err.message ?? 'Error retrieving payment method')
    }
  }
}

/**
 * Obtains the store and product information about a store
 *
 * SHOULD ONLY BE RENDERER on **store VIEW ROUTE**,
 * THIS FUNCTION SHOULD ONLY BE USED TO RENDER WHEN ACTUALY NEEDED
 *
 * @param storeId uuid
 */
export async function publicStore(storeId: string) {
  try {
    const store = await db
      .select({
        storeName: stores.storeName,
        storeCurrency: stores.storeCurrency,
      })
      .from(stores)
      .where(eq(stores.id, storeId))
      .limit(1)

    if (!store[0]) throw new Error('store was not found')

    return store[0]
  } catch (err: any) {
    console.error(err)
    throw new Error(err.message ?? 'Error finding store')
  }
}

// get all the user stores from its id
// export async function getUserstoresByUserId(
//   userId: string,
// ): Promise<Array<storeExtendedSchemaType> | null> {
//   try {
//     const userstores = await db
//       .select()
//       .from(stores)
//       .where(eq(stores.userId, userId))

//     if (userstores.length === 0) return null
//     return storeExtendedSchema.array().parse(userstores)
//   } catch (err: any) {
//     console.error(err)
//     throw new Error('Error getting user stores')
//   }
// }

// get store by id
// export async function getNameBystoreId(storeId: string) {
//   try {
//     const store = await db
//       .select({
//         storeName: stores.storeName,
//       })
//       .from(stores)
//       .where(eq(stores.id, storeId))
//       .limit(1)

//     console.log(store.length)
//     if (store.length === 0) throw new Error('store not found')
//     return store[0].storeName
//   } catch (err: any) {
//     console.error(err)
//     throw new Error(err.message ?? 'Error getting store')
//   }
// }
