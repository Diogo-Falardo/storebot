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
  serverUpdateProductFromShop,
} from '@/server/shop/products/product.functions'
import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { Eye, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

type productProps = {
  id: string
  shopId: string
  productName: string
  productPrice: string
  prouctDesc?: string | null
}

const ProductCardADM = (product: productProps) => {
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false)
  const deleted = useServerFn(serverDeleteProductFromShop)

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

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-xl">{product.productName}</CardTitle>
        <CardDescription>{product.prouctDesc ?? ''}</CardDescription>
        {/* visibility toogler */}
        <CardAction>
          <Button variant={'ghost'} className="text-sm">
            <Eye className="h-3 w-3" />
            hide product
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-end justify-end">
        <Label className="text-xl">{product.productPrice}</Label>
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
        <Button>Update Product</Button>
      </CardFooter>
    </Card>
  )
}

export default ProductCardADM
