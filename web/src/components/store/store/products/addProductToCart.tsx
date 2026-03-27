import { toast } from 'sonner'
import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

type CartAddProps = {
  productId: string
  productName: string
  productPrice: string
  productImageUrl: string | null
}

const AddProductToCart = ({
  productId,
  productName,
  productPrice,
  productImageUrl,
}: CartAddProps) => {
  const addItemToStorage = () => {
    const key = 'cart-item:' + productId
    const cartItem = JSON.stringify({
      productId,
      productName,
      productPrice,
      productImageUrl,
    })
    localStorage.setItem(key, cartItem)
    toast.success(`${productName} added to the cart`)
  }

  return (
    <Button className="w-full" variant={'secondary'} onClick={addItemToStorage}>
      <ShoppingCart />
      Add to cart
    </Button>
  )
}

export default AddProductToCart
