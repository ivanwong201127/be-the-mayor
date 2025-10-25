import { NextRequest, NextResponse } from 'next/server';
import { VideoGenerationResponse, HailuoInput, HailuoPrediction } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const image = formData.get('image') as string;
    const duration = formData.get('duration') as string;

    if (!prompt || !image) {
      return NextResponse.json(
        { error: 'Prompt and image are required for video generation' },
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

    // Generate video using Hailuo with the provided image
    const input: HailuoInput = {
      prompt: prompt,
      go_fast: true,
      duration: parseInt(duration) || 6,
      prompt_optimizer: false,
      first_frame_image: image
    };

    console.log('Generating Hailuo video with input:', JSON.stringify(input, null, 2));

    // Retry logic for queue full errors
    let data: HailuoPrediction | null = null;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt}/3: Generating Hailuo video...`);
        
        const response = await fetch('https://api.replicate.com/v1/models/hailuo/hailuo-video/predictions', {
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
          console.error(`Attempt ${attempt}/3 - Hailuo API error:`, errorData);
          
          // Check if it's a queue full error
          if (errorData.includes('Queue is full') || errorData.includes('queue is full')) {
            if (attempt < 3) {
              const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
              console.log(`Queue is full. Waiting ${waitTime}ms before retry ${attempt + 1}/3...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              continue;
            } else {
              return NextResponse.json(
                { error: 'Video generation queue is full. Please try again later.' },
                { status: 503 }
              );
            }
          } else {
            // Non-queue error, don't retry
              return NextResponse.json(
                { error: 'Failed to generate Hailuo video' },
                { status: 500 }
              );
          }
        }

        data = await response.json();
        
        // Check if the response contains a queue full error
        if (data && data.error && (data.error.includes('Queue is full') || data.error.includes('queue is full'))) {
          if (attempt < 3) {
            const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
            console.log(`Queue is full in response. Waiting ${waitTime}ms before retry ${attempt + 1}/3...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            continue;
          } else {
            return NextResponse.json(
              { error: 'Video generation queue is full. Please try again later.' },
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
          console.log(`Network error. Waiting ${waitTime}ms before retry ${attempt + 1}/3...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        } else {
          return NextResponse.json(
            { error: 'Failed to generate video after 3 attempts' },
            { status: 500 }
          );
        }
      }
    }

    if (!data) {
      return NextResponse.json(
        { error: 'Failed to generate video after all retry attempts' },
        { status: 500 }
      );
    }

    console.log('Hailuo API response:', data);
    
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
