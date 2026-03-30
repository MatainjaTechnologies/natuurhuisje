'use client';

import { useState } from 'react';
import { Building, ChevronRight, AlertCircle, Home } from 'lucide-react';
import SpecialPricingManager from './SpecialPricingManager';

interface Property {
  id: number;
  accommodation_name: string;
  price_per_night: number;
  location: string;
  status: string;
  image_url?: string;
  house_images?: {
    image_url: string;
    sort_order: number;
  }[];
}

interface SpecialPricingSelectorProps {
  properties: Property[];
}

export default function SpecialPricingSelector({ properties }: SpecialPricingSelectorProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Helper function to get the first image from house_images
  const getPropertyImage = (property: Property) => {
    if (property.house_images && property.house_images.length > 0) {
      const sortedImages = [...property.house_images].sort((a, b) => a.sort_order - b.sort_order);
      return sortedImages[0].image_url;
    }
    return property.image_url;
  };

  if (selectedProperty) {
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How Special Pricing Works</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Set different prices for specific date ranges</li>
              <li>Perfect for holidays, weekends, or peak seasons</li>
              <li>Guests will see the adjusted price automatically when booking</li>
              <li>Date ranges cannot overlap for the same property</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
            <button
              onClick={() => setSelectedProperty(null)}
              className="flex items-center gap-2 text-purple-100 hover:text-white mb-3 transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              <span className="text-sm">Back to properties</span>
            </button>
            <div className="flex items-start gap-4">
              {getPropertyImage(selectedProperty) && (
                <img
                  src={getPropertyImage(selectedProperty)}
                  alt={selectedProperty.accommodation_name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{selectedProperty.accommodation_name}</h2>
                <p className="text-purple-100 mt-1">{selectedProperty.location}</p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-sm">
                    Regular Price: <span className="font-semibold">€{selectedProperty.price_per_night}/night</span>
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedProperty.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedProperty.status === 'active' ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <SpecialPricingManager
              houseId={selectedProperty.id}
              regularPrice={selectedProperty.price_per_night}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-medium">Select a property to manage special pricing</p>
          <p className="text-blue-700 mt-1">
            Choose which property you want to set different prices for holidays, weekends, or peak seasons
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties.map((property) => (
          <button
            key={property.id}
            onClick={() => setSelectedProperty(property)}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg hover:border-purple-300 transition-all text-left group"
          >
            {getPropertyImage(property) ? (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={getPropertyImage(property)}
                  alt={property.accommodation_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-white font-semibold text-lg line-clamp-1">
                    {property.accommodation_name}
                  </h3>
                </div>
              </div>
            ) : (
              <div className="h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Home className="h-16 w-16 text-purple-400" />
              </div>
            )}

            <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-sm text-gray-600 line-clamp-1">{property.location}</p>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                    property.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {property.status === 'active' ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Regular Price</p>
                  <p className="text-lg font-bold text-gray-900">
                    €{property.price_per_night}
                    <span className="text-sm font-normal text-gray-600">/night</span>
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-purple-600 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
