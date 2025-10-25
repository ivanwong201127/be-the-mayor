import { NextRequest, NextResponse } from 'next/server';
import { SeedanceInput, SeedancePrediction, CampaignVideoRequest, CampaignVideoResponse } from '@/types';
import { CAMPAIGN_STYLES, CITY_CAMPAIGNS, DEFAULT_CITY_CAMPAIGN } from '@/constants/campaign';

export async function POST(request: NextRequest) {
  try {
    const { description, selectedCity, campaignStyle, videoSettings }: CampaignVideoRequest = await request.json();

    if (!description || !selectedCity || !campaignStyle) {
      return NextResponse.json(
        { error: 'Description, selected city, and campaign style are required' },
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

    // Get the campaign style
    const style = CAMPAIGN_STYLES.find(s => s.id === campaignStyle);
    if (!style) {
      return NextResponse.json(
        { error: 'Invalid campaign style' },
        { status: 400 }
      );
    }

    // Get city campaign data
    const cityData = CITY_CAMPAIGNS[selectedCity] || DEFAULT_CITY_CAMPAIGN;
    
    // Build the video prompt
    const videoPrompt = style.videoPromptTemplate
      .replace('{description}', description)
      .replace('{city}', selectedCity)
      + ` Include elements specific to ${selectedCity}: ${cityData.culturalElements.join(', ')}. `
      + `Campaign slogan: "${cityData.slogan}". `
      + `High quality, professional campaign video.`;

    // Default video settings
    const defaultVideoSettings = {
      fps: 24,
      duration: 5,
      resolution: '720p' as const,
      aspect_ratio: '16:9' as const,
      camera_fixed: false
    };

    // Merge with user-provided settings
    const finalVideoSettings = { ...defaultVideoSettings, ...videoSettings };

    const input: SeedanceInput = {
      fps: finalVideoSettings.fps,
      prompt: videoPrompt,
      duration: finalVideoSettings.duration,
      resolution: finalVideoSettings.resolution,
      aspect_ratio: finalVideoSettings.aspect_ratio,
      camera_fixed: finalVideoSettings.camera_fixed
    };

    console.log('Sending campaign video request to Seedance with input:', JSON.stringify(input, null, 2));

    const response = await fetch('https://api.replicate.com/v1/models/bytedance/seedance-1-lite/predictions', {
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
      console.error('Seedance API error:', errorData);
      console.error('Response status:', response.status);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      return NextResponse.json(
        { error: 'Failed to generate campaign video' },
        { status: 500 }
      );
    }

    const data: SeedancePrediction = await response.json();
    
    if (data.output && typeof data.output === 'string') {
      return NextResponse.json({
        videoUrl: data.output
      } as CampaignVideoResponse);
    } else {
      return NextResponse.json(
        { error: 'No campaign video generated' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Campaign video generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
