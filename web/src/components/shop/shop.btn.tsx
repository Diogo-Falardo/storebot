import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { Link } from '@tanstack/react-router'
import { Button, buttonVariants } from '../ui/button'
import { Input } from '../ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
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
import { useGetUserShops } from '@/server/shop/shop.hooks'
import {
  shopCreateSchema,
  shopCreateSchemaType,
} from '@/db/schemas/shop.schemas'
import { useUserContext } from '@/routes/__root'
import { postcreateUserShop } from '@/server/shop/shop.functions'

const ShopBtn = () => {
  // get the user
  const { userId } = useUserContext()

  if (!userId) return <Button variant={'outline'}>Loading user...</Button>

  // loaded shops from user
  const { data: shops, isLoading } = useGetUserShops({ id: userId })
  const createShop = useServerFn(postcreateUserShop)

  // create a shop
  const formCreateShop = useForm({
    defaultValues: {
      shopType: '',
      shopName: '',
    },
    validators: {
      onSubmit: shopCreateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const dto = value as shopCreateSchemaType
        await createShop({
          data: { userId: userId, createShopDto: dto },
        })
        toast.success('Your new shop is ready:' + value.shopName)
      } catch (err) {
        console.error(err)
        toast.error('Error creating shop...')
      }
    },
  })

  if (isLoading) {
    return <Button variant={'outline'}>Loading...</Button>
  }

  // if user doesnt have  any shop
  if (!shops || shops.length === 0) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={'outline'} className="cursor-pointer">
            Create your shop!
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create your new shop</DialogTitle>
            <DialogDescription className="flex flex-col">
              Currently the website is only generating public shops. Use
              telegram bot to create a telegram only shop!
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              formCreateShop.handleSubmit()
            }}
          >
            <FieldGroup className="gap-y-5">
              <formCreateShop.Field
                name="shopName"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Shop name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="name"
                        autoComplete="off"
                      />

                      <FieldDescription>
                        Provide desired shop name.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />

              <formCreateShop.Field
                name="shopType"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Shop type</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger
                          id={field.name}
                          onBlur={field.handleBlur}
                        >
                          <SelectValue placeholder="Select a shop type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="private" disabled>
                            Private
                          </SelectItem>
                          <SelectItem value="telegram_only" disabled>
                            Telegram Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Choose your shop type.
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  )
                }}
              />
            </FieldGroup>

            <div className="flex items-center justify-end mt-3">
              <Button type="submit">Create Shop</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Link
      to="/dashboard/$id"
      params={{ id: shops[0].id }}
      className={buttonVariants({ variant: 'outline' })}
    >
      Dashboard
    </Link>
  )
}

export default ShopBtn
