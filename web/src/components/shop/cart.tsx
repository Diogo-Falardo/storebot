import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { ShoppingBag, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Card } from '../ui/card'
import Checkout from './orders/checkout'
import { sf_ValidateIfProductExists } from '@/server/shop/products/product.functions'

type StoredItem = {
  productId: string
  productName: string
  productPrice: string
  quantity: number
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
}: {
  shopId: string
  shopCurrency: string | null
}) => {
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
    total: Number(item.productPrice) * item.quantity,
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
      <SheetContent className="p-2">
        {cartProducts.length > 0 ? (
          <div>
            <SheetHeader>
              <SheetTitle>Products in Cart:</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2">
              {cartProducts.map((item) => (
                <Card
                  key={item.productId}
                  className="p-2 bg-transparent rounded-sm border flex-col gap-2"
                >
                  <div className="flex flex-col gap-1">
                    <h1 className="text-xl">{item.productName}</h1>
                    <h1 className="flex gap-1 text-lg">
                      {item.productPrice}
                      <span>{shopCurrency}</span>
                    </h1>
                  </div>
                  <div className="flex w-full justify-end">
                    <Button
                      variant={'ghost'}
                      className="text-destructive cursor-pointer"
                      size={'icon'}
                      onClick={() => removeItemFromStorage(item.productId)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>No products</div>
        )}
        <div className="flex justify-between px-2">
          <h1 className="text-lg">Total:</h1>
          <p>{total ? `${total.toFixed(2)} ${shopCurrency}` : ''}</p>
        </div>
        <Checkout shopId={shopId} productsId={validatedProducts} />
      </SheetContent>
    </Sheet>
  )
}

export default Cart
