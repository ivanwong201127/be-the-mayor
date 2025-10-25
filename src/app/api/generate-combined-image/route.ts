import { NextRequest, NextResponse } from "next/server";
import { ReplicateInput, ReplicatePrediction } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('videoFile') as File;
    const celebrityImageUrl = formData.get('celebrityImageUrl') as string;

    if (!videoFile || !celebrityImageUrl) {
      return NextResponse.json(
        { error: 'Video file and celebrity image URL are required' },
        { status: 400 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_KEY;
    
    if (!replicateApiToken) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    // Create a prompt for combining the video screenshot with celebrity image
    const prompt = `Create a cinematic first frame for a video where a celebrity appears in the scene. Combine the background environment from the video screenshot with the celebrity character. The celebrity should be naturally integrated into the scene, looking like they belong in that environment. Make it look like the beginning of a professional video where the celebrity will perform. High quality, cinematic lighting, realistic composition.`;

    const input: ReplicateInput = {
      prompt: prompt,
      input_image: celebrityImageUrl, // Use celebrity image as base
      aspect_ratio: "16:9" as const,
      output_format: "jpg" as const,
      safety_tolerance: 2,
      prompt_upsampling: false,
    };

    console.log('Generating combined image with input:', JSON.stringify(input, null, 2));

    const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({ input })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Replicate API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate combined image' },
        { status: 500 }
      );
    }

    const data: ReplicatePrediction = await response.json();

    console.log('Combined image API response:', data);
    
    if (data.output && typeof data.output === 'string') {
      return NextResponse.json({
        combinedImageUrl: data.output
      });
    } else {
      return NextResponse.json(
        { error: 'No combined image generated' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Combined image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
