import { NextRequest, NextResponse } from 'next/server';
import { ReplicateInput, ReplicatePrediction, CampaignPosterRequest, CampaignPosterResponse } from '@/types';
import { CAMPAIGN_STYLES, CITY_CAMPAIGNS, DEFAULT_CITY_CAMPAIGN } from '@/constants/campaign';

export async function POST(request: NextRequest) {
  try {
    const { description, selectedCity, campaignStyle }: CampaignPosterRequest = await request.json();

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
    
    // Build the comprehensive prompt
    const prompt = style.promptTemplate
      .replace('{description}', description)
      .replace('{city}', selectedCity)
      .replace('{state}', cityData.state)
      .replace('{slogan}', cityData.slogan)
      + ` Include elements specific to ${selectedCity}: ${cityData.culturalElements.join(', ')}. `
      + `Address local issues: ${cityData.localIssues.join(', ')}. `
      + `Campaign slogan: "${cityData.slogan}". `
      + `High quality, detailed, professional campaign poster design.`;

    // Use a default input image - this should be a placeholder or default poster image
    const defaultInputImage = "https://replicate.delivery/pbxt/N55l5TWGh8mSlNzW8usReoaNhGbFwvLeZR3TX1NL4pd2Wtfv/replicate-prediction-f2d25rg6gnrma0cq257vdw2n4c.png";

    const input: ReplicateInput = {
      prompt: prompt,
      input_image: defaultInputImage,
      aspect_ratio: "match_input_image",
      output_format: "jpg",
      safety_tolerance: 2,
      prompt_upsampling: false
    };

    console.log('Sending campaign poster request to Replicate with input:', JSON.stringify(input, null, 2));

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
        { error: 'Failed to generate campaign poster' },
        { status: 500 }
      );
    }

    const data: ReplicatePrediction = await response.json();
    
    if (data.output && typeof data.output === 'string') {
      return NextResponse.json({
        imageUrl: data.output
      } as CampaignPosterResponse);
    } else if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      return NextResponse.json({
        imageUrl: data.output[0]
      } as CampaignPosterResponse);
    } else {
      return NextResponse.json(
        { error: 'No campaign poster generated' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Campaign poster generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
