import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("imageFile") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    const replicateApiToken = process.env.REPLICATE_API_KEY;
    if (!replicateApiToken) {
      throw new Error("Replicate API token not configured");
    }

    // Convert file to buffer
    const imageBuffer = await imageFile.arrayBuffer();

    // Upload to Replicate
    const uploadResponse = await fetch('https://api.replicate.com/v1/files', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${replicateApiToken}`,
        'Content-Type': 'application/octet-stream',
      },
      body: imageBuffer,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.text();
      console.error("Replicate upload error:", errorData);
      throw new Error(`Failed to upload image to Replicate: ${uploadResponse.status}`);
    }

    const uploadData = await uploadResponse.json();
    console.log(`Successfully uploaded image to Replicate: ${uploadData.urls.get}`);

    return NextResponse.json({
      replicateUrl: uploadData.urls.get,
    });
  } catch (error) {
    console.error("Upload to Replicate error:", error);
    return NextResponse.json(
      { error: "Failed to upload image to Replicate" },
      { status: 500 }
    );
  }
}
