/**
 * Shop information editor — name, description, currency (table_shops).
 */
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import { useState } from 'react'
import { CURRENCIES, type Currency, type ShopInfo } from './mock-data'
import { TelegramSection } from './telegram-section'

export function ShopInfoSection({
  shop: initial,
  onSave,
}: {
  shop: ShopInfo
  onSave?: (shop: ShopInfo) => void
}) {
  const [shop, setShop] = useState(initial)
  const [savedFlash, setSavedFlash] = useState(false)

  const patch = <K extends keyof ShopInfo>(key: K, value: ShopInfo[K]) => {
    setShop((s) => ({ ...s, [key]: value }))
  }

  const handleSave = () => {
    onSave?.(shop)
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1500)
  }

  return (
    <div className="flex flex-col gap-4">
      <TelegramSection title="Store profile" cardClassName="p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shop-name">Name</Label>
            <Input
              id="shop-name"
              value={shop.name}
              maxLength={64}
              onChange={(e) => patch('name', e.target.value)}
              className="border-border/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="shop-desc">Description</Label>
            <Textarea
              id="shop-desc"
              value={shop.description}
              onChange={(e) => patch('description', e.target.value)}
              className="min-h-24 border-border/60"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Currency</Label>
            <Select
              value={shop.currency}
              onValueChange={(v) => patch('currency', v as Currency)}
            >
              <SelectTrigger className="w-full border-border/60">
                <SelectValue placeholder="Currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </TelegramSection>

      <Button type="button" className="w-full" onClick={handleSave}>
        {savedFlash ? 'Saved' : 'Save shop info'}
      </Button>
    </div>
  )
}
