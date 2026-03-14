import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { Plane, X } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Field, FieldError, FieldGroup } from '../ui/field'
import InputEndInlineButtonDemo from '../shadcn-studio/input/input-31'
import { Spinner } from '../ui/spinner'
import { ScrollArea } from '../ui/scroll-area'
import { Empty, EmptyDescription, EmptyTitle } from '../ui/empty'
import { Card, CardTitle } from '../ui/card'
import { CREATE_SHIPPING_METHOD_SCHEMA } from '@/schemas/store.schema'
import { useGetstoreShippingMethods } from '@/lib/hooks/shop/store.hooks'
import {
  sf_CreateStoreShippingMethod,
  sf_DeletestoreShippingMethod,
} from '@/server/store/store.functions'

const ShippingMethodAdd = ({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) => {
  // load current shipping methods
  const { data, isLoading } = useGetstoreShippingMethods({ storeId })

  const queryClient = useQueryClient()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addMethod = useServerFn(sf_CreateStoreShippingMethod)
  const deleteMethod = useServerFn(sf_DeletestoreShippingMethod)

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
          data: { userId, storeId, shippingMethod: value.method },
        })
        toast.success(`NEW Shipping Method: ${value.method}`)
        queryClient.invalidateQueries({
          queryKey: ['shippingMethods', storeId],
        })
      } catch (err: any) {
        toast.error(err.message ?? 'Error adding shipping method.')
      }
    },
  })

  const useDeleteMethod = async (methodId: string) => {
    setDeletingId(methodId)
    try {
      await deleteMethod({
        data: { userId, storeId, methodId },
      })
      queryClient.invalidateQueries({ queryKey: ['shippingMethods', storeId] })
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
              <EmptyDescription className="">
                Please add at least one shipping method so your customers can
                understand how their orders will be delivered. Clear shipping
                options help set expectations and improve the overall storeping
                experience.
              </EmptyDescription>
            </Empty>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ShippingMethodAdd
