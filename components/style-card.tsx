"use client";

import { Check, Sparkles } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface StyleCardProps {
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
  featured?: boolean;
}

export default function StyleCard({
  style,
  isSelected,
  onClick,
}: StyleCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasPreviewImage = style.previewImage && !imageError;

  return (
    <button
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer aspect-square ${
        isSelected
          ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02] shadow-lg glow-primary"
          : "hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-primary/30"
      }`}
    >
      {/* Background - Image or Gradient */}
      {hasPreviewImage ? (
        <Image
          src={style.previewImage!}
          alt={style.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setImageError(true)}
          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
        />
      ) : (
        <div
          className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
          style={{ background: style.image }}
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        {/* Selected Checkmark */}
        {isSelected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-xl ring-2 ring-white animate-in zoom-in duration-200">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        )}

        {/* Hover Effect Icon */}
        {!isSelected && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/20 backdrop-blur-sm scale-75 group-hover:scale-100">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Name Label */}
      <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
        <div className="text-center">
          <p className="text-white/70 text-[10px] font-medium tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-0.5">
            {style.type.replace("_", " ")}
          </p>
          <p className="text-white text-xs sm:text-sm font-bold drop-shadow-lg">
            {style.name}
          </p>
        </div>
      </div>
    </button>
  );
}
