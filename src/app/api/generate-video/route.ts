import { NextRequest, NextResponse } from 'next/server';
import { SeedanceInput, SeedancePrediction, VideoGenerationRequest, VideoGenerationResponse } from '@/types';
import { CAMPAIGN_STYLES, CITY_CAMPAIGNS, DEFAULT_CITY_CAMPAIGN } from '@/constants/campaign';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const type = formData.get('type') as string;
    const description = formData.get('description') as string;
    const selectedCity = formData.get('selectedCity') as string;
    const campaignStyle = formData.get('campaignStyle') as string;
    const backgroundVideo = formData.get('backgroundVideo') as File;
    const characterImage = formData.get('characterImage') as string;
    const musicUrl = formData.get('musicUrl') as string | undefined;

    if (!type) {
      return NextResponse.json(
        { error: 'Type is required' },
        { status: 400 }
      );
    }

    if (type === 'compose') {
      // Video composition
      if (!backgroundVideo || !characterImage) {
        return NextResponse.json(
          { error: 'Background video and character image are required for composition' },
          { status: 400 }
        );
      }

      // For now, we'll simulate video composition
      // In a real implementation, you would use a video processing service
      // like FFmpeg, Cloudinary, or AWS MediaConvert
      
      console.log('Video composition request:', {
        videoSize: backgroundVideo.size,
        videoType: backgroundVideo.type,
        characterImage,
        musicUrl
      });

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));

      // For demonstration, return the original video URL
      // In production, this would be the composed video URL
      const composedVideoUrl = URL.createObjectURL(backgroundVideo);

      return NextResponse.json({
        videoUrl: composedVideoUrl
      } as VideoGenerationResponse);

    } else if (type === 'campaign') {
      // Campaign video generation
      if (!description || !selectedCity || !campaignStyle) {
        return NextResponse.json(
          { error: 'Description, selected city, and campaign style are required for campaign video' },
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

      const style = CAMPAIGN_STYLES.find(s => s.id === campaignStyle);
      if (!style) {
        return NextResponse.json(
          { error: 'Invalid campaign style' },
          { status: 400 }
        );
      }

      const cityData = CITY_CAMPAIGNS[selectedCity] || DEFAULT_CITY_CAMPAIGN;
      
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

      const input: SeedanceInput = {
        fps: defaultVideoSettings.fps,
        prompt: videoPrompt,
        duration: defaultVideoSettings.duration,
        resolution: defaultVideoSettings.resolution,
        aspect_ratio: defaultVideoSettings.aspect_ratio,
        camera_fixed: defaultVideoSettings.camera_fixed
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
        return NextResponse.json(
          { error: 'Failed to generate campaign video' },
          { status: 500 }
        );
      }

      const data: SeedancePrediction = await response.json();
      
      if (data.output && typeof data.output === 'string') {
        return NextResponse.json({
          videoUrl: data.output
        } as VideoGenerationResponse);
      } else {
        return NextResponse.json(
          { error: 'No campaign video generated' },
          { status: 500 }
        );
      }

    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "compose" or "campaign"' },
        { status: 400 }
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
