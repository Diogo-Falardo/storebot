import { useEffect, useState } from 'react'
import { formatDate } from '../../dashboard/orders/orderTable.dashboard'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { use_get_ProductsFromOrderId } from '@/lib/hooks/order.hooks'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'

const OrderInfo = ({
  storeId,
  storeCurrency,
  orderId,
  orderDate,
  orderIdentifier,
  orderDeliveryInstruction,
  orderCustomMessage,
  open,
  onOpenChange,
}: {
  storeId: string
  storeCurrency?: string | null
  orderId: string
  orderDate: string
  orderIdentifier: string
  orderDeliveryInstruction: string
  orderCustomMessage: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [total, setTotal] = useState<number>(0)

  // load the products from each order
  const { data: products, isLoading: productsIsLoading } =
    use_get_ProductsFromOrderId({ storeId, orderId })

  useEffect(() => {
    if (
      products !== undefined &&
      Array.isArray(products) &&
      products.length > 0
    ) {
      let ptotal = 0
      products.forEach((product) => {
        ptotal += Number(product.productPrice)
      })
      setTotal(ptotal)
    }
  }, [products])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <span />
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-neutral-400">
            Order for:{' '}
            <span className="text-neutral-50">{orderIdentifier}</span>
          </SheetTitle>
          <SheetDescription className="flex flex-col gap-1">
            <h1 className="font-bold text-base">
              Order Id:{' '}
              <span className="font-normal text-neutral-100 text-sm">
                {orderId}
              </span>
            </h1>
            <h1 className="font-bold text-base">
              Order Date:{' '}
              <span className="font-normal text-neutral-100 text-sm">
                {formatDate(orderDate)}
              </span>
            </h1>
          </SheetDescription>
        </SheetHeader>
        <div className="px-4 flex flex-col gap-4 flex-1 overflow-auto">
          <h1 className="text-lg flex gap-2 text-neutral-400 font-normal">
            TOTAL:
            <span className="font-medium text-neutral-50">
              {total.toFixed(2)}
              <span className="ml-1">{storeCurrency}</span>
            </span>
          </h1>

          <Label className="text-xl">Delivery Instructions</Label>
          <p className="text-neutral-400">{orderDeliveryInstruction}</p>

          <Label>Products Requested</Label>
          {productsIsLoading && (
            <div className="flex flex-1 justify-center items-center">
              <div className="flex gap-1">
                <Spinner /> Loading products..
              </div>
            </div>
          )}
          {!productsIsLoading && products && (
            <ScrollArea className="flex flex-1 gap-2">
              <div className="flex flex-col gap-2 p-1">
                {products.map((product) => (
                  <Card className="p-2.5 bg-background ring ring-primary border-primary/50">
                    <CardContent className="flex gap-2 p-0">
                      {product.productImageUrl && (
                        <img
                          src={product.productImageUrl}
                          className="h-15 w-15 rounded object-cover"
                        />
                      )}
                      <div className="flex flex-1 justify-between">
                        <div className="flex flex-col">
                          <CardTitle>{product.productName}</CardTitle>
                          <CardDescription>
                            {product.productPrice} {storeCurrency}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <div className="mb-5 px-4 flex flex-col gap-4">
          <Label className="text-xl">Order Notification Message</Label>
          <p className="min-h-20 border p-2 rounded">
            {orderCustomMessage ?? (
              <div>
                <p className="text-base">No additional information</p>
                <p className="text-sm text-neutral-400">
                  There are no custom updates or messages for this order at the
                  moment.
                </p>
              </div>
            )}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
export default OrderInfo
