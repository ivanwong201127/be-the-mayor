import { NextRequest, NextResponse } from 'next/server';
import { VideoGenerationResponse, OmniHumanInput, OmniHumanPrediction } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audio = formData.get('audio') as string;
    const image = formData.get('image') as string;

    if (!audio || !image) {
      return NextResponse.json(
        { error: 'Audio and image are required for video generation' },
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

    const input: OmniHumanInput = {
      audio: audio,
      image: image
    };

    console.log('Generating omni-human video with input:', JSON.stringify(input, null, 2));

    const response = await fetch('https://api.replicate.com/v1/models/bytedance/omni-human/predictions', {
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
      console.error('Omni-human API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate omni-human video' },
        { status: 500 }
      );
    }

    const data: OmniHumanPrediction = await response.json();

    console.log('Omni-human API response:', data);
    
    if (data.output && typeof data.output === 'string') {
      return NextResponse.json({
        videoUrl: data.output
      } as VideoGenerationResponse);
    } else {
      return NextResponse.json(
        { error: 'No video generated' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
