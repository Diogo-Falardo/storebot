import { useRef, useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { CircleX, EllipsisVertical, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { use_get_StoreInfoByStoreId } from '@/lib/hooks/store.hooks'
import {
  sf_delete_Store,
  sf_update_Store,
} from '@/server/store/store.functions'
import { create_STORE, enum_STORE_TYPE } from '@/db/schemas/store.schema'

const StoreConfig = ({
  userId,
  storeId,
}: {
  userId: string
  storeId: string
}) => {
  // load existing data from store
  const { data, isLoading } = use_get_StoreInfoByStoreId({ userId, storeId })
  const queryClient = useQueryClient()
  const router = useRouter()
  const closeDialogRef = useRef<HTMLButtonElement>(null)
  const updateStore = useServerFn(sf_update_Store)
  const deleteStore = useServerFn(sf_delete_Store)
  const [openDeleteStoreDialog, setOpenDeleteStoreDialog] = useState(false)

  const form = useForm({
    defaultValues: {
      storeName: data?.storeName ?? '',
      storeType: data?.storeType ?? 'public',
      storeCurrency: data?.storeCurrency ?? 'EUR',
    },
    validators: {
      onSubmit: create_STORE,
    },
    onSubmit: async ({ value }) => {
      try {
        const updatedInfo = await updateStore({
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
      const result = await deleteStore({
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
    <div className="flex flex-col gap-4 px-2">
      <div className="flex justify-between items-center">
        <h1 className="font-mono text-xl font-medium">Store Configuration</h1>
        <div className="flex items-center gap-2">
          <Button type="submit" form="update-store-configuration-form">
            <Save />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={'outline'} size={'icon'}>
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* delete store */}
              <DropdownMenuItem>
                <Button
                  onClick={() => setOpenDeleteStoreDialog(true)}
                  variant={'destructive'}
                >
                  <CircleX />
                  Delete Store
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialog
            open={openDeleteStoreDialog}
            onOpenChange={setOpenDeleteStoreDialog}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>There is no going back...</AlertDialogTitle>
                <AlertDialogDescription>Final decision?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  onClick={() => setOpenDeleteStoreDialog(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  variant={'destructive'}
                  onClick={deleteUserstore}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <form
        className="w-full flex flex-col justify-center"
        id="update-store-configuration-form"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
      >
        <FieldGroup className="flex flex-col gap-2">
          {/* store name */}
          <form.Field
            name="storeName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel
                    className="text-lg font-sans text-neutral-500"
                    htmlFor={field.name}
                  >
                    Store Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Kira store"
                    autoComplete="off"
                    className="border-primary ring ring-primary dark:bg-secondary px-4 py-5 tracking-widest text-lg"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  <FieldLabel
                    className="text-lg font-sans text-neutral-500"
                    htmlFor={field.name}
                  >
                    Store Currency
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => field.handleChange(value)}
                  >
                    <SelectTrigger className="border-primary ring ring-primary dark:bg-secondary px-4 py-5 tracking-wide text-lg">
                      <SelectValue placeholder="Select your store currency" />
                    </SelectTrigger>
                    <SelectContent className="border-primary ring ring-primary">
                      {enum_STORE_TYPE.options.map((type) => (
                        <SelectItem
                          className="shadow-primary"
                          key={type}
                          value={type}
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                  <FieldLabel
                    className="text-lg font-sans text-neutral-500"
                    htmlFor={field.name}
                  >
                    Store Type
                  </FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as typeof field.state.value)
                    }
                  >
                    <SelectTrigger className="border-primary ring ring-primary dark:bg-secondary px-4 py-5 tracking-wide text-lg">
                      <SelectValue placeholder="Select a store type" />
                    </SelectTrigger>
                    <SelectContent className="border-primary ring ring-primary ">
                      {enum_STORE_TYPE.options.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          />
        </FieldGroup>
      </form>
    </div>
  )
}

export default StoreConfig
