import OpenAI from "openai";

// Lazy-initialized OpenAI client (initialized on first use, not at import time)
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

export interface GenerateImageParams {
  prompt: string;
  n?: number;
  size?: "1024x1024" | "1792x1024" | "1024x1792";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
}

export interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

export async function generateImage(
  params: GenerateImageParams
): Promise<GeneratedImage[]> {
  const { prompt, n = 1, size = "1024x1024", quality = "standard", style = "vivid" } = params;

  const openai = getOpenAIClient();

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n,
      size,
      quality,
      style,
    });

    return response.data.map((image) => ({
      url: image.url || "",
      revised_prompt: image.revised_prompt,
    }));
  } catch (error) {
    console.error("OpenAI image generation error:", error);
    throw error;
  }
}

export { getOpenAIClient };
