// component to add a product to a cart
// ui
import { ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'

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
  }

  return (
    <Button onClick={addItemToStorage}>
      <ShoppingCart />
      Add to cart
    </Button>
  )
}

export default CartAdd
