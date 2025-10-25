import { NextRequest, NextResponse } from "next/server";
import {
  VideoGenerationResponse,
  HailuoInput,
  HailuoPrediction,
} from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get("prompt") as string;
    const image = formData.get("image") as string;
    const duration = formData.get("duration") as string;

    if (!prompt || !image) {
      return NextResponse.json(
        { error: "Prompt and image are required for video generation" },
        { status: 400 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_KEY;

    if (!replicateApiToken) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      );
    }

    // Generate video using Hailuo with the provided image
    const input: HailuoInput = {
      prompt: prompt,
      go_fast: true,
      duration: parseInt(duration) || 6,
      prompt_optimizer: false,
      first_frame_image: image,
    };

    console.log(
      "Generating Hailuo video with input:",
      JSON.stringify(input, null, 2)
    );

    // Retry logic for queue full errors
    let data: HailuoPrediction | null = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}/3: Generating Hailuo video...`);

        const response = await fetch(
          "https://api.replicate.com/v1/models/minimax/hailuo-02-fast/predictions",
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

        console.log("Hailuo API response:", response);

        data = await response.json();

        // Check if the response contains a queue full error
        if (
          data &&
          data.error &&
          (data.error.includes("Queue is full") ||
            data.error.includes("queue is full"))
        ) {
          if (attempt < 3) {
            const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(
              `Queue is full in response. Waiting ${waitTime}ms before retry ${
                attempt + 1
              }/3...`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          } else {
            return NextResponse.json(
              {
                error:
                  "Video generation queue is full. Please try again later.",
              },
              { status: 503 }
            );
          }
        }

        // Success, break out of retry loop
        break;
      } catch (error) {
        console.error(`Attempt ${attempt}/3 - Network error:`, error);

        if (attempt < 3) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(
            `Network error. Waiting ${waitTime}ms before retry ${
              attempt + 1
            }/3...`
          );
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          return NextResponse.json(
            { error: "Failed to generate video after 3 attempts" },
            { status: 500 }
          );
        }
      }
    }

    if (!data) {
      return NextResponse.json(
        { error: "Failed to generate video after all retry attempts" },
        { status: 500 }
      );
    }

    console.log("Hailuo API response:", data);

    // If the prediction is still processing, poll until completion
    if (data && (data.status === 'starting' || data.status === 'processing')) {
      console.log(`Prediction ${data.id} is ${data.status}, polling for completion...`);
      
      // Poll the prediction until it's completed
      const maxPolls = 60; // Maximum 60 polls (5 minutes with 5s intervals)
      let pollCount = 0;
      
      while (pollCount < maxPolls) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        try {
          if (!data) {
            console.error("Data is null during polling");
            break;
          }
          
          const pollResponse: Response = await fetch(data.urls.get, {
            headers: {
              Authorization: `Bearer ${replicateApiToken}`,
            },
          });
          
          if (!pollResponse.ok) {
            console.error(`Polling failed: ${pollResponse.status}`);
            break;
          }
          
          data = await pollResponse.json();
          pollCount++;
          
          console.log(`Poll ${pollCount}/${maxPolls}: Status = ${data?.status}`);
          
          if (data?.status === 'succeeded' && data?.output) {
            console.log("Video generation completed successfully!");
            break;
          } else if (data?.status === 'failed' || data?.status === 'canceled') {
            console.error(`Video generation failed with status: ${data?.status}`);
            return NextResponse.json(
              { error: `Video generation failed: ${data?.error || 'Unknown error'}` },
              { status: 500 }
            );
          }
        } catch (pollError) {
          console.error(`Polling error:`, pollError);
          break;
        }
      }
      
      if (pollCount >= maxPolls) {
        return NextResponse.json(
          { error: "Video generation timed out after 5 minutes" },
          { status: 504 }
        );
      }
    }

    // Return output if available
    if (data?.output && typeof data.output === "string") {
      return NextResponse.json({
        videoUrl: data.output,
      } as VideoGenerationResponse);
    }

    // If no output after polling, return error
    return NextResponse.json(
      { error: "No video generated" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Video generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
