import { NextRequest, NextResponse } from "next/server";
import {
  CharacterImageRequest,
  CharacterImageResponse,
  ReplicateInput,
  ReplicatePrediction,
} from "@/types";
import { localCache } from "@/lib/cache";

export async function POST(request: NextRequest) {
  try {
    const { characterName, characterDescription }: CharacterImageRequest =
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
      let characterPrompt = "";
      if (characterName.toLowerCase().includes("jungkook")) {
        characterPrompt =
          "Jungkook from BTS, handsome Korean male idol with dark hair, wearing stylish outfit, giving a kiss at the end of the video. Professional K-pop star appearance, charismatic smile, dancing gracefully.";
      } else if (characterName.toLowerCase().includes("jimin")) {
        characterPrompt =
          "Jimin from BTS, beautiful Korean male idol with blonde hair, wearing elegant outfit, giving a kiss at the end of the video. Professional K-pop star appearance, charming smile, smooth dance moves.";
      } else if (characterName.toLowerCase().includes("v")) {
        characterPrompt =
          "V (Taehyung) from BTS, handsome Korean male idol with dark hair, wearing fashionable outfit, giving a kiss at the end of the video. Professional K-pop star appearance, deep voice, artistic expression.";
      } else if (characterName.toLowerCase().includes("jennie")) {
        characterPrompt =
          "Jennie from BLACKPINK, beautiful Korean female idol with dark hair, wearing stylish outfit, giving a kiss at the end of the video. Professional K-pop star appearance, confident smile, elegant dance moves.";
      } else if (characterName.toLowerCase().includes("lisa")) {
        characterPrompt =
          "Lisa from BLACKPINK, beautiful Thai-Korean female idol with blonde hair, wearing trendy outfit, giving a kiss at the end of the video. Professional K-pop star appearance, bright smile, powerful dance moves.";
      } else if (characterName.toLowerCase().includes("blue")) {
        characterPrompt =
          "A charming blue character, friendly and approachable, wearing blue outfit, giving a kiss at the end of the video. Cartoon-style character, warm smile, animated movements.";
      } else {
        characterPrompt = characterDescription;
      }

      return NextResponse.json({
        imageUrl: cachedEntry.url,
        characterPrompt,
        cached: true,
      } as CharacterImageResponse);
    }

    // Create character prompt based on character
    let characterPrompt = "";

    if (characterName.toLowerCase().includes("jungkook")) {
      characterPrompt +=
        "Jungkook from BTS, handsome Korean male idol with dark hair, wearing stylish outfit, giving a kiss at the end of the video. Professional K-pop star appearance, charismatic smile, dancing gracefully.";
    } else if (characterName.toLowerCase().includes("jimin")) {
      characterPrompt +=
        "Jimin from BTS, beautiful Korean male idol with blonde hair, wearing elegant outfit, giving a kiss at the end of the video. Professional K-pop star appearance, charming smile, smooth dance moves.";
    } else if (characterName.toLowerCase().includes("v")) {
      characterPrompt +=
        "V (Taehyung) from BTS, handsome Korean male idol with dark hair, wearing fashionable outfit, giving a kiss at the end of the video. Professional K-pop star appearance, deep voice, artistic expression.";
    } else if (characterName.toLowerCase().includes("jennie")) {
      characterPrompt +=
        "Jennie from BLACKPINK, beautiful Korean female idol with dark hair, wearing stylish outfit, giving a kiss at the end of the video. Professional K-pop star appearance, confident smile, elegant dance moves.";
    } else if (characterName.toLowerCase().includes("lisa")) {
      characterPrompt +=
        "Lisa from BLACKPINK, beautiful Thai-Korean female idol with blonde hair, wearing trendy outfit, giving a kiss at the end of the video. Professional K-pop star appearance, bright smile, powerful dance moves.";
    } else if (characterName.toLowerCase().includes("blue")) {
      characterPrompt +=
        "A charming blue character, friendly and approachable, wearing blue outfit, giving a kiss at the end of the video. Cartoon-style character, warm smile, animated movements.";
    } else {
      // Generic prompt based on description
      characterPrompt += characterDescription; // Use the provided description as prompt
    }

    console.log(`Generating character image: ${characterPrompt}`);

    const replicateApiToken = process.env.REPLICATE_API_KEY;

    if (!replicateApiToken) {
      throw new Error("Replicate API token not configured");
    }

      // Generate image using Replicate
      const input: ReplicateInput = {
        prompt: characterPrompt,
        aspect_ratio: "16:9" as const,
        output_format: "jpg" as const,
        safety_tolerance: 2,
        prompt_upsampling: false,
      };

    const response = await fetch(
      "https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions",
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

    console.log("Replicate API response:", response);

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Replicate API error:", errorData);
      throw new Error("Failed to generate character image");
    }

    const data: ReplicatePrediction = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    if (!data.output || typeof data.output !== "string") {
      throw new Error("No character image generated");
    }

    const imageUrl = data.output;

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
