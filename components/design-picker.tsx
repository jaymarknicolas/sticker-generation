"use client";

import { useState } from "react";
import { ChevronLeft, HelpCircle, Printer, Download, Heart, Share2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GeneratedDesign } from "@/lib/types";

interface DesignPickerProps {
  designs?: GeneratedDesign[];
  onBack: () => void;
  onConfirm: (selectedDesignId: string) => void;
}

// Fallback mock designs for when no real designs are provided
const mockDesigns: GeneratedDesign[] = [
  { id: 1, url: "", style: "Generated" },
];

export default function DesignPicker({ designs, onBack, onConfirm }: DesignPickerProps) {
  const displayDesigns = designs && designs.length > 0 ? designs : mockDesigns;
  const [selectedDesign, setSelectedDesign] = useState<number>(displayDesigns[0]?.id || 1);
  const [imageLoadingStates, setImageLoadingStates] = useState<Record<number, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [liked, setLiked] = useState(false);

  const handleImageLoad = (id: number) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
  };

  const handleImageError = (id: number) => {
    setImageLoadingStates(prev => ({ ...prev, [id]: false }));
    setImageErrors(prev => ({ ...prev, [id]: true }));
  };

  const selectedDesignData = displayDesigns.find(d => d.id === selectedDesign);

  const handleDownload = async () => {
    if (!selectedDesignData?.url) return;

    try {
      const response = await fetch(selectedDesignData.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sticker-${selectedDesign}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-3 sm:px-6 py-4 sm:py-5 flex items-center justify-between shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground shrink-0"
        >
          <ChevronLeft className="w-6 sm:w-7 h-6 sm:h-7" />
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground flex-1 text-center">
          Pick Your Favorite
        </h1>
        <button className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground shrink-0">
          <HelpCircle className="w-6 sm:w-7 h-6 sm:h-7" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-primary">STEP 3 OF 3</span>
          <span className="text-muted-foreground">{displayDesigns.length} Design{displayDesigns.length !== 1 ? 's' : ''} Ready</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-full bg-primary rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col px-3 sm:px-6 py-6 sm:py-8">
        {/* Title Section */}
        <div className="mb-6 sm:mb-8 shrink-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Your sticker is ready!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Download your creation or send it to print.
          </p>
        </div>

        {/* Main Preview (Single Design) */}
        {displayDesigns.length === 1 && selectedDesignData?.url ? (
          <div className="flex-1 flex items-center justify-center mb-8">
            <div className="relative w-full max-w-md aspect-square rounded-3xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
              {imageLoadingStates[selectedDesignData.id] !== false && !imageErrors[selectedDesignData.id] && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Loader2 className="w-12 h-12 animate-spin text-muted-foreground" />
                </div>
              )}
              {!imageErrors[selectedDesignData.id] ? (
                <img
                  src={selectedDesignData.url}
                  alt="Generated sticker"
                  className="w-full h-full object-cover"
                  onLoad={() => handleImageLoad(selectedDesignData.id)}
                  onError={() => handleImageError(selectedDesignData.id)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground">Failed to load image</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Designs Grid (Multiple Designs) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 flex-1">
            {displayDesigns.map((design) => (
              <button
                key={design.id}
                onClick={() => setSelectedDesign(design.id)}
                className={`relative aspect-square rounded-2xl overflow-hidden transition-all group ${
                  selectedDesign === design.id
                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
                    : "hover:ring-2 hover:ring-primary/50 hover:scale-[1.01]"
                }`}
              >
                {/* Background/Image */}
                {design.url ? (
                  <div className="absolute inset-0 bg-muted">
                    {imageLoadingStates[design.id] !== false && !imageErrors[design.id] && (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    )}
                    {!imageErrors[design.id] ? (
                      <img
                        src={design.url}
                        alt={`Generated sticker design ${design.id}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        onLoad={() => handleImageLoad(design.id)}
                        onError={() => handleImageError(design.id)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <span className="text-muted-foreground text-sm">Failed to load</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20" />
                )}

                {/* Design Number Badge */}
                <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg">
                  <span className="text-xs font-semibold text-foreground">
                    Design {design.id}
                  </span>
                </div>

                {/* Selection Checkmark */}
                {selectedDesign === design.id && (
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 sm:w-8 h-6 sm:h-8 bg-primary rounded-full flex items-center justify-center ring-2 ring-white shadow-lg">
                    <svg
                      className="w-4 sm:w-5 h-4 sm:h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-border px-3 sm:px-6 py-4 sm:py-5 shrink-0 bg-background">
        <div className="flex items-center gap-2 sm:gap-3 max-w-2xl mx-auto">
          <button
            onClick={() => setLiked(!liked)}
            className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full transition flex items-center justify-center ${
              liked ? 'bg-red-500/20 text-red-500' : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            }`}
          >
            <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${liked ? 'fill-current' : ''}`} />
          </button>

          {selectedDesignData?.url && (
            <>
              <button
                onClick={handleDownload}
                className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted hover:bg-muted/80 transition flex items-center justify-center text-muted-foreground hover:text-foreground"
                title="Download"
              >
                <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted hover:bg-muted/80 transition flex items-center justify-center text-muted-foreground hover:text-foreground"
                title="Share"
              >
                <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </>
          )}

          <Button
            onClick={() => onConfirm(selectedDesign.toString())}
            className="flex-1 bg-primary hover:bg-primary/90 text-white h-10 sm:h-12 rounded-full font-bold text-sm sm:text-base"
          >
            {selectedDesignData?.url ? 'Create Another' : 'Confirm Selection'}
            <Printer className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3" />
          </Button>
        </div>
      </div>

      {/* Mobile safe area */}
      <div className="h-safe-b" />
    </div>
  );
}
