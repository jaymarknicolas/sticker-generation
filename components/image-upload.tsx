'use client'

import React from "react"

import { useRef, useState } from 'react'
import { ImageIcon, X } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload: (image: string) => void
  image: string | null
}

export default function ImageUpload({ onImageUpload, image }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-xl sm:rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-40 sm:min-h-56 flex items-center justify-center overflow-hidden ${
        isDragging
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {image ? (
        <div className="w-full h-full relative">
          <img src={image || "/placeholder.svg"} alt="Uploaded" className="w-full h-full object-cover" />
          <button
            onClick={(e) => {
              e.stopPropagation()
              onImageUpload(null)
            }}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-background/80 hover:bg-background rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="text-center space-y-2 sm:space-y-3 px-4">
          <ImageIcon className="w-10 sm:w-12 h-10 sm:h-12 mx-auto text-muted-foreground flex-shrink-0" />
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Tap to pick an image</p>
        </div>
      )}
    </div>
  )
}
