export interface SpecialPricing {
  id: number;
  house_id: number;
  start_date: string;
  end_date: string;
  price_per_night: number;
  occasion_name?: string;
  description?: string;
  status: 'active' | 'inactive' | 'expired';
  created_at: string;
  updated_at: string;
}

export interface CreateSpecialPricingData {
  house_id: number;
  start_date: string;
  end_date: string;
  price_per_night: number;
  occasion_name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface UpdateSpecialPricingData {
  start_date?: string;
  end_date?: string;
  price_per_night?: number;
  occasion_name?: string;
  description?: string;
  status?: 'active' | 'inactive';
}

export interface PriceBreakdown {
  date: string;
  price: number;
  isSpecialPrice: boolean;
  occasionName?: string;
}

export interface BookingPriceCalculation {
  regularNights: number;
  regularPrice: number;
  specialNights: number;
  specialPrice: number;
  totalNights: number;
  totalPrice: number;
  priceBreakdown: PriceBreakdown[];
}
