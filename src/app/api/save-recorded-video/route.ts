import { NextRequest, NextResponse } from 'next/server';
import { localCache } from '@/lib/cache';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const videoFile = formData.get('videoFile') as File;
    
    if (!videoFile) {
      return NextResponse.json(
        { error: 'Video file is required' },
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
    const fileExtension = videoFile.name.split('.').pop() || 'webm';
    const filename = `recorded-video-${timestamp}.${fileExtension}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file to disk
    const buffer = Buffer.from(await videoFile.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // Create URL for the saved file
    const videoUrl = `/uploads/${filename}`;

    // Cache the result
    const cacheKey = `recorded-video-${timestamp}`;
    localCache.set(cacheKey, videoUrl, {
      filename,
      timestamp: Date.now(),
      size: videoFile.size,
      type: videoFile.type
    });

    console.log(`Saved recorded video: ${filename} at ${videoUrl}`);

    return NextResponse.json({
      videoUrl,
      filename,
      cached: false
    });

  } catch (error) {
    console.error('Save recorded video error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
