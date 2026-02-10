import { NextRequest, NextResponse } from 'next/server';

// Simple API route that generates a colored placeholder image
export async function GET(request: NextRequest) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const width = parseInt(searchParams.get('width') || '800', 10);
  const height = parseInt(searchParams.get('height') || '600', 10);
  const text = searchParams.get('text') || 'Placeholder';
  const color = searchParams.get('color') || '1D331D'; // Default to forest green
  
  // Create a canvas element
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    return new NextResponse('Could not create canvas context', { status: 500 });
  }
  
  // Fill background
  ctx.fillStyle = `#${color}`;
  ctx.fillRect(0, 0, width, height);
  
  // Add some visual interest with a lighter circle
  ctx.fillStyle = `#${color}33`; // Add 33 for 20% opacity
  ctx.beginPath();
  ctx.arc(width * 0.5, height * 0.5, Math.min(width, height) * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Add text
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `bold ${Math.floor(width / 20)}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Convert to blob
  const blob = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality: 0.8
  });
  
  // Convert blob to array buffer
  const buffer = await blob.arrayBuffer();
  
  // Return image
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  });
}
