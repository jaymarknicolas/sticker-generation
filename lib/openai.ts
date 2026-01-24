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
  customPrompt?: string; // User's custom prompt for style override
  customPromptOnly?: boolean; // When true, use ONLY the custom prompt style
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
 * Comprehensive structure for parsed image analysis - Detective Level Detail
 */
interface PersonDetail {
  // Position & Distance
  position: string;
  distanceFromCamera: string;
  // Demographics
  gender: string;
  approximateAge: string;
  ethnicity: string;
  skinTone: string;
  // Face Details
  faceShape: string;
  facialFeatures: string;
  eyebrows: string;
  eyes: string;
  nose: string;
  lips: string;
  // Hair
  hairColor: string;
  hairTexture: string;
  hairLength: string;
  hairStyle: string;
  facialHair: string;
  // Expression & Emotion
  facialExpression: string;
  emotionalState: string;
  eyeContact: string;
  // Body & Pose
  headPosition: string;
  bodyPosture: string;
  armPosition: string;
  handDetails: string;
  bodyType: string;
  height: string;
  // Accessories - Head & Face
  headwear: string;
  eyewear: string;
  earAccessories: string;
  // Accessories - Neck & Body
  neckAccessories: string;
  wristAccessories: string;
  fingerAccessories: string;
  // Clothing
  topClothing: string;
  topClothingDetails: string;
  bottomClothing: string;
  bottomClothingDetails: string;
  footwear: string;
  outerLayer: string;
  // Carried Items
  bagOrCarry: string;
  otherAccessories: string;
  // Style
  clothingCondition: string;
  overallStyle: string;
}

interface ObjectDetail {
  name: string;
  type: string;
  color: string;
  material: string;
  size: string;
  position: string;
  details: string;
}

interface AnimalDetail {
  species: string;
  breed: string;
  color: string;
  size: string;
  position: string;
  pose: string;
  expression: string;
  accessories: string;
  notableFeatures: string;
}

interface BackgroundDetail {
  setting: string;
  indoorOutdoor: string;
  mainElements: string;
  dominantColors: string;
  lighting: string;
  atmosphere: string;
}

interface PhotoComposition {
  shotType: string;
  angle: string;
  framing: string;
}

interface ImageAnalysis {
  imageType: "people" | "objects" | "mixed" | "animal" | "scene";
  totalPeople: number;
  totalAnimals: number;
  totalObjects: number;
  people: PersonDetail[];
  animals: AnimalDetail[];
  objects: ObjectDetail[];
  subjectInteraction: string;
  background: BackgroundDetail;
  photoComposition: PhotoComposition;
  overallMood: string;
  dominantColors: string[];
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
          content: `You are a FORENSIC VISUAL DETECTIVE - the world's best observer. Your job is to analyze images with EXTREME precision like you're documenting evidence. Miss NOTHING about the subjects. Every detail matters: what they wear, how they stand, their expression, accessories, colors. You have a photographic memory for details. Output valid JSON only.`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `DETECTIVE ANALYSIS - Examine this image like evidence. Document EVERY observable detail.

PRIORITY: 100% DETAIL ON SUBJECTS (people/animals/objects) + 30% BACKGROUND CONTEXT

Return JSON:

{
  "imageType": "people/objects/mixed/animal/scene",
  "totalPeople": <COUNT HEADS CAREFULLY - this is CRITICAL>,
  "totalAnimals": <exact count>,
  "totalObjects": <main objects count>,
  "people": [
    {
      "position": "left/center/right/foreground/background",
      "distanceFromCamera": "close-up/medium/far",
      "gender": "male/female",
      "approximateAge": "infant/toddler/child (3-12)/teenager (13-19)/young adult (20-35)/adult (36-50)/middle-aged (51-65)/senior (65+)",
      "ethnicity": "observed ethnicity",
      "skinTone": "very dark brown/dark brown/medium brown/caramel/tan/olive/light brown/fair/pale/pink",
      "faceShape": "oval/round/square/heart/oblong/diamond",
      "facialFeatures": "notable features - prominent cheekbones, dimples, freckles, moles, scars",
      "hairColor": "jet black/black/dark brown/medium brown/light brown/dirty blonde/blonde/strawberry blonde/red/auburn/gray/silver/white/bald/dyed [color]",
      "hairTexture": "straight/wavy/curly/coily/kinky",
      "hairLength": "bald/shaved/buzzcut/short/ear-length/chin-length/shoulder-length/mid-back/long",
      "hairStyle": "loose/ponytail/bun/braids/cornrows/dreadlocks/afro/mohawk/slicked back/parted/messy/styled",
      "facialHair": "none/clean shaven/5 o'clock shadow/stubble/mustache/goatee/short beard/full beard/long beard",
      "eyebrows": "thin/medium/thick/arched/straight/bushy",
      "eyes": "shape and color - round brown/almond black/hooded blue/etc",
      "nose": "small/medium/large/wide/narrow/pointed/rounded",
      "lips": "thin/medium/full",
      "facialExpression": "broad smile showing teeth/closed-mouth smile/slight smirk/neutral/serious/frowning/laughing/surprised/thoughtful/squinting",
      "emotionalState": "happy/joyful/content/excited/proud/confident/relaxed/focused/pensive/tired",
      "eyeContact": "looking directly at camera/looking away left/looking away right/looking up/looking down/eyes closed",
      "headPosition": "straight/tilted left/tilted right/looking up/looking down/turned left/turned right",
      "bodyPosture": "standing straight/standing relaxed/leaning/sitting upright/sitting relaxed/crouching/kneeling/lying down",
      "armPosition": "at sides/crossed/on hips/raised/one raised/holding something/hugging/gesturing",
      "handDetails": "visible hands doing what - holding phone/in pockets/making gesture/etc",
      "bodyType": "petite/slim/lean/average/athletic/muscular/stocky/heavy/plus-size",
      "height": "appears short/average/tall relative to others or objects",
      "headwear": "none/baseball cap [color]/snapback [color]/beanie [color]/bucket hat/sun hat/fedora/visor/headband/bandana/hijab [color]/turban [color]/helmet/hood up",
      "eyewear": "none/prescription glasses [frame color and style]/sunglasses [style - aviator/wayfarer/round/sport] [color]/reading glasses",
      "earAccessories": "none/stud earrings [color/material]/hoop earrings [size]/dangling earrings/ear cuff/airpods/headphones",
      "neckAccessories": "none/thin chain necklace [color]/thick chain [color]/pendant necklace/choker/scarf [color and pattern]/tie [color and pattern]/bowtie",
      "wristAccessories": "none/watch [style and color]/bracelet [type]/multiple bracelets/fitness band/bangles",
      "fingerAccessories": "none/ring(s) [which finger, color]",
      "topClothing": "[EXACT color] [material if visible] [style] - e.g., 'navy blue cotton polo shirt with white collar and small logo on chest'",
      "topClothingDetails": "buttons/zipper/graphics/logos/text/patterns/collar style/sleeve length",
      "bottomClothing": "[EXACT color] [material] [style] - e.g., 'faded light blue denim skinny jeans with ripped knees'",
      "bottomClothingDetails": "fit/rips/patterns/pockets visible",
      "footwear": "not visible/barefoot/[EXACT color] [brand if visible] [style] - e.g., 'white Nike Air Force 1 sneakers'",
      "outerLayer": "none/jacket [color, type]/hoodie [color]/coat [color, type]/vest/cardigan",
      "bagOrCarry": "none/backpack [color]/handbag [color]/tote/messenger bag/shopping bag/briefcase",
      "otherAccessories": "none/belt [color]/umbrella/phone in hand/drink/food/book/camera/any held items",
      "clothingCondition": "neat/casual/wrinkled/formal/sporty/dressed up/dressed down",
      "overallStyle": "casual/formal/business casual/sporty/streetwear/bohemian/elegant/grunge"
    }
  ],
  "animals": [
    {
      "species": "specific animal",
      "breed": "breed if identifiable",
      "color": "detailed fur/feather colors and patterns",
      "size": "toy/small/medium/large/giant",
      "position": "location in frame",
      "pose": "sitting/standing/lying/walking/running/playing",
      "expression": "happy/alert/sleepy/playful/anxious/calm",
      "accessories": "collar [color]/leash/clothing/harness/none",
      "notableFeatures": "any distinctive markings or features"
    }
  ],
  "objects": [
    {
      "name": "object name",
      "type": "category",
      "color": "exact colors",
      "material": "material type",
      "size": "relative size",
      "position": "where in frame",
      "details": "notable details"
    }
  ],
  "subjectInteraction": "how subjects interact - hugging/holding hands/talking/looking at each other/standing apart/grouped together",
  "background": {
    "setting": "specific location type",
    "indoorOutdoor": "indoor/outdoor/partially covered",
    "mainElements": "key background elements briefly",
    "dominantColors": "2-3 main background colors",
    "lighting": "natural daylight/overcast/sunset/artificial/mixed/flash/studio",
    "atmosphere": "mood of the setting"
  },
  "photoComposition": {
    "shotType": "extreme close-up/close-up/medium close-up/medium shot/medium full/full shot/wide shot",
    "angle": "eye level/slight low/low angle/slight high/high angle/bird's eye/worm's eye",
    "framing": "centered/rule of thirds/off-center left/off-center right"
  },
  "overallMood": "the emotional feeling of the image",
  "dominantColors": ["top 5 colors in entire image"]
}

DETECTIVE RULES:
1. COUNT SUBJECTS PRECISELY - Count every head visible. 1 person = 1. 3 people = 3. NO GUESSING.
2. ACCESSORIES ARE EVIDENCE - Caps, hats, glasses, sunglasses, jewelry, watches = DOCUMENT ALL
3. COLORS ARE SPECIFIC - Not "blue" but "navy blue" or "sky blue" or "royal blue"
4. SKIN TONES MATTER - Be precise and respectful: dark brown, medium brown, light brown, tan, olive, fair
5. CLOTHING IS IDENTITY - Full description with colors, style, any visible brands/logos
6. EXPRESSIONS TELL STORIES - Capture the exact facial expression and emotional state
7. POSES REVEAL CHARACTER - Document how they stand, sit, gesture
8. NOTHING IS INSIGNIFICANT - If you can see it, document it`,
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
      max_tokens: 2000,
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

  // Handle people - FULL DETECTIVE DETAIL
  if (analysis.totalPeople > 0 && analysis.people?.length > 0) {
    parts.push(`EXACTLY ${analysis.totalPeople} ${analysis.totalPeople === 1 ? "person" : "people"}`);

    analysis.people.forEach((person, index) => {
      const personDesc: string[] = [];

      // Position & Distance
      const pos = person.position || `person ${index + 1}`;
      personDesc.push(`[${pos.toUpperCase()}]:`);
      if (person.distanceFromCamera) {
        personDesc.push(`(${person.distanceFromCamera})`);
      }

      // Gender and age
      if (person.gender && person.gender !== "unclear") {
        personDesc.push(`${person.gender}`);
      }
      if (person.approximateAge) {
        personDesc.push(`${person.approximateAge}`);
      }

      // Ethnicity
      if (person.ethnicity) {
        personDesc.push(`${person.ethnicity}`);
      }

      // Skin tone (critical)
      if (person.skinTone) {
        personDesc.push(`with ${person.skinTone} skin`);
      }

      // Face details
      if (person.faceShape) {
        personDesc.push(`${person.faceShape} face`);
      }
      if (person.facialFeatures && person.facialFeatures !== "none") {
        personDesc.push(`(${person.facialFeatures})`);
      }

      // Eyes
      if (person.eyes) {
        personDesc.push(`${person.eyes}`);
      }

      // Hair (comprehensive)
      const hairParts = [person.hairColor, person.hairLength, person.hairTexture, person.hairStyle].filter(Boolean);
      if (hairParts.length > 0) {
        personDesc.push(`${hairParts.join(" ")} hair`);
      }

      // Facial hair
      if (person.facialHair && person.facialHair !== "none" && person.facialHair !== "clean shaven") {
        personDesc.push(`with ${person.facialHair}`);
      }

      // Body type & height
      if (person.bodyType && person.bodyType !== "average") {
        personDesc.push(`${person.bodyType} build`);
      }
      if (person.height) {
        personDesc.push(`(${person.height})`);
      }

      // ACCESSORIES (critical)
      const accessories: string[] = [];
      if (person.headwear && person.headwear !== "none") {
        accessories.push(`${person.headwear}`);
      }
      if (person.eyewear && person.eyewear !== "none") {
        accessories.push(`${person.eyewear}`);
      }
      if (person.earAccessories && person.earAccessories !== "none") {
        accessories.push(`${person.earAccessories}`);
      }
      if (person.neckAccessories && person.neckAccessories !== "none") {
        accessories.push(`${person.neckAccessories}`);
      }
      if (person.wristAccessories && person.wristAccessories !== "none") {
        accessories.push(`${person.wristAccessories}`);
      }
      if (person.fingerAccessories && person.fingerAccessories !== "none") {
        accessories.push(`${person.fingerAccessories}`);
      }
      if (accessories.length > 0) {
        personDesc.push(`wearing ${accessories.join(", ")}`);
      }

      // Clothing (critical - all pieces with details)
      const clothing: string[] = [];
      if (person.outerLayer && person.outerLayer !== "none") {
        clothing.push(person.outerLayer);
      }
      if (person.topClothing) {
        const topWithDetails = person.topClothingDetails
          ? `${person.topClothing} (${person.topClothingDetails})`
          : person.topClothing;
        clothing.push(topWithDetails);
      }
      if (person.bottomClothing) {
        const bottomWithDetails = person.bottomClothingDetails
          ? `${person.bottomClothing} (${person.bottomClothingDetails})`
          : person.bottomClothing;
        clothing.push(bottomWithDetails);
      }
      if (person.footwear && person.footwear !== "not visible") {
        clothing.push(person.footwear);
      }
      if (clothing.length > 0) {
        personDesc.push(`dressed in ${clothing.join(", ")}`);
      }

      // Bags and carried items
      if (person.bagOrCarry && person.bagOrCarry !== "none") {
        personDesc.push(`carrying ${person.bagOrCarry}`);
      }
      if (person.otherAccessories && person.otherAccessories !== "none") {
        personDesc.push(`with ${person.otherAccessories}`);
      }

      // Style
      if (person.overallStyle) {
        personDesc.push(`${person.overallStyle} style`);
      }

      // Expression and emotion
      if (person.facialExpression) {
        personDesc.push(`${person.facialExpression}`);
      }
      if (person.emotionalState) {
        personDesc.push(`looking ${person.emotionalState}`);
      }
      if (person.eyeContact) {
        personDesc.push(`${person.eyeContact}`);
      }

      // Pose and body position
      if (person.bodyPosture) {
        personDesc.push(`${person.bodyPosture}`);
      }
      if (person.armPosition && person.armPosition !== "at sides") {
        personDesc.push(`arms ${person.armPosition}`);
      }
      if (person.handDetails && person.handDetails !== "not visible") {
        personDesc.push(`${person.handDetails}`);
      }

      parts.push(personDesc.join(", "));
    });
  }

  // Subject interaction
  if (analysis.subjectInteraction) {
    parts.push(`Interaction: ${analysis.subjectInteraction}`);
  }

  // Handle animals
  if (analysis.totalAnimals > 0 && analysis.animals?.length > 0) {
    parts.push(`EXACTLY ${analysis.totalAnimals} ${analysis.totalAnimals === 1 ? "animal" : "animals"}`);

    analysis.animals.forEach((animal) => {
      const animalDesc: string[] = [];
      if (animal.color) animalDesc.push(animal.color);
      if (animal.breed) animalDesc.push(animal.breed);
      if (animal.species) animalDesc.push(animal.species);
      if (animal.size) animalDesc.push(`(${animal.size})`);
      if (animal.pose) animalDesc.push(animal.pose);
      if (animal.expression) animalDesc.push(`looking ${animal.expression}`);
      if (animal.accessories && animal.accessories !== "none") {
        animalDesc.push(`wearing ${animal.accessories}`);
      }
      if (animal.notableFeatures) animalDesc.push(`- ${animal.notableFeatures}`);
      parts.push(animalDesc.join(" "));
    });
  }

  // Handle objects
  if (analysis.totalObjects > 0 && analysis.objects?.length > 0) {
    if (analysis.totalPeople === 0 && analysis.totalAnimals === 0) {
      parts.push(`EXACTLY ${analysis.totalObjects} ${analysis.totalObjects === 1 ? "object" : "objects"}`);
    } else {
      parts.push(`Also visible: ${analysis.totalObjects} ${analysis.totalObjects === 1 ? "object" : "objects"}`);
    }

    analysis.objects.forEach((obj) => {
      const objParts: string[] = [];
      if (obj.color) objParts.push(obj.color);
      if (obj.material) objParts.push(obj.material);
      if (obj.name) objParts.push(obj.name);
      if (obj.size) objParts.push(`(${obj.size})`);
      if (obj.position) objParts.push(`at ${obj.position}`);
      if (obj.details) objParts.push(`- ${obj.details}`);
      parts.push(objParts.join(" "));
    });
  }

  // Photo composition
  if (analysis.photoComposition) {
    const comp = analysis.photoComposition;
    const compParts: string[] = [];
    if (comp.shotType) compParts.push(comp.shotType);
    if (comp.angle) compParts.push(comp.angle);
    if (comp.framing) compParts.push(comp.framing);
    if (compParts.length > 0) {
      parts.push(`Shot: ${compParts.join(", ")}`);
    }
  }

  // BACKGROUND (30% - simplified)
  if (analysis.background) {
    const bg = analysis.background;
    const bgParts: string[] = [];

    if (bg.setting) bgParts.push(bg.setting);
    if (bg.indoorOutdoor) bgParts.push(`(${bg.indoorOutdoor})`);
    if (bg.mainElements) bgParts.push(bg.mainElements);
    if (bg.dominantColors) bgParts.push(`colors: ${bg.dominantColors}`);
    if (bg.lighting) bgParts.push(`${bg.lighting} lighting`);
    if (bg.atmosphere) bgParts.push(`${bg.atmosphere} atmosphere`);

    if (bgParts.length > 0) {
      parts.push(`BACKGROUND: ${bgParts.join(", ")}`);
    }
  }

  // Dominant colors
  if (analysis.dominantColors && analysis.dominantColors.length > 0) {
    parts.push(`Colors: ${analysis.dominantColors.join(", ")}`);
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

REQUIRED FORMAT - Start with exact count:
"[EXACT COUNT] people/animals/objects: [DETAILED description]"

FOR EACH PERSON, DESCRIBE ALL:
1. BASICS: Gender, age, ethnicity appearance, skin tone (be specific: dark brown, medium brown, light brown, tan, olive, fair, pale)
2. FACE: Shape, expression, emotion, eye color
3. HAIR: Color, length, style (straight/curly/wavy), any specific styling
4. ACCESSORIES (CRITICAL):
   - Headwear: caps, hats, beanies, headbands, hijab, etc.
   - Eyewear: glasses, sunglasses (include frame color/style)
   - Jewelry: necklaces, earrings, bracelets, watches, rings
   - Other: bags, scarves, ties
5. CLOTHING (EXACT COLORS):
   - Top: "[exact color] [type]" e.g., "navy blue polo shirt with white collar"
   - Bottom: "[exact color] [type]" e.g., "light blue denim jeans"
   - Footwear: if visible
6. BODY: Type, pose, action
7. POSITION: Where in frame (left/center/right)

FOR OBJECTS/ANIMALS:
- Type, exact colors, size, material, position, notable details

BACKGROUND (50% importance):
- Setting (indoor/outdoor, specific location)
- Colors, furniture, objects visible
- Nature elements (trees, sky, water)
- Lighting and atmosphere

EXAMPLE:
"1 person: Male adult with dark brown skin, oval face, short black curly hair, wearing black Ray-Ban sunglasses, gold stud earrings, navy blue Nike cap worn backwards, white Nike t-shirt with red swoosh logo, black jogger pants, white Air Jordan sneakers. Standing with arms crossed, confident smile, looking at camera. Background: urban street with graffiti wall (red, blue, yellow), sunny day. Mood: cool and confident."

COUNT CAREFULLY. If 1 person = say "1 person". If 3 people = say "3 people".`,
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
    customPrompt,
    customPromptOnly = false,
  } = params;

  const openai = getOpenAIClient();

  try {
    let finalPrompt = prompt;

    // Determine the effective style to use
    // If custom prompt contains style instructions, use it instead of styleName
    const hasCustomStyleInstructions = customPrompt && (
      customPrompt.toLowerCase().includes("style") ||
      customPrompt.toLowerCase().includes("ghibli") ||
      customPrompt.toLowerCase().includes("anime") ||
      customPrompt.toLowerCase().includes("disney") ||
      customPrompt.toLowerCase().includes("pixar") ||
      customPrompt.toLowerCase().includes("watercolor") ||
      customPrompt.toLowerCase().includes("cartoon") ||
      customPrompt.toLowerCase().includes("cinematic") ||
      customPrompt.toLowerCase().includes("realistic") ||
      customPrompt.toLowerCase().includes("artistic") ||
      customPrompt.length > 50
    );

    // Use custom prompt style if it has style instructions OR customPromptOnly is true
    const effectiveStyle = (customPromptOnly || hasCustomStyleInstructions) && customPrompt
      ? customPrompt.trim()
      : styleName;

    const useCustomStyleMode = customPromptOnly || hasCustomStyleInstructions;

    // If an image is provided, analyze it and create a style-focused prompt
    if (imageBase64) {
      console.log(`Analyzing uploaded image...`);
      console.log(`Custom prompt mode: ${useCustomStyleMode ? 'YES - using custom prompt as style' : 'NO - using selected style'}`);
      console.log(`Effective style: ${useCustomStyleMode ? 'CUSTOM: ' + effectiveStyle.substring(0, 100) + '...' : styleName}`);

      const cleanedImage = cleanBase64Image(imageBase64);
      const imageDescription = await analyzeImageWithVision(
        cleanedImage,
        useCustomStyleMode ? "custom artistic" : styleName,
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

        if (useCustomStyleMode) {
          // CUSTOM STYLE MODE: Use the user's custom prompt as the primary style instruction
          finalPrompt = `${effectiveStyle}

APPLY THE ABOVE STYLE TO THIS SUBJECT - Create a sticker illustration showing EXACTLY ${countPhrase}:

DETAILED SUBJECT DESCRIPTION:
${imageDescription}

CRITICAL REQUIREMENTS - MUST FOLLOW:
1. STYLE: Follow the style instructions above EXACTLY as specified
2. NUMBER: Show EXACTLY ${countPhrase} - not ${peopleCount - 1}, not ${peopleCount + 1}, EXACTLY ${peopleCount}
3. SKIN TONES: Match the exact skin tones described for each person
4. GENDER: Match the gender of each person as described
5. CLOTHING: Match exact clothing colors and types for each person
6. HAIR: Match exact hair color, length, and style for each person
7. POSES: Match the poses and actions described
8. EXPRESSIONS: Match the facial expressions and emotions described
9. ARRANGEMENT: Position people exactly as described (left/center/right)
10. BACKGROUND: Include the background setting as described

ABSOLUTELY NO TEXT - No words, letters, numbers, labels, captions, watermarks, or any written content anywhere in the image.
NO COLOR PALETTES - Do not add any color swatches, color palette strips, color samples, color bars, or reference colors at the edges or bottom of the image. The image should contain ONLY the sticker illustration itself with nothing else.`;
        } else {
          // STANDARD MODE: Use the selected style
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

ABSOLUTELY NO TEXT - No words, letters, numbers, labels, captions, watermarks, or any written content anywhere in the image.
NO COLOR PALETTES - Do not add any color swatches, color palette strips, color samples, color bars, or reference colors at the edges or bottom of the image. The image should contain ONLY the sticker illustration itself with nothing else.`;
        }

      } else if (objectCount > 0) {
        const countPhrase = numberToWord(objectCount, "object", "objects");

        if (useCustomStyleMode) {
          finalPrompt = `${effectiveStyle}

APPLY THE ABOVE STYLE TO THIS SUBJECT - Create a sticker illustration showing EXACTLY ${countPhrase}:

DETAILED SUBJECT DESCRIPTION:
${imageDescription}

CRITICAL REQUIREMENTS:
1. STYLE: Follow the style instructions above EXACTLY as specified
2. NUMBER: Show EXACTLY ${countPhrase} as described
3. COLORS: Match exact colors for each object
4. DETAILS: Include all specific details mentioned
5. ARRANGEMENT: Position objects as described
6. BACKGROUND: Include background as described

ABSOLUTELY NO TEXT - No words, letters, numbers, or writing anywhere.
NO COLOR PALETTES - No color swatches, color strips, or color samples at the edges or bottom of the image.`;
        } else {
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

ABSOLUTELY NO TEXT - No words, letters, numbers, or writing anywhere.
NO COLOR PALETTES - No color swatches, color strips, or color samples at the edges or bottom of the image.`;
        }

      } else {
        // Fallback for scenes, animals, or unspecified
        if (useCustomStyleMode) {
          finalPrompt = `${effectiveStyle}

APPLY THE ABOVE STYLE TO CREATE A STICKER ILLUSTRATION:

DETAILED DESCRIPTION:
${imageDescription}

REQUIREMENTS:
- Follow the style instructions above EXACTLY as specified
- Match all visual details exactly as described
- Match all colors exactly as described
- Include background as described
- Create clean sticker edges
- ABSOLUTELY NO TEXT, words, letters, or writing anywhere in the image
- NO COLOR PALETTES, color swatches, or color samples at edges or bottom of image`;
        } else {
          finalPrompt = `Create a ${styleName} style sticker illustration:

DETAILED DESCRIPTION:
${imageDescription}

REQUIREMENTS:
- Match all visual details exactly as described
- Match all colors exactly as described
- Include background as described
- ${styleName} artistic style with clean sticker edges
- ABSOLUTELY NO TEXT, words, letters, or writing anywhere in the image
- NO COLOR PALETTES, color swatches, or color samples at edges or bottom of image`;
        }
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
