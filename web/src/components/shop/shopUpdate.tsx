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
import { useGetUserShopInfo } from '@/lib/hooks/shop/shop.hooks'
import { sf_DeleteShop, sf_UpdateShop } from '@/server/shop/shop.functions'
import {
  CREATE_SHOP_SCHEMA,
  SHOP_CURRENCY_ENUM,
  SHOP_TYPE_ENUM,
} from '@/schemas/shop.schema'

/**
 *
 *
 *
 * @param param0
 * @returns Component
 */
const ShopUpdate = ({ userId, shopId }: { userId: string; shopId: string }) => {
  // load existing data from shop
  const { data, isLoading } = useGetUserShopInfo({ userId, shopId })
  if (data) {
    console.log(data)
  }
  // required hooks
  const queryClient = useQueryClient()
  const router = useRouter()
  const closeDialogRef = useRef<HTMLButtonElement>(null)

  const update = useServerFn(sf_UpdateShop)
  const deleted = useServerFn(sf_DeleteShop)

  const form = useForm({
    defaultValues: {
      shopName: data?.shopName ?? '',
      shopType: data?.shopType ?? 'public',
      shopCurrency: data?.shopCurrency ?? 'EUR',
    },
    validators: {
      onSubmit: CREATE_SHOP_SCHEMA,
    },
    onSubmit: async ({ value }) => {
      try {
        const updatedInfo = await update({
          data: { userId, shopId, dto: value },
        })
        toast.success(updatedInfo)
        // invalidate querys and router
        queryClient.invalidateQueries({ queryKey: ['shop', shopId] })
        closeDialogRef.current?.click()
      } catch (err: any) {
        toast.error(err.message ?? 'Error while updating shop!')
      }
    },
  })

  // function to delete the user shop for completely
  const deleteUserShop = async () => {
    try {
      const result = await deleted({
        data: {
          userId: userId,
          shopId: shopId,
        },
      })
      if (result) {
        toast.success('Shop and all its related data got deleted!')
        // invalidate all querys related to the shop
        queryClient.invalidateQueries({ queryKey: ['shop'] })
        router.invalidate()
        router.navigate({ to: '/' })
      }
    } catch (err: any) {
      toast.error(err.message ?? 'Error while deleting shop')
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
      {/* update shop content */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Shop</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          id="update-shop-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            {/* shop name */}
            <form.Field
              name="shopName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Shop Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Kira Shop"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
            {/* shop currency */}
            <form.Field
              name="shopCurrency"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Shop Currency</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as typeof field.state.value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your shop currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOP_CURRENCY_ENUM.options.map((type) => (
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
            {/* shop type */}
            <form.Field
              name="shopType"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Shop Type</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as typeof field.state.value)
                      }
                    >
                      <SelectTrigger disabled>
                        <SelectValue placeholder="Select a shop type" />
                      </SelectTrigger>
                      <SelectContent>
                        {SHOP_TYPE_ENUM.options.map((type) => (
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
                Delete Shop
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent size="sm">
              <AlertDialogHeader>
                <AlertDialogMedia className="bg-destructive">
                  <Trash2 />
                </AlertDialogMedia>
                <AlertDialogTitle>
                  Delete shop?
                  <AlertDialogDescription>
                    This will delete this shop and all respective data!
                  </AlertDialogDescription>
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant="destructive"
                  onClick={() => deleteUserShop()}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button form="update-shop-form" type="submit">
            <Store />
            Update Shop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ShopUpdate
