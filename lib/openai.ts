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
 * Comprehensive structure for parsed image analysis
 */
interface PersonDetail {
  position: string;
  gender: string;
  age: string;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  facialExpression: string;
  emotion: string;
  pose: string;
  action: string;
  clothingTop: string;
  clothingBottom: string;
  accessories: string;
  bodyType: string;
}

interface ObjectDetail {
  name: string;
  color: string;
  size: string;
  position: string;
  details: string;
}

interface ImageAnalysis {
  imageType: "people" | "objects" | "mixed" | "animal" | "scene";
  totalPeople: number;
  totalObjects: number;
  people: PersonDetail[];
  objects: ObjectDetail[];
  background: string;
  lighting: string;
  overallMood: string;
  arrangement: string;
}

/**
 * Analyze an image using GPT-4 Vision to extract COMPREHENSIVE visual details
 */
async function analyzeImageWithVision(
  imageBase64: string,
  targetStyle: string,
): Promise<string> {
  const openai = getOpenAIClient();
  const cleanedImage = cleanBase64Image(imageBase64);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are an expert visual analyst for artists. Analyze images with extreme precision and detail. Your descriptions will be used to recreate the image as stylized artwork. Be accurate about counts, colors, positions, and all visual details. Output valid JSON only.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Analyze this image in EXTREME DETAIL. Return JSON with this structure:

{
  "imageType": "people/objects/mixed/animal/scene",
  "totalPeople": <exact number, 0 if none>,
  "totalObjects": <number of main objects if no people>,
  "people": [
    {
      "position": "left/center/right/front/back",
      "gender": "male/female/unclear",
      "age": "baby/toddler/child/teenager/young adult/adult/middle-aged/senior",
      "skinTone": "very dark brown/dark brown/medium brown/light brown/tan/olive/fair/pale/pink",
      "hairColor": "black/dark brown/brown/light brown/blonde/red/gray/white/dyed color",
      "hairStyle": "short/medium/long, straight/wavy/curly/coily, specific style like ponytail/braids/bun/afro",
      "facialExpression": "smiling/laughing/neutral/serious/surprised/etc",
      "emotion": "happy/joyful/content/excited/calm/etc",
      "pose": "standing/sitting/kneeling/leaning/hugging/etc",
      "action": "what they are doing - looking at camera/talking/waving/holding something/etc",
      "clothingTop": "exact color and type - e.g., navy blue polo shirt, white t-shirt with red stripes",
      "clothingBottom": "exact color and type - e.g., blue jeans, black shorts, pink skirt",
      "accessories": "glasses/hat/jewelry/watch/none",
      "bodyType": "slim/average/athletic/heavy"
    }
  ],
  "objects": [
    {
      "name": "object name",
      "color": "exact colors",
      "size": "small/medium/large relative to image",
      "position": "where in image",
      "details": "specific details"
    }
  ],
  "background": "detailed description of background - indoor/outdoor, colors, setting",
  "lighting": "bright/soft/natural/artificial/warm/cool",
  "overallMood": "cheerful/serious/romantic/playful/professional",
  "arrangement": "how subjects are positioned relative to each other"
}

COUNT CAREFULLY. If 1 person, totalPeople=1. If 3 people, totalPeople=3.
Be SPECIFIC about skin tones - they matter for accurate recreation.
Describe EXACT clothing colors (not just "shirt" but "light blue denim shirt").`,
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
      max_tokens: 1200,
      response_format: { type: "json_object" },
    });

    const jsonResponse = response.choices[0]?.message?.content;
    console.log("Raw Vision JSON response:", jsonResponse);

    if (!jsonResponse) {
      throw new Error("Failed to analyze image");
    }

    let analysis: ImageAnalysis;
    try {
      analysis = JSON.parse(jsonResponse);
    } catch {
      console.error("Failed to parse Vision JSON, falling back to text");
      return await analyzeImageWithVisionFallback(cleanedImage, targetStyle);
    }

    // Build comprehensive natural language description
    const description = buildDetailedDescription(analysis);
    console.log("Constructed detailed description:", description);
    return description;

  } catch (error) {
    console.error("GPT-4 Vision analysis error:", error);
    return await analyzeImageWithVisionFallback(cleanedImage, targetStyle);
  }
}

/**
 * Build a detailed natural language description from the analysis
 */
function buildDetailedDescription(analysis: ImageAnalysis): string {
  const parts: string[] = [];

  // Handle people
  if (analysis.totalPeople > 0 && analysis.people?.length > 0) {
    parts.push(`EXACTLY ${analysis.totalPeople} ${analysis.totalPeople === 1 ? "person" : "people"}`);

    analysis.people.forEach((person, index) => {
      const personDesc: string[] = [];

      // Position
      const pos = person.position || `person ${index + 1}`;
      personDesc.push(`[${pos.toUpperCase()}]:`);

      // Gender and age
      if (person.gender && person.gender !== "unclear") {
        personDesc.push(`${person.gender}`);
      }
      if (person.age) {
        personDesc.push(`${person.age}`);
      }

      // Skin tone (critical)
      if (person.skinTone) {
        personDesc.push(`with ${person.skinTone} skin`);
      }

      // Hair
      if (person.hairColor || person.hairStyle) {
        const hair = [person.hairColor, person.hairStyle].filter(Boolean).join(" ");
        personDesc.push(`${hair} hair`);
      }

      // Body type
      if (person.bodyType && person.bodyType !== "average") {
        personDesc.push(`${person.bodyType} build`);
      }

      // Clothing (critical)
      const clothing: string[] = [];
      if (person.clothingTop) clothing.push(person.clothingTop);
      if (person.clothingBottom) clothing.push(person.clothingBottom);
      if (clothing.length > 0) {
        personDesc.push(`wearing ${clothing.join(" and ")}`);
      }

      // Accessories
      if (person.accessories && person.accessories !== "none") {
        personDesc.push(`with ${person.accessories}`);
      }

      // Expression and emotion
      if (person.facialExpression) {
        personDesc.push(`${person.facialExpression}`);
      }

      // Pose and action
      if (person.pose) {
        personDesc.push(`${person.pose}`);
      }
      if (person.action) {
        personDesc.push(`${person.action}`);
      }

      parts.push(personDesc.join(", "));
    });
  }

  // Handle objects (for non-people images)
  if (analysis.totalObjects > 0 && analysis.objects?.length > 0 && analysis.totalPeople === 0) {
    parts.push(`EXACTLY ${analysis.totalObjects} ${analysis.totalObjects === 1 ? "object" : "objects"}`);

    analysis.objects.forEach((obj) => {
      const objDesc = `${obj.color} ${obj.name} (${obj.size}, ${obj.position})${obj.details ? ` - ${obj.details}` : ""}`;
      parts.push(objDesc);
    });
  }

  // Handle animals/mixed
  if (analysis.imageType === "animal" || analysis.imageType === "mixed") {
    if (analysis.objects?.length > 0) {
      analysis.objects.forEach((obj) => {
        parts.push(`${obj.color} ${obj.name} - ${obj.details}`);
      });
    }
  }

  // Arrangement
  if (analysis.arrangement) {
    parts.push(`Arrangement: ${analysis.arrangement}`);
  }

  // Background (important for context)
  if (analysis.background) {
    parts.push(`Background: ${analysis.background}`);
  }

  // Mood
  if (analysis.overallMood) {
    parts.push(`Mood: ${analysis.overallMood}`);
  }

  return parts.join(". ");
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
              text: `Describe this image in EXTREME DETAIL for an artist to recreate as a ${targetStyle} illustration.

REQUIRED FORMAT:
"[COUNT] people/objects: [DETAILED description of EACH subject]"

FOR EACH PERSON INCLUDE:
- Gender (male/female)
- Age (child/teen/adult/senior)
- Skin tone (be specific: dark brown, medium brown, light brown, tan, fair, pale)
- Hair color and style
- Exact clothing colors and types
- Facial expression and emotion
- Pose and what they're doing
- Position (left/center/right)

FOR OBJECTS/ANIMALS:
- Exact colors
- Size
- Position
- Details

ALSO DESCRIBE:
- Background setting
- Overall mood

EXAMPLE:
"1 person: Female young adult with medium brown skin, long wavy black hair, warm smile, wearing bright red blouse and blue jeans, standing with arms crossed, looking at camera. Background: outdoor park with green trees, sunny day. Mood: cheerful and confident."

Be ACCURATE about the count. If 1 person, say 1 person. If 3 people, say 3 people.`,
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
      max_tokens: 800,
    });

    const description = response.choices[0]?.message?.content;
    console.log("Fallback Vision response:", description);

    if (!description) {
      return "a subject in a simple setting";
    }

    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes("i can't") || lowerDesc.includes("i cannot") ||
        lowerDesc.includes("sorry") || lowerDesc.includes("not able to")) {
      return "a person with warm expression in casual setting";
    }

    return description.trim();
  } catch (error) {
    console.error("Fallback Vision analysis error:", error);
    return "a subject in a casual setting";
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

      // Extract counts from description
      const peopleMatch = imageDescription.match(/EXACTLY\s*(\d+)\s*(?:person|people)/i);
      const objectMatch = imageDescription.match(/EXACTLY\s*(\d+)\s*(?:object|objects)/i);

      const peopleCount = peopleMatch ? parseInt(peopleMatch[1]) : 0;
      const objectCount = objectMatch ? parseInt(objectMatch[1]) : 0;

      // Convert number to word for emphasis
      const numberToWord = (n: number, singular: string, plural: string): string => {
        const words: Record<number, string> = {
          1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
          6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten"
        };
        const word = words[n] || String(n);
        return `${word} ${n === 1 ? singular : plural}`;
      };

      // Build comprehensive DALL-E prompt
      if (peopleCount > 0) {
        const countPhrase = numberToWord(peopleCount, "person", "people");

        finalPrompt = `Create a ${styleName} style sticker illustration showing EXACTLY ${countPhrase}.

DETAILED SUBJECT DESCRIPTION:
${imageDescription}

CRITICAL REQUIREMENTS - MUST FOLLOW:
1. NUMBER: Show EXACTLY ${countPhrase} - not ${peopleCount - 1}, not ${peopleCount + 1}, EXACTLY ${peopleCount}
2. SKIN TONES: Match the exact skin tones described for each person
3. GENDER: Match the gender of each person as described
4. CLOTHING: Match exact clothing colors and types for each person
5. HAIR: Match exact hair color, length, and style for each person
6. POSES: Match the poses and actions described
7. EXPRESSIONS: Match the facial expressions and emotions described
8. ARRANGEMENT: Position people exactly as described (left/center/right)
9. BACKGROUND: Include the background setting as described
10. STYLE: ${styleName} artistic style with clean sticker edges

ABSOLUTELY NO TEXT - No words, letters, numbers, labels, captions, watermarks, or any written content anywhere in the image.`;

      } else if (objectCount > 0) {
        const countPhrase = numberToWord(objectCount, "object", "objects");

        finalPrompt = `Create a ${styleName} style sticker illustration showing EXACTLY ${countPhrase}.

DETAILED SUBJECT DESCRIPTION:
${imageDescription}

CRITICAL REQUIREMENTS:
1. NUMBER: Show EXACTLY ${countPhrase} as described
2. COLORS: Match exact colors for each object
3. DETAILS: Include all specific details mentioned
4. ARRANGEMENT: Position objects as described
5. BACKGROUND: Include background as described
6. STYLE: ${styleName} artistic style with clean sticker edges

ABSOLUTELY NO TEXT - No words, letters, numbers, or writing anywhere.`;

      } else {
        // Fallback for scenes, animals, or unspecified
        finalPrompt = `Create a ${styleName} style sticker illustration:

DETAILED DESCRIPTION:
${imageDescription}

REQUIREMENTS:
- Match all visual details exactly as described
- Match all colors exactly as described
- Include background as described
- ${styleName} artistic style with clean sticker edges
- ABSOLUTELY NO TEXT, words, letters, or writing anywhere in the image`;
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
