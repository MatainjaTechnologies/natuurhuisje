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
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 ${className}`}>
      <div className="flex items-center">
        {/* Search Destination */}
        <div className="flex items-center gap-2.5 px-6 py-4 flex-1 border-r border-gray-200">
          <MapPin className="h-5 w-5 text-gray-500 shrink-0" />
          <input 
            type="text" 
            placeholder="Where or what?" 
            className="w-full outline-none bg-transparent text-gray-900 text-[15px] placeholder:text-gray-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        
        {/* Check-in */}
        <div className="flex items-center gap-2.5 px-6 py-4 border-r border-gray-200 cursor-pointer hover:bg-gray-50">
          <CalendarIcon className="h-5 w-5 text-gray-500 shrink-0" />
          <span className="text-gray-900 text-[15px] whitespace-nowrap">
            Choose dates
          </span>
        </div>
        
        {/* Guests */}
        <div className="flex items-center gap-2.5 px-6 py-4 cursor-pointer hover:bg-gray-50">
          <Users className="h-5 w-5 text-gray-500 shrink-0" />
          <span className="text-gray-900 text-[15px] whitespace-nowrap">
            Guests
          </span>
        </div>
        
        {/* Search Button */}
        <div className="px-4 py-3">
          <button
            onClick={handleSearch}
            className="px-8 py-3 rounded-lg text-white font-semibold text-[15px] transition-all hover:shadow-lg whitespace-nowrap"
            style={{ background: '#10b981' }}
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
