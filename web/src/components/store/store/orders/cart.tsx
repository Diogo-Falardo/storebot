import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { ShoppingCart, X } from 'lucide-react'
import Checkout from './checkout'
import { sf_validate_IfProductExists } from '@/server/products/product.functions'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type StoredItem = {
  productId: string
  productName: string
  productPrice: string
  productImageUrl: string | null
}

const CART_PREFIX = 'cart-item:'

// function to get all the items from localstorage
function getItemFromStorage(): Array<StoredItem> {
  const stored: Array<StoredItem> = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key?.startsWith(CART_PREFIX)) continue

    const value = localStorage.getItem(key)
    if (!value) continue

    const item = JSON.parse(value)
    stored.push(item)
  }

  return stored
}

export function clearCartStorage() {
  const keysToRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith(CART_PREFIX)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

const Cart = ({
  storeId,
  storeCurrency,
  telegramUserId,
}: {
  storeId: string
  storeCurrency: string
  telegramUserId: number
}) => {
  if (typeof telegramUserId !== 'number') {
    throw new Error('Couldnt validate telegram session!')
  }

  // stored localhost items
  const [stored, setStored] = useState<Array<StoredItem>>([])
  const [validatedProducts, setValidatedProducts] = useState<Array<string>>([])

  // serverFn
  const validProduct = useServerFn(sf_validate_IfProductExists)

  useEffect(() => {
    setStored(getItemFromStorage())
  }, [])

  // refreshes the cart everytime the user opens it
  const refreshCart = () => setStored(getItemFromStorage())

  const cartProducts = stored.map((item) => ({
    ...item,
    total: Number(item.productPrice),
  }))

  // counts the total of the cart
  const total = cartProducts.reduce((sum, item) => sum + item.total, 0)

  function removeItemFromStorage(productId: string) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key?.startsWith(CART_PREFIX)) continue

      const value = localStorage.getItem(key)
      if (!value) continue

      const item = JSON.parse(value)
      if (item.productId === productId) {
        localStorage.removeItem(key)
        refreshCart()
      }
    }
  }

  // validate cart products
  async function validateCartProducts() {
    const items = getItemFromStorage()
    const results = await Promise.all(
      items.map(async (product) => {
        const valid = await validProduct({
          data: { storeId, productId: product.productId },
        })
        return { productId: product.productId, valid }
      }),
    )

    const validIds: Array<string> = []
    let removed = false

    for (const result of results) {
      if (result.valid === 'valid') {
        validIds.push(result.productId)
      } else {
        removeItemFromStorage(result.productId)
        removed = true
      }
    }

    if (removed) {
      toast.info(`Some products were removed because they were outdated!`)
    }

    setValidatedProducts(validIds)
    setStored(getItemFromStorage())
  }

  return (
    <Sheet
      onOpenChange={async (open) => {
        if (open) {
          await validateCartProducts()
        }
      }}
    >
      <SheetTrigger asChild>
        <Button>
          <ShoppingCart />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full p-3">
        <SheetDescription className="p-0"></SheetDescription>
        {/* container 1 */}
        <div className="flex-1 min-h-0">
          {cartProducts.length > 0 ? (
            <div className="flex flex-col h-full">
              {/* header when there is items */}
              <SheetHeader className="px-0 py-5">
                <SheetTitle className="text-xl text-neutral-400 font-medium flex gap-2">
                  <ShoppingCart /> Products in Cart
                </SheetTitle>
              </SheetHeader>
              <div className="w-full overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="flex flex-col gap-2">
                    {/* each product */}
                    {cartProducts.map((item) => (
                      <Card
                        key={item.productId}
                        className=" bg-transparent rounded-sm border p-2"
                      >
                        <div className="flex justify-between">
                          <div className="flex w-full gap-2">
                            {item.productImageUrl && (
                              <img
                                src={item.productImageUrl}
                                className="w-full max-w-24 h-24 object-cover border-2 border-white/10 rounded-md"
                              />
                            )}
                            <div className="w-full   flex flex-col">
                              <h1 className="text-base">{item.productName}</h1>
                              <h1 className="flex gap-1">
                                {item.productPrice}
                                <span>{storeCurrency}</span>
                              </h1>
                            </div>
                          </div>

                          <Button
                            variant={'ghost'}
                            className="text-destructive cursor-pointer"
                            size={'icon'}
                            onClick={() =>
                              removeItemFromStorage(item.productId)
                            }
                          >
                            <X />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            // no cart products
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant={'icon'}>
                  <ShoppingCart className="opacity-40" />
                </EmptyMedia>
                <EmptyTitle>Your cart is empty</EmptyTitle>
                <EmptyDescription>
                  Add some items to your cart to continue with your order.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>

        {/* container 2 */}
        <div>
          <div className="flex justify-between">
            <h1 className="text-lg">Total:</h1>
            <p>{total ? `${total.toFixed(2)} ${storeCurrency}` : ''}</p>
          </div>

          <Checkout
            telegramUserId={telegramUserId}
            storeId={storeId}
            productsId={validatedProducts}
            isCartEmpty={cartProducts.length === 0}
            onCartCleared={refreshCart}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Cart
