import OpenAI from "openai";

// Lazy-initialized OpenAI client
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
  styleName?: string;
  negativePrompt?: string;
  size?: "1024x1024" | "1024x1792" | "1792x1024";
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
  numOutputs?: number;
  imageBase64?: string;
}

export interface GeneratedImage {
  url: string;
  revised_prompt?: string;
  base64?: string; // Make base64 optional
}

/**
 * Analyze an image using GPT-4 Vision to extract key details for sticker recreation
 */
async function analyzeImageWithVision(
  imageBase64: string,
  targetStyle: string,
): Promise<string> {
  const openai = getOpenAIClient();

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `I want to recreate this image as a ${targetStyle} style sticker/illustration.

Analyze the image and describe ONLY the key elements I need to recreate:
1. Main subject(s): their appearance, pose, expression, clothing colors
2. The relationship/interaction between subjects (if multiple people)
3. Key identifying features that make this image unique

Keep your description to 1-2 sentences. Focus on WHAT to draw, not HOW. Do not mention image quality, photography, or technical aspects.

Example good response: "A young couple in cream sweaters and blue jeans, facing each other intimately with the woman's hand on the man's chest, both smiling warmly."`,
            },
            {
              type: "image_url",
              image_url: {
                url: imageBase64,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 200,
    });

    const description = response.choices[0]?.message?.content;
    if (!description) {
      throw new Error("Failed to analyze image");
    }

    return description.trim();
  } catch (error) {
    console.error("GPT-4 Vision analysis error:", error);
    throw new Error("Failed to analyze the uploaded image. Please try again.");
  }
}

/**
 * Generate images using OpenAI's DALL-E 3 (high quality)
 * Pricing: $0.040 (1024x1024 standard), $0.080 (1024x1024 hd)
 *
 * When an image is provided, we first analyze it with GPT-4 Vision,
 * then generate a new image in the requested style.
 */
export async function generateImage(
  params: GenerateImageParams,
): Promise<GeneratedImage[]> {
  const {
    prompt,
    styleName = "artistic",
    size = "1024x1024",
    quality = "standard",
    style = "vivid",
    numOutputs = 1,
    imageBase64,
  } = params;

  const openai = getOpenAIClient();

  try {
    let finalPrompt = prompt;

    // If an image is provided, analyze it and create a style-focused prompt
    if (imageBase64) {
      console.log(`Analyzing uploaded image for ${styleName} style...`);
      const imageDescription = await analyzeImageWithVision(
        imageBase64,
        styleName,
      );
      console.log("Image description:", imageDescription);

      // Structure the prompt to STRONGLY emphasize the style
      // Put the style instruction FIRST and make it dominant
      finalPrompt = `Create a ${styleName} style sticker illustration of: ${imageDescription}

IMPORTANT STYLE REQUIREMENTS:
${prompt}

The final image MUST be unmistakably in ${styleName} style. This is a sticker design with clean edges suitable for printing.`;

      console.log("Final prompt length:", finalPrompt.length);
    }

    // Generate images using DALL-E 3
    const results: GeneratedImage[] = [];
    const generateCount = Math.min(numOutputs, 4);

    for (let i = 0; i < generateCount; i++) {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: finalPrompt,
        n: 1,
        size: size,
        quality: quality,
        style: style,
        response_format: "url",
      });

      if (response.data && response.data.length > 0) {
        results.push({
          url: response.data[0].url || "",
          revised_prompt: response.data[0].revised_prompt,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("OpenAI generation error:", error);

    // Provide more helpful error messages
    if (error instanceof Error) {
      if (error.message.includes("content_policy")) {
        throw new Error(
          "Your prompt was rejected by content policy. Please try a different description.",
        );
      }
      if (error.message.includes("rate_limit")) {
        throw new Error(
          "Rate limit exceeded. Please wait a moment and try again.",
        );
      }
      if (error.message.includes("insufficient_quota")) {
        throw new Error(
          "Insufficient API credits. Please add credits at platform.openai.com/account/billing",
        );
      }
    }

    throw error;
  }
}

export { getOpenAIClient };
