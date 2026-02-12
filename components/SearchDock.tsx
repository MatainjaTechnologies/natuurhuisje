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
  height?: string;
  initialTab?: 'where' | 'dates' | 'people' | null;
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
  maxWidth = 'max-w-full',
  height = 'py-3',
  initialTab = null
}: SearchDockProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [location, setLocation] = useState(defaultLocation);
  const [guests, setGuests] = useState(defaultGuests);
  const [pets, setPets] = useState(defaultPets);
  const [activeTab, setActiveTab] = useState<'where' | 'dates' | 'people' | null>(initialTab);
  const [dateSelectionType, setDateSelectionType] = useState<'arrival' | 'departure'>('arrival');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    defaultDateRange || {
      from: new Date(),
      to: addDays(new Date(), 7)
    }
  );
  
  // Search suggestions data
  const [suggestions, setSuggestions] = useState<{
    locations: Suggestion[];
    categories: Suggestion[];
  }>({
    locations: [],
    categories: []
  });

  // Load search options from JSON
  useEffect(() => {
    console.log('Fetching search options...');
    fetch('/data/search-options.json')
      .then(response => {
        console.log('Response status:', response.status);
        return response.json();
      })
      .then(data => {
        console.log('Loaded search options:', data);
        setSuggestions({
          locations: data.locations || [],
          categories: data.categories || []
        });
        console.log('Suggestions set:', { locations: data.locations?.length, categories: data.categories?.length });
      })
      .catch(error => {
        console.error('Error loading search options:', error);
      });
  }, []);

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
      <div className="relative bg-white rounded-xl shadow-md overflow-visible">
        <div className="flex items-center overflow-hidden rounded-xl">
          {/* Where or what Tab */}
          <button
            onClick={() => setActiveTab(activeTab === 'where' ? null : 'where')}
            className={`flex items-center gap-2.5 px-6 ${height} flex-1 transition-colors rounded-l-xl ${
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
            className={`flex items-center gap-2.5 px-6 ${height} border-l border-gray-200 transition-colors ${
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
            className={`flex items-center gap-2.5 px-6 ${height} border-l border-gray-200 transition-colors ${
              activeTab === 'people' ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            <Users className={`h-5 w-5 shrink-0 ${activeTab === 'people' ? 'text-white' : 'text-gray-500'}`} />
            <span className={`text-[15px] whitespace-nowrap ${activeTab === 'people' ? 'text-white' : 'text-gray-900'}`}>
              People
            </span>
          </button>

          {/* Search Button */}
          <div className={`px-4 ${height}`}>
            <button
              onClick={handleSearch}
              className="px-8 py-3 rounded-lg text-white font-semibold text-[15px] transition-all hover:shadow-lg whitespace-nowrap"
              style={{ background: '#10b981' }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Where Dropdown */}
        {activeTab === 'where' && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200 w-[500px] z-50 max-h-[500px] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search where or what</h3>
              <button
                onClick={() => setActiveTab(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="For example Amsterdam, Tiny House"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Suggestions */}
            <div className="space-y-1 max-h-[300px] overflow-y-auto">
              {suggestions.locations.length === 0 && suggestions.categories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Loading suggestions...
                </div>
              ) : (
                <>
                  {/* Location Suggestions */}
                  {suggestions.locations.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setLocation(item.name);
                        setActiveTab(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <MapPin className="h-5 w-5 text-gray-600 shrink-0" />
                      <span className="text-gray-900 font-medium">{item.name}</span>
                    </button>
                  ))}

                  {/* Category Suggestions */}
                  {suggestions.categories.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setLocation(item.name);
                        setActiveTab(null);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      {getIcon(item.icon)}
                      <span className="text-gray-900 font-medium">{item.name}</span>
                    </button>
                  ))}
                </>
              )}
            </div>

            {/* View All Link */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="text-blue-600 font-semibold hover:text-blue-700 transition-colors flex items-center gap-2">
                View all
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Dates Dropdown */}
        {activeTab === 'dates' && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200 w-[800px] z-50 max-h-[600px] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {dateSelectionType === 'arrival' ? 'Select arrival date' : 'Select departure date'}
                </h3>
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Arrival/Departure Tabs */}
              <div className="flex gap-2 mb-6">
                <button 
                  onClick={() => setDateSelectionType('arrival')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    dateSelectionType === 'arrival' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>Choose date</span>
                  {dateSelectionType === 'arrival' && <span className="text-xs opacity-80">→</span>}
                </button>
                <button 
                  onClick={() => setDateSelectionType('departure')}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors ${
                    dateSelectionType === 'departure' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>Choose date</span>
                  {dateSelectionType === 'departure' && <span className="text-xs opacity-80">→</span>}
                </button>
              </div>

              {/* Dual Calendar */}
              <div className="grid grid-cols-2 gap-8">
                {/* February 2026 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">February 2026</h4>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {/* Empty cells for alignment */}
                    {[...Array(5)].map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square" />
                    ))}
                    {/* February dates */}
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => (
                      <button
                        key={date}
                        className="aspect-square flex items-center justify-center text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>

                {/* March 2026 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">March 2026</h4>
                    <button className="p-1 hover:bg-gray-100 rounded-lg">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {/* Day headers */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                    {/* Empty cells for alignment */}
                    {[...Array(5)].map((_, i) => (
                      <div key={`empty-mar-${i}`} className="aspect-square" />
                    ))}
                    {/* March dates */}
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
                      <button
                        key={date}
                        className="aspect-square flex items-center justify-center text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-900"
                      >
                        {date}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setActiveTab(null)}
                  className="text-gray-600 font-medium hover:text-gray-800 transition-colors text-sm"
                >
                  Skip
                </button>
                <button className="px-6 py-2.5 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition-colors text-sm">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}

        {/* People Dropdown */}
        {activeTab === 'people' && (
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200 w-[400px] z-50 max-h-[500px] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Select number of persons</h3>
                <button
                  onClick={() => setActiveTab(null)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* People Options */}
              <div className="space-y-2 max-h-[350px] overflow-y-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setGuests(num);
                      setActiveTab(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      guests === num 
                        ? 'bg-blue-50 border-2 border-blue-600' 
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <Users className="h-5 w-5 text-gray-600 shrink-0" />
                    <span className="text-gray-900 font-medium">
                      {num} {num === 1 ? 'person' : 'people'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
