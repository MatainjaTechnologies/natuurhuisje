export interface Booking {
  id: string;
  house_id: number;
  user_id: string;
  check_in: string;
  check_out: string;
  guests: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  special_requests?: string;
  created_at: string;
  updated_at: string;
  nights?: number;
  subtotal?: number;
  regular_nights?: number;
  regular_nights_total?: number;
  special_nights?: number;
  special_nights_total?: number;
  cleaning_fee?: number;
  service_fee?: number;
  price_breakdown?: {
    date: string;
    price: number;
    isSpecialPricing: boolean;
    occasionName?: string;
  }[];
}

export interface BookingFormData {
  checkIn: string;
  checkOut: string;
  guests: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
}

export interface BookingWithHouse extends Booking {
  house: {
    id: string;
    title: string;
    location: string;
    images: string[];
  };
}

export interface CreateBookingData extends BookingFormData {
  houseId: number;
  totalPrice: number;
  nights?: number;
  subtotal?: number;
  regularNights?: number;
  regularNightsTotal?: number;
  specialNights?: number;
  specialNightsTotal?: number;
  cleaningFee?: number;
  serviceFee?: number;
  priceBreakdown?: {
    date: string;
    price: number;
    isSpecialPricing: boolean;
    occasionName?: string;
  }[];
}

export interface PaginatedBookingsResponse {
  success: boolean;
  data: BookingWithHouse[];
  total: number;
  error?: string;
}
