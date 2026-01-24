"use client";

import { useState, useCallback, useEffect } from "react";
import { Sparkles, Wand2, AlertCircle, Pencil, Clock, Upload, Palette, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/components/image-upload";
import StyleCard from "@/components/style-card";
import RecentlyUsed from "@/components/recently-used";
import BottomNav from "@/components/bottom-nav";
import GenerationProgress from "@/components/generation-progress";
import DesignPicker from "@/components/design-picker";
import { ThemeToggle } from "@/components/theme-toggle";
import { useGeneration } from "@/hooks/use-generation";
import { Style, SelectedStyle } from "@/lib/types";
import { STICKER_STYLES } from "@/lib/prompt-builder";

// Convert STICKER_STYLES to array format for display
const styles: Style[] = Object.entries(STICKER_STYLES).map(
  ([key, value], index) => ({
    id: String(index + 1),
    name: value.name,
    type: key,
    image: value.color,
    previewImage: value.previewImage,
    description: value.description,
  }),
);

// LocalStorage key for recently used styles
const RECENT_STYLES_KEY = "synthetik-recent-styles";
const MAX_RECENT_STYLES = 6;

// Type for per-style custom prompts
interface StyleCustomPrompt {
  enabled: boolean;
  prompt: string;
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(
    null,
  );
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [showDesignPicker, setShowDesignPicker] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Feature 1: Custom prompt only mode (no style required)
  const [useCustomPromptOnly, setUseCustomPromptOnly] = useState(false);

  // Feature 2: Per-style additional custom prompts
  const [styleCustomPrompts, setStyleCustomPrompts] = useState<
    Record<string, StyleCustomPrompt>
  >({});

  // Recently used styles (stored in localStorage)
  const [recentlyUsedStyles, setRecentlyUsedStyles] = useState<Style[]>([]);

  // Load recently used styles from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_STYLES_KEY);
      if (stored) {
        const parsedIds: string[] = JSON.parse(stored);
        const recentStyles = parsedIds
          .map((id) => styles.find((s) => s.id === id))
          .filter((s): s is Style => s !== undefined);
        setRecentlyUsedStyles(recentStyles);
      }
    } catch (error) {
      console.error("Failed to load recent styles:", error);
    }
  }, []);

  // Function to add a style to recently used
  const addToRecentlyUsed = useCallback((style: SelectedStyle) => {
    setRecentlyUsedStyles((prev) => {
      const filtered = prev.filter((s) => s.id !== style.id);
      const fullStyle = styles.find((s) => s.id === style.id);
      if (!fullStyle) return prev;

      const updated = [fullStyle, ...filtered].slice(0, MAX_RECENT_STYLES);

      try {
        localStorage.setItem(
          RECENT_STYLES_KEY,
          JSON.stringify(updated.map((s) => s.id))
        );
      } catch (error) {
        console.error("Failed to save recent styles:", error);
      }

      return updated;
    });
  }, []);

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
    },
    onError: (error) => {
      console.error("Generation error:", error);
      setLocalError(error);
    },
  });

  const handleGenerateClick = useCallback(async () => {
    if (!selectedStyle && !useCustomPromptOnly) {
      setLocalError("Please select a style first");
      return;
    }

    if (useCustomPromptOnly && !customPrompt.trim()) {
      setLocalError("Please enter a custom prompt");
      return;
    }

    setLocalError(null);

    if (selectedStyle) {
      addToRecentlyUsed(selectedStyle);
    }

    const subject =
      customPrompt.trim() ||
      (uploadedImage ? "the uploaded image subject" : "a creative character");

    let finalCustomPrompt = customPrompt.trim();
    if (selectedStyle) {
      const stylePromptConfig = styleCustomPrompts[selectedStyle.id];
      if (stylePromptConfig?.enabled && stylePromptConfig.prompt.trim()) {
        finalCustomPrompt = finalCustomPrompt
          ? `${finalCustomPrompt}, ${stylePromptConfig.prompt.trim()}`
          : stylePromptConfig.prompt.trim();
      }
    }

    await generate({
      style: selectedStyle?.type || "artistic",
      customPrompt: finalCustomPrompt || undefined,
      subject,
      numberOfVariations: 1,
      imageBase64: uploadedImage || undefined,
      customPromptOnly: useCustomPromptOnly,
    });
  }, [
    selectedStyle,
    customPrompt,
    uploadedImage,
    generate,
    useCustomPromptOnly,
    styleCustomPrompts,
    addToRecentlyUsed,
  ]);

  const getStyleCustomPrompt = (styleId: string): StyleCustomPrompt => {
    return styleCustomPrompts[styleId] || { enabled: false, prompt: "" };
  };

  const updateStyleCustomPrompt = (
    styleId: string,
    updates: Partial<StyleCustomPrompt>,
  ) => {
    setStyleCustomPrompts((prev) => ({
      ...prev,
      [styleId]: {
        ...getStyleCustomPrompt(styleId),
        ...updates,
      },
    }));
  };

  const handleSurpriseMe = () => {
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    setSelectedStyle({
      id: randomStyle.id,
      name: randomStyle.name,
      type: randomStyle.type,
    });

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
    setShowDesignPicker(false);
    reset();
  };

  const handleCloseGeneration = () => {
    reset();
  };

  // Show generation progress while generating
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

  // Show design picker when we have generated images
  if (generatedImages.length > 0) {
    return (
      <DesignPicker
        designs={generatedImages}
        onBack={handleBack}
        onConfirm={handleConfirm}
      />
    );
  }

  const displayError = localError || generationError;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-8">
      {/* Gradient Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 px-4 py-4 sm:py-5 md:px-6 sticky top-0 glass z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg glow-primary">
                <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-white" fill="currentColor" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gradient">Synthetik</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Sticker Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {displayError && (
        <div className="relative bg-destructive/10 border-b border-destructive/20 px-4 py-3">
          <div className="max-w-6xl mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive flex-1">{displayError}</p>
            <button
              onClick={() => {
                setLocalError(null);
                reset();
              }}
              className="p-1 hover:bg-destructive/20 rounded-full transition"
            >
              <X className="w-4 h-4 text-destructive" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-4 py-8 md:px-6">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Create <span className="text-gradient">Amazing</span> Stickers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Transform your photos into unique sticker designs with the power of AI.
            Choose a style, add your touch, and watch the magic happen.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Left Column - Upload & Prompt */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-primary text-white text-sm font-bold shadow-md">
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upload Photo</h3>
                  <p className="text-xs text-muted-foreground">Optional reference image</p>
                </div>
              </div>
              <ImageUpload
                onImageUpload={setUploadedImage}
                image={uploadedImage}
              />
            </section>

            {/* Prompt Section */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-secondary text-white text-sm font-bold shadow-md">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Describe Your Vision</h3>
                    <p className="text-xs text-muted-foreground">What should we create?</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Custom Only</span>
                  <Switch
                    checked={useCustomPromptOnly}
                    onCheckedChange={(checked) => {
                      setUseCustomPromptOnly(checked);
                      if (checked) setSelectedStyle(null);
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder={
                    useCustomPromptOnly
                      ? "Describe your sticker in detail...\n\nBe creative and specific!"
                      : 'e.g., "a cute orange cat playing with yarn"'
                  }
                  className="bg-card/50 border-border/50 min-h-28 resize-none text-sm focus:border-primary/50 focus:ring-primary/20 transition-all"
                  rows={4}
                />

                <Button
                  onClick={handleSurpriseMe}
                  variant="outline"
                  className="w-full border-dashed border-2 hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <Wand2 className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Surprise Me
                </Button>
              </div>

              {useCustomPromptOnly && (
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  Style selection disabled. Your custom prompt will be used directly with a default artistic style.
                </p>
              )}
            </section>

            {/* Per-Style Additional Prompt */}
            {selectedStyle && !useCustomPromptOnly && (
              <section className="space-y-3 p-4 rounded-2xl bg-card/50 border border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Pencil className="w-4 h-4 text-accent" />
                    <span className="text-sm font-medium">
                      Extra details for {selectedStyle.name}
                    </span>
                  </div>
                  <Switch
                    checked={getStyleCustomPrompt(selectedStyle.id).enabled}
                    onCheckedChange={(checked) =>
                      updateStyleCustomPrompt(selectedStyle.id, { enabled: checked })
                    }
                  />
                </div>
                {getStyleCustomPrompt(selectedStyle.id).enabled && (
                  <Textarea
                    value={getStyleCustomPrompt(selectedStyle.id).prompt}
                    onChange={(e) =>
                      updateStyleCustomPrompt(selectedStyle.id, { prompt: e.target.value })
                    }
                    placeholder={`Add specific details for ${selectedStyle.name} style...`}
                    className="bg-background/50 border-border/50 min-h-20 text-sm"
                  />
                )}
              </section>
            )}

            {/* Generate Button */}
            <Button
              onClick={handleGenerateClick}
              disabled={useCustomPromptOnly ? !customPrompt.trim() : !selectedStyle}
              className="w-full h-14 rounded-2xl font-bold text-lg bg-gradient-primary hover:opacity-90 text-white shadow-lg glow-primary transition-all disabled:opacity-50 disabled:glow-none group"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="white" />
              {useCustomPromptOnly ? "Generate with Custom Prompt" : "Generate Sticker"}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Column - Style Selection */}
          <div className="lg:col-span-3 space-y-6">
            {/* Style Selection */}
            <section className={`space-y-4 ${useCustomPromptOnly ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-xl text-white text-sm font-bold shadow-md ${
                    useCustomPromptOnly ? "bg-muted" : "bg-gradient-accent"
                  }`}>
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Choose Style
                      {useCustomPromptOnly && (
                        <span className="text-xs font-normal text-muted-foreground">(Disabled)</span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {selectedStyle ? `Selected: ${selectedStyle.name}` : "Pick your favorite style"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Show All</span>
                  <Switch
                    checked={isAdvanced}
                    onCheckedChange={setIsAdvanced}
                    disabled={useCustomPromptOnly}
                  />
                </div>
              </div>

              <div className={`grid gap-3 ${
                isAdvanced
                  ? "grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-3"
              }`}>
                {styles.slice(0, isAdvanced ? styles.length : 9).map((style) => (
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

              {!isAdvanced && !useCustomPromptOnly && (
                <p className="text-xs text-muted-foreground text-center">
                  Toggle &quot;Show All&quot; to see all {styles.length} styles
                </p>
              )}
            </section>

            {/* Recently Used */}
            {recentlyUsedStyles.length > 0 && !useCustomPromptOnly && (
              <section className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Recently Used</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {recentlyUsedStyles.map((style) => (
                    <RecentlyUsed
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
              </section>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            Powered by AI. Generation typically takes 10-30 seconds.
          </p>
          <p className="text-xs text-muted-foreground">
            By generating, you agree to our Terms of Service.
          </p>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <BottomNav />
    </div>
  );
}
