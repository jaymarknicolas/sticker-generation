"use client";

import { useEffect, useRef } from "react";
import { X, Zap } from "lucide-react";

interface GenerationProgressProps {
  progress?: number;
  statusText?: string;
  generatedCount?: number;
  onClose: () => void;
  onComplete?: () => void;
}

export default function GenerationProgress({
  progress = 0,
  statusText = "Analyzing your style...",
  generatedCount = 0,
  onClose,
  onComplete,
}: GenerationProgressProps) {
  const hasCompletedRef = useRef(false);

  // Trigger onComplete when progress reaches 100%
  useEffect(() => {
    if (progress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      const timer = setTimeout(() => {
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, onComplete]);

  const displayProgress = Math.min(Math.round(progress), 100);

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
        <div className="relative w-48 sm:w-64 h-48 sm:h-64 mb-8 sm:mb-12 shrink-0">
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
              stroke="var(--border)"
              strokeWidth="8"
            />

            {/* Progress circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeDasharray={`${565.48 * (displayProgress / 100)} 565.48`}
              strokeLinecap="round"
              className="transition-all duration-300 drop-shadow-lg"
              style={{
                filter: "drop-shadow(0 0 12px rgba(37, 99, 235, 0.5))",
              }}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">
              {displayProgress}%
            </div>
            <div className="text-xs sm:text-sm font-semibold text-primary tracking-widest uppercase">
              {displayProgress >= 100 ? "Complete" : "Working"}
            </div>
          </div>
        </div>

        {/* Subtitle and Status */}
        <div className="text-center max-w-sm mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            {displayProgress >= 100
              ? "Your sticker is ready!"
              : "Creating your unique design..."}
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
                  ? "bg-linear-to-br from-primary to-secondary border-primary"
                  : "bg-muted/30"
              }`}
            >
              {index < generatedCount && (
                <div className="text-xs sm:text-sm font-bold text-white text-center">
                  {String.fromCharCode(65 + index)}
                </div>
              )}
              {index >= generatedCount && (
                <div className="text-muted-foreground">
                  {index === generatedCount ? (
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-dashed border-muted-foreground/50 rounded" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="w-full max-w-md bg-card border border-border rounded-2xl p-4 sm:p-6 mb-8 sm:mb-12">
          <div className="flex gap-3 sm:gap-4">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-white text-xs sm:text-sm">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-foreground mb-2 text-sm sm:text-base">
                Pro Tip
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
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Overall Progress
            </span>
            <span className="text-xs font-semibold text-foreground">
              {displayProgress}%
            </span>
          </div>
          <div className="w-full h-2 sm:h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mobile bottom padding for safe area */}
      <div className="h-4" />
    </div>
  );
}
