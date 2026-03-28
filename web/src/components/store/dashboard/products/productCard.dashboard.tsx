import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useServerFn } from '@tanstack/react-start'
import {
  Edit2Icon,
  EllipsisVerticalIcon,
  EyeIcon,
  EyeOffIcon,
  Trash2Icon,
} from 'lucide-react'
import ProductUpdate from './productUpdate'
import ProductImageUploader from './productImageUploader'
import ConfirmationDialog from '@/components/confirmationDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { useLayoutDashboard } from '@/lib/data'
import {
  sf_delete_Product,
  sf_toogle_ProductVisibilty,
} from '@/server/products/product.functions'
import { type_schema_PRODUCT } from '@/db/schemas/product.schema'

type productProps = type_schema_PRODUCT & { storeCurrency: string }

const ProductCardDashboard = (product: productProps) => {
  const queryClient = useQueryClient()
  const [openProductUpdate, setOpenProductUpdate] = useState<boolean>(false)
  const [openProductImageUploader, setOpenProductImageUploader] =
    useState<boolean>(false)
  const [openConfirmDeleteProduct, setOpenConfirmDeleteProduct] =
    useState<boolean>(false)
  const dropDowmMenuRef = useRef<HTMLDivElement>(null)
  const setOpenProductInfoCard = useLayoutDashboard(
    (pId) => pId.setProductInfoActive,
  )
  const setOpenProductInfoCardCategoryId = useLayoutDashboard(
    (cId) => cId.setProductInfoActiveCategoryId,
  )

  const deleted = useServerFn(sf_delete_Product)
  const visibility = useServerFn(sf_toogle_ProductVisibilty)

  const deleteProduct = async () => {
    try {
      const result = await deleted({
        data: { storeId: product.storeId, productId: product.productId },
      })

      if (result) {
        toast.success('Product got deleted!')
        queryClient.invalidateQueries({
          queryKey: ['products', product.storeId],
        })
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Error while deleting product')
    }
  }

  const visibilityToogler = async () => {
    try {
      const result = await visibility({
        data: { storeId: product.storeId, productId: product.productId },
      })

      if (result) {
        toast.success(
          product.productVisible === 1 ? 'Product hidden!' : 'Product shown!',
        )
        queryClient.invalidateQueries({
          queryKey: ['products', product.storeId],
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
    <Card className="cursor-pointer w-full p-2.5 bg-background ring ring-primary border-primary/50">
      <CardContent className="flex w-full items-center justify-between p-0 gap-4">
        <div
          onClick={() => {
            setOpenProductInfoCardCategoryId(product.productCategoryId)
            setOpenProductInfoCard(product.productCategoryId)
          }}
          className="flex-1 flex gap-2 items-center"
        >
          <div className="relative w-15 h-15 shrink-0">
            <img
              src={product.productImageUrl || PLACEHOLDER_IMG}
              alt={product.productName}
              className="w-15 h-15 object-cover rounded"
            />
            <div className="absolute -bottom-1 left-0.75 shadow-sm">
              {product.productVisible ? (
                <Badge className="bg-green-800 ring ring-green-700/50 border border-green-600/50 w-13.5 text-xs text-white rounded-sm">
                  active
                </Badge>
              ) : (
                <Badge className="bg-neutral-800 ring ring-neutral-700/50 border border-neutral-600 w-13.5 text-white text-xs rounded-sm">
                  inactive
                </Badge>
              )}
            </div>
          </div>
          <CardHeader className="w-full flex flex-col gap-0 p-0">
            <CardTitle className="text-xl">{product.productName}</CardTitle>
            <CardDescription>
              {product.productPrice} {product.storeCurrency}
            </CardDescription>
          </CardHeader>
        </div>
        <div ref={dropDowmMenuRef}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'outline'}
                className="cursor-pointer"
                size={'icon'}
              >
                <EllipsisVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="p-2 w-auto min-w-11 flex flex-col gap-1"
              align="end"
            >
              {/* visibily toogler button */}
              <DropdownMenuItem asChild>
                <Button
                  variant={'outline'}
                  size={'icon'}
                  className="cursor-pointer"
                  onClick={visibilityToogler}
                  aria-label={
                    product.productVisible ? 'Hide product' : 'Show product'
                  }
                  title={
                    product.productVisible ? 'Hide product' : 'Show product'
                  }
                >
                  {product.productVisible ? <EyeOffIcon /> : <EyeIcon />}
                </Button>
              </DropdownMenuItem>
              {/* edit button  */}
              <DropdownMenuItem asChild>
                <Button
                  variant={'outline'}
                  size="icon"
                  onClick={() => setOpenProductUpdate(true)}
                >
                  <Edit2Icon />
                </Button>
              </DropdownMenuItem>
              {/* change image button */}
              <DropdownMenuItem asChild>
                <ProductImageUploader
                  open={openProductImageUploader}
                  setOpen={setOpenProductImageUploader}
                  storeId={product.storeId}
                  productId={product.productId}
                  productName={product.productName}
                />
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* delete button */}
              <DropdownMenuItem asChild>
                <Button
                  size={'icon'}
                  onClick={() => setOpenConfirmDeleteProduct(true)}
                  variant={'destructive'}
                >
                  <Trash2Icon />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
            {/* item - edit */}
            <ProductUpdate
              open={openProductUpdate}
              setOpen={setOpenProductUpdate}
              product={product}
            />
            {/* item - delete dialog */}
            <ConfirmationDialog
              open={openConfirmDeleteProduct}
              onOpenChange={setOpenConfirmDeleteProduct}
              onConfirm={deleteProduct}
            />
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCardDashboard
