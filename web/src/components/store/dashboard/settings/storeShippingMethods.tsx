import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { MoreHorizontalIcon, SendHorizonal } from 'lucide-react'
import { CREATE_SHIPPING_METHOD_SCHEMA } from '@/schemas/store.schema'
import { useGetstoreShippingMethods } from '@/lib/hooks/shop/store.hooks'
import {
  sf_CreateStoreShippingMethod,
  sf_DeletestoreShippingMethod,
} from '@/server/store/store.functions'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const StoreShippingMethod = ({
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

  console.log(data)

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
      toast.success('Shipping method deleted!')
      await new Promise((res) => setTimeout(res, 500))
    } catch (err) {
      toast.error('Error deleting method!')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-2">
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
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="New Shipping Method"
                      autoComplete="off"
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
        <Button
          type="submit"
          form="add-shipping-method-form"
          variant={'outline'}
        >
          <SendHorizonal />
        </Button>
      </div>
      <div className="flex-1 py-2">
        {!data && isLoading && <div>is loading</div>}
        <div className="border rounded-sm">
          {data && data === 'There are a total of 0 Shipping Methods...' ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No Shipping Methods Yet</EmptyTitle>
                <EmptyDescription>
                  Add your first shipping method to start delivering orders to
                  your customers.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ScrollArea className="h-full flex max-h-47 flex-col gap-4">
              {Array.isArray(data) &&
                data.length > 0 &&
                data.map((method) => {
                  return (
                    <div
                      key={method.id}
                      className="w-full flex justify-between items-center px-2 py-1 last:border-b-0 border-b-secondary border-b "
                    >
                      <h1>{method.method}</h1>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={'ghost'}
                            size={'icon'}
                            className={'size-8'}
                            disabled={deletingId === method.id}
                          >
                            <MoreHorizontalIcon />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => useDeleteMethod(method.id)}
                            variant="destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )
                })}
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreShippingMethod
