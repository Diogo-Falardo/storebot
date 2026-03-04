import React, { useState } from 'react'
import { useServerFn } from '@tanstack/react-start'
import { toast } from 'sonner'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { sf_AddProductImage } from '@/server/shop/products/product.functions'

const CLOUD_NAME = 'ddpkwh9th'
const UPLOAD_PRESET = 'KiraBot'

const ImgUploader = ({ productId }: { productId: string }) => {
  const [uploading, setUploading] = useState(false)
  const uploadImg = useServerFn(sf_AddProductImage)

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
        toast.success('Image updated!')
      }
    }
  }

  return (
    <>
      <label htmlFor="product-image">
        <Button asChild>
          <span>{uploading ? 'Uploading...' : 'Add product image'}</span>
        </Button>
      </label>
      <Input
        id="product-image"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        placeholder="Image"
      />
    </>
  )
}

export default ImgUploader
