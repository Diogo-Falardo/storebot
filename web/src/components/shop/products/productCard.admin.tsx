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
  CardContent,
  CardDescription,
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
        queryClient.invalidateQueries({
          queryKey: ['products', product.shopId],
        })
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
        queryClient.invalidateQueries({
          queryKey: ['products', product.shopId],
        })
      }
    } catch (err: any) {
      toast.error(
        err.message ?? 'Error switching the visibility of the product',
      )
    }
  }

  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  return (
    <Card className="p-2 w-full max-w-sm">
      <CardContent className="flex flex-col w-full justify-between p-0 gap-4">
        <div className="flex flex-col gap-2">
          {/* PRODUCT HEADER
        
        - productName
        - productPrice and shopCurrency
        */}

          <CardHeader className="w-full flex flex-col gap-0 p-0">
            <CardTitle className="text-xl">{product.productName}</CardTitle>
            <CardDescription>
              {product.productPrice} {product.shopCurrency}
            </CardDescription>
          </CardHeader>
        </div>
        {/* PRODUCT BODY

        - add a product image
        - update product
        - hide product
        - delete product
        
        */}
        <div className="flex items-center justify-between gap-4">
          {/* left */}
          <div className="flex w-full justify-center items-center">
            <img
              src={product.imageUrl || PLACEHOLDER_IMG}
              alt={product.productName}
              className="w-full h-40 object-cover rounded"
            />
          </div>
          {/* right */}
          <div className="flex flex-col gap-1">
            {/* visibility toogler */}
            <Button
              variant={'outline'}
              className="text-sm"
              onClick={() => visibilityToogler()}
            >
              {product.visible === 1 ? (
                <>
                  <EyeOff className="h-3 w-3" />
                  Hide
                </>
              ) : (
                <>
                  <Eye className="h-3 w-3" />
                  show
                </>
              )}
            </Button>
            <ImgUploader shopId={product.shopId} productId={product.id} />
            {/* update */}
            <ProductUpdate {...product} />
            {/* delete */}
            <Button
              className=""
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
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCardADM
