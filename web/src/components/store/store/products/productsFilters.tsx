import { HandCoins, ListFilterIcon, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Empty, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { Field, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'

const MIN = 0
const MAX = 10000

type productsFiltersProps = {
  categories: Array<{ categoryId: string; categoryName: string }>
  priceRange: [number, number]
  setPriceRange: (range: [number, number]) => void
  selectedCategories: Array<string> // store IDs
  setSelectedCategories: (categories: Array<string>) => void
}

const ProductsFilters = (filters: productsFiltersProps) => {
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
        ? MAX
        : Math.max(Number(valueStr), filters.priceRange[0])
    filters.setPriceRange([filters.priceRange[0], value])
  }

  const handleCategoryChange = (id: string) => {
    if (filters.selectedCategories.includes(id)) {
      filters.setSelectedCategories(
        filters.selectedCategories.filter((c) => c !== id),
      )
    } else {
      filters.setSelectedCategories([...filters.selectedCategories, id])
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'secondary'}>
          <ListFilterIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="space-y-4">
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
        {/* categories collapse*/}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex items-center gap-2">
            <Tag />
            <h1>Categories</h1>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            {filters.categories.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyTitle>No categories</EmptyTitle>
                </EmptyHeader>
              </Empty>
            ) : (
              <FieldGroup className="gap-2">
                {filters.categories.map((category) => (
                  <Field orientation={'horizontal'} key={category.categoryId}>
                    <Checkbox
                      id={category.categoryId}
                      name={category.categoryName}
                      checked={filters.selectedCategories.includes(
                        category.categoryId,
                      )}
                      onCheckedChange={() =>
                        handleCategoryChange(category.categoryId)
                      }
                    />
                    <Label className="text-base" htmlFor={category.categoryId}>
                      {category.categoryName}
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

export default ProductsFilters
