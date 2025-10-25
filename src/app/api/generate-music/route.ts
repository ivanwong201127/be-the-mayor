import { NextRequest, NextResponse } from 'next/server';
import { MusicGenInput, MusicGenPrediction, MusicGenerationRequest, MusicGenerationResponse } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { prompt, duration, inputAudio, modelVersion, outputFormat }: MusicGenerationRequest = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
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

    // Default settings for rap music generation
    const input: MusicGenInput = {
      model_version: modelVersion || 'stereo-large',
      prompt: prompt,
      duration: duration || 30, // Default 30 seconds
      temperature: 1,
      continuation: false,
      continuation_start: 0,
      multi_band_diffusion: false,
      normalization_strategy: 'peak',
      top_k: 250,
      top_p: 0,
      classifier_free_guidance: 3,
      output_format: outputFormat || 'wav'
    };

    // Only add input_audio if it's provided
    if (inputAudio) {
      input.input_audio = inputAudio;
    }

    console.log('Sending music generation request to MusicGen with input:', JSON.stringify(input, null, 2));

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({ 
        version: 'meta/musicgen:671ac645ce5e552cc63a54a2bbff63fcf798043055d2dac5fc9e36a837eedcfb',
        input: input 
      })
    });

    console.log('MusicGen API response:', response);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('MusicGen API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate music' },
        { status: 500 }
      );
    }

    const data: MusicGenPrediction = await response.json();

    if (data.output) {
      return NextResponse.json({
        audioUrl: data.output
      } as MusicGenerationResponse);
    } else {
      return NextResponse.json(
        { error: 'No music generated' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Music generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
