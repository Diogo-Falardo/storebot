import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { ShoppingBag, ShoppingCart, Trash2, X } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Card } from '../ui/card'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'
import { ScrollArea } from '../ui/scroll-area'
import Checkout from './orders/checkout'
import { sf_ValidateIfProductExists } from '@/server/shop/products/product.functions'

type StoredItem = {
  productId: string
  productName: string
  productPrice: string
  productImg: string | null
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

const Cart = ({
  shopId,
  shopCurrency,
  telegramUserId,
}: {
  shopId: string
  shopCurrency: string | null
  telegramUserId: number | null
}) => {
  if (typeof telegramUserId !== 'number') {
    throw new Error('Couldnt validate telegram session!')
  }

  // stored localhost items
  const [stored, setStored] = useState<Array<StoredItem>>([])
  const [validatedProducts, setValidatedProducts] = useState<Array<string>>([])

  // serverFn
  const validProduct = useServerFn(sf_ValidateIfProductExists)

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
    const results = await Promise.all(
      cartProducts.map(async (product) => {
        const valid = await validProduct({
          data: { shopId, productId: product.productId },
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
  }

  return (
    <Sheet
      onOpenChange={async (open) => {
        if (open) {
          refreshCart()
          await validateCartProducts()
        }
      }}
    >
      <SheetTrigger asChild>
        <Button>
          <ShoppingBag /> My Cart
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full p-3">
        {/* container 1 */}
        <div className="flex-1 min-h-0">
          {cartProducts.length > 0 ? (
            <div className="flex flex-col h-full">
              {/* header when there is items */}
              <SheetHeader className="px-0 py-5">
                <SheetTitle className="text-xl flex gap-2">
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
                            {item.productImg && (
                              <img
                                src={item.productImg}
                                className="w-full max-w-24 h-24 object-cover border-2 border-white/10 rounded-md"
                              />
                            )}
                            <div className="w-full   flex flex-col">
                              <h1 className="text-base">{item.productName}</h1>
                              <h1 className="flex gap-1">
                                {item.productPrice}
                                <span>{shopCurrency}</span>
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
            <p>{total ? `${total.toFixed(2)} ${shopCurrency}` : ''}</p>
          </div>

          <Checkout
            telegramUserId={telegramUserId}
            shopId={shopId}
            productsId={validatedProducts}
            isCartEmpty={cartProducts.length === 0}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default Cart
