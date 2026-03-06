import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Minus, Plane, PlusCircle, Trash, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { CREATE_SHIPPING_METHOD_SCHEMA } from '@/schemas/shop.schema'
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field'
import { Input } from '../ui/input'
import InputEndInlineButtonDemo from '../shadcn-studio/input/input-31'
import { useGetShopShippingMethods } from '@/lib/hooks/shop/shop.hooks'
import {
  sf_CreateShopShippingMethod,
  sf_DeleteShopShippingMethod,
} from '@/server/shop/shop.functions'
import { Spinner } from '../ui/spinner'
import { ScrollArea } from '../ui/scroll-area'
import { Empty, EmptyHeader, EmptyTitle } from '../ui/empty'
import { Card, CardTitle } from '../ui/card'

const ShippingMethodAdd = ({
  userId,
  shopId,
}: {
  userId: string
  shopId: string
}) => {
  // load current shipping methods
  const { data, isLoading } = useGetShopShippingMethods({ shopId })

  const queryClient = useQueryClient()
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addMethod = useServerFn(sf_CreateShopShippingMethod)
  const deleteMethod = useServerFn(sf_DeleteShopShippingMethod)

  const form = useForm({
    defaultValues: {
      method: '',
    },
    validators: {
      onSubmit: CREATE_SHIPPING_METHOD_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      try {
        await addMethod({
          data: { userId, shopId, shippingMethod: value.method },
        })
        toast.success(`NEW Shipping Method: ${value.method}`)
        queryClient.invalidateQueries({ queryKey: ['shippingMethods', shopId] })
      } catch (err: any) {
        toast.error(err.message ?? 'Error adding shipping method.')
      }
    },
  })

  const useDeleteMethod = async (methodId: string) => {
    setDeletingId(methodId)
    try {
      await deleteMethod({
        data: { userId, shopId, methodId },
      })
      queryClient.invalidateQueries({ queryKey: ['shippingMethods', shopId] })
      toast.success('Method deleted!')
      await new Promise((res) => setTimeout(res, 500))
    } catch (err) {
      toast.error('Error deleting method!')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button>
          <Plane />
          Shipping Methods
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        {/* new shipping method */}
        <div className="flex items-center gap-2">
          <form
            className="flex-1"
            id="add-shipping-method-form"
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
          >
            <FieldGroup>
              <form.Field
                name="method"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <InputEndInlineButtonDemo
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="New Shipping Method"
                        autoComplete="off"
                        icon={<Plane />}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>
          </form>
        </div>
        {/* current shipping methods */}
        <div className="flex justify-center pt-2">
          {isLoading && (
            <div>
              <Spinner />
              Loading Shipping Methods
            </div>
          )}
          {data && typeof data !== 'string' && data.length > 0 ? (
            <ScrollArea className="max-h-50 w-full">
              <div className="flex flex-col gap-2">
                {data.map((method) => (
                  <Card key={method.id} className="w-full p-1 rounded-sm">
                    <div className="px-0.5 flex flex-row justify-between items-center">
                      <CardTitle className="capitalize font-medium">
                        {method.method}
                      </CardTitle>
                      <Button
                        variant={'ghost'}
                        className="text-destructive"
                        size={'icon-xs'}
                        onClick={() => useDeleteMethod(method.id)}
                        disabled={deletingId === method.id}
                      >
                        {deletingId === method.id ? <Spinner /> : <X />}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <Empty>
              <EmptyTitle className="text-base">No Shipping Methods</EmptyTitle>
            </Empty>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ShippingMethodAdd
