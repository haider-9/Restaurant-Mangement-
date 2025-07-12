import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function MultiSelectComponent({
  items,
  onSubmit,
  description,
  maxHeight = "max-h-64",
  placeholder = "No items available",
  alreadySelectedItems = []
}) {
  // Use a ref to track the initial mount
  const isFirstMount = useRef(true)
  const [selectedItems, setSelectedItems] = useState(alreadySelectedItems)

  // Only update selectedItems from alreadySelectedItems on mount
  useEffect(() => {
    setSelectedItems(alreadySelectedItems)
  }, [])

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false
      return
    }
    if (onSubmit) onSubmit(selectedItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems])

  const handleItemToggle = (value) => {
    setSelectedItems((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(items.map((item) => item.value))
    }
  }

  const handleClearAll = () => {
    setSelectedItems([])
  }

  if (!items || items.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto">
        <p className="text-center text-muted-foreground py-8">{placeholder}</p>
      </div>
    )
  }

  console.log(selectedItems)

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-2">
        {description && (
          <div className="text-muted-foreground text-sm">{description}</div>
        )}
      </div>
      <div className="space-y-4">
        {/* Selection Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {selectedItems.length} of {items.length} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
              className="h-auto p-1 text-xs"
              type="button"
            >
              {selectedItems.length === items.length ? "Deselect All" : "Select All"}
            </Button>
            {selectedItems.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-auto p-1 text-xs"
                type="button"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Selected Items Preview */}
        {selectedItems.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected:</Label>
            <div className="flex flex-wrap gap-1">
              {selectedItems.map((value) => {
                const item = items.find((i) => i.value === value)
                return (
                  <Badge key={value} variant="secondary" className="text-xs">
                    {item?.label}
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        <Separator />

        {/* Items List */}
        <div className={`space-y-3 overflow-y-auto ${maxHeight} pr-2`}>
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3">
              <Checkbox
                id={item.id}
                checked={selectedItems.includes(item.value)}
                onCheckedChange={() => handleItemToggle(item.value)}
                aria-describedby={`${item.id}-description`}
              />
              <Label
                htmlFor={item.id}
                className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
