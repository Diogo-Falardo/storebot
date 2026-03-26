import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type productCardProps = {
  productId: string
  productName: string
  productPrice: string
  productImg: string
  storeCurrency: string
}

const ProductCard = (product: productCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.productName}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 items-center">
        <img src={product.productImg} />
        <div>
          <h1>
            {product.productPrice}
            <span>{product.storeCurrency}</span>
          </h1>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
