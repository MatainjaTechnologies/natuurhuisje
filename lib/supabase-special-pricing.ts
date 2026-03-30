import { createClient } from '@/utils/supabase/server';
import { 
  SpecialPricing, 
  CreateSpecialPricingData, 
  UpdateSpecialPricingData,
  BookingPriceCalculation,
  PriceBreakdown
} from '@/types/special-pricing';

/**
 * Get all special pricing periods for a house
 */
export async function getSpecialPricingForHouse(houseId: number): Promise<SpecialPricing[]> {
  const supabase = await createClient();
  
  const { data, error } = await (supabase as any)
    .from('special_pricing')
    .select('*')
    .eq('house_id', houseId)
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching special pricing:', error);
    throw new Error('Failed to fetch special pricing');
  }
  
  return data || [];
}

/**
 * Get active special pricing periods for a house (current and future)
 */
export async function getActiveSpecialPricing(houseId: number): Promise<SpecialPricing[]> {
  const supabase = await createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await (supabase as any)
    .from('special_pricing')
    .select('*')
    .eq('house_id', houseId)
    .gte('end_date', today)
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching active special pricing:', error);
    throw new Error('Failed to fetch active special pricing');
  }
  
  return data || [];
}

/**
 * Get special pricing for a specific date range
 */
export async function getSpecialPricingForDateRange(
  houseId: number,
  startDate: string,
  endDate: string
): Promise<SpecialPricing[]> {
  const supabase = await createClient();
  
  const { data, error } = await (supabase as any)
    .from('special_pricing')
    .select('*')
    .eq('house_id', houseId)
    .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`)
    .order('start_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching special pricing for date range:', error);
    throw new Error('Failed to fetch special pricing');
  }
  
  return data || [];
}

/**
 * Create a new special pricing period
 */
export async function createSpecialPricing(
  data: CreateSpecialPricingData
): Promise<SpecialPricing> {
  const supabase = await createClient();
  
  const { data: result, error } = await (supabase as any)
    .from('special_pricing')
    .insert(data)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating special pricing:', error);
    throw new Error(error.message || 'Failed to create special pricing');
  }
  
  return result;
}

/**
 * Update a special pricing period
 */
export async function updateSpecialPricing(
  id: number,
  data: UpdateSpecialPricingData
): Promise<SpecialPricing> {
  const supabase = await createClient();
  
  const { data: result, error } = await (supabase as any)
    .from('special_pricing')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating special pricing:', error);
    throw new Error(error.message || 'Failed to update special pricing');
  }
  
  return result;
}

/**
 * Delete a special pricing period
 */
export async function deleteSpecialPricing(id: number): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await (supabase as any)
    .from('special_pricing')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting special pricing:', error);
    throw new Error('Failed to delete special pricing');
  }
}

/**
 * Calculate booking price with special pricing
 */
export async function calculateBookingPrice(
  houseId: number,
  regularPricePerNight: number,
  checkInDate: string,
  checkOutDate: string
): Promise<BookingPriceCalculation> {
  // Get special pricing for the date range
  const specialPricing = await getSpecialPricingForDateRange(
    houseId,
    checkInDate,
    checkOutDate
  );
  
  const priceBreakdown: PriceBreakdown[] = [];
  let totalPrice = 0;
  let regularNights = 0;
  let specialNights = 0;
  let regularPrice = 0;
  let specialPrice = 0;
  
  // Calculate number of nights
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const totalNights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  // Iterate through each night
  for (let i = 0; i < totalNights; i++) {
    const currentDate = new Date(checkIn);
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Check if this date falls within any special pricing period
    const specialPeriod = specialPricing.find(sp => {
      return dateStr >= sp.start_date && dateStr <= sp.end_date;
    });
    
    if (specialPeriod) {
      // Use special pricing
      priceBreakdown.push({
        date: dateStr,
        price: specialPeriod.price_per_night,
        isSpecialPrice: true,
        occasionName: specialPeriod.occasion_name
      });
      totalPrice += specialPeriod.price_per_night;
      specialNights++;
      specialPrice += specialPeriod.price_per_night;
    } else {
      // Use regular pricing
      priceBreakdown.push({
        date: dateStr,
        price: regularPricePerNight,
        isSpecialPrice: false
      });
      totalPrice += regularPricePerNight;
      regularNights++;
      regularPrice += regularPricePerNight;
    }
  }
  
  return {
    regularNights,
    regularPrice,
    specialNights,
    specialPrice,
    totalNights,
    totalPrice,
    priceBreakdown
  };
}

/**
 * Check if dates overlap with existing special pricing
 */
export async function checkSpecialPricingOverlap(
  houseId: number,
  startDate: string,
  endDate: string,
  excludeId?: number
): Promise<boolean> {
  const supabase = await createClient();
  
  let query = (supabase as any)
    .from('special_pricing')
    .select('id')
    .eq('house_id', houseId)
    .or(`and(start_date.lte.${endDate},end_date.gte.${startDate})`);
  
  if (excludeId) {
    query = query.neq('id', excludeId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error checking overlap:', error);
    return false;
  }
  
  return data && data.length > 0;
}
