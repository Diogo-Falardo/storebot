import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  CREATE_ORDER_CUSTOM_MESSGE,
  ORDER_SCHEMA,
  ORDER_STATUS_ENUM,
  OrderStatus,
} from '@/schemas/order.schema'
import {
  sf_GetPaymentMethodName,
  sf_GetShippingMethodName,
} from '@/server/shop/shop.functions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { useGetProductsFromOrders } from '@/lib/hooks/order.hooks'
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  sf_AddCustomOrderMessage,
  sf_UpdateOrderStatus,
} from '@/server/shop/orders/order.function'

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const OrderCardADM = ({
  shopId,
  shopCurrency,
  order,
}: {
  shopId: string
  shopCurrency: string
  order: ORDER_SCHEMA
}) => {
  // serverFn
  const shippingMethod = useServerFn(sf_GetShippingMethodName)
  const paymentMethod = useServerFn(sf_GetPaymentMethodName)
  const updateOrderStatus = useServerFn(sf_UpdateOrderStatus)

  // states
  const [shippingMethodName, setShippingMethodName] = useState<string>('')
  const [paymentMethodName, setPaymentMethodName] = useState<string>('')
  const [status, setStatus] = useState<string>(order.orderStatus)
  // ui states
  const [sheetOpen, setSheetOpen] = useState(false)

  const queryClient = useQueryClient()

  useEffect(() => {
    // fetch shipping method name
    shippingMethod({
      data: { shippingMethodId: order.orderShippingMethod },
    }).then(setShippingMethodName)
    // fetch payment method name
    paymentMethod({
      data: { paymentMethodId: order.orderPaymentMethod },
    }).then(setPaymentMethodName)
  }, [order.orderShippingMethod, order.orderPaymentMethod])

  const updateStatus = async (newStatus: OrderStatus) => {
    setStatus(newStatus)
    try {
      await updateOrderStatus({
        data: { shopId, orderId: order.id, status: newStatus },
      })
      toast.success(`Status changed to: ${newStatus}!`)
      queryClient.invalidateQueries({ queryKey: ['orders', shopId, order.id] })
    } catch (err: any) {
      toast.error(err.message ?? 'Error updating order status')
    }
  }

  return (
    <div className="w-full max-w-sm">
      <Card className="p-2  w-full max-w-sm">
        <CardContent className="flex flex-col w-full justify-between p-0 gap-4">
          {/* header */}
          <CardHeader className="w-full flex flex-row justify-between items-start gap-0 p-0">
            <CardTitle className="text-xl w-full p-0">
              Order for: {order.orderIdentifier}
            </CardTitle>
            {/* order status changer */}
            <div
              className="w-full flex flex-row gap-2 justify-end items-end"
              onClick={(e) => e.stopPropagation()}
            >
              <Label className="text-xl mb-1">Status</Label>
              <Select value={status} onValueChange={updateStatus}>
                <SelectTrigger className="uppercase dark:bg-neutral-950 text-xs ">
                  <SelectValue placeholder={status.replace('_', ' ')} />
                </SelectTrigger>
                <SelectContent>
                  {ORDER_STATUS_ENUM.options.map((statusOption) => (
                    <SelectItem key={statusOption} value={statusOption}>
                      {statusOption.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          {/* container 1 */}
          {/* order info */}
          <div className="w-full gap-4">
            <h1 className="flex items-center gap-2 font-bold text-lg">
              Order Date:
              <span className="text-base font-normal">
                {formatDate(order.createdAt)}
              </span>
            </h1>
            <h1 className="flex items-center gap-2">
              Payment Method
              <Badge className="rounded bg-emerald-900 text-white">
                {paymentMethodName}
              </Badge>
            </h1>
            <h1 className="flex items-center gap-2">
              Shipping Method
              <Badge className="rounded bg-cyan-900 text-white">
                {shippingMethodName}
              </Badge>
            </h1>
          </div>

          <Button className="mt-4 w-full" onClick={() => setSheetOpen(true)}>
            View Details
          </Button>
        </CardContent>
      </Card>
      <OrderCardSheet
        orderId={order.id}
        shopId={shopId}
        shopCurrency={shopCurrency}
        orderCustomMessage={order.orderCustomMessage}
        orderIdentifier={order.orderIdentifier}
        orderDate={order.createdAt}
        orderDeliveryInstruction={order.orderDeliveryInstruction}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  )
}

const OrderCardSheet = ({
  shopId,
  shopCurrency,
  orderId,
  orderDate,
  orderIdentifier,
  orderDeliveryInstruction,
  orderCustomMessage,
  open,
  onOpenChange,
}: {
  shopId: string
  shopCurrency: string
  orderId: string
  orderDate: string
  orderIdentifier: string
  orderDeliveryInstruction: string
  orderCustomMessage: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  // states
  const [total, setTotal] = useState<number>(0)

  // load the products from each order
  const { data: products, isLoading: productsIsLoading } =
    useGetProductsFromOrders({ shopId, orderId })

  // serverfn
  const add = useServerFn(sf_AddCustomOrderMessage)

  const queryClient = useQueryClient()

  useEffect(() => {
    if (
      products !== 'No Products' &&
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

  // form to update custom ordering message
  const form = useForm({
    defaultValues: {
      orderCustomMessage: '',
    },
    validators: {
      onSubmit: CREATE_ORDER_CUSTOM_MESSGE,
    },
    onSubmit: async ({ value }) => {
      try {
        await add({
          data: { shopId, orderId, message: value.orderCustomMessage },
        })
        toast.success(`Order Custom Message was updated!`)
        queryClient.invalidateQueries({ queryKey: ['orders', shopId, orderId] })
      } catch (err: any) {
        toast.error(err.message ?? 'Error adding custom order message')
      }
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <span />
      </SheetTrigger>
      <SheetContent>
        {/* header */}
        {/* uses to render */}
        <SheetHeader>
          <SheetTitle>
            {`
                ORDER FROM: ${orderIdentifier}
                `}
          </SheetTitle>
          <SheetDescription>{`
                ORDER ID: ${orderId}
                ORDER DATE: ${formatDate(orderDate)}
                `}</SheetDescription>
        </SheetHeader>

        {/* BODY OF THE ORDER
        
        - total of the oder
        - orderDeliveryInstruction
        - products ordered
        */}
        <div className="px-4 flex flex-col gap-4 flex-1 overflow-auto">
          <h1 className="text-lg flex gap-2 font-normal">
            TOTAL:
            <span className="font-medium">
              {total}
              <span className="ml-1">{shopCurrency}</span>
            </span>
          </h1>

          <Label className="text-xl">Delivery Instructions</Label>
          <p className="text-neutral-400">{orderDeliveryInstruction}</p>

          <Label>Products Requested</Label>
          {/* 
          WHILE PRODUCTS ARE LOADING
          */}
          {productsIsLoading && (
            <div className="flex flex-1 justify-center items-center">
              <div className="flex gap-1">
                <Spinner /> Loading products..
              </div>
            </div>
          )}
          {/* 
          LOADED PRODUCTS
          */}
          {!productsIsLoading && products && products !== 'No Products' && (
            <ScrollArea className="flex flex-1 gap-2">
              {/* TOP OF THE SCROLL AREA */}
              <div className="flex flex-col gap-2">
                {products.map((product) => (
                  <Card>
                    <CardContent className="flex gap-2">
                      {/* LEFT SIDE 

                    - produt image
                    */}
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          className="h-15 w-15 rounded object-cover"
                        />
                      )}
                      {/* BODY OF PRODUCTS
                    
                    - product name
                    - product price
                    */}
                      <div className="flex flex-1 justify-between">
                        <div className="flex flex-col">
                          <CardTitle>{product.productName}</CardTitle>
                          <CardDescription>
                            {product.productPrice} {shopCurrency}
                          </CardDescription>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
          {/* BOTTOM OF BODY */}
          <div className="flex flex-col gap-4 items-end mt-auto mb-4">
            <form
              id="add-order-custom-message"
              onSubmit={(e) => {
                e.preventDefault()
                form.handleSubmit()
              }}
            >
              <form.Field
                name="orderCustomMessage"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Order Custome Message
                      </FieldLabel>
                      <FieldDescription>
                        Order Custom Message allows shop administrators to
                        communicate important updates or personalized notes
                        regarding an order. Use this field to inform customers
                        about delays, special instructions, or any issues
                        related to their purchase.
                      </FieldDescription>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder={orderCustomMessage ?? 'Message'}
                        className="h-30"
                      />
                    </Field>
                  )
                }}
              />
            </form>
            <Button
              form="add-order-custom-message"
              type="submit"
              disabled={form.state.isSubmitting}
            >
              {form.state.isSubmitting ? 'Sending Message....' : 'Send Message'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default OrderCardADM
