"use client";

import { useState } from "react";
import { ChevronLeft, HelpCircle, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DesignPickerProps {
  onBack: () => void;
  onConfirm: (selectedDesignId: string) => void;
}

const generateDesigns = () => {
  const designs = [
    {
      id: 1,
      bg: "linear-gradient(135deg, #2a5d4f 0%, #1a3a35 100%)",
      emoji: "🐱",
    },
    {
      id: 2,
      bg: "linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)",
      emoji: "🌅",
    },
    {
      id: 3,
      bg: "linear-gradient(135deg, #1a472a 0%, #0d2818 100%)",
      emoji: "🤖",
    },
    {
      id: 4,
      bg: "linear-gradient(135deg, #2a3d4a 0%, #1a2635 100%)",
      emoji: "🐅",
    },
    {
      id: 5,
      bg: "linear-gradient(135deg, #3d5a4f 0%, #2a4540 100%)",
      emoji: "🌿",
    },
    {
      id: 6,
      bg: "linear-gradient(135deg, #4a3f2f 0%, #2d2620 100%)",
      emoji: "🏠",
    },
    {
      id: 7,
      bg: "linear-gradient(135deg, #2a4a5a 0%, #1a3a4a 100%)",
      emoji: "🚗",
    },
    {
      id: 8,
      bg: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
      emoji: "☕",
    },
    {
      id: 9,
      bg: "linear-gradient(135deg, #2a5a6a 0%, #1a3a4a 100%)",
      emoji: "🪼",
    },
    {
      id: 10,
      bg: "linear-gradient(135deg, #3a4a5a 0%, #2a3a4a 100%)",
      emoji: "◇",
    },
  ];
  return designs;
};

export default function DesignPicker({ onBack, onConfirm }: DesignPickerProps) {
  const [selectedDesign, setSelectedDesign] = useState(1);
  const designs = generateDesigns();

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border px-3 sm:px-6 py-4 sm:py-6 flex items-center justify-between flex-shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground flex-shrink-0"
        >
          <ChevronLeft className="w-6 sm:w-7 h-6 sm:h-7" />
        </button>
        <h1 className="text-lg sm:text-2xl font-bold text-foreground flex-1 text-center">
          Pick Your Favorite
        </h1>
        <button className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground flex-shrink-0">
          <HelpCircle className="w-6 sm:w-7 h-6 sm:h-7" />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-border space-y-2 flex-shrink-0">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="font-bold text-primary">STEP 3 OF 3</span>
          <span className="text-muted-foreground">10 Variations Ready</span>
        </div>
        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full w-full bg-primary rounded-full" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto flex flex-col px-3 sm:px-6 py-6 sm:py-8">
        {/* Title Section */}
        <div className="mb-6 sm:mb-8 flex-shrink-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Choose the perfect design
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Select your favorite variation to send it to the printer.
          </p>
        </div>

        {/* Designs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-8 flex-1">
          {designs.map((design) => (
            <button
              key={design.id}
              onClick={() => setSelectedDesign(design.id)}
              className={`relative aspect-square rounded-2xl overflow-hidden transition-all group ${
                selectedDesign === design.id
                  ? "ring-3 ring-primary ring-offset-2 ring-offset-background"
                  : "hover:ring-2 hover:ring-primary/50"
              }`}
            >
              {/* Background */}
              <div
                className="absolute inset-0"
                style={{
                  background: design.bg,
                }}
              />

              {/* White Border Frame */}
              <div className="absolute inset-3 sm:inset-4 border-2 sm:border-3 border-white rounded-xl sm:rounded-2xl" />

              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl sm:text-6xl">{design.emoji}</div>
              </div>

              {/* Selection Checkmark */}
              {selectedDesign === design.id && (
                <div className="absolute top-2 right-2 sm:top-3 sm:right-3 w-6 sm:w-8 h-6 sm:h-8 bg-primary rounded-full flex items-center justify-center ring-2 ring-white">
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
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-border px-3 sm:px-6 py-4 sm:py-6 flex items-center gap-2 sm:gap-3 flex-shrink-0 bg-background">
        <button className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-muted hover:bg-muted/80 transition flex items-center justify-center text-muted-foreground hover:text-foreground">
          <span className="text-lg sm:text-xl">❤️</span>
        </button>
        <Button
          onClick={() => onConfirm(selectedDesign.toString())}
          className="flex-1 bg-primary hover:bg-blue-600 text-white h-10 sm:h-12 rounded-full font-bold text-sm sm:text-base"
        >
          Confirm Selection
          <Printer className="w-4 sm:w-5 h-4 sm:h-5 ml-2 sm:ml-3" />
        </Button>
      </div>

      {/* Mobile safe area */}
      <div className="h-safe-b" />
    </div>
  );
}
