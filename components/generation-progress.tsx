"use client";

import { useState, useEffect } from "react";
import { X, Zap } from "lucide-react";

interface GenerationProgressProps {
  onClose: () => void;
  onComplete?: () => void;
}

export default function GenerationProgress({
  onClose,
  onComplete,
}: GenerationProgressProps) {
  const [progress, setProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [statusText, setStatusText] = useState("Analyzing your style...");

  useEffect(() => {
    // Simulate progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 20;
        return Math.min(next, 95);
      });
    }, 800);

    // Simulate generation of stickers
    const stickerInterval = setInterval(() => {
      setGeneratedCount((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2500);

    // Update status text based on progress
    const statusInterval = setInterval(() => {
      setStatusText((prev) => {
        if (prev === "Analyzing your style...") return "Processing textures...";
        if (prev === "Processing textures...") return "Applying effects...";
        if (prev === "Applying effects...") return "Final touches...";
        return "Almost done...";
      });
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stickerInterval);
      clearInterval(statusInterval);
    };
  }, []);

  // Auto-complete after 6 seconds and transition to design picker
  useEffect(() => {
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setGeneratedCount(3);

      // Transition to design picker after another 1 second
      setTimeout(() => {
        onComplete?.();
      }, 1000);
    }, 6000);

    return () => clearTimeout(completeTimer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-6 border-b border-border">
        <button
          onClick={onClose}
          className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
        >
          <X className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Creating Your Stickers
        </h1>
        <div className="w-6 sm:w-7" />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 overflow-y-auto">
        {/* Circular Progress */}
        <div className="relative w-48 sm:w-64 h-48 sm:h-64 mb-8 sm:mb-12 flex-shrink-0">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 200 200"
          >
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#374151"
              strokeWidth="8"
            />

            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#2563eb"
              strokeWidth="8"
              strokeDasharray={`${565.48 * (progress / 100)} 565.48`}
              strokeLinecap="round"
              className="transition-all duration-300 drop-shadow-lg"
              style={{
                filter: "drop-shadow(0 0 12px rgba(37, 99, 235, 0.5))",
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
              {Math.round(progress)}%
            </div>
            <div className="text-xs sm:text-sm font-semibold text-primary tracking-widest">
              WORKING
            </div>
          </div>
        </div>

        {/* Subtitle and Status */}
        <div className="text-center max-w-sm mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Brewing up 10 unique designs...
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            {statusText}
          </p>
        </div>

        {/* Generated Stickers Preview */}
        <div className="flex gap-2 sm:gap-3 justify-center mb-8 sm:mb-12 flex-wrap">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`w-16 sm:w-20 h-16 sm:h-20 rounded-2xl border-2 border-border flex items-center justify-center transition-all duration-300 ${
                index < generatedCount
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 border-primary"
                  : "bg-muted/30"
              }`}
            >
              {index < generatedCount && (
                <div className="text-xs sm:text-sm font-bold text-white text-center">
                  {String.fromCharCode(65 + index)}
                </div>
              )}
              {index === 3 || index === 4 ? (
                <div className="text-muted-foreground">
                  {index === 3 ? (
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-dashed border-muted-foreground rounded" />
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex gap-3 sm:gap-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs sm:text-sm font-bold">
                💡
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2 text-sm sm:text-base">
                PRO TIP
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                High-contrast images with clear subjects work best for AI
                sticker generation. Try portraits or simple objects for the
                sharpest results!
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground tracking-wide">
              OVERALL PROGRESS
            </span>
            <span className="text-xs font-semibold text-foreground">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="w-full h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile bottom padding for safe area */}
      <div className="h-4" />
    </div>
  );
}
