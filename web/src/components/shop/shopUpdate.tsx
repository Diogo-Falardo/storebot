// this component is supossed to go inside a dialog to update a shop
import { createServerFn, useServerFn } from '@tanstack/react-start'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../ui/field'
import { Input } from '../ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { Spinner } from '../ui/spinner'
import {
  currencyEnum,
  shopExtendedSchema,
  shopExtendedSchemaType,
  shopSchema,
  shopTypeEnum,
} from '@/db/schemas/shop.schemas'
import { useGetUserShopInfo } from '@/server/shop/shop.hooks'
import { updateUserShop } from '@/server/shop/shop.server'

// update the shop function
const updateShop = createServerFn({ method: 'POST' })
  .inputValidator((data: shopExtendedSchemaType) => data)
  .handler(async ({ data }) => {
    return await updateUserShop(data)
  })

const ShopUpdate = ({
  userId,
  shopId,
  onSuccess,
}: {
  userId: string
  shopId: string
  onSuccess?: () => void
}) => {
  const queryClient = useQueryClient()
  const router = useRouter()
  // load existing data
  const { data, isLoading } = useGetUserShopInfo({ userId, shopId })
  const update = useServerFn(updateShop)

  const form = useForm({
    defaultValues: {
      shopName: data?.shopName ?? '',
      shopType: 'public',
      shopCurrency: data?.shopCurrency ?? 'EUR',
    },
    validators: {
      onSubmit: shopSchema,
    },
    onSubmit: async ({ value }) => {
      const _payload = {
        ...value,
        userId,
        id: shopId,
      }

      const payload = shopExtendedSchema.parse(_payload)

      try {
        const updatedInfo = await update({ data: payload })
        toast.success(updatedInfo)
        queryClient.invalidateQueries({ queryKey: ['shop'] })
        router.invalidate()
        if (onSuccess) onSuccess()
      } catch (err: any) {
        toast.error(err.message ?? 'Error while updating shop!')
      }
    },
  })

  if (isLoading) {
    return <Spinner className="size-6" />
  }

  return (
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
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
                    {currencyEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
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
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger disabled>
                    <SelectValue placeholder="Select a shop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {shopTypeEnum.options.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription className="text-red-500">
                  Currently disabled!
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>
    </form>
  )
}

export default ShopUpdate
