import { useRef } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Settings, Store, Trash2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Spinner } from '../ui/spinner'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  CREATE_store_SCHEMA,
  store_CURRENCY_ENUM,
  store_TYPE_ENUM,
} from '@/schemas/store.schema'
import { useGetUserstoreInfo } from '@/lib/hooks/shop/store.hooks'
import { sf_Deletestore, sf_Updatestore } from '@/server/store/store.functions'

/**
 *
 *
 *
 * @param param0
 * @returns Component
 */
const StoreUpdate = ({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) => {
  // load existing data from store
  const { data, isLoading } = useGetUserstoreInfo({ userId, storeId })
  if (data) {
    console.log(data)
  }
  // required hooks
  const queryClient = useQueryClient()
  const router = useRouter()
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const update = useServerFn(sf_Updatestore)
  const deleted = useServerFn(sf_Deletestore)

  const form = useForm({
    defaultValues: {
      storeName: data?.storeName ?? '',
      storeType: data?.storeType ?? 'public',
      storeCurrency: data?.storeCurrency ?? 'EUR',
    },
    validators: {
      onSubmit: CREATE_store_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      try {
        const updatedInfo = await update({
          data: { userId, storeId, dto: value },
        })
        toast.success(updatedInfo)
        // invalidate querys and router
        queryClient.invalidateQueries({ queryKey: ['store', storeId] })
        closeDialogRef.current?.click()
      } catch (err: any) {
        toast.error(err.message ?? 'Error while updating store!')
      }
    },
  })

  // function to delete the user store for completely
  const deleteUserstore = async () => {
    try {
      const result = await deleted({
        data: {
          userId: userId,
          storeId: storeId,
        },
      })
      if (result) {
        toast.success('store and all its related data got deleted!')
        // invalidate all querys related to the store
        queryClient.invalidateQueries({ queryKey: ['store'] })
        router.invalidate()
        router.navigate({ to: '/' })
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Error while deleting store')
    }
  }

  if (isLoading) {
    return <Spinner className="size-6" />
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          ref={closeDialogRef}
          variant={'outline'}
          size={'icon-sm'}
          className="cursor-pointer"
        >
          <Settings />
        </Button>
      </DialogTrigger>
      {/* update store content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update store</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          id="update-store-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            {/* store name */}
            <form.Field
              name="storeName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>store Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Kira store"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            {/* store currency */}
            <form.Field
              name="storeCurrency"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>store Currency</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as typeof field.state.value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your store currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {store_CURRENCY_ENUM.options.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
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
            {/* store type */}
            <form.Field
              name="storeType"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>store Type</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as typeof field.state.value)
                      }
                    >
                      <SelectTrigger disabled>
                        <SelectValue placeholder="Select a store type" />
                      </SelectTrigger>
                      <SelectContent>
                        {store_TYPE_ENUM.options.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldDescription className="text-red-500">
                      Currently disabled!
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          {/* delete dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant={'destructive'}>
                <Trash2 />
                Delete store
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive">
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>
                  Delete store?
                  <AlertDialogDescription>
                    This will delete this store and all respective data!
                  </AlertDialogDescription>
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteUserstore()}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button form="update-store-form" type="submit">
            <Store />
            Update store
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default StoreUpdate
