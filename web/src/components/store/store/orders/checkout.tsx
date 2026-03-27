import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { clearCartStorage } from './cart'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Textarea } from '@/components/ui/textarea'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import {
  use_get_StorePaymentMethods,
  use_get_StoreShippingMethods,
} from '@/lib/hooks/store.hooks'
import { sf_create_Order } from '@/server/orders/order.function'
import { sf_get_ProductFromProductId } from '@/server/products/product.functions'
import { create_ORDER } from '@/db/schemas/order.schema'

type ProductInfo = {
  productId: string
  productName: string
  productPrice: string
  productDesc?: string | null
  productImageUrl?: string | null
}

const Checkout = ({
  telegramUserId,
  storeId,
  productsId,
  isCartEmpty = false,
  onCartCleared,
}: {
  telegramUserId: number
  storeId: string
  productsId: Array<string>
  isCartEmpty?: boolean
  onCartCleared?: () => void
}) => {
  const queryClient = useQueryClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)
  const { data: paymentMethods, isLoading: loadingPaymentMethods } =
    use_get_StorePaymentMethods({ storeId })
  const { data: shippingMethods, isLoading: loadingShippingMethods } =
    use_get_StoreShippingMethods({ storeId })
  const placeOrder = useServerFn(sf_create_Order)
  const productInfo = useServerFn(sf_get_ProductFromProductId)

  const [displayProducts, setDisplayProducts] = useState<Array<ProductInfo>>([])

  // update products array
  async function updateDisplayProducts() {
    if (productsId.length === 0) {
      setDisplayProducts([])
      return
    }
    const products = await Promise.all(
      productsId.map(async (id) => {
        return await productInfo({ data: { storeId, productId: id } })
      }),
    )
    setDisplayProducts(products)
  }

  // remove product
  const handleRemove = (id: string) => {
    setDisplayProducts((prev) => prev.filter((p) => p.productId !== id))
    form.setFieldValue(
      'productsId',
      displayProducts.filter((p) => p.productId !== id).map((p) => p.productId),
    )
  }

  const form = useForm({
    defaultValues: {
      orderIdentifier: '',
      orderPaymentMethod: '',
      orderShippingMethod: '',
      orderDeliveryInstruction: '',
      productsId: displayProducts.map((p) => p.productId),
    },
    validators: {
      onSubmit: create_ORDER,
    },
    onSubmit: async ({ value }) => {
      try {
        await placeOrder({ data: { telegramUserId, storeId, dto: value } })
        toast.success(`Your order has been placed!`)
        clearCartStorage()
        if (onCartCleared) onCartCleared()
        queryClient.invalidateQueries({ queryKey: ['orders', storeId] })
        closeDialogRef.current?.click()
      } catch (err: any) {
        toast.error(err.message ?? 'Order failed!')
      }
    },
  })

  const paymentReady =
    (!loadingPaymentMethods && paymentMethods !== null) ||
    paymentMethods !== undefined

  const shippingReady =
    (!loadingShippingMethods && shippingMethods !== null) ||
    shippingMethods !== undefined

  const checkoutEnable = paymentReady && shippingReady

  const getCheckoutDisableReason = () => {
    if (paymentMethods === null || paymentMethods === undefined) {
      return 'This store has no payment methods configured. Please contact the store owner.'
    }
    if (shippingMethods === null || shippingMethods === undefined) {
      return 'This store has no shipping methods configured. Please contact the store owner.'
    }
    return 'Checkout is currently unavailable.'
  }

  console.log(productsId)

  return (
    <Dialog
      onOpenChange={async (open) => {
        if (open) {
          await updateDisplayProducts()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={isCartEmpty} className="w-full">
          Checkout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete Your Order</DialogTitle>
          <DialogDescription>
            Please provide your contact details and delivery preferences to
            finalize your purchase.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-135 md:max-h-210">
          <form
            id="checkout-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              {/* order intentifier */}
              <form.Field
                name="orderIdentifier"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Telegram Contact</FieldLabel>
                      <FieldDescription>
                        Enter your Telegram username or contact information so
                        the store owner can reach you if needed.
                      </FieldDescription>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Telegram Indentification"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              {/* order payment method */}
              <form.Field
                name="orderPaymentMethod"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Payment Methods
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {loadingPaymentMethods && <div>Loading...</div>}
                          {!loadingPaymentMethods &&
                            paymentMethods &&
                            typeof paymentMethods !== 'string' &&
                            paymentMethods.map((method) => (
                              <SelectItem
                                key={method.methodId}
                                value={method.methodId}
                              >
                                {method.method}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              {/* order shipping method */}
              <form.Field
                name="orderShippingMethod"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Shipping Methods
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a shipping method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {loadingShippingMethods && <div>Loading...</div>}
                          {!loadingShippingMethods &&
                            shippingMethods &&
                            typeof shippingMethods !== 'string' &&
                            shippingMethods.map((method) => (
                              <SelectItem
                                key={method.methodId}
                                value={method.methodId}
                              >
                                {method.method}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              {/* order delivery instructions */}
              <form.Field
                name="orderDeliveryInstruction"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Delivery Instructions
                      </FieldLabel>
                      <FieldDescription>
                        Provide any details for your delivery or handover. For
                        shipping, specify drop-off preferences. For in-person
                        trades, suggest a meeting place or time.
                      </FieldDescription>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="e.g., Leave at the front desk, or meet at the main entrance at 5pm"
                        autoComplete="off"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
              {/* products displayer */}
              <FieldLabel>Order Summary</FieldLabel>
              <FieldDescription>
                Review the items in your cart. You can remove products before
                completing your order.
              </FieldDescription>
              <ScrollArea className="max-h-40">
                <div className="flex flex-col gap-3">
                  {displayProducts.map((product) => (
                    <Card
                      key={product.productId}
                      className="flex flex-row p-3 rounded-lg bg-black/5"
                    >
                      {/* image on left side if there is image */}
                      {product.productImageUrl && (
                        <img
                          src={product.productImageUrl}
                          alt={product.productName}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      {/* Info and remove button */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="mb-1">
                              {product.productName}
                            </CardTitle>
                            <div className="text-sm font-semibold mb-1">
                              {product.productPrice}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-lg"
                            className="text-destructive"
                            type="button"
                            onClick={() => handleRemove(product.productId)}
                          >
                            <X />
                          </Button>
                        </div>
                        <CardDescription className="text-xs mt-1">
                          {product.productDesc}
                        </CardDescription>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </FieldGroup>
          </form>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button ref={closeDialogRef} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            form="checkout-form"
            type="submit"
            disabled={form.state.isSubmitting}
            onClick={(e) => {
              if (!checkoutEnable) {
                e.preventDefault()
                toast.error(getCheckoutDisableReason())
                return
              }
            }}
          >
            {form.state.isSubmitting ? 'Placing order...' : 'Place order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Checkout
