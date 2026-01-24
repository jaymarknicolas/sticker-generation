"use client";

import { useState, useCallback } from "react";
import { GeneratedDesign, GenerationState } from "@/lib/types";

interface UseGenerationOptions {
  onComplete?: (images: GeneratedDesign[]) => void;
  onError?: (error: string) => void;
}

interface GenerateParams {
  style: string;
  customPrompt?: string;
  subject?: string;
  numberOfVariations?: number;
  imageBase64?: string;
  customPromptOnly?: boolean;
}

export function useGeneration(options: UseGenerationOptions = {}) {
  const { onComplete, onError } = options;

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    progress: 0,
    statusText: "",
    generatedCount: 0,
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedDesign[]>([]);

  const updateProgress = useCallback((updates: Partial<GenerationState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const generate = useCallback(
    async (params: GenerateParams) => {
      const { style, customPrompt, subject, numberOfVariations = 1, imageBase64, customPromptOnly = false } = params;

      // Reset state
      setState({
        isGenerating: true,
        progress: 0,
        statusText: "Analyzing your style...",
        generatedCount: 0,
        error: undefined,
      });
      setGeneratedImages([]);

      // Simulate progress animation while waiting for API
      const progressInterval = setInterval(() => {
        setState((prev) => {
          if (prev.progress >= 85) return prev;
          const increment = Math.random() * 15;
          return {
            ...prev,
            progress: Math.min(prev.progress + increment, 85),
          };
        });
      }, 800);

      // Update status text based on whether image is provided
      const statusTexts = imageBase64
        ? [
            "AI is analyzing your photo...",
            "Understanding the composition...",
            "Applying your chosen style...",
            "Creating your unique sticker...",
            "Finalizing the design...",
          ]
        : [
            "Preparing your style...",
            "Processing artistic elements...",
            "Generating your design...",
            "Creating your sticker...",
            "Adding final touches...",
          ];
      let statusIndex = 0;
      const statusInterval = setInterval(() => {
        statusIndex = (statusIndex + 1) % statusTexts.length;
        setState((prev) => ({
          ...prev,
          statusText: statusTexts[statusIndex],
        }));
      }, 3000);

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            style,
            customPrompt,
            subject,
            numberOfVariations,
            imageBase64,
            customPromptOnly,
          }),
        });

        const data = await response.json();

        clearInterval(progressInterval);
        clearInterval(statusInterval);

        if (!response.ok || !data.success) {
          const errorMessage = data.message || data.error || "Generation failed";
          setState((prev) => ({
            ...prev,
            isGenerating: false,
            progress: 0,
            statusText: "",
            error: errorMessage,
          }));
          onError?.(errorMessage);
          return { success: false, error: errorMessage };
        }

        // Successfully generated
        const images = data.images || [];
        setGeneratedImages(images);

        setState({
          isGenerating: false,
          progress: 100,
          statusText: "Complete!",
          generatedCount: images.length,
        });

        onComplete?.(images);
        return { success: true, images };
      } catch (error) {
        clearInterval(progressInterval);
        clearInterval(statusInterval);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";

        setState({
          isGenerating: false,
          progress: 0,
          statusText: "",
          generatedCount: 0,
          error: errorMessage,
        });

        onError?.(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [onComplete, onError]
  );

  const reset = useCallback(() => {
    setState({
      isGenerating: false,
      progress: 0,
      statusText: "",
      generatedCount: 0,
      error: undefined,
    });
    setGeneratedImages([]);
  }, []);

  return {
    ...state,
    generatedImages,
    generate,
    reset,
    updateProgress,
  };
}

export default useGeneration;
