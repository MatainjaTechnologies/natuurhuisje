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
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-border sticky top-24">
      <div className="mb-6">
        <div className="flex justify-between items-baseline">
          <div className="text-forest-900">
            <span className="text-xl font-semibold">€{pricePerNight}</span>
            <span className="text-forest-600"> / night</span>
          </div>
          
          {rating !== undefined && (
            <div className="text-sm">
              <span className="text-forest-800 font-medium">{rating.toFixed(1)}</span>
              <span className="text-forest-600"> · {reviewCount} reviews</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="border border-border rounded-xl overflow-hidden mb-4">
        {/* Date selection */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-forest-800 mr-2" />
            <button 
              type="button" 
              className="w-full text-left outline-none"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <div className="text-sm text-forest-600">Dates</div>
              <div className="font-medium text-forest-900">{dateRangeText}</div>
            </button>
          </div>
          
          {isCalendarOpen && (
            <div className="mt-2 p-2 bg-white rounded-lg border border-border">
              {/* Here we would render the actual calendar picker component */}
              <div className="text-center py-4">
                <p className="text-forest-600">Calendar picker would go here</p>
                <button
                  onClick={() => setIsCalendarOpen(false)}
                  className="mt-2 px-4 py-2 bg-forest-100 text-forest-800 rounded-lg hover:bg-forest-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Guests selection */}
        <div className="p-3">
          <div className="flex items-center">
            <Users className="h-5 w-5 text-forest-800 mr-2" />
            <div className="flex-1">
              <div className="text-sm text-forest-600">Guests</div>
              <div className="font-medium text-forest-900">{guests} guests</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-forest-100 disabled:opacity-50"
                disabled={guests <= 1}
                onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
              >
                <span className="w-5 h-5 flex items-center justify-center">-</span>
              </button>
              <span className="w-6 text-center">{guests}</span>
              <button
                type="button"
                className="p-1 rounded-full hover:bg-forest-100"
                onClick={() => setGuests((prev) => prev + 1)}
              >
                <span className="w-5 h-5 flex items-center justify-center">+</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <button
        type="button"
        className={`w-full btn-primary flex items-center justify-center ${
          isSubmitting ? 'opacity-70' : ''
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
          'Book Now'
        )}
      </button>
      
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <div>€{pricePerNight} x {nights} nights</div>
          <div>€{subtotal}</div>
        </div>
        <div className="flex justify-between mb-2">
          <div>Service fee</div>
          <div>€{serviceFee}</div>
        </div>
        <div className="border-t border-border my-3"></div>
        <div className="flex justify-between font-semibold">
          <div>Total</div>
          <div>€{total}</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-forest-600 flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-forest-700" />
        <span>You won't be charged yet</span>
      </div>
    </div>
  );
}
