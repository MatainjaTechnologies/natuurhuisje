"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Search, Users, PawPrint, MapPin } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';

interface SearchDockProps {
  variant?: 'hero' | 'compact';
  className?: string;
  defaultLocation?: string;
  defaultGuests?: number;
  defaultPets?: boolean;
  defaultDateRange?: DateRange;
}

export function SearchDock({ 
  variant = 'hero',
  className = '',
  defaultLocation = '',
  defaultGuests = 2,
  defaultPets = false,
  defaultDateRange
}: SearchDockProps) {
  const router = useRouter();
  
  const [location, setLocation] = useState(defaultLocation);
  const [guests, setGuests] = useState(defaultGuests);
  const [pets, setPets] = useState(defaultPets);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange || {
      from: new Date(),
      to: addDays(new Date(), 7)
    }
  );
  
  // This will be used for displaying the selected date range
  const dateRangeText = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`
    : 'Select dates';
  
  const handleSearch = () => {
    // Build search params
    const searchParams = new URLSearchParams();
    
    if (location) {
      searchParams.set('location', location);
    }
    
    if (dateRange?.from) {
      searchParams.set('checkin', format(dateRange.from, 'yyyy-MM-dd'));
    }
    
    if (dateRange?.to) {
      searchParams.set('checkout', format(dateRange.to, 'yyyy-MM-dd'));
    }
    
    if (guests > 0) {
      searchParams.set('guests', guests.toString());
    }
    
    if (pets) {
      searchParams.set('pets', 'true');
    }
    
    router.push(`/search?${searchParams.toString()}`);
  };
  
  return (
    <div className={`bg-white rounded-2xl shadow-2xl shadow-black/10 ${variant === 'hero' ? 'p-5 md:p-6' : 'p-4'} ${className}`}>
      <div className={`flex ${variant === 'hero' ? 'flex-col lg:flex-row gap-3' : 'flex-col gap-3'}`}>
        {/* Location */}
        <div className="flex-1 flex items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors group">
          <MapPin className="h-5 w-5 text-purple-600 mr-3 shrink-0" />
          <div className="flex-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">Location</label>
            <input 
              type="text" 
              placeholder="Where to?" 
              className="w-full outline-none bg-transparent text-gray-900 text-sm font-medium placeholder:text-gray-400"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        
        {/* Date Range */}
        <div className="flex-1 flex items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors group">
          <CalendarIcon className="h-5 w-5 text-purple-600 mr-3 shrink-0" />
          <div className="flex-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">Dates</label>
            <button 
              type="button" 
              className="w-full text-left outline-none bg-transparent text-gray-900 text-sm font-medium"
            >
              {dateRangeText}
            </button>
          </div>
        </div>
        
        {/* Guests */}
        <div className="flex-1 flex items-center bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors group">
          <Users className="h-5 w-5 text-purple-600 mr-3 shrink-0" />
          <div className="flex-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block">Guests</label>
            <div className="flex justify-between items-center">
              <span className="text-gray-900 text-sm font-medium">{guests} {guests === 1 ? 'guest' : 'guests'}</span>
              <div className="flex items-center gap-1">
                <button 
                  type="button" 
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 text-sm font-medium disabled:opacity-30 transition-colors"
                  disabled={guests <= 1}
                  onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                >
                  −
                </button>
                <button 
                  type="button"
                  className="w-7 h-7 rounded-lg bg-white border border-gray-200 hover:border-gray-400 flex items-center justify-center text-gray-600 text-sm font-medium transition-colors"
                  onClick={() => setGuests((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button 
            type="button"
            className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl transition-all ${
              pets 
                ? 'border-purple-500 bg-purple-50 text-purple-700' 
                : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
            }`}
            onClick={() => setPets(!pets)}
          >
            <PawPrint className="h-4 w-4" />
            <span className={`text-sm font-medium ${variant === 'compact' ? 'hidden sm:inline-block' : ''}`}>
              Pets
            </span>
          </button>
          
          <button
            onClick={handleSearch}
            className={`${variant === 'hero' ? 'py-3.5 px-7' : 'py-2.5 px-5'} flex items-center gap-2 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-0.5`}
            style={{ background: 'linear-gradient(135deg, #7B3FA0, #5B2D8E)' }}
          >
            <Search className="h-4 w-4" />
            <span className={variant === 'compact' ? 'hidden sm:inline-block' : ''}>
              Search
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
