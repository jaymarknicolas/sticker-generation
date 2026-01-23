"use client";

import { Check, Star, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface RecentlyUsedProps {
  style: {
    id: string;
    name: string;
    type: string;
    image: string; // gradient fallback
    previewImage?: string; // actual preview image URL
    description?: string;
  };
  isSelected: boolean;
  onClick: () => void;
  featured?: boolean;
}

export default function RecentlyUsed({
  style,
  isSelected,
  onClick,
  featured,
}: RecentlyUsedProps) {
  // Determine featured status - use prop if provided, otherwise use first style as featured
  const isFeatured = featured ?? style.id === "1";
  const [imageError, setImageError] = useState(false);
  const hasPreviewImage = style.previewImage && !imageError;

  return (
    <button
      onClick={onClick}
      className={`relative flex-1 rounded-full overflow-hidden transition-all group cursor-pointer aspect-square ${
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
          : "hover:scale-105 hover:ring-1 hover:ring-primary/30"
      }`}
    >
      {/* Background - Image or Gradient */}
      {hasPreviewImage ? (
        <Image
          src={style.previewImage!}
          alt={style.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
          style={{
            background: style.image,
          }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-between p-2 sm:p-3">
        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 sm:w-5 h-3 sm:h-5 bg-primary rounded-full flex items-center justify-center shadow-xl ring-2 ring-white">
            <Check
              className="w-3 sm:w-5 h-3 sm:h-5 text-white"
              strokeWidth={3}
            />
          </div>
        )}

        {/* Hover Effect Icon */}
        {!isSelected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 sm:w-5 h-3 sm:h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/20 backdrop-blur-sm">
            <Sparkles className="w-3 sm:w-5 h-3 sm:h-5 text-white" />
          </div>
        )}

        {/* Name and Type */}
        <div className="text-center mt-auto w-full">
          <p className="text-white/80 text-[10px] sm:text-xs font-semibold tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity">
            {style.type.replace("_", " ")}
          </p>
          <p className="text-white text-xs sm:text-sm font-bold mt-0.5 drop-shadow-lg">
            {style.name}
          </p>
        </div>
      </div>
    </button>
  );
}
