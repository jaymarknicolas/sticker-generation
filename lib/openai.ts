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
 * Clean and validate base64 image data for API compatibility
 */
function cleanBase64Image(imageBase64: string): string {
  // If it's already a proper data URL, validate and return
  if (imageBase64.startsWith("data:image/")) {
    // Remove any whitespace/newlines that might exist (iOS issue)
    const parts = imageBase64.split(",");
    if (parts.length === 2) {
      const cleanedBase64 = parts[1].replace(/\s/g, "");
      return `${parts[0]},${cleanedBase64}`;
    }
  }

  // If it's raw base64, add the data URL prefix
  const cleanedBase64 = imageBase64.replace(/\s/g, "");
  return `data:image/jpeg;base64,${cleanedBase64}`;
}

/**
 * Structure for parsed image analysis
 */
interface ImageAnalysis {
  totalPeople: number;
  people: Array<{
    position: string;
    age: string;
    skinTone: string;
    hair: string;
    clothing: string;
  }>;
  arrangement: string;
}

/**
 * Analyze an image using GPT-4 Vision to extract EXACT visual details for recreation
 */
async function analyzeImageWithVision(
  imageBase64: string,
  targetStyle: string,
): Promise<string> {
  const openai = getOpenAIClient();
  const cleanedImage = cleanBase64Image(imageBase64);

  try {
    // First, get a structured JSON analysis
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You analyze photos for artists creating stylized illustrations. Output valid JSON only. Describe what you see accurately - count people carefully, note skin tones, hair, and clothing colors precisely. This is for artwork recreation, not identification.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this photo and return JSON with this exact structure:
{
  "totalPeople": <number>,
  "people": [
    {
      "position": "left/center/right",
      "age": "child/teen/adult/elderly",
      "skinTone": "dark brown/medium brown/light brown/tan/fair/pale",
      "hair": "color and style",
      "clothing": "exact colors and items"
    }
  ],
  "arrangement": "how they are posed together"
}

Count heads carefully. Describe each person you see. Be specific about skin tones and colors.`,
            },
            {
              type: "image_url",
              image_url: {
                url: cleanedImage,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const jsonResponse = response.choices[0]?.message?.content;
    console.log("Raw Vision JSON response:", jsonResponse);

    if (!jsonResponse) {
      throw new Error("Failed to analyze image");
    }

    // Parse the JSON
    let analysis: ImageAnalysis;
    try {
      analysis = JSON.parse(jsonResponse);
    } catch {
      console.error("Failed to parse Vision JSON, falling back to text");
      return await analyzeImageWithVisionFallback(cleanedImage, targetStyle);
    }

    // Validate we got actual people data
    if (!analysis.totalPeople || analysis.totalPeople < 1 || !analysis.people?.length) {
      console.log("Vision returned no people, using fallback");
      return await analyzeImageWithVisionFallback(cleanedImage, targetStyle);
    }

    // Build a natural language description from the structured data
    const peopleDescriptions = analysis.people.map((person, index) => {
      return `${person.position?.toUpperCase() || `Person ${index + 1}`}: ${person.age} with ${person.skinTone} skin, ${person.hair}, wearing ${person.clothing}`;
    }).join(". ");

    const description = `${analysis.totalPeople} people total. ${peopleDescriptions}. ${analysis.arrangement || "Posed together"}`;

    console.log("Constructed description:", description);
    return description;

  } catch (error) {
    console.error("GPT-4 Vision analysis error:", error);
    // Try fallback method
    return await analyzeImageWithVisionFallback(cleanedImage, targetStyle);
  }
}

/**
 * Fallback text-based analysis if JSON fails
 */
async function analyzeImageWithVisionFallback(
  cleanedImage: string,
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
              text: `You are helping an artist recreate this photo as a ${targetStyle} illustration.

IMPORTANT: Count the people carefully and describe each one.

Answer in this EXACT format:
"[NUMBER] people: [describe each person with their skin tone, hair color/style, and clothing colors]. [How they are arranged]."

Example: "3 people: Adult man (dark brown skin, short black hair, navy blue shirt) on left, adult woman (dark brown skin, long curly black hair, cream blouse) in center, young girl (dark brown skin, curly hair in puffs, striped dress) on right. Family sitting close together, smiling."

Be accurate about the count and skin tones.`,
            },
            {
              type: "image_url",
              image_url: {
                url: cleanedImage,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 400,
    });

    const description = response.choices[0]?.message?.content;
    console.log("Fallback Vision response:", description);

    if (!description) {
      return "a group of people together";
    }

    // Check for refusal
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("i can't") || lowerDesc.includes("i cannot") ||
        lowerDesc.includes("sorry") || lowerDesc.includes("not able to")) {
      return "a group of people in casual attire, smiling together";
    }

    return description.trim();
  } catch (error) {
    console.error("Fallback Vision analysis error:", error);
    return "a group of people together";
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
      const cleanedImage = cleanBase64Image(imageBase64);
      const imageDescription = await analyzeImageWithVision(
        cleanedImage,
        styleName,
      );
      console.log("Image description:", imageDescription);

      // Extract the people count from description if possible
      const countMatch = imageDescription.match(/(\d+)\s*people/i);
      const peopleCount = countMatch ? countMatch[1] : "";

      // Build a very direct, no-nonsense prompt for DALL-E 3
      // DALL-E 3 tends to rewrite prompts, so we need to be extremely explicit

      // If we found a people count, emphasize it heavily
      if (peopleCount) {
        const count = parseInt(peopleCount);
        const countWord = count === 1 ? "one person" : count === 2 ? "two people" : count === 3 ? "three people" : count === 4 ? "four people" : `${count} people`;

        // Create a very direct prompt that DALL-E 3 is more likely to follow
        finalPrompt = `A ${styleName} style sticker of ${countWord}:

${imageDescription}

Important details that MUST be included:
- Show exactly ${countWord} (not more, not less)
- Preserve all skin tones exactly as described
- Preserve all clothing colors exactly as described
- Preserve all hair styles and colors exactly as described
- Keep the same arrangement and poses
- ${styleName} art style with clean sticker edges
- Simple background
- Absolutely no text, words, letters, or writing`;
      } else {
        // No people count found, use simpler prompt
        finalPrompt = `A ${styleName} style sticker illustration:

${imageDescription}

Style: ${styleName} art style
Format: Clean sticker with defined edges, simple background
Important: No text, no words, no letters anywhere in the image`;
      }

      console.log("Final prompt:", finalPrompt);
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
        const revisedPrompt = response.data[0].revised_prompt;
        console.log(`DALL-E revised prompt ${i + 1}:`, revisedPrompt);
        results.push({
          url: response.data[0].url || "",
          revised_prompt: revisedPrompt,
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
