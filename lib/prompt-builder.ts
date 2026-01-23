/**
 * Advanced Prompt Engineering for AI Sticker Generation
 * Optimized for Google Nano Banana / Gemini 2.5 image generation
 */

// Comprehensive style configurations with detailed prompt engineering
export const STICKER_STYLES = {
  GHIBLI: {
    id: "ghibli",
    name: "Ghibli",
    description: "Studio Ghibli inspired anime art style",
    promptModifier:
      "Studio Ghibli style, watercolor texture, soft colors, whimsical atmosphere, hand-painted look",
    negativePrompt:
      "realistic, photorealistic, dark, horror, violent, sharp edges, 3D, neon",
    color: "linear-gradient(135deg, #d4a574 0%, #8b7355 100%)",
    previewImage: "/styles/ghibli.svg",
    emoji: "🍃",
    lighting: "soft natural light",
    composition: "centered subject",
  },
  ANIMATED: {
    id: "animated",
    name: "Cartoon",
    description: "Modern 2D animation style",
    promptModifier:
      "modern cartoon style, clean outlines, flat colors, expressive features, Disney/Pixar inspired",
    negativePrompt: "realistic, sketch, rough, 3D, photograph, blurry",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    previewImage: "/styles/cartoon.svg",
    emoji: "🎬",
    lighting: "bright studio lighting",
    composition: "clear silhouette",
  },
  "3D_RENDER": {
    id: "3d-render",
    name: "3D Render",
    description: "High-quality 3D rendered style",
    promptModifier:
      "3D render, Pixar style, smooth surfaces, soft lighting, stylized 3D character",
    negativePrompt: "2D, flat, sketch, watercolor, low poly, realistic human",
    color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    previewImage: "/styles/3d-render.svg",
    emoji: "🎮",
    lighting: "studio three-point lighting",
    composition: "three-quarter view",
  },
  ANIME: {
    id: "anime",
    name: "Anime",
    description: "Japanese anime style",
    promptModifier:
      "anime style, large expressive eyes, cel-shaded colors, detailed hair, vibrant colors",
    negativePrompt: "western cartoon, 3D, realistic, chibi, bad anatomy",
    color: "linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)",
    previewImage: "/styles/anime.svg",
    emoji: "⭐",
    lighting: "anime lighting",
    composition: "dynamic pose",
  },
  CHIBI: {
    id: "chibi",
    name: "Chibi",
    description: "Cute chibi style",
    promptModifier:
      "chibi style, oversized head, tiny body, cute features, pastel colors, kawaii",
    negativePrompt: "realistic proportions, tall, serious, detailed",
    color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    previewImage: "/styles/chibi.svg",
    emoji: "🎀",
    lighting: "soft flat lighting",
    composition: "centered, simple pose",
  },
  RETRO_80S: {
    id: "retro-80s",
    name: "Synthwave",
    description: "Nostalgic 80s aesthetic",
    promptModifier:
      "synthwave style, neon colors, sunset gradient, retro 80s aesthetic",
    negativePrompt: "modern, minimalist, muted colors, realistic",
    color: "linear-gradient(135deg, #ff0080 0%, #7928ca 100%)",
    previewImage: "/styles/synthwave.svg",
    emoji: "🌆",
    lighting: "neon glow",
    composition: "silhouette against gradient",
  },
  CYBERPUNK: {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic cyberpunk style",
    promptModifier:
      "cyberpunk style, neon lights, futuristic, cybernetic elements, urban dystopia",
    negativePrompt: "natural, pastoral, bright daylight, vintage",
    color: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    previewImage: "/styles/cyberpunk.svg",
    emoji: "🤖",
    lighting: "neon lighting",
    composition: "urban setting",
  },
  WATERCOLOR: {
    id: "watercolor",
    name: "Watercolor",
    description: "Artistic watercolor painting",
    promptModifier:
      "watercolor painting, soft edges, transparent colors, brush strokes",
    negativePrompt: "digital, sharp edges, flat colors, 3D, photorealistic",
    color: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    previewImage: "/styles/watercolor.svg",
    emoji: "🎨",
    lighting: "soft natural light",
    composition: "organic flow",
  },
  PASTEL: {
    id: "pastel",
    name: "Pastel Dream",
    description: "Soft pastel colors",
    promptModifier:
      "pastel colors, soft aesthetic, cute styling, gentle colors",
    negativePrompt: "dark, high contrast, neon, harsh",
    color: "linear-gradient(135deg, #fce7f3 0%, #ddd6fe 100%)",
    previewImage: "/styles/pastel.svg",
    emoji: "🌸",
    lighting: "soft diffused light",
    composition: "gentle curves",
  },
  PIXEL_ART: {
    id: "pixel-art",
    name: "Pixel Art",
    description: "Retro pixel art style",
    promptModifier:
      "pixel art, retro video game style, limited colors, crisp pixels",
    negativePrompt: "smooth, anti-aliased, high resolution, photorealistic",
    color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    previewImage: "/styles/pixel-art.svg",
    emoji: "👾",
    lighting: "flat shading",
    composition: "clear silhouette",
  },
  POP_ART: {
    id: "pop-art",
    name: "Pop Art",
    description: "Andy Warhol inspired",
    promptModifier:
      "pop art style, bold colors, Ben-Day dots, comic book aesthetic",
    negativePrompt: "subtle, muted, realistic, watercolor",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    previewImage: "/styles/pop-art.svg",
    emoji: "💥",
    lighting: "flat graphic lighting",
    composition: "bold graphic shapes",
  },
  MINIMALIST: {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean minimal design",
    promptModifier:
      "minimalist design, simple shapes, limited colors, clean lines",
    negativePrompt: "detailed, complex, busy, ornate",
    color: "linear-gradient(135deg, #e8e8e8 0%, #c4c4c4 100%)",
    previewImage: "/styles/minimalist.svg",
    emoji: "◯",
    lighting: "flat lighting",
    composition: "balanced negative space",
  },
  KAWAII: {
    id: "kawaii",
    name: "Kawaii",
    description: "Super cute Japanese style",
    promptModifier: "kawaii style, extremely cute, sparkly eyes, pastel colors",
    negativePrompt: "scary, dark, realistic, serious",
    color: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    previewImage: "/styles/kawaii.svg",
    emoji: "💖",
    lighting: "soft bright lighting",
    composition: "centered cute subject",
  },
  COMIC_BOOK: {
    id: "comic-book",
    name: "Comic Book",
    description: "Marvel/DC comic style",
    promptModifier:
      "comic book style, bold outlines, dynamic poses, superhero aesthetic",
    negativePrompt: "anime, cute, realistic, soft",
    color: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
    previewImage: "/styles/comic-book.svg",
    emoji: "💪",
    lighting: "dramatic lighting",
    composition: "heroic pose",
  },
  VINTAGE: {
    id: "vintage",
    name: "Vintage",
    description: "Retro vintage aesthetic",
    promptModifier:
      "vintage style, muted colors, retro aesthetic, classic illustration",
    negativePrompt: "modern, digital, neon, futuristic",
    color: "linear-gradient(135deg, #c79081 0%, #dfa579 100%)",
    previewImage: "/styles/vintage.svg",
    emoji: "📺",
    lighting: "warm lighting",
    composition: "classic framing",
  },
  NEON: {
    id: "neon",
    name: "Neon Glow",
    description: "Bright neon lights",
    promptModifier:
      "neon glow, bright colors, glowing effects, dark background",
    negativePrompt: "daylight, natural, muted, vintage",
    color: "linear-gradient(135deg, #00f260 0%, #0575e6 100%)",
    previewImage: "/styles/neon.svg",
    emoji: "✨",
    lighting: "neon lighting",
    composition: "glowing subject",
  },
  GRAFFITI: {
    id: "graffiti",
    name: "Street Art",
    description: "Urban graffiti style",
    promptModifier: "graffiti style, spray paint, urban art, bold colors",
    negativePrompt: "clean, corporate, delicate, traditional",
    color: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    previewImage: "/styles/street-art.svg",
    emoji: "🎤",
    lighting: "daylight",
    composition: "bold graphic",
  },
  STAINED_GLASS: {
    id: "stained-glass",
    name: "Stained Glass",
    description: "Colorful stained glass",
    promptModifier: "stained glass art, lead lines, jewel colors, translucent",
    negativePrompt: "opaque, matte, realistic, modern",
    color: "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",
    previewImage: "/styles/stained-glass.svg",
    emoji: "🏰",
    lighting: "backlit",
    composition: "segmented design",
  },
  DOODLE: {
    id: "doodle",
    name: "Doodle",
    description: "Hand-drawn doodle style",
    promptModifier: "hand-drawn doodle, sketchy lines, pen on paper, whimsical",
    negativePrompt: "polished, perfect, digital, 3D",
    color: "linear-gradient(135deg, #ffeaa7 0%, #dfe6e9 100%)",
    previewImage: "/styles/doodle.svg",
    emoji: "✏️",
    lighting: "flat",
    composition: "casual arrangement",
  },
  HOLOGRAPHIC: {
    id: "holographic",
    name: "Holographic",
    description: "Iridescent holographic",
    promptModifier: "holographic effect, rainbow colors, iridescent, shiny",
    negativePrompt: "matte, flat, dull, natural",
    color: "linear-gradient(135deg, #a8c0ff 0%, #3f2b96 50%, #a8c0ff 100%)",
    previewImage: "/styles/holographic.svg",
    emoji: "🌈",
    lighting: "iridescent",
    composition: "showcasing color-shift",
  },
} as const;

export type StyleKey = keyof typeof STICKER_STYLES;

export interface PromptBuilderParams {
  subject: string;
  style: StyleKey | string;
  customPrompt?: string;
  includeSticker?: boolean;
  imageBase64?: string;
}

export interface DetailedPromptResult {
  prompt: string;
  negativePrompt: string;
}

/**
 * Build a comprehensive, detailed prompt optimized for AI image generation
 * Designed for Google Nano Banana / Gemini 2.5 model
 */
export function buildStickerPrompt(params: PromptBuilderParams): string {
  const { subject, style, customPrompt, includeSticker = true } = params;

  // Get style configuration
  const styleConfig =
    STICKER_STYLES[style as StyleKey] ||
    Object.values(STICKER_STYLES).find(
      (s) => s.id === style || s.name.toLowerCase() === style.toLowerCase(),
    );

  // === SIMPLIFIED PROMPT STRUCTURE ===
  const promptParts: string[] = [];

  // 1. Core subject
  const cleanSubject = subject.trim();

  // 2. Style
  if (styleConfig) {
    promptParts.push(styleConfig.promptModifier);
  }

  // 3. Format
  if (includeSticker) {
    promptParts.push("sticker design");
  }

  // 4. Subject
  promptParts.push(`of ${cleanSubject}`);

  // 5. Custom additions
  if (customPrompt && customPrompt.trim()) {
    promptParts.push(customPrompt.trim());
  }

  // 6. Quality
  promptParts.push("high quality, detailed, professional");

  // 7. No text
  promptParts.push("no text, no words, no letters");

  // 8. Background
  if (includeSticker) {
    promptParts.push("clean sticker edges");
  }

  // Build final prompt
  let finalPrompt = promptParts.join(", ");

  // Capitalize first letter
  finalPrompt = finalPrompt.charAt(0).toUpperCase() + finalPrompt.slice(1);

  return finalPrompt;
}

/**
 * Get the negative prompt for a given style
 */
export function getNegativePrompt(style: StyleKey | string): string {
  const styleConfig =
    STICKER_STYLES[style as StyleKey] ||
    Object.values(STICKER_STYLES).find(
      (s) => s.id === style || s.name.toLowerCase() === style.toLowerCase(),
    );

  const baseNegative = [
    "text",
    "words",
    "letters",
    "numbers",
    "writing",
    "labels",
    "captions",
    "watermark",
    "signature",
    "logo",
    "blurry",
    "low quality",
    "distorted",
    "ugly",
    "bad anatomy",
    "extra limbs",
    "extra people",
    "extra faces",
    "crowd",
    "deformed",
    "disfigured",
    "mutated",
  ];

  const styleNegative = styleConfig?.negativePrompt
    ? styleConfig.negativePrompt.split(", ")
    : [];

  return [...baseNegative, ...styleNegative].filter(Boolean).join(", ");
}

/**
 * Build both positive and negative prompts
 */
export function buildDetailedPrompt(
  params: PromptBuilderParams,
): DetailedPromptResult {
  return {
    prompt: buildStickerPrompt(params),
    negativePrompt: getNegativePrompt(params.style),
  };
}

/**
 * Enhance the subject description based on style context
 */
function enhanceSubjectDescription(
  subject: string,
  styleConfig: (typeof STICKER_STYLES)[StyleKey] | undefined,
): string {
  if (!subject || subject.trim().length === 0) {
    return "a creative character design";
  }

  return subject.trim();
}

/**
 * Generate variation prompts for multiple design options
 */
export function buildVariationPrompts(
  baseParams: PromptBuilderParams,
  count: number = 4,
): string[] {
  const variations = [
    "", // Original
    "playful version",
    "cute version",
    "dynamic version",
  ];

  const prompts: string[] = [];
  for (let i = 0; i < count; i++) {
    const variation = variations[i % variations.length];
    const modifiedParams = variation
      ? {
          ...baseParams,
          customPrompt: [baseParams.customPrompt, variation]
            .filter(Boolean)
            .join(", "),
        }
      : baseParams;

    prompts.push(buildStickerPrompt(modifiedParams));
  }

  return prompts;
}

/**
 * Get all styles as an array for UI display
 */
export function getStylesArray() {
  return Object.entries(STICKER_STYLES).map(([key, value]) => ({
    ...value,
    type: key,
  }));
}

/**
 * Get a default creative subject suggestion for a given style
 */
export function getDefaultSubjectFromStyle(style: StyleKey | string): string {
  const subjects: Record<string, string> = {
    GHIBLI: "a forest spirit",
    ANIMATED: "a cartoon character",
    "3D_RENDER": "a 3D mascot",
    ANIME: "an anime character",
    CHIBI: "a chibi character",
    RETRO_80S: "a retro character",
    CYBERPUNK: "a cyberpunk character",
    WATERCOLOR: "a butterfly",
    PASTEL: "a cute bunny",
    PIXEL_ART: "a game character",
    POP_ART: "a pop art portrait",
    MINIMALIST: "a geometric fox",
    KAWAII: "a kawaii character",
    COMIC_BOOK: "a superhero",
    VINTAGE: "a vintage character",
    NEON: "a neon figure",
    GRAFFITI: "a graffiti character",
    STAINED_GLASS: "a phoenix",
    DOODLE: "a doodle creature",
    HOLOGRAPHIC: "a unicorn",
  };

  return subjects[style as StyleKey] || "a creative sticker design";
}
