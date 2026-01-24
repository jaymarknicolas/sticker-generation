"use client";

import React, { useRef, useState } from "react";
import { ImageIcon, X, Upload, Camera, Sparkles } from "lucide-react";

interface ImageUploadProps {
  onImageUpload: (image: string | null) => void;
  image: string | null;
}

export default function ImageUpload({
  onImageUpload,
  image,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleFile = async (file: File) => {
    setIsLoading(true);

    try {
      const objectUrl = URL.createObjectURL(file);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = objectUrl;
      });

      const MAX_SIZE = 1024;
      let { width, height } = img;

      if (width > MAX_SIZE || height > MAX_SIZE) {
        const scale = Math.min(MAX_SIZE / width, MAX_SIZE / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

      if (!dataUrl || !dataUrl.startsWith("data:image/")) {
        throw new Error("Failed to convert image");
      }

      onImageUpload(dataUrl);
    } catch (error) {
      console.error("Image processing error:", error);
      alert("Failed to process image. Please try a different image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) {
      handleFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer min-h-52 sm:min-h-64 flex items-center justify-center overflow-hidden group ${
        isDragging
          ? "border-primary bg-primary/10 scale-[1.02] glow-primary"
          : image
            ? "border-transparent bg-card"
            : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card/80"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {isLoading ? (
        <div className="text-center space-y-4 px-4">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground font-medium text-sm">
            Processing image...
          </p>
        </div>
      ) : image ? (
        <div className="relative w-full h-full min-h-52 sm:min-h-64">
          <img
            src={image}
            alt="Uploaded"
            className="w-full h-full object-cover rounded-2xl"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Clear button */}
          <button
            onClick={handleClear}
            className="absolute top-3 right-3 p-2.5 bg-background/90 hover:bg-destructive hover:text-white text-foreground rounded-full transition-all shadow-lg backdrop-blur-sm"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Change image hint */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="px-3 py-2 bg-background/90 backdrop-blur-sm rounded-xl text-xs font-medium text-foreground shadow-lg flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
              Click to change
            </div>
            <div className="px-3 py-2 bg-primary/90 backdrop-blur-sm rounded-xl text-xs font-medium text-white shadow-lg flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Ready
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-4 px-6 py-8">
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
            isDragging
              ? "bg-primary/20 scale-110"
              : "bg-muted/50 group-hover:bg-primary/10 group-hover:scale-105"
          }`}>
            {isDragging ? (
              <Upload className="w-10 h-10 text-primary animate-bounce" />
            ) : (
              <ImageIcon className="w-10 h-10 text-muted-foreground group-hover:text-primary transition-colors" />
            )}
          </div>
          <div className="space-y-2">
            <p className="text-foreground font-semibold text-base">
              {isDragging ? "Drop your image here" : "Upload a photo"}
            </p>
            <p className="text-muted-foreground text-sm">
              Drag & drop or click to browse
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 px-4 py-2 rounded-full mx-auto w-fit">
            <Camera className="w-3.5 h-3.5" />
            <span>JPG, PNG, HEIC supported</span>
          </div>
        </div>
      )}
    </div>
  );
}
