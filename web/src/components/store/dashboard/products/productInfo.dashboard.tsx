import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { use_getProductByProductId } from '@/lib/hooks/product.hooks'
import { Spinner } from '@/components/ui/spinner'
import { useLayoutDashboard } from '@/lib/data'
import { use_getCategoryNameByCategoryId } from '@/lib/hooks/category.hooks'

export const ProductInfoDashboard = ({
  storeId,
  productId,
}: {
  storeId: string
  productId: string
}) => {
  const activeProductCategoryId = useLayoutDashboard(
    (cId) => cId.productInfoActiveCategoryId,
  )
  const { data: product, isLoading: productIsLoading } =
    use_getProductByProductId({ storeId, productId })
  const { data: categoryName, isLoading: categoryNameIsLoading } =
    use_getCategoryNameByCategoryId({
      storeId,
      categoryId:
        activeProductCategoryId === null ? undefined : activeProductCategoryId,
    })

  console.log(activeProductCategoryId)
  console.log(categoryName)

  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      )
    }
  }, [productId])

  if (productIsLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex gap-2">
          <Spinner />
          loading product...
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex gap-2">product not found...</div>
      </div>
    )
  }

  return (
    <Card
      ref={cardRef}
      className="w-full max-w-md dark:bg-background shadow-xl rounded-xl flex flex-col items-center p-6 gap-6 ring ring-secondary border-primary/20"
    >
      <div className="w-full flex items-center justify-between">
        <Badge variant={'outline'} className="rounded-sm">
          {categoryNameIsLoading ? (
            <span className="flex gap-2">
              <Spinner /> loading category...
            </span>
          ) : categoryName === null || categoryName === undefined ? (
            <span className="text-muted-foreground">no category</span>
          ) : (
            <span>{categoryName}</span>
          )}
        </Badge>
        <Badge
          variant={product.visible ? 'default' : 'outline'}
          className={`rounded-sm ${product.visible ? 'bg-green-500' : 'bg-zinc-400'}`}
        >
          {product.visible ? (
            <span className="flex items-center gap-1">
              <EyeIcon className="size-4" /> Visible
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <EyeOffIcon className="size-4" /> Hidden
            </span>
          )}
        </Badge>
      </div>
      <img
        src={product.imageUrl || PLACEHOLDER_IMG}
        alt={product.productName}
        className="w-full h-70 object-cover rounded-lg border"
      />
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{product.productName}</h2>
          <span className="text-lg font-bold ">{product.productPrice}</span>
        </div>

        {product.productDesc && (
          <p className="text-sm text-muted-foreground mt-2">
            {product.productDesc}
          </p>
        )}
      </div>
    </Card>
  )
}
