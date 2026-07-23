/**
 * Shop information form — TanStack Form + shadcn Field (table_shops).
 * Pattern mirrors web storeConfig.tsx
 */
import { TgAlert } from '#/components/app/telegram'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import { sfUpdateShop } from '#/server/shops/shops.function'
import { useForm } from '@tanstack/react-form'
import { useServerFn } from '@tanstack/react-start'
import { SaveIcon } from 'lucide-react'
import { useState } from 'react'
import { formSchema, shopInfoFormSchema } from './form-schemas'
import { CURRENCIES, type Currency, type ShopInfo } from './mock-data'
import { TelegramSection } from './telegram-section'

export function ShopInfoSection({
  shop: initial,
  onSave,
  userId,
  shopId,
}: {
  shop: ShopInfo
  onSave?: (shop: ShopInfo) => void
  userId: string
  shopId: string
}) {
  const updateShop = useServerFn(sfUpdateShop)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      name: initial.name ?? '',
      description: initial.description ?? '',
      currency: initial.currency ?? 'EUR',
    },
    validators: {
      onSubmit: formSchema(shopInfoFormSchema),
    },
    onSubmit: async ({ value }) => {
      const parsed = shopInfoFormSchema.parse(value)
      setSubmitError(null)
      setSuccessMessage(null)

      try {
        // Server re-checks ownership via validateUserShopInteraction — never trust client alone
        await updateShop({
          data: {
            userId,
            shopId,
            shopInfo: {
              name: parsed.name,
              description: parsed.description,
              currency: parsed.currency,
            },
          },
        })

        onSave?.({
          ...initial,
          name: parsed.name,
          description: parsed.description,
          currency: parsed.currency as Currency,
        })

        setSuccessMessage('Shop information saved.')
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'Failed to update shop',
        )
      }
    },
  })

  return (
    <div className="flex flex-col gap-4">
      {successMessage ? (
        <TgAlert
          variant="success"
          title="Saved"
          description={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      ) : null}

      {submitError ? (
        <TgAlert
          variant="error"
          title="Update failed"
          description={submitError}
          onClose={() => setSubmitError(null)}
        />
      ) : null}

      <form
        id="shop-info-form"
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          void form.handleSubmit()
        }}
      >
        <TelegramSection title="Store profile" cardClassName="p-4">
          <FieldGroup className="flex flex-col gap-4">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      maxLength={64}
                      placeholder="Nova Merch Co."
                      autoComplete="off"
                      className="border-border/60"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="What does your shop sell?"
                      className="min-h-24 border-border/60"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="currency"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Currency</FieldLabel>
                    <Select
                      value={field.state.value}
                      onValueChange={(value) =>
                        field.handleChange(value as Currency)
                      }
                    >
                      <SelectTrigger
                        id={field.name}
                        className="w-full border-border/60"
                        aria-invalid={isInvalid}
                      >
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
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
          </FieldGroup>
        </TelegramSection>

        <Button
          type="submit"
          form="shop-info-form"
          className="w-full"
          disabled={form.state.isSubmitting}
        >
          <SaveIcon data-icon="inline-start" />
          {form.state.isSubmitting ? 'Saving…' : 'Save shop info'}
        </Button>
      </form>
    </div>
  )
}
