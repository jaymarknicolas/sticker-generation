'use client'

import { Check, Star } from 'lucide-react'

interface StyleCardProps {
  style: {
    id: string
    name: string
    type: string
    image: string
  }
  isSelected: boolean
  onClick: () => void
}

export default function StyleCard({ style, isSelected, onClick }: StyleCardProps) {
  const isFeatured = Math.random() > 0.5

  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl sm:rounded-2xl overflow-hidden transition-all group cursor-pointer aspect-square ${
        isSelected ? 'ring-2 ring-primary ring-offset-1 sm:ring-offset-2' : 'hover:scale-105'
      }`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-transform group-hover:scale-110"
        style={{
          background: style.image,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-2 sm:p-3">
        {/* Featured Badge */}
        {isFeatured && (
          <div className="self-end bg-yellow-500 rounded-full p-1 sm:p-1.5">
            <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-white text-white" />
          </div>
        )}

        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 sm:w-10 h-8 sm:h-10 bg-primary rounded-full flex items-center justify-center">
            <Check className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
          </div>
        )}

        {/* Name and Type */}
        <div className="text-center mt-auto">
          <p className="text-white text-xs font-bold tracking-wide opacity-0 group-hover:opacity-100 transition">
            {style.type}
          </p>
          <p className="text-white text-xs sm:text-sm font-bold mt-0.5 sm:mt-1">{style.name}</p>
        </div>
      </div>
    </button>
  )
}
