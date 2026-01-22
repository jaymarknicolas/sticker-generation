'use client'

import React, { useRef, useState } from 'react'
import { ImageIcon, X, Upload, Camera } from 'lucide-react'

interface ImageUploadProps {
  onImageUpload: (image: string | null) => void
  image: string | null
}

export default function ImageUpload({ onImageUpload, image }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFile = (file: File) => {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsLoading(true)
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string)
      }
      setIsLoading(false)
    }
    reader.onerror = () => {
      setIsLoading(false)
      alert('Failed to read file')
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) {
      handleFile(file)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    onImageUpload(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border-2 border-dashed transition-all cursor-pointer min-h-48 sm:min-h-64 flex items-center justify-center overflow-hidden ${
        isDragging
          ? 'border-primary bg-primary/10 scale-[1.02]'
          : image
            ? 'border-transparent'
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

      {isLoading ? (
        <div className="text-center space-y-3 px-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-medium text-sm sm:text-base">Loading image...</p>
        </div>
      ) : image ? (
        <div className="w-full h-full relative min-h-48 sm:min-h-64">
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-2xl"
          />
          {/* Overlay gradient for better button visibility */}
          <div className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-black/20 rounded-2xl pointer-events-none" />
          {/* Clear button */}
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-2 bg-background/90 hover:bg-background text-foreground rounded-full transition shadow-lg"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          {/* Change image hint */}
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-background/90 rounded-full text-xs font-medium text-foreground shadow-lg">
            Click to change
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4 px-6 py-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-muted/50 flex items-center justify-center">
            {isDragging ? (
              <Upload className="w-8 sm:w-10 h-8 sm:h-10 text-primary animate-bounce" />
            ) : (
              <ImageIcon className="w-8 sm:w-10 h-8 sm:h-10 text-muted-foreground" />
            )}
          </div>
          <div className="space-y-1">
            <p className="text-foreground font-semibold text-sm sm:text-base">
              {isDragging ? 'Drop your image here' : 'Upload an image'}
            </p>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Drag & drop or click to browse
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Camera className="w-3.5 h-3.5" />
            <span>PNG, JPG, WEBP up to 10MB</span>
          </div>
        </div>
      )}
    </div>
  )
}
