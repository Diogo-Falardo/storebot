import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { EllipsisIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from '@/components/ui/card'
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
import { Spinner } from '@/components/ui/spinner'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  create_ORDER_CUSTOM_MESSAGE,
  enum_ORDER_STATUS,
  type_enum_ORDER_STATUS,
  type_extended_schema_ORDER,
} from '@/db/schemas/order.schema'
import {
  sf_add_CustomOrderMessage,
  sf_update_OrderStatus,
} from '@/server/orders/order.function'
import { use_get_ProductsFromOrderId } from '@/lib/hooks/order.hooks'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const OrderTableDashboard = ({
  storeId,
  storeCurrency,
  orders,
  tableCaption,
}: {
  storeId: string
  storeCurrency: string
  orders: Array<type_extended_schema_ORDER>
  tableCaption: string
}) => {
  const queryClient = useQueryClient()
  const updateOrderStatus = useServerFn(sf_update_OrderStatus)
  const [sheetOpen, setSheetOpen] = useState(false)

  return (
    <Table>
      <TableCaption>{tableCaption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>More</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders
          .sort(
            (a, b) =>
              new Date(b.orderCreatedAt).getTime() -
              new Date(a.orderCreatedAt).getTime(),
          )
          .map((order) => (
            <TableRow key={order.orderId}>
              <TableCell>{order.orderIdentifier}</TableCell>
              <TableCell>{formatDate(order.orderCreatedAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={'ghost'} size={'icon'}>
                      <EllipsisIcon />
                    </Button>
                  </DropdownMenuTrigger>
                  {/* change order status */}
                  <DropdownMenuContent className="flex flex-col gap-2">
                    <DropdownMenuItem
                      asChild
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Select
                        value={order.orderStatus}
                        onValueChange={async (
                          newStatus: type_enum_ORDER_STATUS,
                        ) => {
                          try {
                            await updateOrderStatus({
                              data: {
                                storeId,
                                orderId: order.orderId,
                                status: newStatus,
                              },
                            })
                            toast.success(`Status changed to: ${newStatus}!`)
                            queryClient.invalidateQueries({
                              queryKey: ['orders', storeId],
                            })
                          } catch (err: any) {
                            toast.error(
                              err.message ?? 'Error updating order status',
                            )
                          }
                        }}
                      >
                        <SelectTrigger className=" dark:bg-neutral-900 border-primary text-xs! w-full ">
                          <SelectValue
                            placeholder={order.orderStatus.replace('_', ' ')}
                          />
                        </SelectTrigger>
                        <SelectContent align="end" className="">
                          {enum_ORDER_STATUS.options.map((statusOption) => (
                            <SelectItem key={statusOption} value={statusOption}>
                              {statusOption.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </DropdownMenuItem>
                    {/* view order details */}
                    <DropdownMenuItem
                      asChild
                      onSelect={(e) => e.preventDefault()}
                    >
                      <OrderCardSheet
                        key={order.orderId}
                        orderId={order.orderId}
                        storeId={storeId}
                        storeCurrency={storeCurrency}
                        orderCustomMessage={order.orderCustomMessage ?? null}
                        orderIdentifier={order.orderIdentifier}
                        orderPaymentMethod={order.orderPaymentMethodName}
                        orderShippingMethod={order.orderShippingMethodName}
                        orderDate={order.orderCreatedAt}
                        orderDeliveryInstruction={
                          order.orderDeliveryInstruction
                        }
                        open={sheetOpen}
                        onOpenChange={setSheetOpen}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

const OrderCardSheet = ({
  storeId,
  storeCurrency,
  orderId,
  orderDate,
  orderIdentifier,
  orderPaymentMethod,
  orderShippingMethod,
  orderDeliveryInstruction,
  orderCustomMessage,
  open,
  onOpenChange,
}: {
  storeId: string
  storeCurrency: string
  orderId: string
  orderDate: string
  orderIdentifier: string
  orderPaymentMethod: string
  orderShippingMethod: string
  orderDeliveryInstruction: string
  orderCustomMessage: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) => {
  const [total, setTotal] = useState<number>(0)

  // load the products from each order
  const { data: products, isLoading: productsIsLoading } =
    use_get_ProductsFromOrderId({ storeId, orderId })

  const addCustomeOrderMessage = useServerFn(sf_add_CustomOrderMessage)

  const queryClient = useQueryClient()

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

  // form to update custom ordering message
  const form = useForm({
    defaultValues: {
      orderCustomMessage: '',
    },
    validators: {
      onSubmit: create_ORDER_CUSTOM_MESSAGE,
    },
    onSubmit: async ({ value }) => {
      try {
        await addCustomeOrderMessage({
          data: { storeId, orderId, message: value.orderCustomMessage },
        })
        toast.success(`Order Custom Message was updated!`)
        queryClient.invalidateQueries({
          queryKey: ['orders', storeId, orderId],
        })
      } catch (err: any) {
        toast.error(err.message ?? 'Error adding custom order message')
      }
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button>more details</Button>
      </SheetTrigger>
      <SheetContent>
        {/* header */}
        <SheetHeader>
          <SheetTitle className="text-neutral-400">
            Order From:{' '}
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
              Order Date:
              <span className="font-normal text-neutral-100 text-sm">
                {formatDate(orderDate)}
              </span>
            </h1>
            <h1 className="font-bold text-base">
              Order Payment Method:
              <span className="font-normal text-neutral-100 text-sm bg-primary p-1 rounded-sm border-primary/50 border">
                {orderPaymentMethod}
              </span>
            </h1>
            <h1 className="font-bold text-base">
              Order Shipping Method:
              <span className="font-normal text-sm text-neutral-100 bg-emerald-900 p-1 rounded-sm border-emerald-500/50 border">
                {orderShippingMethod}
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
                        Order Custom Message
                      </FieldLabel>
                      <FieldDescription>
                        Order Custom Message allows store administrators to
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

export default OrderTableDashboard
