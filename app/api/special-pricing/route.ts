import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { 
  getSpecialPricingForHouse, 
  createSpecialPricing,
  checkSpecialPricingOverlap 
} from '@/lib/supabase-special-pricing';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const houseId = searchParams.get('house_id');

    if (!houseId) {
      return NextResponse.json(
        { error: 'house_id is required' },
        { status: 400 }
      );
    }

    const specialPricing = await getSpecialPricingForHouse(parseInt(houseId));
    return NextResponse.json(specialPricing);
  } catch (error: any) {
    console.error('Error in GET /api/special-pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch special pricing' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { house_id, start_date, end_date, price_per_night, occasion_name, description } = body;

    // Validate required fields
    if (!house_id || !start_date || !end_date || !price_per_night) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate dates
    if (new Date(start_date) > new Date(end_date)) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Validate price
    if (price_per_night <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if user owns the house
    const { data: house } = await (supabase as any)
      .from('houses')
      .select('host_id')
      .eq('id', house_id)
      .single();

    if (!house || house.host_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to add special pricing to this house' },
        { status: 403 }
      );
    }

    // Check for overlapping periods
    const hasOverlap = await checkSpecialPricingOverlap(house_id, start_date, end_date);
    if (hasOverlap) {
      return NextResponse.json(
        { error: 'This date range overlaps with an existing special pricing period' },
        { status: 400 }
      );
    }

    const specialPricing = await createSpecialPricing({
      house_id,
      start_date,
      end_date,
      price_per_night,
      occasion_name,
      description
    });

    return NextResponse.json(specialPricing, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/special-pricing:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create special pricing' },
      { status: 500 }
    );
  }
}
