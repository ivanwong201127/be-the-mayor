import { NextRequest, NextResponse } from "next/server";
import {
  TextGenInput,
  TextGenPrediction,
  TextGenerationRequest,
  TextGenerationResponse,
} from "@/types";

export async function POST(request: NextRequest) {
  try {
    const {
      prompt,
      messages,
      verbosity,
      image_input,
      reasoning_effort,
    }: TextGenerationRequest = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_KEY;

    if (!replicateApiToken) {
      return NextResponse.json(
        { error: "Replicate API token not configured" },
        { status: 500 }
      );
    }

    const input: TextGenInput = {
      prompt: prompt,
      messages: messages || [],
      verbosity: verbosity || "medium",
      image_input: image_input || [],
      reasoning_effort: reasoning_effort || "minimal",
      max_completion_tokens: 4096,
    };

    console.log(
      "Sending text generation request to Replicate with input:",
      JSON.stringify(input, null, 2)
    );

    const response = await fetch("https://api.replicate.com/v1/models/openai/gpt-5-nano/predictions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${replicateApiToken}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: input,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Text generation API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate text" },
        { status: 500 }
      );
    }

    const data: TextGenPrediction = await response.json();

    if (data.output && Array.isArray(data.output)) {
      // Join the array of tokens into a single string
      const text = data.output.join("");
      return NextResponse.json({
        text: text,
      } as TextGenerationResponse);
    } else {
      return NextResponse.json({ error: "No text generated" }, { status: 500 });
    }
  } catch (error) {
    console.error("Text generation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
