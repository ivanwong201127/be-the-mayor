import { NextRequest, NextResponse } from 'next/server';
import { ReplicateInput, ReplicatePrediction, ImageGenerationRequest, ImageGenerationResponse } from '@/types';
import { CAMPAIGN_STYLES, CITY_CAMPAIGNS, DEFAULT_CITY_CAMPAIGN } from '@/constants/campaign';

export async function POST(request: NextRequest) {
  try {
    const { type, description, selectedCity, campaignStyle }: ImageGenerationRequest = await request.json();

    if (!type || !description) {
      return NextResponse.json(
        { error: 'Type and description are required' },
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

    let prompt: string;
    let inputImage: string;

    if (type === 'avatar') {
      // Avatar generation
      prompt = `Create a professional avatar portrait of: ${description}. High quality, detailed, photorealistic, professional headshot style, clean background, good lighting`;
      inputImage = "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png";
    } else if (type === 'campaign-poster') {
      // Campaign poster generation
      if (!selectedCity || !campaignStyle) {
        return NextResponse.json(
          { error: 'Selected city and campaign style are required for campaign poster' },
          { status: 400 }
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
      
      prompt = style.promptTemplate
        .replace('{description}', description)
        .replace('{city}', selectedCity)
        .replace('{state}', cityData.state)
        .replace('{slogan}', cityData.slogan)
        + ` Include elements specific to ${selectedCity}: ${cityData.culturalElements.join(', ')}. `
        + `Address local issues: ${cityData.localIssues.join(', ')}. `
        + `Campaign slogan: "${cityData.slogan}". `
        + `High quality, detailed, professional campaign poster design.`;
      
      inputImage = "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png";
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "avatar" or "campaign-poster"' },
        { status: 400 }
      );
    }

    const input: ReplicateInput = {
      prompt: prompt,
      input_image: inputImage,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
      prompt_upsampling: false
    };

    console.log(`Sending ${type} generation request to Replicate with input:`, JSON.stringify(input, null, 2));

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
        { error: `Failed to generate ${type}` },
        { status: 500 }
      );
    }

    const data: ReplicatePrediction = await response.json();
    
    if (data.output && typeof data.output === 'string') {
      return NextResponse.json({
        imageUrl: data.output
      } as ImageGenerationResponse);
    } else if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      return NextResponse.json({
        imageUrl: data.output[0]
      } as ImageGenerationResponse);
    } else {
      return NextResponse.json(
        { error: `No ${type} generated` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
