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
      <div className="flex-1 flex flex-col items-center px-4 sm:px-6 py-6 sm:py-8 overflow-y-auto">
        {/* Circular Progress */}
        <div className="relative w-40 sm:w-56 h-40 sm:h-56 mb-6 sm:mb-8 shrink-0">
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
        <div className="text-center max-w-sm mb-4 sm:mb-6 shrink-0">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {displayProgress >= 100
              ? "Your sticker is ready!"
              : "Creating your unique design..."}
          </h2>
          <p className="text-sm text-muted-foreground">
            {statusText}
          </p>
        </div>

        {/* Generated Stickers Preview */}
        <div className="flex gap-2 justify-center mb-4 sm:mb-6 flex-wrap shrink-0">
          {[0].map((index) => (
            <div
              key={index}
              className={`w-14 sm:w-16 h-14 sm:h-16 rounded-xl border-2 border-border flex items-center justify-center transition-all duration-300 ${
                index < generatedCount
                  ? "bg-linear-to-br from-primary to-secondary border-primary"
                  : "bg-muted/30"
              }`}
            >
              {index < generatedCount && (
                <div className="text-xs font-bold text-white text-center">
                  ✓
                </div>
              )}
              {index >= generatedCount && (
                <div className="text-muted-foreground">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="w-full max-w-sm bg-card border border-border rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 shrink-0">
          <div className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-xs">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground mb-1 text-sm">
                Pro Tip
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                High-contrast images with clear subjects work best for sticker generation.
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full max-w-sm shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
              Progress
            </span>
            <span className="text-xs font-semibold text-foreground">
              {displayProgress}%
            </span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
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
