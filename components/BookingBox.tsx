"use client";

import { useState } from 'react';
import { Calendar as CalendarIcon, Users, CheckCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, differenceInDays, addDays } from 'date-fns';

interface BookingBoxProps {
  pricePerNight: number;
  rating?: number;
  reviewCount?: number;
  availableDates?: {
    start: Date;
    end: Date;
  }[];
}

export function BookingBox({
  pricePerNight,
  rating,
  reviewCount = 0,
  availableDates = [],
}: BookingBoxProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });
  
  const [guests, setGuests] = useState(2);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate number of nights and total price
  const nights = dateRange?.from && dateRange?.to
    ? differenceInDays(dateRange.to, dateRange.from)
    : 0;
    
  const subtotal = pricePerNight * nights;
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
        <div className="flex justify-between text-sm">
          <div className="underline">€{pricePerNight} x {nights} nights</div>
          <div>€{subtotal}</div>
        </div>
        <div className="flex justify-between text-sm">
          <div className="underline">Service fee</div>
          <div>€{serviceFee}</div>
        </div>
        <div className="border-t border-neutral-200 pt-3"></div>
        <div className="flex justify-between font-semibold text-neutral-900">
          <div>Total</div>
          <div>€{total}</div>
        </div>
      </div>
      
      <div className="mt-5 text-sm text-neutral-600 text-center flex items-center justify-center gap-2">
        <CheckCircle className="h-4 w-4" />
        <span>You won't be charged yet</span>
      </div>
    </div>
  );
}
