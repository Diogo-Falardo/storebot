// component to add a product to a cart
// ui
import { ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'

type CartAddProps = {
  productId: string
  productName: string
  productPrice: string
}

const CartAdd = ({ productId, productName, productPrice }: CartAddProps) => {
  const addItemToStorage = () => {
    const key = 'cart-item:' + productId
    const cartItem = JSON.stringify({
      productId,
      productName,
      productPrice,
      quantity: 1,
    })
    localStorage.setItem(key, cartItem)
    toast.success(`${productName} added to the cart`)
  }

  return (
    <Button size={'icon'} onClick={addItemToStorage}>
      <ShoppingCart />
    </Button>
  )
}

export default CartAdd
