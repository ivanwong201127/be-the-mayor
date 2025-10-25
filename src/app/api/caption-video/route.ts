import { NextRequest, NextResponse } from "next/server";
import {
  Qwen2VLInput,
  Qwen2VLPrediction,
  VideoCaptioningRequest,
  VideoCaptioningResponse,
} from "@/types";
import { VIDEO_CAPTIONING_CONFIG } from "@/constants/video-captioning";

// Utility function to chunk video into 5-second segments
async function chunkVideo(videoBlob: Blob): Promise<Blob[]> {
  const chunks: Blob[] = [];
  const chunkDuration = VIDEO_CAPTIONING_CONFIG.CHUNK_DURATION * 1000; // Convert to milliseconds

  // For now, we'll return the original video as a single chunk
  // In a real implementation, you would use FFmpeg or similar to split the video
  chunks.push(videoBlob);

  return chunks;
}

// Utility function to upload video chunk to a temporary URL
async function uploadVideoChunk(chunk: Blob): Promise<string> {
  // For mobile compatibility, we'll use a more robust upload approach
  // In a real implementation, you would upload to a cloud storage service like AWS S3, Cloudinary, etc.

  // For now, we'll create a data URL, but this has size limitations
  // For production, you should implement proper file upload to cloud storage
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read video file"));
    };
    reader.readAsDataURL(chunk);
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get("videoFile") as File;
    const prompt =
      (formData.get("prompt") as string) ||
      VIDEO_CAPTIONING_CONFIG.DEFAULT_PROMPT;
    const maxNewTokens =
      parseInt(formData.get("maxNewTokens") as string) ||
      VIDEO_CAPTIONING_CONFIG.DEFAULT_MAX_TOKENS;

    if (!videoFile) {
      return NextResponse.json(
        { error: "Video file is required" },
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

    // Validate video file
    const validation = {
      isValid: true,
      error: undefined,
    };

    if (!videoFile.type.startsWith("video/")) {
      return NextResponse.json(
        { error: "Invalid file type. Please upload a video file." },
        { status: 400 }
      );
    }

    // Check file size (important for mobile)
    if (videoFile.size > VIDEO_CAPTIONING_CONFIG.MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large. Maximum size: ${
            VIDEO_CAPTIONING_CONFIG.MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    // Convert File to Blob
    const videoBlob = new Blob([await videoFile.arrayBuffer()], {
      type: videoFile.type,
    });

    // For mobile videos, we might need to process them differently
    // Check if it's a mobile-recorded video (usually MP4 or WebM)
    const isMobileVideo =
      videoFile.type === "video/mp4" || videoFile.type === "video/webm";

    // Chunk the video into 5-second segments
    const videoChunks = await chunkVideo(videoBlob);

    console.log(
      `Processing ${videoChunks.length} video chunks for ${
        isMobileVideo ? "mobile" : "desktop"
      } video`
    );

    // Process each chunk
    const captions: string[] = [];

    for (let i = 0; i < videoChunks.length; i++) {
      const chunk = videoChunks[i];

      try {
        // Upload chunk to get a URL
        const mediaUrl = await uploadVideoChunk(chunk);

        const input: Qwen2VLInput = {
          media: mediaUrl,
          prompt: prompt,
          max_new_tokens: maxNewTokens,
        };

        console.log(
          `Processing video chunk ${i + 1}/${videoChunks.length} with input:`,
          JSON.stringify(input, null, 2)
        );

        const response = await fetch(
          "https://api.replicate.com/v1/models/lucataco/qwen2-vl-7b-instruct/predictions",
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

        if (!response.ok) {
          const errorData = await response.text();
          console.error("Qwen2-VL API error:", errorData);
          return NextResponse.json(
            { error: `Failed to process video chunk ${i + 1}: ${errorData}` },
            { status: 500 }
          );
        }

        const data: Qwen2VLPrediction = await response.json();

        if (data.output) {
          captions.push(data.output);
        } else {
          console.warn(`No output for chunk ${i + 1}`);
        }
      } catch (chunkError) {
        console.error(`Error processing chunk ${i + 1}:`, chunkError);
        // Continue with other chunks instead of failing completely
        continue;
      }
    }

    // Combine all captions
    const finalCaption = captions.join(" ");

    return NextResponse.json({
      caption: finalCaption,
    } as VideoCaptioningResponse);
  } catch (error) {
    console.error("Video captioning error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
