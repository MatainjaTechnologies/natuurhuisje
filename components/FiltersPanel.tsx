"use client";

import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Search } from 'lucide-react';
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
    <div className="space-y-3">
      {filters.map((filter) => (
        <label key={filter.id} className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.isActive}
            onChange={() => onToggle(filter.id)}
            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
          />
          <span className="text-sm text-gray-700 font-medium">{filter.label}</span>
        </label>
      ))}
    </div>
  );
};

export function FiltersPanel({ className = '' }: FiltersPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [expandedSections, setExpandedSections] = useState({
    propertyType: true,
    amenities: true,
    priceRange: true,
    rooms: true,
    features: false,
    accessibility: false,
  });
  
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

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Get all active filters for the chips at the top
  const allFilters = [...propertyTypes, ...amenities, ...features];
  const activeFilterObjects = allFilters.filter(filter => activeFilters.includes(filter.id));

  return (
    <div className={`${className} bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          {activeFilterObjects.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all
            </button>
          )}
        </div>
        
        {/* Active filters chips */}
        {activeFilterObjects.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilterObjects.map((filter) => (
              <div
                key={filter.id}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-sm"
              >
                <span>{filter.label}</span>
                <button 
                  onClick={() => toggleFilter(filter.id)}
                  className="p-0.5 rounded-full hover:bg-blue-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Property Type */}
        <div>
          <button
            onClick={() => toggleSection('propertyType')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Property Type</h3>
            {expandedSections.propertyType ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedSections.propertyType && (
            <div className="mt-3">
              <FilterGroup filters={propertyTypes} onToggle={toggleFilter} />
            </div>
          )}
        </div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('priceRange')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
            {expandedSections.priceRange ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedSections.priceRange && (
            <div className="mt-3 space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: parseInt(e.target.value) || 500 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="text-xs text-gray-500">€{priceRange.min} - €{priceRange.max} per night</div>
            </div>
          )}
        </div>

        {/* Amenities */}
        <div>
          <button
            onClick={() => toggleSection('amenities')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Amenities</h3>
            {expandedSections.amenities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedSections.amenities && (
            <div className="mt-3">
              <FilterGroup filters={amenities} onToggle={toggleFilter} />
            </div>
          )}
        </div>

        {/* Rooms */}
        <div>
          <button
            onClick={() => toggleSection('rooms')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Rooms and Beds</h3>
            {expandedSections.rooms ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedSections.rooms && (
            <div className="mt-3 space-y-4">
              <div>
                <label className="text-xs text-gray-600">Bedrooms</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Any</option>
                  <option>1+</option>
                  <option>2+</option>
                  <option>3+</option>
                  <option>4+</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600">Bathrooms</label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>Any</option>
                  <option>1+</option>
                  <option>2+</option>
                  <option>3+</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Features */}
        <div>
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="text-sm font-medium text-gray-900">Features</h3>
            {expandedSections.features ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {expandedSections.features && (
            <div className="mt-3">
              <FilterGroup filters={features} onToggle={toggleFilter} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
