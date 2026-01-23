import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/openai";
import {
  buildDetailedPrompt,
  getDefaultSubjectFromStyle,
  StyleKey,
  STICKER_STYLES,
} from "@/lib/prompt-builder";
import {
  GenerationRequest,
  GenerationResponse,
  GeneratedDesign,
} from "@/lib/types";

export const maxDuration = 60; // Allow up to 60 seconds for image generation

export async function POST(
  request: NextRequest,
): Promise<NextResponse<GenerationResponse>> {
  try {
    // Check for API token
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured",
          message: "Please set the OPENAI_API_KEY environment variable",
        },
        { status: 500 },
      );
    }

    // Parse request body
    const body: GenerationRequest = await request.json();
    const {
      style,
      customPrompt,
      subject,
      numberOfVariations = 1,
      imageBase64,
    } = body;

    // Validate required fields
    if (!style) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: style",
          message: "Please select a style for your sticker",
        },
        { status: 400 },
      );
    }

    // Map style to StyleKey
    const styleKey = mapStyleToKey(style);

    // Get the human-readable style name for the AI
    const styleConfig = STICKER_STYLES[styleKey];
    const styleName = styleConfig?.name || style;

    // Build the subject - use provided subject, custom prompt as subject, or style-specific default
    const finalSubject = buildSubject(subject, customPrompt, styleKey);

    // Build comprehensive prompts using advanced prompt engineering
    const { prompt, negativePrompt } = buildDetailedPrompt({
      subject: finalSubject,
      style: styleKey,
      customPrompt: customPrompt,
      includeSticker: true,
    });

    console.log("=== STICKER GENERATION ===");
    console.log("Style:", styleKey);
    console.log("Subject:", finalSubject);
    console.log("Has reference image:", !!imageBase64);
    console.log("Prompt length:", prompt.length);
    console.log("Prompt:", prompt.substring(0, 500) + "...");
    console.log("Negative prompt:", negativePrompt.substring(0, 200) + "...");

    // Generate images using OpenAI DALL-E 3 (high quality: $0.040/image at 1024x1024)
    const images: GeneratedDesign[] = [];
    const generateCount = Math.min(numberOfVariations, 4); // Limit to 4 for cost control

    try {
      const result = await generateImage({
        prompt: prompt,
        styleName: styleName,
        numOutputs: generateCount,
        size: "1024x1024",
        quality: "standard",
        style: "vivid",
        imageBase64: imageBase64,
      });

      // if (result && result.length > 0) {
      //   result.forEach((img, index) => {
      //     images.push({
      //       id: index + 1,
      //       url: img.url,
      //       base64: img.base64, // Include base64 for direct download (avoids CORS)
      //       prompt: prompt,
      //       style: style,
      //       createdAt: new Date(),
      //     });
      //   });
      // }

      // In your app/api/generate/route.ts, update the image handling section:
      if (result && result.length > 0) {
        // Convert all OpenAI URLs to base64 before sending to client
        for (let i = 0; i < result.length; i++) {
          const img = result[i];
          let base64Data = "";

          try {
            // Fetch the image from OpenAI URL and convert to base64
            const imageResponse = await fetch(img.url);
            if (!imageResponse.ok) {
              throw new Error(`Failed to fetch image: ${imageResponse.status}`);
            }

            // Get image as buffer
            const arrayBuffer = await imageResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Convert to base64
            base64Data = buffer.toString("base64");

            images.push({
              id: i + 1,
              url: img.url, // Keep original URL for display
              base64: base64Data, // Add base64 for download
              prompt: prompt,
              style: style,
              createdAt: new Date(),
            });
          } catch (error) {
            console.error("Failed to convert image to base64:", error);
            // Fallback: use URL without base64
            images.push({
              id: i + 1,
              url: img.url,
              base64: "", // Empty base64
              prompt: prompt,
              style: style,
              createdAt: new Date(),
            });
          }
        }
      }
    } catch (genError) {
      console.error("Error generating images:", genError);
      throw genError;
    }

    if (images.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate any images",
          message: "Please try again or adjust your prompt",
        },
        { status: 500 },
      );
    }

    console.log(`Successfully generated ${images.length} image(s)`);

    return NextResponse.json({
      success: true,
      images,
      message: `Successfully generated ${images.length} sticker design${images.length > 1 ? "s" : ""}`,
    });
  } catch (error) {
    console.error("Generation API error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (
        error.message.includes("billing") ||
        error.message.includes("payment") ||
        error.message.includes("insufficient_quota")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "API payment required",
            message:
              "Please add credits at platform.openai.com/account/billing to generate images.",
          },
          { status: 402 },
        );
      }

      if (error.message.includes("nsfw") || error.message.includes("safety")) {
        return NextResponse.json(
          {
            success: false,
            error: "Content policy violation",
            message:
              "Your prompt was flagged by content policy. Please try a different description.",
          },
          { status: 400 },
        );
      }

      if (
        error.message.includes("rate limit") ||
        error.message.includes("429")
      ) {
        return NextResponse.json(
          {
            success: false,
            error: "Rate limit exceeded",
            message: "Too many requests. Please wait a moment and try again.",
          },
          { status: 429 },
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: "An error occurred during generation. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 },
    );
  }
}

/**
 * Build the subject for the prompt based on available inputs
 */
function buildSubject(
  subject: string | undefined,
  customPrompt: string | undefined,
  styleKey: StyleKey,
): string {
  // Priority 1: Explicit subject provided
  if (subject && subject.trim().length > 0) {
    return subject.trim();
  }

  // Priority 2: Use custom prompt as the subject (if it describes something)
  if (customPrompt && customPrompt.trim().length > 0) {
    const prompt = customPrompt.trim();
    // If custom prompt is descriptive enough, use it as subject
    if (prompt.length > 10) {
      return prompt;
    }
  }

  // Priority 3: Get a creative default subject for the style
  return getDefaultSubjectFromStyle(styleKey);
}

/**
 * Helper function to map style names to StyleKey
 */
function mapStyleToKey(style: string): StyleKey {
  const styleMap: Record<string, StyleKey> = {
    // Direct mappings
    ghibli: "GHIBLI",
    animated: "ANIMATED",
    cartoon: "ANIMATED",
    "3d render": "3D_RENDER",
    "3d": "3D_RENDER",
    "3d_render": "3D_RENDER",
    anime: "ANIME",
    chibi: "CHIBI",
    "retro 80s": "RETRO_80S",
    retro_80s: "RETRO_80S",
    synthwave: "RETRO_80S",
    cyberpunk: "CYBERPUNK",
    watercolor: "WATERCOLOR",
    pastel: "PASTEL",
    "pastel dream": "PASTEL",
    "pixel art": "PIXEL_ART",
    pixel_art: "PIXEL_ART",
    pixel: "PIXEL_ART",
    "pop art": "POP_ART",
    pop_art: "POP_ART",
    pop: "POP_ART",
    minimalist: "MINIMALIST",
    minimal: "MINIMALIST",
    kawaii: "KAWAII",
    "comic book": "COMIC_BOOK",
    comic_book: "COMIC_BOOK",
    comic: "COMIC_BOOK",
    vintage: "VINTAGE",
    neon: "NEON",
    "neon glow": "NEON",
    graffiti: "GRAFFITI",
    "street art": "GRAFFITI",
    "stained glass": "STAINED_GLASS",
    stained_glass: "STAINED_GLASS",
    doodle: "DOODLE",
    holographic: "HOLOGRAPHIC",
  };

  const normalizedStyle = style.toLowerCase().trim();

  // Check direct mapping first
  if (styleMap[normalizedStyle]) {
    return styleMap[normalizedStyle];
  }

  // Check if it's already a valid StyleKey (uppercase)
  const validKeys: StyleKey[] = [
    "GHIBLI",
    "ANIMATED",
    "3D_RENDER",
    "ANIME",
    "CHIBI",
    "RETRO_80S",
    "CYBERPUNK",
    "WATERCOLOR",
    "PASTEL",
    "PIXEL_ART",
    "POP_ART",
    "MINIMALIST",
    "KAWAII",
    "COMIC_BOOK",
    "VINTAGE",
    "NEON",
    "GRAFFITI",
    "STAINED_GLASS",
    "DOODLE",
    "HOLOGRAPHIC",
  ];

  if (validKeys.includes(style as StyleKey)) {
    return style as StyleKey;
  }

  // Default fallback
  return "ANIMATED";
}
