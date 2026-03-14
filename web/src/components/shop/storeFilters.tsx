import { HandCoins, ListFilter, Tag } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import { Input } from '../ui/input'
import { Slider } from '../ui/slider'
import { Empty, EmptyHeader, EmptyTitle } from '../ui/empty'
import { Field, FieldGroup } from '../ui/field'
import { Checkbox } from '../ui/checkbox'
import { Label } from '../ui/label'

const MIN = 0
const MAX = 100000

type storeFiltersProps = {
  categoryNames: Array<string>
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  selectedCategories: Array<string>
  setSelectedCategories: (categories: Array<string>) => void
}

const StoreFilters = (filters: storeFiltersProps) => {
  // Handlers for input changes
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueStr = e.target.value.replace(',', '.')
    const value = Math.min(Number(valueStr), filters.priceRange[1])
    filters.setPriceRange([value, filters.priceRange[1]])
  }
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valueStr = e.target.value.replace(',', '.')
    const value =
      e.target.value === ''
        ? Infinity
        : Math.max(Number(valueStr), filters.priceRange[0])
    filters.setPriceRange([filters.priceRange[0], value])
  }

  const handleCategoryChange = (name: string) => {
    if (filters.selectedCategories.includes(name)) {
      filters.setSelectedCategories(
        filters.selectedCategories.filter((c) => c !== name),
      )
    } else {
      filters.setSelectedCategories([...filters.selectedCategories, name])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'}>
          <ListFilter /> Filters
        </Button>
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        {/* price collapse */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2">
            <HandCoins /> <h1>Price Range</h1>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <Input
                className="max-w-30"
                inputMode="numeric"
                min={MIN}
                max={filters.priceRange[1]}
                value={filters.priceRange[0]}
                onChange={handleMinChange}
              />
              <Input
                className="max-w-30"
                inputMode="numeric"
                min={filters.priceRange[0]}
                max={MAX}
                value={filters.priceRange[1]}
                onChange={handleMaxChange}
              />
            </div>
            <Slider
              min={MIN}
              max={MAX}
              step={1}
              value={filters.priceRange}
              onValueChange={(val) => filters.setPriceRange([val[0], val[1]])}
            />
          </CollapsibleContent>
        </Collapsible>
        {/* categorys collapse*/}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2">
            <Tag />
            <h1>Categorys</h1>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            {filters.categoryNames.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No categorys</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <FieldGroup className="gap-2">
                {filters.categoryNames.map((name) => (
                  <Field orientation={'horizontal'}>
                    <Checkbox
                      id={name}
                      name={name}
                      checked={filters.selectedCategories.includes(name)}
                      onCheckedChange={() => handleCategoryChange(name)}
                    />
                    <Label className="text-base" htmlFor={name}>
                      {name}
                    </Label>
                  </Field>
                ))}
              </FieldGroup>
            )}
          </CollapsibleContent>
        </Collapsible>
      </PopoverContent>
    </Popover>
  )
}

export default StoreFilters
