"use client";

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, CheckCircle, Info } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, differenceInDays, addDays } from 'date-fns';
import { BookingPriceCalculation } from '@/types/special-pricing';

interface BookingBoxWithSpecialPricingProps {
  houseId: number;
  pricePerNight: number;
  rating?: number;
  reviewCount?: number;
  availableDates?: {
    start: Date;
    end: Date;
  }[];
}

export function BookingBoxWithSpecialPricing({
  houseId,
  pricePerNight,
  rating,
  reviewCount = 0,
  availableDates = [],
}: BookingBoxWithSpecialPricingProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });
  
  const [guests, setGuests] = useState(2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceCalculation, setPriceCalculation] = useState<BookingPriceCalculation | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  
  // Fetch price calculation when dates change
  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      fetchPriceCalculation();
    }
  }, [dateRange?.from, dateRange?.to, houseId]);

  const fetchPriceCalculation = async () => {
    if (!dateRange?.from || !dateRange?.to) return;

    setIsLoadingPrice(true);
    try {
      const checkIn = format(dateRange.from, 'yyyy-MM-dd');
      const checkOut = format(dateRange.to, 'yyyy-MM-dd');
      
      const response = await fetch(
        `/api/booking-price?house_id=${houseId}&check_in=${checkIn}&check_out=${checkOut}&regular_price=${pricePerNight}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setPriceCalculation(data);
      }
    } catch (error) {
      console.error('Error fetching price calculation:', error);
    } finally {
      setIsLoadingPrice(false);
    }
  };
  
  // Calculate number of nights and total price
  const nights = priceCalculation?.totalNights || 0;
  const subtotal = priceCalculation?.totalPrice || 0;
  const serviceFee = Math.round(subtotal * 0.12); // 12% service fee
  const total = subtotal + serviceFee;
  
  // Format the selected date range for display
  const dateRangeText = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    : 'Select dates';
  
  const handleBooking = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Here we would call a server action to create the booking
    // For now we'll just simulate a delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    alert('Booking successful! (This is a demo)');
  };

  const hasSpecialPricing = priceCalculation && priceCalculation.specialNights > 0;
  
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
      <div className="mb-6">
        <div className="flex justify-between items-baseline">
          <div className="text-neutral-900">
            <span className="text-3xl font-bold">€{pricePerNight}</span>
            <span className="text-neutral-600 text-base font-normal"> / night</span>
          </div>
          
          {rating !== undefined && (
            <div className="text-sm">
              <span className="text-neutral-900 font-semibold">{rating.toFixed(1)}</span>
              <span className="text-neutral-600"> · {reviewCount} reviews</span>
            </div>
          )}
        </div>
        
        {hasSpecialPricing && (
          <div className="mt-2 flex items-center gap-2 text-sm text-purple-600">
            <Info className="h-4 w-4" />
            <span>Special pricing applies to some dates</span>
          </div>
        )}
      </div>
      
      <div className="border border-neutral-300 rounded-lg overflow-hidden mb-4">
        {/* Date selection */}
        <div className="p-4 border-b border-neutral-300">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-neutral-700 mr-3" />
            <button 
              type="button" 
              className="w-full text-left outline-none"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <div className="text-xs text-neutral-600 mb-1">Dates</div>
              <div className="font-medium text-neutral-900">{dateRangeText}</div>
            </button>
          </div>
          
          {isCalendarOpen && (
            <div className="mt-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
              <div className="text-center py-4">
                <p className="text-neutral-600">Calendar picker would go here</p>
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="mt-2 px-4 py-2 bg-white text-neutral-900 rounded-lg hover:bg-neutral-100 border border-neutral-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Guests selection */}
        <div className="p-4">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-neutral-700 mr-3" />
            <div className="flex-1">
              <div className="text-xs text-neutral-600 mb-1">Guests</div>
              <div className="font-medium text-neutral-900">{guests} guests</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-900 disabled:opacity-30 disabled:hover:border-neutral-300 flex items-center justify-center transition-colors"
                disabled={guests <= 1}
                onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
              >
                <span className="text-neutral-900">−</span>
              </button>
              <span className="w-8 text-center font-medium">{guests}</span>
              <button
                type="button"
                className="w-8 h-8 rounded-full border border-neutral-300 hover:border-neutral-900 flex items-center justify-center transition-colors"
                onClick={() => setGuests((prev) => prev + 1)}
              >
                <span className="text-neutral-900">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        className={`w-full py-3.5 px-6 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center ${
          isSubmitting || nights === 0 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isSubmitting || nights === 0}
        onClick={handleBooking}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          'Reserve'
        )}
      </button>
      
      <div className="mt-6 space-y-3 text-neutral-700">
        {isLoadingPrice ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-900 mx-auto"></div>
          </div>
        ) : priceCalculation ? (
          <>
            {hasSpecialPricing && (
              <button
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="w-full text-left text-sm text-purple-600 hover:text-purple-700 underline mb-2"
              >
                {showPriceBreakdown ? 'Hide' : 'Show'} daily price breakdown
              </button>
            )}
            
            {showPriceBreakdown && hasSpecialPricing && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200 max-h-48 overflow-y-auto">
                <div className="space-y-2 text-xs">
                  {priceCalculation.priceBreakdown.map((day, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-700">
                          {format(new Date(day.date), 'MMM d, yyyy')}
                        </span>
                        {day.isSpecialPrice && day.occasionName && (
                          <span className="px-2 py-0.5 bg-purple-200 text-purple-800 rounded-full text-xs">
                            {day.occasionName}
                          </span>
                        )}
                      </div>
                      <span className={day.isSpecialPrice ? 'font-semibold text-purple-700' : 'text-neutral-700'}>
                        €{day.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {priceCalculation.regularNights > 0 && (
              <div className="flex justify-between text-sm">
                <div className="underline">€{pricePerNight} x {priceCalculation.regularNights} nights</div>
                <div>€{priceCalculation.regularPrice}</div>
              </div>
            )}
            
            {priceCalculation.specialNights > 0 && (
              <div className="flex justify-between text-sm">
                <div className="underline text-purple-600">
                  Special pricing x {priceCalculation.specialNights} nights
                </div>
                <div className="text-purple-600 font-medium">€{priceCalculation.specialPrice}</div>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <div className="underline">Service fee</div>
              <div>€{serviceFee}</div>
            </div>
            <div className="border-t border-neutral-200 pt-3"></div>
            <div className="flex justify-between font-semibold text-neutral-900">
              <div>Total</div>
              <div>€{total}</div>
            </div>
          </>
        ) : (
          <div className="flex justify-between text-sm">
            <div>Select dates to see pricing</div>
          </div>
        )}
      </div>
      
      <div className="mt-5 text-sm text-neutral-600 text-center flex items-center justify-center gap-2">
        <CheckCircle className="h-4 w-4" />
        <span>You won't be charged yet</span>
      </div>
    </div>
  );
}
