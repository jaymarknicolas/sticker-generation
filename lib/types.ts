// Shared types for the sticker generation app

export interface Style {
  id: string;
  name: string;
  type: string;
  image: string;
  previewImage?: string;
  description?: string;
}

export interface SelectedStyle {
  id: string;
  name: string;
  type: string;
}

export interface RecentStyle {
  id: string;
  name: string;
  featured: boolean;
}

export interface GeneratedDesign {
  id: number;
  url: string;
  base64?: string; // Base64 data for direct download (avoids CORS issues)
  prompt?: string;
  style?: string;
  createdAt?: Date;
}

export interface GenerationRequest {
  imageBase64?: string;
  style: string;
  customPrompt?: string;
  subject?: string;
  numberOfVariations?: number;
  customPromptOnly?: boolean; // When true, use ONLY the custom prompt, ignore selected style
}

export interface GenerationResponse {
  success: boolean;
  images?: GeneratedDesign[];
  error?: string;
  message?: string;
}

export interface GenerationState {
  isGenerating: boolean;
  progress: number;
  statusText: string;
  generatedCount: number;
  error?: string;
}

// API Error types
export interface APIError {
  code: string;
  message: string;
  details?: unknown;
}

// Navigation items
export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
}

// App steps
export type AppStep = "upload" | "style" | "generate" | "pick" | "order";

// Toast notification types
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}
