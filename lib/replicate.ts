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
}

export interface GeneratedImage {
  url: string;
}

/**
 * Generate images using Replicate's FLUX model
 * Using black-forest-labs/flux-schnell for fast generation
 */
export async function generateImage(
  params: GenerateImageParams
): Promise<GeneratedImage[]> {
  const {
    prompt,
    width = 1024,
    height = 1024,
    numOutputs = 1,
  } = params;

  const replicate = getReplicateClient();

  try {
    // Using FLUX Schnell for fast, high-quality image generation
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          go_fast: true,
          num_outputs: numOutputs,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 90,
        },
      }
    );

    // Output is an array of URLs
    if (Array.isArray(output)) {
      return output.map((url) => ({ url: String(url) }));
    }

    return [];
  } catch (error) {
    console.error("Replicate image generation error:", error);
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
    negativePrompt = "blurry, low quality, distorted, ugly",
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
