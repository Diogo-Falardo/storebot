import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'

type ProductInfoProps = {
  productName: string
  productDesc: string | null | undefined
  productPrice: string
  productCategory: string | null
  productImage: string | null
  shopCurrency: string | null
}

export const ProductInfo = (product: ProductInfoProps) => {
  const PLACEHOLDER_IMG = 'https://placehold.co/400x300?text=No+Image'
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Info className="mr-2" /> Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-0">
        <Card className="relative mx-auto w-full max-w-md pt-0">
          <img
            src={product.productImage || PLACEHOLDER_IMG}
            alt={product.productName}
            className="w-full object-cover  rounded-t-lg"
          />
          <div className="p-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {product.productName}
              </DialogTitle>
              <DialogDescription className="mb-2 text-muted-foreground">
                {product.productCategory === null ? (
                  <Badge variant="outline" className="rounded-sm">
                    no category
                  </Badge>
                ) : (
                  <Badge variant="outline" className="rounded-sm">
                    {product.productCategory}
                  </Badge>
                )}
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-primary">
                {product.productPrice}
                <span>{product.shopCurrency}</span>
              </span>
            </div>
            <p className="mb-4 mt-2">
              {!product.productDesc ? 'no description' : product.productDesc}
            </p>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
