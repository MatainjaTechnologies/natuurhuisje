"use client";

import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Filter {
  id: string;
  label: string;
  isActive: boolean;
  value: string;
}

interface FilterGroupProps {
  filters: Filter[];
  onToggle: (filterId: string) => void;
}

interface FiltersPanelProps {
  className?: string;
}

const FilterGroup = ({ filters, onToggle }: FilterGroupProps) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onToggle(filter.id)}
          className={`px-4 py-2 rounded-full text-sm transition-colors ${
            filter.isActive
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export function FiltersPanel({ className = '' }: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Read active filters from URL
  const filtersParam = searchParams.get('filters');
  const activeFilters = filtersParam ? filtersParam.split(',') : [];

  // Property types
  const propertyTypes = [
    { id: 'cabin', label: 'Cabins', value: 'cabin' },
    { id: 'treehouse', label: 'Treehouses', value: 'treehouse' },
    { id: 'tiny-house', label: 'Tiny Houses', value: 'tiny-house' },
    { id: 'glamping', label: 'Glamping', value: 'glamping' },
    { id: 'farm', label: 'Farm Stays', value: 'farm' },
  ].map(type => ({
    ...type,
    isActive: activeFilters.includes(type.id)
  }));

  // Amenities
  const amenities = [
    { id: 'wifi', label: 'WiFi', value: 'wifi' },
    { id: 'pets', label: 'Pets Allowed', value: 'pets' },
    { id: 'fireplace', label: 'Fireplace', value: 'fireplace' },
    { id: 'pool', label: 'Pool', value: 'pool' },
    { id: 'hot-tub', label: 'Hot Tub', value: 'hot-tub' },
    { id: 'bbq', label: 'BBQ', value: 'bbq' },
  ].map(amenity => ({
    ...amenity,
    isActive: activeFilters.includes(amenity.id)
  }));

  // Features
  const features = [
    { id: 'lake', label: 'Lake Access', value: 'lake' },
    { id: 'mountain-view', label: 'Mountain Views', value: 'mountain-view' },
    { id: 'beachfront', label: 'Beachfront', value: 'beachfront' },
    { id: 'secluded', label: 'Secluded', value: 'secluded' },
    { id: 'forest', label: 'Forest', value: 'forest' },
  ].map(feature => ({
    ...feature,
    isActive: activeFilters.includes(feature.id)
  }));

  const toggleFilter = (filterId: string) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    // Update URL query params
    const params = new URLSearchParams(searchParams.toString());
    
    if (newFilters.length > 0) {
      params.set('filters', newFilters.join(','));
    } else {
      params.delete('filters');
    }
    
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('filters');
    router.push(`/search?${params.toString()}`);
  };
  
  // Get all active filters for the chips at the top
  const allFilters = [...propertyTypes, ...amenities, ...features];
  const activeFilterObjects = allFilters.filter(filter => activeFilters.includes(filter.id));

  return (
    <div className={`${className} bg-white rounded-xl p-6 shadow-md`}>
      {/* Active filters chips */}
      {activeFilterObjects.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Active Filters</h3>
          <div className="flex flex-wrap gap-2">
            {activeFilterObjects.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm"
              >
                <span>{filter.label}</span>
                <button 
                  onClick={() => toggleFilter(filter.id)}
                  className="p-0.5 rounded-full hover:bg-green-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-900 underline"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Property Types */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-800 mb-3">Property Types</h3>
        <FilterGroup filters={propertyTypes} onToggle={toggleFilter} />
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-800 mb-3">Amenities</h3>
        <FilterGroup filters={amenities} onToggle={toggleFilter} />
      </div>

      {/* Features */}
      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-3">Features</h3>
        <FilterGroup filters={features} onToggle={toggleFilter} />
      </div>
    </div>
  );
}
