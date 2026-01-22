// Sticker style configurations - 20 unique styles
export const STICKER_STYLES = {
  GHIBLI: {
    id: "ghibli",
    name: "Ghibli",
    description: "Studio Ghibli inspired anime art style",
    promptModifier:
      "in the style of Studio Ghibli, soft watercolor aesthetics, warm and whimsical atmosphere, hand-drawn anime look, gentle lighting, pastel colors",
    color: "linear-gradient(135deg, #d4a574 0%, #8b7355 100%)",
    emoji: "🍃",
  },
  ANIMATED: {
    id: "animated",
    name: "Cartoon",
    description: "Modern 2D animation style",
    promptModifier:
      "in a modern animated cartoon style, vibrant colors, bold outlines, expressive features, clean vector-like art, Disney/Pixar inspired 2D aesthetics",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    emoji: "🎬",
  },
  "3D_RENDER": {
    id: "3d-render",
    name: "3D Render",
    description: "High-quality 3D rendered style",
    promptModifier:
      "as a high-quality 3D render, Pixar-style CGI, soft lighting, detailed textures, volumetric rendering, clay-like smooth surfaces, professional 3D animation quality",
    color: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    emoji: "🎮",
  },
  ANIME: {
    id: "anime",
    name: "Anime",
    description: "Japanese anime style",
    promptModifier:
      "in Japanese anime style, big expressive eyes, dynamic poses, cel-shaded look, vibrant colors, manga-inspired aesthetics, detailed hair and clothing",
    color: "linear-gradient(135deg, #ff6b9d 0%, #c44569 100%)",
    emoji: "⭐",
  },
  CHIBI: {
    id: "chibi",
    name: "Chibi",
    description: "Cute chibi style",
    promptModifier:
      "in adorable chibi style, super deformed proportions, big head small body, extremely cute and kawaii, simple features, round shapes",
    color: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    emoji: "🎀",
  },
  RETRO_80S: {
    id: "retro-80s",
    name: "Synthwave",
    description: "Nostalgic 80s aesthetic",
    promptModifier:
      "in retro 80s aesthetic, synthwave colors, neon pink and cyan, grid patterns, VHS aesthetic, Miami Vice vibes, chromatic aberration",
    color: "linear-gradient(135deg, #ff0080 0%, #7928ca 100%)",
    emoji: "🌆",
  },
  CYBERPUNK: {
    id: "cyberpunk",
    name: "Cyberpunk",
    description: "Futuristic cyberpunk style",
    promptModifier:
      "in cyberpunk style, neon lights, dark urban atmosphere, high-tech low-life aesthetic, glowing elements, blade runner inspired, futuristic",
    color: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    emoji: "🤖",
  },
  WATERCOLOR: {
    id: "watercolor",
    name: "Watercolor",
    description: "Artistic watercolor painting",
    promptModifier:
      "as a beautiful watercolor painting, soft color bleeds, artistic brush strokes, delicate washes, fine art quality, ethereal and dreamy",
    color: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    emoji: "🎨",
  },
  PASTEL: {
    id: "pastel",
    name: "Pastel Dream",
    description: "Soft pastel colors",
    promptModifier:
      "in soft pastel color palette, kawaii aesthetic, gentle and soothing tones, minimal shadows, cute and adorable style, clean lines",
    color: "linear-gradient(135deg, #fce7f3 0%, #ddd6fe 100%)",
    emoji: "🌸",
  },
  PIXEL_ART: {
    id: "pixel-art",
    name: "Pixel Art",
    description: "Retro pixel art style",
    promptModifier:
      "as detailed pixel art, 16-bit style, retro gaming aesthetic, limited color palette, crisp pixels, nostalgic video game look",
    color: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
    emoji: "👾",
  },
  POP_ART: {
    id: "pop-art",
    name: "Pop Art",
    description: "Andy Warhol inspired",
    promptModifier:
      "in pop art style, bold primary colors, Ben-Day dots, high contrast, Andy Warhol inspired, comic book aesthetic, screen print look",
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    emoji: "💥",
  },
  MINIMALIST: {
    id: "minimalist",
    name: "Minimalist",
    description: "Clean minimal design",
    promptModifier:
      "in minimalist style, clean simple lines, limited color palette, negative space, modern flat design, geometric shapes, elegant simplicity",
    color: "linear-gradient(135deg, #e8e8e8 0%, #c4c4c4 100%)",
    emoji: "◯",
  },
  KAWAII: {
    id: "kawaii",
    name: "Kawaii",
    description: "Super cute Japanese style",
    promptModifier:
      "in kawaii style, extremely cute and adorable, big sparkly eyes, blush marks, pastel colors, Japanese cute culture inspired, cheerful expression",
    color: "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    emoji: "💖",
  },
  COMIC_BOOK: {
    id: "comic-book",
    name: "Comic Book",
    description: "Marvel/DC comic style",
    promptModifier:
      "in comic book style, bold ink outlines, halftone dots, dynamic action pose, superhero aesthetic, vivid colors, dramatic shading",
    color: "linear-gradient(135deg, #eb3349 0%, #f45c43 100%)",
    emoji: "💪",
  },
  VINTAGE: {
    id: "vintage",
    name: "Vintage",
    description: "Retro vintage aesthetic",
    promptModifier:
      "in vintage retro style, muted earth tones, aged paper texture, 1950s aesthetic, nostalgic feel, classic illustration style, warm sepia tones",
    color: "linear-gradient(135deg, #c79081 0%, #dfa579 100%)",
    emoji: "📺",
  },
  NEON: {
    id: "neon",
    name: "Neon Glow",
    description: "Bright neon lights",
    promptModifier:
      "with bright neon glow effect, electric colors, glowing outlines, dark background, luminescent, vibrant fluorescent colors, light bloom effect",
    color: "linear-gradient(135deg, #00f260 0%, #0575e6 100%)",
    emoji: "✨",
  },
  GRAFFITI: {
    id: "graffiti",
    name: "Street Art",
    description: "Urban graffiti style",
    promptModifier:
      "in street art graffiti style, spray paint texture, urban aesthetic, bold colors, dripping paint effect, hip-hop culture inspired, expressive",
    color: "linear-gradient(135deg, #f857a6 0%, #ff5858 100%)",
    emoji: "🎤",
  },
  STAINED_GLASS: {
    id: "stained-glass",
    name: "Stained Glass",
    description: "Colorful stained glass",
    promptModifier:
      "in stained glass art style, bold black outlines, translucent colored segments, luminous effect, cathedral window inspired, geometric patterns",
    color: "linear-gradient(135deg, #4776e6 0%, #8e54e9 100%)",
    emoji: "🏰",
  },
  DOODLE: {
    id: "doodle",
    name: "Doodle",
    description: "Hand-drawn doodle style",
    promptModifier:
      "as a hand-drawn doodle, sketchy line art, playful and whimsical, notebook doodle aesthetic, black ink on white, casual artistic style",
    color: "linear-gradient(135deg, #ffeaa7 0%, #dfe6e9 100%)",
    emoji: "✏️",
  },
  HOLOGRAPHIC: {
    id: "holographic",
    name: "Holographic",
    description: "Iridescent holographic",
    promptModifier:
      "with holographic iridescent effect, rainbow shimmer, metallic sheen, prismatic colors, futuristic, chrome-like reflections, ethereal glow",
    color: "linear-gradient(135deg, #a8c0ff 0%, #3f2b96 50%, #a8c0ff 100%)",
    emoji: "🌈",
  },
} as const;

export type StyleKey = keyof typeof STICKER_STYLES;

export interface PromptBuilderParams {
  subject: string;
  style: StyleKey | string;
  customPrompt?: string;
  includeSticker?: boolean;
}

/**
 * Builds an optimized prompt for sticker generation using OpenAI DALL-E
 */
export function buildStickerPrompt(params: PromptBuilderParams): string {
  const { subject, style, customPrompt, includeSticker = true } = params;

  // Get style configuration
  const styleConfig =
    STICKER_STYLES[style as StyleKey] ||
    Object.values(STICKER_STYLES).find((s) => s.id === style || s.name.toLowerCase() === style.toLowerCase());

  // Base sticker requirements
  const stickerBase = includeSticker
    ? "Create a cute die-cut sticker design with a clean white border, suitable for printing. The design should have clean edges and work well as a standalone sticker."
    : "";

  // Build the full prompt
  const parts: string[] = [];

  // Add sticker base if needed
  if (stickerBase) {
    parts.push(stickerBase);
  }

  // Add subject/description
  if (subject) {
    parts.push(`Subject: ${subject}`);
  }

  // Add custom prompt if provided
  if (customPrompt && customPrompt.trim()) {
    parts.push(`Additional details: ${customPrompt.trim()}`);
  }

  // Add style modifier
  if (styleConfig) {
    parts.push(`Style: ${styleConfig.promptModifier}`);
  } else if (style && typeof style === "string") {
    // Use custom style as-is if not a predefined style
    parts.push(`Style: ${style}`);
  }

  // Add quality enhancers
  parts.push("High quality, detailed, professional sticker design, centered composition, vibrant colors");

  return parts.join(". ");
}

/**
 * Generate variations of the same prompt for multiple design options
 */
export function buildVariationPrompts(
  baseParams: PromptBuilderParams,
  count: number = 4
): string[] {
  const variations = [
    "", // Original
    "with a playful twist",
    "with extra cute details",
    "with a bold artistic interpretation",
    "with minimalist elements",
    "with extra vibrant colors",
    "with a whimsical touch",
    "with dynamic pose",
    "with expressive features",
    "with unique artistic flair",
  ];

  const prompts: string[] = [];
  for (let i = 0; i < count; i++) {
    const variation = variations[i % variations.length];
    const modifiedSubject = variation
      ? `${baseParams.subject} ${variation}`
      : baseParams.subject;

    prompts.push(
      buildStickerPrompt({
        ...baseParams,
        subject: modifiedSubject,
      })
    );
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
 * Extract subject from an uploaded image description
 */
export function getDefaultSubjectFromStyle(style: StyleKey | string): string {
  const subjects: Record<string, string> = {
    GHIBLI: "a cute forest spirit creature",
    ANIMATED: "a cheerful cartoon character",
    "3D_RENDER": "a friendly 3D mascot character",
    ANIME: "an anime character with expressive eyes",
    CHIBI: "an adorable chibi character",
    RETRO_80S: "a cool retro character with sunglasses",
    CYBERPUNK: "a cyberpunk character with neon accents",
    WATERCOLOR: "a beautiful flower arrangement",
    PASTEL: "a cute kawaii animal",
    PIXEL_ART: "a retro game character",
    POP_ART: "a bold portrait",
    MINIMALIST: "a simple geometric animal",
    KAWAII: "an extremely cute character",
    COMIC_BOOK: "a heroic character",
    VINTAGE: "a classic retro design",
    NEON: "a glowing neon design",
    GRAFFITI: "an urban street art character",
    STAINED_GLASS: "a beautiful decorative design",
    DOODLE: "a playful doodle character",
    HOLOGRAPHIC: "a magical shimmering creature",
  };

  return subjects[style as StyleKey] || "a creative sticker design";
}
