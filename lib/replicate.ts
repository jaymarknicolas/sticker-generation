import Replicate from "replicate";

// Lazy-initialized Replicate client
let replicateClient: Replicate | null = null;

function getReplicateClient(): Replicate {
  if (!replicateClient) {
    const apiToken = process.env.REPLICATE_API_TOKEN;
    if (!apiToken) {
      throw new Error("REPLICATE_API_TOKEN environment variable is not set");
    }
    replicateClient = new Replicate({ auth: apiToken });
  }
  return replicateClient;
}

export interface GenerateImageParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  numOutputs?: number;
  aspectRatio?: string;
  outputFormat?: "webp" | "png" | "jpg";
  outputQuality?: number;
  imageBase64?: string;
}

export interface GeneratedImage {
  url: string;
}

/**
 * Generate images using Google's Nano Banana model (Gemini 2.5 image editing)
 * This is Google's latest image generation/editing model on Replicate
 */
export async function generateImage(
  params: GenerateImageParams
): Promise<GeneratedImage[]> {
  const {
    prompt,
    negativePrompt,
    aspectRatio = "1:1",
    outputFormat = "webp",
    outputQuality = 90,
    numOutputs = 1,
    imageBase64,
  } = params;

  const replicate = getReplicateClient();

  try {
    // Build input parameters for Google's Nano Banana model (Gemini 2.5)
    const inputParams: Record<string, unknown> = {
      prompt: prompt,
      negative_prompt: negativePrompt || "blurry, low quality, distorted, watermark, text, ugly, bad anatomy, extra limbs, cropped, out of frame",
      aspect_ratio: aspectRatio,
      output_format: outputFormat,
      output_quality: outputQuality,
      number_of_images: numOutputs,
      safety_tolerance: 2,
    };

    // Add reference image if provided (for image-to-image generation)
    if (imageBase64) {
      inputParams.image = imageBase64;
    }

    const output = await replicate.run(
      "google/nano-banana",
      {
        input: inputParams,
      }
    );

    // Handle different output formats from the model
    if (Array.isArray(output)) {
      return output.map((item) => {
        // Handle if output is URL string or object with url property
        if (typeof item === "string") {
          return { url: item };
        }
        if (item && typeof item === "object" && "url" in item) {
          return { url: String(item.url) };
        }
        return { url: String(item) };
      });
    }

    // Handle single output
    if (output && typeof output === "string") {
      return [{ url: output }];
    }

    if (output && typeof output === "object" && "url" in output) {
      return [{ url: String((output as { url: string }).url) }];
    }

    return [];
  } catch (error) {
    console.error("Replicate Nano Banana generation error:", error);

    // Fallback to FLUX if Nano Banana fails
    console.log("Falling back to FLUX Schnell model...");
    return generateImageFlux(params);
  }
}

/**
 * Fallback: Generate images using FLUX Schnell
 */
async function generateImageFlux(
  params: GenerateImageParams
): Promise<GeneratedImage[]> {
  const {
    prompt,
    aspectRatio = "1:1",
    outputFormat = "webp",
    outputQuality = 90,
    numOutputs = 1,
  } = params;

  const replicate = getReplicateClient();

  try {
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          go_fast: true,
          num_outputs: numOutputs,
          aspect_ratio: aspectRatio,
          output_format: outputFormat,
          output_quality: outputQuality,
        },
      }
    );

    if (Array.isArray(output)) {
      return output.map((url) => ({ url: String(url) }));
    }

    return [];
  } catch (error) {
    console.error("Replicate FLUX generation error:", error);
    throw error;
  }
}

/**
 * Alternative: Generate images using Stable Diffusion XL
 */
export async function generateImageSDXL(
  params: GenerateImageParams
): Promise<GeneratedImage[]> {
  const {
    prompt,
    negativePrompt = "blurry, low quality, distorted, ugly, watermark, text",
    width = 1024,
    height = 1024,
    numOutputs = 1,
  } = params;

  const replicate = getReplicateClient();

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          prompt: prompt,
          negative_prompt: negativePrompt,
          width: width,
          height: height,
          num_outputs: numOutputs,
          scheduler: "K_EULER",
          num_inference_steps: 25,
          guidance_scale: 7.5,
          refine: "expert_ensemble_refiner",
        },
      }
    );

    if (Array.isArray(output)) {
      return output.map((url) => ({ url: String(url) }));
    }

    return [];
  } catch (error) {
    console.error("Replicate SDXL generation error:", error);
    throw error;
  }
}

export { getReplicateClient };
