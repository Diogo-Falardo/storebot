import AddProductToCart from './addProductToCart'
import { useLayoutPublic } from '@/lib/data'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

type productCardProps = {
  productId: string
  productName: string
  productPrice: string
  productCategoryId: string
  productImageUrl?: string | null
  storeCurrency: string
}

const ProductCard = (product: productCardProps) => {
  const setOpenProductInfoCard = useLayoutPublic(
    (pId) => pId.setProductInfoActive,
  )
  const setOpenProductInfoCardCategoryId = useLayoutPublic(
    (cId) => cId.setProductInfoActiveCategoryId,
  )

  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  return (
    <Card className=" gap-0 p-1 border-primary ring ring-primary bg-background ">
      <div
        className="cursor-pointer select-none"
        onClick={() => {
          setOpenProductInfoCardCategoryId(product.productCategoryId)
          setOpenProductInfoCard(product.productId)
        }}
      >
        <CardHeader className="p-1 w-full text-center">
          <CardTitle className="text-base p-0 text-neutral-200">
            {product.productName}
          </CardTitle>
        </CardHeader>
        <img
          className="w-full h-35 object-cover border ring ring-primary/25 border-secondary rounded"
          src={product.productImageUrl ?? PLACEHOLDER_IMG}
          alt={product.productName}
        />

        <h1 className="p-2 font-bold text-neutral-300 text-sm tracking-wide">
          {product.productPrice}
          <span className="font-normal text-neutral-500 text-xs ml-1 tracking-normal">
            {product.storeCurrency}
          </span>
        </h1>
      </div>

      <div className="w-full mt-auto">
        <AddProductToCart
          productImageUrl={product.productImageUrl ?? null}
          {...product}
        />
      </div>
    </Card>
  )
}

export default ProductCard
