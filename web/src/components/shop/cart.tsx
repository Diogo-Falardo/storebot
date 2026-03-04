import { useState } from 'react'
// ui
import { Button } from '../ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet'
import { Card } from '../ui/card'
import { ShoppingBag } from 'lucide-react'

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

const Cart = () => {
  const [stored, setStored] = useState<Array<StoredItem>>(() =>
    getItemFromStorage(),
  )

  // refreshes the cart everytime the user opens it
  const refreshCart = () => setStored(getItemFromStorage())

  const cartProducts = stored.map((item) => ({
    ...item,
    total: Number(item.productPrice) * item.quantity,
  }))

  const total = cartProducts.reduce((sum, item) => sum + item.total, 0)

  const sendDataToApi = () => {
    return console.log(JSON.stringify(cartProducts))
  }

  return (
    <Sheet onOpenChange={(open) => open && refreshCart()}>
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
                <Card key={item.productId} className="p-2">
                  <h1>{item.productName}</h1>
                  <h1 className="flex gap-4">{item.productPrice}</h1>
                  <h2>
                    Total: <span>{item.total}</span>
                  </h2>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>No products</div>
        )}
        <div className="flex justify-between px-2">
          <h1 className="text-lg">Total:</h1>
          <p>{total ? `${total.toFixed(2)}` : ''}</p>
        </div>
        <Button onClick={sendDataToApi}>Checkout</Button>
      </SheetContent>
    </Sheet>
  )
}

export default Cart
