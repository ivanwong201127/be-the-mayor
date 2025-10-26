import { NextRequest, NextResponse } from "next/server";
import {
  CharacterImageRequest,
  CharacterImageResponse,
  Seedream4Input,
  Seedream4Prediction,
} from "@/types";
import { localCache } from "@/lib/cache";
import { getCharacterPromptByName } from "@/constants/characters";

export async function POST(request: NextRequest) {
  try {
    const { characterName, characterDescription, inputImage }: CharacterImageRequest =
      await request.json();

    if (!characterName || !characterDescription) {
      return NextResponse.json(
        { error: "Character name and description are required" },
        { status: 400 }
      );
    }

    // Create cache key based on character
    const cacheKey = `character-image-${characterName
      .toLowerCase()
      .replace(/\s+/g, "-")}`;

    // Check cache first
    const cachedEntry = localCache.get(cacheKey);
    if (cachedEntry) {
      console.log(`Using cached character image for: ${characterName}`);

      // Get character prompt for cached entries
      const characterData = getCharacterPromptByName(characterName);
      const characterPrompt = characterData?.imagePrompt || characterDescription;

      return NextResponse.json({
        imageUrl: cachedEntry.url,
        characterPrompt,
        cached: true,
      } as CharacterImageResponse);
    }

    // Create character prompt based on character
    const characterData = getCharacterPromptByName(characterName);
    const characterPrompt = characterData?.imagePrompt || characterDescription;

    console.log(`Generating character image: ${characterPrompt}`);

    const replicateApiToken = process.env.REPLICATE_API_KEY;

    if (!replicateApiToken) {
      console.error("REPLICATE_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "API configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // Handle input image - should be a public URL now
    let validInputImage = null;
    if (inputImage) {
      try {
        const url = new URL(inputImage);
        // Only allow http/https URLs for Seedream-4
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          validInputImage = inputImage;
          console.log(`Using input image: ${validInputImage}`);
        } else {
          console.warn(`Invalid input image protocol: ${url.protocol}. Skipping input image.`);
        }
      } catch (error) {
        console.warn(`Invalid input image URL: ${inputImage}. Skipping input image.`, error);
      }
    }

    // Generate image using Seedream-4
    const input: Seedream4Input = {
      size: "2K",
      width: 2048,
      height: 1536, // 4:3 aspect ratio: 2048 / 4 * 3 = 1536
      prompt: characterPrompt,
      max_images: 1,
      image_input: validInputImage ? [validInputImage] : [],
      aspect_ratio: "4:3",
      sequential_image_generation: "auto",
    };

    console.log("Sending request to Seedream-4 with input:", JSON.stringify(input, null, 2));

    const response = await fetch(
      "https://api.replicate.com/v1/models/bytedance/seedream-4/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${replicateApiToken}`,
          "Content-Type": "application/json",
          Prefer: "wait",
        },
        body: JSON.stringify({ input }),
      }
    );

    console.log("Replicate API response status:", response.status);
    console.log("Replicate API response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Replicate API error:", errorData);
      console.error("Response status:", response.status);
      console.error("Response statusText:", response.statusText);
      throw new Error(`Failed to generate character image: ${response.status} ${response.statusText}`);
    }

    const data: Seedream4Prediction = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.output || !Array.isArray(data.output) || data.output.length === 0) {
      throw new Error("No character image generated");
    }

    const imageUrl = data.output[0]; // Use the first generated image

    // Cache the result
    localCache.set(cacheKey, imageUrl, {
      characterName,
      characterDescription,
      characterPrompt,
      timestamp: Date.now(),
    });

    console.log(`Generated character image for ${characterName}:`, imageUrl);

    return NextResponse.json({
      imageUrl,
      characterPrompt,
      cached: false,
    } as CharacterImageResponse);
  } catch (error) {
    console.error("Character image search error:", error);
    return NextResponse.json(
      { error: "Failed to find character image" },
      { status: 500 }
    );
  }
}
