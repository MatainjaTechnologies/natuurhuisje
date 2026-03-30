interface SpecialPricing {
  start_date: string;
  end_date: string;
  price_per_night: number;
  occasion_name?: string;
}

interface PricingCalculation {
  nights: number;
  subtotal: number;
  regularPrice: number;
  specialPricingApplied: boolean;
  priceBreakdown: {
    date: string;
    price: number;
    isSpecialPricing: boolean;
    occasionName?: string;
  }[];
}

/**
 * Calculate the total price for a booking, considering special pricing
 */
export function calculateBookingPrice(
  checkIn: string,
  checkOut: string,
  regularPricePerNight: number,
  specialPricings: SpecialPricing[] = []
): PricingCalculation {
  if (!checkIn || !checkOut) {
    return {
      nights: 0,
      subtotal: 0,
      regularPrice: regularPricePerNight,
      specialPricingApplied: false,
      priceBreakdown: []
    };
  }

  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);

  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return {
      nights: 0,
      subtotal: 0,
      regularPrice: regularPricePerNight,
      specialPricingApplied: false,
      priceBreakdown: []
    };
  }

  const priceBreakdown: PricingCalculation['priceBreakdown'] = [];
  let totalPrice = 0;
  let hasSpecialPricing = false;

  // Iterate through each night
  const currentDate = new Date(startDate);
  while (currentDate < endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    
    // Check if this date has special pricing
    const specialPricing = specialPricings.find(sp => {
      const spStart = new Date(sp.start_date);
      const spEnd = new Date(sp.end_date);
      return currentDate >= spStart && currentDate <= spEnd;
    });

    if (specialPricing) {
      priceBreakdown.push({
        date: dateStr,
        price: specialPricing.price_per_night,
        isSpecialPricing: true,
        occasionName: specialPricing.occasion_name
      });
      totalPrice += specialPricing.price_per_night;
      hasSpecialPricing = true;
    } else {
      priceBreakdown.push({
        date: dateStr,
        price: regularPricePerNight,
        isSpecialPricing: false
      });
      totalPrice += regularPricePerNight;
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    nights: priceBreakdown.length,
    subtotal: totalPrice,
    regularPrice: regularPricePerNight,
    specialPricingApplied: hasSpecialPricing,
    priceBreakdown
  };
}

/**
 * Get the price range for a property considering special pricing
 */
export function getPriceRange(
  regularPrice: number,
  specialPricings: SpecialPricing[] = []
): { min: number; max: number; hasSpecialPricing: boolean } {
  if (!specialPricings || specialPricings.length === 0) {
    return {
      min: regularPrice,
      max: regularPrice,
      hasSpecialPricing: false
    };
  }

  const allPrices = [regularPrice, ...specialPricings.map(sp => sp.price_per_night)];
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);

  return {
    min,
    max,
    hasSpecialPricing: true // Always true if special pricing records exist
  };
}

/**
 * Calculate number of nights between two dates
 */
export function calculateNights(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  
  // Validate dates
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return 0;
  
  // Calculate difference in milliseconds and convert to days
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
}
