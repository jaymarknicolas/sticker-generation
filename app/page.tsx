"use client";

import { useState } from "react";
import { Upload, Sparkles, Zap, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/image-upload";
import StyleCard from "@/components/style-card";
import RecentlyUsed from "@/components/recently-used";
import BottomNav from "@/components/bottom-nav";
import GenerationProgress from "@/components/generation-progress";
import DesignPicker from "@/components/design-picker";

interface SelectedStyle {
  id: string;
  name: string;
  type: string;
}

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<SelectedStyle | null>(
    null,
  );
  const [customPrompt, setCustomPrompt] = useState("");
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDesignPicker, setShowDesignPicker] = useState(false);

  const styles = [
    {
      id: "1",
      name: "Ghibli",
      type: "GHIBLI",
      image: "linear-gradient(135deg, #d4a574 0%, #8b7355 100%)",
    },
    {
      id: "2",
      name: "Animated",
      type: "ANIMATED",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    },
    {
      id: "3",
      name: "3D Render",
      type: "3D RENDER",
      image: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    },
  ];

  const recentStyles = [
    { id: "r1", name: "Retro 80s", featured: true },
    { id: "r2", name: "Ghibli Mix", featured: true },
    { id: "r3", name: "Neon City", featured: false },
    { id: "r4", name: "Watercolor", featured: false },
    { id: "r5", name: "Pastel", featured: false },
  ];

  const handleGenerateClick = () => {
    if (uploadedImage && selectedStyle) {
      setIsGenerating(true);
    }
  };

  const handleSurpriseMe = () => {
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    setSelectedStyle({
      id: randomStyle.id,
      name: randomStyle.name,
      type: randomStyle.type,
    });
  };

  if (showDesignPicker) {
    return (
      <DesignPicker
        onBack={() => {
          setShowDesignPicker(false);
          setIsGenerating(false);
        }}
        onConfirm={(selectedDesignId) => {
          console.log("Selected design:", selectedDesignId);
          setShowDesignPicker(false);
          setIsGenerating(false);
        }}
      />
    );
  }

  if (isGenerating) {
    return (
      <GenerationProgress
        onClose={() => setIsGenerating(false)}
        onComplete={() => setShowDesignPicker(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 sm:pb-24">
      {/* Header */}
      <div className="border-b border-border px-4 py-4 sm:py-6 md:px-6 sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="flex items-center gap-2">
          <Sparkles
            className="w-5 sm:w-6 h-5 sm:h-6 text-primary flex-shrink-0"
            fill="currentColor"
          />
          <h1 className="text-lg sm:text-2xl font-bold">Upload & Styling</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-3 sm:px-4 py-6 sm:py-8 md:px-6 space-y-6 sm:space-y-8 block lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-7xl">
        {/* Step 1: Upload Photo */}
        <section className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center justify-center w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-primary text-white text-xs sm:text-sm font-bold flex-shrink-0">
              1
            </div>
            <h2 className="text-lg sm:text-xl font-bold">Upload Photo</h2>
          </div>
          <ImageUpload onImageUpload={setUploadedImage} image={uploadedImage} />
        </section>

        <div className="space-y-6">
          {/* Step 2: Choose Your Style */}
          <section className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center justify-center w-6 sm:w-7 h-6 sm:h-7 rounded-full bg-primary text-white text-xs sm:text-sm font-bold flex-shrink-0">
                  2
                </div>
                <h2 className="text-lg sm:text-xl font-bold">
                  Choose Your Style
                </h2>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Advanced
                </span>
                <button
                  onClick={() => setIsAdvanced(!isAdvanced)}
                  className={`w-9 sm:w-10 h-5 sm:h-6 rounded-full transition-colors flex-shrink-0 ${
                    isAdvanced ? "bg-primary" : "bg-muted"
                  } flex items-center ${isAdvanced ? "justify-end" : "justify-start"} p-0.5`}
                >
                  <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-white" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              {styles.map((style) => (
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
          </section>

          {/* Custom Prompt */}
          <section className="space-y-3">
            <label className="text-xs font-bold text-muted-foreground tracking-wide">
              CUSTOM PROMPT
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder='Describe your style (e.g., "cyberpunk cat")...'
                  className="bg-input border-border text-foreground placeholder-muted-foreground pr-10 text-sm sm:text-base"
                />
                <button className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition flex-shrink-0">
                  <Zap className="w-4 h-4" />
                </button>
              </div>
              <Button
                onClick={handleSurpriseMe}
                variant="outline"
                className="bg-secondary/20 border-secondary text-secondary hover:bg-secondary/30 text-xs sm:text-sm whitespace-nowrap"
              >
                <Wand2 className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                SURPRISE ME
              </Button>
            </div>
          </section>

          {/* Recently Used */}
          <section>
            <RecentlyUsed
              styles={recentStyles}
              onStyleClick={(style) => setSelectedStyle(style)}
            />
          </section>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateClick}
            disabled={!uploadedImage || !selectedStyle}
            className="w-full bg-primary hover:bg-blue-600 text-white h-10 sm:h-12 rounded-lg font-bold text-sm sm:text-base"
          >
            <Sparkles className="w-4 h-4 mr-2" fill="white" />
            Generate Sticker
          </Button>
        </div>

        {/* Terms */}
        <div className="text-center text-xs text-muted-foreground space-y-1">
          <p>By clicking Generate, you agree to our Terms of Service.</p>
          <p>AI generation usually takes less than 30 seconds.</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
