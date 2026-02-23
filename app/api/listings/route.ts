import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return empty array for now - you can connect to your database later
    return NextResponse.json({
      success: true,
      data: []
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
