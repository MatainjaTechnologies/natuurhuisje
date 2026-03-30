import { NextRequest, NextResponse } from 'next/server';
import { calculateBookingPrice } from '@/lib/supabase-special-pricing';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const houseId = searchParams.get('house_id');
    const checkIn = searchParams.get('check_in');
    const checkOut = searchParams.get('check_out');
    const regularPrice = searchParams.get('regular_price');

    if (!houseId || !checkIn || !checkOut || !regularPrice) {
      return NextResponse.json(
        { error: 'Missing required parameters: house_id, check_in, check_out, regular_price' },
        { status: 400 }
      );
    }

    const priceCalculation = await calculateBookingPrice(
      parseInt(houseId),
      parseFloat(regularPrice),
      checkIn,
      checkOut
    );

    return NextResponse.json(priceCalculation);
  } catch (error: any) {
    console.error('Error in GET /api/booking-price:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to calculate booking price' },
      { status: 500 }
    );
  }
}
