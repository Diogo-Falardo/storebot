import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import { Eye, EyeOff, Trash2 } from 'lucide-react'
import ProductUpdate from './productUpdate'
import {
  sf_DeleteProductFromShop,
  sf_ToogleProductVisibilty,
} from '@/server/shop/products/product.functions'
import ConfirmationDialog from '@/components/confirmationDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import ImgUploader from '@/components/imgUploader'

type productProps = {
  id: string
  shopId: string
  productName: string
  productPrice: string
  productDesc?: string | null
  categoryId?: string | null
  visible: number
  imageUrl: string | null
  shopCurrency: string | null
}

const ProductCardADM = (product: productProps) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const deleted = useServerFn(sf_DeleteProductFromShop)
  const visibility = useServerFn(sf_ToogleProductVisibilty)

  const queryClient = useQueryClient()

  const deleteProduct = async () => {
    try {
      const result = await deleted({
        data: { shopId: product.shopId, productId: product.id },
      })

      if (result) {
        toast.success('Product got deleted!')
        queryClient.invalidateQueries({ queryKey: ['products'] })
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Error while deleting product')
    }
  }

  const visibilityToogler = async () => {
    try {
      const result = await visibility({
        data: { shopId: product.shopId, productId: product.id },
      })

      if (result) {
        toast.success(
          product.visible === 1 ? 'Product hidden!' : 'Product shown!',
        )
        queryClient.invalidateQueries({ queryKey: ['products'] })
      }
    } catch (err: any) {
      toast.error(
        err.message ?? 'Error switching the visibility of the product',
      )
    }
  }
  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  return (
    <Card className="relative mx-auto w-full max-w-sm pt-0">
      <img
        src={product.imageUrl || PLACEHOLDER_IMG}
        alt={product.productName}
        className="w-full h-45 object-cover rounded-t-lg"
      />
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl">{product.productName}</CardTitle>
        <CardDescription>
          {product.productPrice} {product.shopCurrency}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col gap-2">
        <div className="flex w-full items-center justify-between">
          <ImgUploader productId={product.id} />
          {/* visibility toogler */}

          <Button
            variant={'ghost'}
            className="text-sm"
            onClick={() => visibilityToogler()}
          >
            {product.visible === 1 ? (
              <>
                <Eye className="h-3 w-3" />
                Hide product
              </>
            ) : (
              <>
                <EyeOff className="h-3 w-3" />
                Show product
              </>
            )}
          </Button>
        </div>
        {/* update */}
        <ProductUpdate {...product} />
        {/* delete */}
        <Button
          className="w-full"
          variant={'destructive'}
          onClick={() => setOpenConfirmDelete(true)}
        >
          <Trash2 />
          Delete
        </Button>
        {/* confirm delete pop up */}
        <ConfirmationDialog
          open={openConfirmDelete}
          onOpenChange={setOpenConfirmDelete}
          title={`Delete ${product.productName}? `}
          description={`This will delete the ${product.productName} product from your shop!`}
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={() => deleteProduct()}
        />
      </CardFooter>
    </Card>
  )
}

export default ProductCardADM
