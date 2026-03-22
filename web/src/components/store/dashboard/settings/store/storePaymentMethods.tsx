import { useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { MoreHorizontal, SendHorizonal } from 'lucide-react'
import { CREATE_PAYMENT_METHOD_SCHEMA } from '@/schemas/store.schema'
import { useGetstorePaymentMethods } from '@/lib/hooks/shop/store.hooks'
import {
  sf_CreatestorePaymentMethod,
  sf_DeletestorePaymentMethod,
} from '@/server/store/store.functions'
import { Field, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const StorePaymentMethod = ({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) => {
  // load current payment methods
  const { data, isLoading } = useGetstorePaymentMethods({ storeId })

  const queryClient = useQueryClient()

  const [deletingId, setDeletingId] = useState<string | null>(null)

  const addMethod = useServerFn(sf_CreatestorePaymentMethod)
  const deleteMethod = useServerFn(sf_DeletestorePaymentMethod)

  const form = useForm({
    defaultValues: {
      method: '',
    },
    validators: {
      onSubmit: CREATE_PAYMENT_METHOD_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      try {
        await addMethod({
          data: { userId, storeId, paymentMethod: value.method },
        })
        toast.success(`NEW Payment Method: ${value.method}`)
        queryClient.invalidateQueries({ queryKey: ['paymentMethods', storeId] })
      } catch (err: any) {
        toast.error(err.message ?? 'Error adding payment method.')
      }
    },
  })

  const useDeleteMethod = async (methodId: string) => {
    setDeletingId(methodId)
    try {
      await deleteMethod({
        data: { userId, storeId, methodId },
      })
      queryClient.invalidateQueries({ queryKey: ['paymentMethods', storeId] })
      toast.success('Payment method deleted!')
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
          id="add-payment-method-form"
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
                      placeholder="New Payment Method"
                      autoComplete="off"
                      className="border-primary ring ring-primary dark:bg-secondary px-2 py-3 tracking-widest text-sm"
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
          form="add-payment-method-form"
          variant={'outline'}
        >
          <SendHorizonal />
        </Button>
      </div>
      <div className="flex-1 py-2">
        {!data && isLoading && <div>is loading</div>}
        <div className="border rounded-sm">
          {data && data === 'There are a total of 0 Payment Methods...' ? (
            <Empty>
              <EmptyHeader>
                <EmptyTitle>No Payment Methods Yet</EmptyTitle>
                <EmptyDescription>
                  Add your first payment method to start accepting payments from
                  your customers.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <ScrollArea className="h-full flex max-h-40 flex-col gap-4">
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
                            <MoreHorizontal />
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

export default StorePaymentMethod
