import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { 
  updateSpecialPricing, 
  deleteSpecialPricing,
  checkSpecialPricingOverlap 
} from '@/lib/supabase-special-pricing';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const idNum = parseInt(id);
    const body = await request.json();
    const { start_date, end_date, price_per_night, occasion_name, description, status } = body;

    // Validate dates if provided
    if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
      return NextResponse.json(
        { error: 'Start date must be before end date' },
        { status: 400 }
      );
    }

    // Validate price if provided
    if (price_per_night !== undefined && price_per_night <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Get existing special pricing to check ownership
    const { data: existing } = await (supabase as any)
      .from('special_pricing')
      .select('*, houses!inner(host_id)')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Special pricing not found' },
        { status: 404 }
      );
    }

    if (existing.houses.host_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to update this special pricing' },
        { status: 403 }
      );
    }

    // If only status is being updated, skip validation and overlap checks
    if (status && !start_date && !end_date && !price_per_night) {
      const updated = await updateSpecialPricing(idNum, { status });
      return NextResponse.json(updated);
    }

    // Check for overlapping periods if dates are being updated
    if (start_date || end_date) {
      const checkStartDate = start_date || existing.start_date;
      const checkEndDate = end_date || existing.end_date;
      
      const hasOverlap = await checkSpecialPricingOverlap(
        existing.house_id,
        checkStartDate,
        checkEndDate,
        idNum
      );
      
      if (hasOverlap) {
        return NextResponse.json(
          { error: 'This date range overlaps with an existing special pricing period' },
          { status: 400 }
        );
      }
    }

    const updated = await updateSpecialPricing(idNum, {
      start_date,
      end_date,
      price_per_night,
      occasion_name,
      description,
      status
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error in PUT /api/special-pricing/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update special pricing' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const idNum = parseInt(id);

    // Get existing special pricing to check ownership
    const { data: existing } = await (supabase as any)
      .from('special_pricing')
      .select('*, houses!inner(host_id)')
      .eq('id', id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: 'Special pricing not found' },
        { status: 404 }
      );
    }

    if (existing.houses.host_id !== user.id) {
      return NextResponse.json(
        { error: 'You do not have permission to delete this special pricing' },
        { status: 403 }
      );
    }

    await deleteSpecialPricing(idNum);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error in DELETE /api/special-pricing/[id]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete special pricing' },
      { status: 500 }
    );
  }
}
