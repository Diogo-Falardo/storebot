import React, { Dispatch, SetStateAction, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { sf_add_ProductImage } from '@/server/products/product.functions'

const CLOUD_NAME = 'ddpkwh9th'
const UPLOAD_PRESET = 'KiraBot'

const ProductImageUploader = ({
  storeId,
  productId,
  productName,
  open,
  setOpen,
}: {
  storeId: string
  productId: string
  productName: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const uploadImg = useServerFn(sf_add_ProductImage)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // upload image
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', UPLOAD_PRESET)

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    const data = await res.json()
    setUploading(false)

    // insert the image into the database
    if (data.secure_url) {
      const ok = await uploadImg({
        data: { productId, imageUrl: data.secure_url },
      })
      if (ok) {
        toast.success(`Image updated, ${productName}`)
        queryClient.invalidateQueries({ queryKey: ['products', storeId] })
        router.invalidate()
      }
    }
  }

  const inputId = `product-image-${productId}`

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        size={'icon'}
        onClick={() => inputRef.current?.click()}
        variant="outline"
      >
        {uploading ? <Spinner /> : <ImageIcon />}
      </Button>
      <Input
        ref={inputRef}
        id={inputId}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        placeholder="Image"
      />
    </Dialog>
  )
}

export default ProductImageUploader
