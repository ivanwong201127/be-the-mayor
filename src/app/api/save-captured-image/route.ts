import { NextRequest, NextResponse } from 'next/server';
import { localCache } from '@/lib/cache';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('imageFile') as File;
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = imageFile.name.split('.').pop() || 'jpg';
    const filename = `captured-image-${timestamp}.${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file to disk
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Create URL for the saved file
    const imageUrl = `/uploads/${filename}`;

    // Cache the result
    const cacheKey = `captured-image-${timestamp}`;
    localCache.set(cacheKey, imageUrl, {
      filename,
      timestamp: Date.now(),
      size: imageFile.size,
      type: imageFile.type
    });

    console.log(`Saved captured image: ${filename} at ${imageUrl}`);

    return NextResponse.json({
      imageUrl,
      filename,
      cached: false
    });

  } catch (error) {
    console.error('Save captured image error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
