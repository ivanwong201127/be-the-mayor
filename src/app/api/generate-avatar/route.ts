import { NextRequest, NextResponse } from 'next/server';
import { ReplicateInput, ReplicatePrediction, AvatarGenerationRequest, AvatarGenerationResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { description }: AvatarGenerationRequest = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
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

    // Create a prompt for avatar generation
    const prompt = `Create a professional avatar portrait of: ${description}. High quality, detailed, photorealistic, professional headshot style, clean background, good lighting`;

    // Use a default input image - this should be a placeholder or default avatar image
    // For now, we'll use a generic portrait image URL
    const defaultInputImage = "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png";

    const input: ReplicateInput = {
      prompt: prompt,
      input_image: defaultInputImage,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
      prompt_upsampling: false
    };

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
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      return NextResponse.json(
        { error: 'Failed to generate avatar' },
        { status: 500 }
      );
    }

    const data: ReplicatePrediction = await response.json();
    
    if (data.output && typeof data.output === 'string') {
      return NextResponse.json({
        imageUrl: data.output
      } as AvatarGenerationResponse);
    } else if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      return NextResponse.json({
        imageUrl: data.output[0]
      } as AvatarGenerationResponse);
    } else {
      return NextResponse.json(
        { error: 'No image generated' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
