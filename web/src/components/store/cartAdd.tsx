import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'
import { Button } from '../ui/button'

type CartAddProps = {
  productId: string
  productName: string
  productPrice: string
  productImg: string | null
}

const CartAdd = ({
  productId,
  productName,
  productPrice,
  productImg,
}: CartAddProps) => {
  const addItemToStorage = () => {
    const key = 'cart-item:' + productId
    const cartItem = JSON.stringify({
      productId,
      productName,
      productPrice,
      productImg,
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
