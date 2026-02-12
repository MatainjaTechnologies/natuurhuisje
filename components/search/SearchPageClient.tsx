"use client";

import { useState } from 'react';
import { ListingCard } from '@/components/ListingCard';
import { MapModal } from './MapModal';
import { Map } from 'lucide-react';

interface SearchPageClientProps {
  listings: any[];
  error: any;
  location?: string;
}

export function SearchPageClient({ listings, error, location }: SearchPageClientProps) {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(15);

  const displayedListings = listings.slice(0, displayCount);
  const hasMore = listings.length > displayCount;

  const handleShowMore = () => {
    setDisplayCount(prev => Math.min(prev + 15, listings.length));
  };

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-neutral-900">
          {listings?.length || 0} {listings?.length === 1 ? 'stay' : 'stays'} found
          {location && ` in ${location}`}
        </h1>
        
        <button
          onClick={() => setIsMapOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border border-neutral-900 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
        >
          <Map size={20} />
          <span className="hidden sm:inline">Map</span>
        </button>
      </div>
      
      {error && (
        <div className="bg-rose-50 text-rose-700 p-4 rounded-md mb-6">
          An error occurred while fetching listings. Please try again.
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {displayedListings && displayedListings.length > 0 ? (
          displayedListings.map((listing) => (
            <ListingCard
              key={listing.id}
              id={listing.id}
              slug={listing.slug}
              title={listing.title}
              location={listing.location}
              images={listing.images}
              pricePerNight={listing.price_per_night}
              rating={listing.avg_rating}
            />
          ))
        ) : !error ? (
          <div className="col-span-full text-center py-12">
            <h2 className="text-xl font-medium text-neutral-700 mb-2">No listings found</h2>
            <p className="text-neutral-600">
              Try adjusting your search filters or exploring a different location.
            </p>
          </div>
        ) : null}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={handleShowMore}
            className="px-8 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:bg-teal-600 transition-colors inline-flex items-center gap-2"
          >
            <span>More results</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        listings={listings}
      />
    </>
  );
}
