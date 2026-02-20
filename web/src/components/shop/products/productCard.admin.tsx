import ConfirmationDialog from '@/components/confirmationDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  serverDeleteProductFromShop,
  serverToogleProductVisibilty,
  serverUpdateProductFromShop,
} from '@/server/shop/products/product.functions'
import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Eye, EyeOff, ToolCaseIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import ProductUpdate from './productUpdate'

type productProps = {
  id: string
  shopId: string
  productName: string
  productPrice: string
  productDesc?: string | null
  visible: number
}

const ProductCardADM = (product: productProps) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const deleted = useServerFn(serverDeleteProductFromShop)
  const visibility = useServerFn(serverToogleProductVisibilty)

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

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl">{product.productName}</CardTitle>
        {/* visibility toogler */}
        <CardAction>
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
        </CardAction>
      </CardHeader>
      <CardContent>
        <CardDescription>{product.productDesc ?? ''}</CardDescription>
        <div className="flex justify-end">
          <Label className="text-xl">{product.productPrice}</Label>
        </div>
      </CardContent>
      <CardFooter className="flex items-end justify-end gap-2">
        {/* delete */}
        <Button
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
        {/* update */}
        <ProductUpdate {...product} />
      </CardFooter>
    </Card>
  )
}

export default ProductCardADM
