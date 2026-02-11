"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar as CalendarIcon, Search, Users, MapPin, Home, Sparkles, Heart, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { format, addDays } from 'date-fns';

interface SearchDockProps {
  variant?: 'hero' | 'compact';
  className?: string;
  defaultLocation?: string;
  defaultGuests?: number;
  defaultPets?: boolean;
  defaultDateRange?: DateRange;
  maxWidth?: string;
}

interface Suggestion {
  id: string;
  name: string;
  type: string;
  icon: string;
}

export function SearchDock({ 
  variant = 'hero',
  className = '',
  defaultLocation = '',
  defaultGuests = 2,
  defaultPets = false,
  defaultDateRange,
  maxWidth = 'max-w-full'
}: SearchDockProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [location, setLocation] = useState(defaultLocation);
  const [guests, setGuests] = useState(defaultGuests);
  const [pets, setPets] = useState(defaultPets);
  const [activeTab, setActiveTab] = useState<'where' | 'dates' | 'people' | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange || {
      from: new Date(),
      to: addDays(new Date(), 7)
    }
  );
  
  // Search suggestions data
  const suggestions = {
    locations: [
      { id: "1", name: "Amsterdam (NL)", type: "city", icon: "map-pin" },
      { id: "2", name: "Veluwe (NL)", type: "city", icon: "map-pin" },
      { id: "3", name: "Belgium", type: "country", icon: "map-pin" }
    ],
    categories: [
      { id: "1", name: "Tiny House", type: "property", icon: "home" },
      { id: "2", name: "Wellness", type: "amenity", icon: "sparkles" },
      { id: "3", name: "Romantic overnight stays", type: "category", icon: "heart" }
    ]
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveTab(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'map-pin': return <MapPin className="h-5 w-5 text-gray-600 shrink-0" />;
      case 'home': return <Home className="h-5 w-5 text-gray-600 shrink-0" />;
      case 'sparkles': return <Sparkles className="h-5 w-5 text-gray-600 shrink-0" />;
      case 'heart': return <Heart className="h-5 w-5 text-gray-600 shrink-0" />;
      default: return <MapPin className="h-5 w-5 text-gray-600 shrink-0" />;
    }
  };
  
  const handleSearch = () => {
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
    <div className={`relative w-full ${maxWidth} mx-auto ${className}`} ref={dropdownRef}>
      {/* Tabbed Search Bar */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="flex items-center">
          {/* Where or what Tab */}
          <button
            onClick={() => setActiveTab(activeTab === 'where' ? null : 'where')}
            className={`flex items-center gap-2.5 px-6 py-3 flex-1 transition-colors ${
              activeTab === 'where' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Search className={`h-5 w-5 shrink-0 ${activeTab === 'where' ? 'text-white' : 'text-gray-500'}`} />
            <span className={`font-medium text-[15px] ${activeTab === 'where' ? 'text-white' : 'text-gray-900'}`}>
              Where or what?
            </span>
          </button>

          {/* Choose dates Tab */}
          <button
            onClick={() => setActiveTab(activeTab === 'dates' ? null : 'dates')}
            className={`flex items-center gap-2.5 px-6 py-3 border-l border-gray-200 transition-colors ${
              activeTab === 'dates' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <CalendarIcon className={`h-5 w-5 shrink-0 ${activeTab === 'dates' ? 'text-white' : 'text-gray-500'}`} />
            <span className={`text-[15px] whitespace-nowrap ${activeTab === 'dates' ? 'text-white' : 'text-gray-900'}`}>
              Choose dates
            </span>
          </button>

          {/* People Tab */}
          <button
            onClick={() => setActiveTab(activeTab === 'people' ? null : 'people')}
            className={`flex items-center gap-2.5 px-6 py-3 border-l border-gray-200 transition-colors ${
              activeTab === 'people' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Users className={`h-5 w-5 shrink-0 ${activeTab === 'people' ? 'text-white' : 'text-gray-500'}`} />
            <span className={`text-[15px] whitespace-nowrap ${activeTab === 'people' ? 'text-white' : 'text-gray-900'}`}>
              People
            </span>
          </button>

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
    </div>
  );
}
