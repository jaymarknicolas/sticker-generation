import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/replicate";
import { buildStickerPrompt, StyleKey } from "@/lib/prompt-builder";
import { GenerationRequest, GenerationResponse, GeneratedDesign } from "@/lib/types";

export const maxDuration = 60; // Allow up to 60 seconds for image generation

export async function POST(request: NextRequest): Promise<NextResponse<GenerationResponse>> {
  try {
    // Check for API token
    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        {
          success: false,
          error: "Replicate API token not configured",
          message: "Please set the REPLICATE_API_TOKEN environment variable",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body: GenerationRequest = await request.json();
    const { style, customPrompt, subject, numberOfVariations = 1 } = body;

    // Validate required fields
    if (!style) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: style",
          message: "Please select a style for your sticker",
        },
        { status: 400 }
      );
    }

    // Map style to StyleKey
    const styleKey = mapStyleToKey(style);

    // Build the prompt
    const prompt = buildStickerPrompt({
      subject: subject || `a creative ${style.toLowerCase()} themed design`,
      style: styleKey,
      customPrompt: customPrompt,
      includeSticker: true,
    });

    console.log("Generating image with prompt:", prompt);

    // Generate images using Replicate
    const images: GeneratedDesign[] = [];
    const generateCount = Math.min(numberOfVariations, 4); // Limit to 4 for cost control

    try {
      const result = await generateImage({
        prompt: prompt,
        numOutputs: generateCount,
      });

      if (result && result.length > 0) {
        result.forEach((img, index) => {
          images.push({
            id: index + 1,
            url: img.url,
            prompt: prompt,
            style: style,
            createdAt: new Date(),
          });
        });
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
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      images,
      message: `Successfully generated ${images.length} sticker design${images.length > 1 ? "s" : ""}`,
    });
  } catch (error) {
    console.error("Generation API error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("billing") || error.message.includes("payment")) {
        return NextResponse.json(
          {
            success: false,
            error: "API payment required",
            message: "Please check your Replicate billing settings.",
          },
          { status: 402 }
        );
      }

      if (error.message.includes("nsfw") || error.message.includes("safety")) {
        return NextResponse.json(
          {
            success: false,
            error: "Content policy violation",
            message: "Your prompt was flagged by content policy. Please try a different description.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
          message: "An error occurred during generation. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown error",
        message: "An unexpected error occurred. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Helper function to map style names to StyleKey
function mapStyleToKey(style: string): StyleKey {
  const styleMap: Record<string, StyleKey> = {
    ghibli: "GHIBLI",
    animated: "ANIMATED",
    cartoon: "ANIMATED",
    "3d render": "3D_RENDER",
    "3d": "3D_RENDER",
    anime: "ANIME",
    chibi: "CHIBI",
    "retro 80s": "RETRO_80S",
    synthwave: "RETRO_80S",
    cyberpunk: "CYBERPUNK",
    watercolor: "WATERCOLOR",
    pastel: "PASTEL",
    "pastel dream": "PASTEL",
    "pixel art": "PIXEL_ART",
    pixel: "PIXEL_ART",
    "pop art": "POP_ART",
    pop: "POP_ART",
    minimalist: "MINIMALIST",
    minimal: "MINIMALIST",
    kawaii: "KAWAII",
    "comic book": "COMIC_BOOK",
    comic: "COMIC_BOOK",
    vintage: "VINTAGE",
    neon: "NEON",
    "neon glow": "NEON",
    graffiti: "GRAFFITI",
    "street art": "GRAFFITI",
    "stained glass": "STAINED_GLASS",
    doodle: "DOODLE",
    holographic: "HOLOGRAPHIC",
  };

  const normalizedStyle = style.toLowerCase().trim();
  return styleMap[normalizedStyle] || (style as StyleKey) || "ANIMATED";
}
