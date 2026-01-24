"use client";

import { Check, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface RecentlyUsedProps {
  style: {
    id: string;
    name: string;
    type: string;
    image: string;
    previewImage?: string;
    description?: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export default function RecentlyUsed({
  style,
  isSelected,
  onClick,
}: RecentlyUsedProps) {
  const [imageError, setImageError] = useState(false);
  const hasPreviewImage = style.previewImage && !imageError;

  return (
    <button
      onClick={onClick}
      className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer ${
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 glow-primary"
          : "hover:scale-110 hover:ring-2 hover:ring-primary/30"
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
          sizes="80px"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-300 group-hover:scale-110"
          style={{ background: style.image }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      {/* Selected Checkmark */}
      {isSelected && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
            <Check className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        </div>
      )}

      {/* Hover Effect */}
      {!isSelected && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      {/* Name */}
      <div className="absolute bottom-1 left-1 right-1 text-center">
        <p className="text-white text-[10px] font-semibold drop-shadow-lg truncate px-1">
          {style.name}
        </p>
      </div>
    </button>
  );
}
