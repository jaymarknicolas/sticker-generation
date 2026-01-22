"use client";

import { useState, useCallback } from "react";
import { Sparkles, Zap, Wand2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ImageUpload from "@/components/image-upload";
import StyleCard from "@/components/style-card";
import RecentlyUsed from "@/components/recently-used";
import BottomNav from "@/components/bottom-nav";
import GenerationProgress from "@/components/generation-progress";
import DesignPicker from "@/components/design-picker";
import { useGeneration } from "@/hooks/use-generation";
import { Style, SelectedStyle } from "@/lib/types";
import { STICKER_STYLES } from "@/lib/prompt-builder";

// Convert STICKER_STYLES to array format for display
const styles: Style[] = Object.entries(STICKER_STYLES).map(([key, value], index) => ({
  id: String(index + 1),
  name: value.name,
  type: key,
  image: value.color,
  description: value.description,
}));

const recentStyles = [
  { id: "r1", name: "Anime", featured: true },
  { id: "r2", name: "Ghibli", featured: true },
  { id: "r3", name: "Cyberpunk", featured: false },
  { id: "r4", name: "Kawaii", featured: false },
  { id: "r5", name: "Pixel Art", featured: false },
];

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(null);
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Use the generation hook
  const {
    isGenerating,
    progress,
    statusText,
    generatedCount,
    generatedImages,
    error: generationError,
    generate,
    reset,
  } = useGeneration({
    onComplete: (images) => {
      console.log("Generation complete:", images);
      // Automatically show design picker when generation completes
      if (images.length > 0) {
        setTimeout(() => setShowDesignPicker(true), 1000);
      }
    },
    onError: (error) => {
      console.error("Generation error:", error);
      setLocalError(error);
    },
  });

  const handleGenerateClick = useCallback(async () => {
    if (!selectedStyle) {
      setLocalError("Please select a style first");
      return;
    }

    setLocalError(null);

    // Build subject from custom prompt or use default
    const subject = customPrompt.trim() ||
      (uploadedImage ? "the uploaded image subject" : "a creative character");

    await generate({
      style: selectedStyle.type,
      customPrompt: customPrompt.trim() || undefined,
      subject,
      numberOfVariations: 1, // Start with 1 for cost efficiency
    });
  }, [selectedStyle, customPrompt, uploadedImage, generate]);

  const handleSurpriseMe = () => {
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    setSelectedStyle({
      id: randomStyle.id,
      name: randomStyle.name,
      type: randomStyle.type,
    });

    // Also set a random creative prompt
    const funPrompts = [
      "a magical forest creature",
      "a cute robot friend",
      "a space explorer cat",
      "a friendly dragon",
      "a musical unicorn",
      "a superhero bunny",
    ];
    setCustomPrompt(funPrompts[Math.floor(Math.random() * funPrompts.length)]);
  };

  const handleBack = () => {
    setShowDesignPicker(false);
    reset();
  };

  const handleConfirm = (selectedDesignId: string) => {
    console.log("Selected design:", selectedDesignId);
    // Here you would typically proceed to the order/print step
    setShowDesignPicker(false);
    reset();
    // Show success message or navigate to next step
  };

  const handleCloseGeneration = () => {
    reset();
  };

  // Show design picker when we have generated images
  if (showDesignPicker && generatedImages.length > 0) {
    return (
      <DesignPicker
        designs={generatedImages}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    );
  }

  // Show generation progress
  if (isGenerating) {
    return (
      <GenerationProgress
        progress={progress}
        statusText={statusText}
        generatedCount={generatedCount}
        onClose={handleCloseGeneration}
        onComplete={() => setShowDesignPicker(true)}
      />
    );
  }

  const displayError = localError || generationError;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-8">
      {/* Header */}
      <header className="border-b border-border px-4 py-4 sm:py-5 md:px-6 sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Synthetik</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Sticker Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              Gallery
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              History
            </Button>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {displayError && (
        <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{displayError}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocalError(null)}
              className="ml-auto text-destructive hover:text-destructive"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 md:px-6">
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
          {/* Left Column - Upload */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                1
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Upload Photo</h2>
                <p className="text-xs sm:text-sm text-muted-foreground">Optional reference image</p>
              </div>
            </div>
            <ImageUpload onImageUpload={setUploadedImage} image={uploadedImage} />
          </section>

          {/* Right Column - Style & Generate */}
          <div className="space-y-6">
            {/* Step 2: Choose Style */}
            <section className="space-y-4">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    2
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold">Choose Your Style</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Advanced</span>
                  <Switch
                    checked={isAdvanced}
                    onCheckedChange={setIsAdvanced}
                  />
                </div>
              </div>

              <div className={`grid gap-2 sm:gap-3 ${
                isAdvanced
                  ? "grid-cols-4 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5"
                  : "grid-cols-3"
              }`}>
                {styles.slice(0, isAdvanced ? styles.length : 6).map((style) => (
                  <StyleCard
                    key={style.id}
                    style={style}
                    isSelected={selectedStyle?.id === style.id}
                    onClick={() =>
                      setSelectedStyle({
                        id: style.id,
                        name: style.name,
                        type: style.type,
                      })
                    }
                  />
                ))}
              </div>
              {!isAdvanced && (
                <p className="text-xs text-muted-foreground text-center">
                  Enable Advanced to see all {styles.length} styles
                </p>
              )}
            </section>

            {/* Custom Prompt */}
            <section className="space-y-3">
              <label className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                Describe Your Sticker
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder='e.g., "a cute orange cat", "cyberpunk robot"...'
                    className="bg-input border-border pr-10"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition">
                    <Zap className="w-4 h-4" />
                  </button>
                </div>
                <Button
                  onClick={handleSurpriseMe}
                  variant="outline"
                  className="bg-secondary/20 border-secondary text-secondary hover:bg-secondary/30 whitespace-nowrap"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Surprise Me
                </Button>
              </div>
            </section>

            {/* Recently Used */}
            <RecentlyUsed
              styles={recentStyles}
              onStyleClick={(style) => setSelectedStyle(style)}
            />

            {/* Generate Button */}
            <Button
              onClick={handleGenerateClick}
              disabled={!selectedStyle}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white h-12 sm:h-14 rounded-xl font-bold text-base sm:text-lg shadow-lg shadow-primary/25 transition-all"
            >
              <Sparkles className="w-5 h-5 mr-2" fill="white" />
              Generate Sticker
            </Button>

            {/* Info Text */}
            <div className="text-center space-y-1">
              <p className="text-xs text-muted-foreground">
                By clicking Generate, you agree to our Terms of Service.
              </p>
              <p className="text-xs text-muted-foreground">
                AI generation typically takes 10-30 seconds.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
}
