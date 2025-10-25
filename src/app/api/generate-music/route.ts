import { NextRequest, NextResponse } from 'next/server';
import { MusicGenInput, MusicGenPrediction, MusicGenerationRequest, MusicGenerationResponse } from '@/types';
import { localCache } from '@/lib/cache';

export async function POST(request: NextRequest) {
  try {
    const { lyrics, bitrate, song_file, sample_rate }: MusicGenerationRequest = await request.json();

    if (!lyrics) {
      return NextResponse.json(
        { error: 'Lyrics are required' },
        { status: 400 }
      );
    }

    // Create cache key based on parameters
    const cacheKey = `music-minimax-${lyrics.substring(0, 50)}-${bitrate || 256000}-${sample_rate || 44100}`;
    
    // Check cache first
    const cachedEntry = localCache.get(cacheKey);
    if (cachedEntry) {
      console.log(`Using cached music for key: ${cacheKey}`);
      return NextResponse.json({
        audioUrl: cachedEntry.url,
        cached: true
      } as MusicGenerationResponse);
    }

    const replicateApiToken = process.env.REPLICATE_API_KEY;

    if (!replicateApiToken) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    // MiniMax music generation input
    const input: MusicGenInput = {
      lyrics: lyrics,
      bitrate: bitrate || 256000,
      song_file: song_file || "https://replicate.delivery/pbxt/M9zum1Y6qujy02jeigHTJzn0lBTQOemB7OkH5XmmPSC5OUoO/MiniMax-Electronic.wav",
      sample_rate: sample_rate || 44100
    };

    console.log('Sending music generation request to MiniMax with input:', JSON.stringify(input, null, 2));

    const response = await fetch('https://api.replicate.com/v1/models/minimax/music-01/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken}`,
        'Content-Type': 'application/json',
        'Prefer': 'wait'
      },
      body: JSON.stringify({ 
        input: input 
      })
    });

    console.log('MiniMax API response:', response);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('MiniMax API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate music' },
        { status: 500 }
      );
    }

    const data: MusicGenPrediction = await response.json();

    if (data.output) {
      // Cache the result
      localCache.set(cacheKey, data.output, {
        lyrics,
        bitrate,
        song_file,
        sample_rate,
        timestamp: Date.now()
      });

      return NextResponse.json({
        audioUrl: data.output,
        cached: false
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
