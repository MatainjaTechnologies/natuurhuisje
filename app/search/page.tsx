import { SearchDock } from '@/components/SearchDock';
import { FiltersPanel } from '@/components/FiltersPanel';
import { ListingCard } from '@/components/ListingCard';
import { MapModal } from '@/components/search/MapModal';
import { PromotionalBanner } from '@/components/search/PromotionalBanner';
import { AdditionalSections } from '@/components/search/AdditionalSections';
import { SearchPageClient } from '@/components/search/SearchPageClient';
import { promises as fs } from 'fs';
import path from 'path';
import UnoptimizedImage from '@/components/UnoptimizedImage';

// Revalidate the data every 3600 seconds (1 hour)
export const revalidate = 3600;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    location?: string;
    checkin?: string;
    checkout?: string;
    guests?: string;
    pets?: string;
    filters?: string;
  }>;
}) {
  const params = await searchParams;
  
  // Extract search parameters
  const location = params.location;
  const checkinDate = params.checkin ? new Date(params.checkin) : undefined;
  const checkoutDate = params.checkout ? new Date(params.checkout) : undefined;
  const guests = params.guests ? parseInt(params.guests) : undefined;
  const petsAllowed = params.pets === 'true';
  const filtersParam = params.filters;
  
  // Load data from JSON file (same as stay page)
  const filePath = path.join(process.cwd(), 'public', 'data', 'listings.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents);
  let listings = data.featuredListings;
  
  // Apply filters if provided
  if (filtersParam) {
    const activeFilters = filtersParam.split(',');
    
    // Filter by property types
    const propertyTypeFilters = ['cabin', 'treehouse', 'tiny-house', 'glamping', 'farm'];
    const selectedPropertyTypes = activeFilters.filter(f => propertyTypeFilters.includes(f));
    
    if (selectedPropertyTypes.length > 0) {
      listings = listings.filter((listing: any) => {
        const title = listing.title.toLowerCase();
        return selectedPropertyTypes.some(type => 
          title.includes(type.replace('-', ' ')) || 
          title.includes(type.replace('-', ''))
        );
      });
    }
    
    // Filter by amenities
    const amenityFilters = ['wifi', 'pets', 'fireplace', 'pool', 'hot-tub', 'bbq'];
    const selectedAmenities = activeFilters.filter(f => amenityFilters.includes(f));
    
    if (selectedAmenities.length > 0) {
      // For now, just filter by pets since we don't have amenities data in JSON
      if (selectedAmenities.includes('pets')) {
        listings = listings.filter((listing: any) => 
          listing.title.toLowerCase().includes('pet') || 
          listing.title.toLowerCase().includes('animal')
        );
      }
    }
    
    // Filter by features
    const featureFilters = ['lake', 'mountain-view', 'beachfront', 'secluded', 'forest'];
    const selectedFeatures = activeFilters.filter(f => featureFilters.includes(f));
    
    if (selectedFeatures.length > 0) {
      listings = listings.filter((listing: any) => {
        const title = listing.title.toLowerCase();
        const location = listing.location.toLowerCase();
        return selectedFeatures.some(feature => 
          title.includes(feature.replace('-', ' ')) || 
          location.includes(feature.replace('-', ' '))
        );
      });
    }
  }
  
  // Filter by location if provided
  if (location) {
    listings = listings.filter((listing: any) => 
      listing.location.toLowerCase().includes(location.toLowerCase())
    );
  }
  
  // Only show published listings
  listings = listings.filter((listing: any) => listing.is_published);
  
  const error = null; // No error when using JSON data
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search header with background image */}
      <section className="relative bg-white border-b border-neutral-200 shadow-sm h-[250px] group">
        <div className="absolute inset-0 overflow-hidden">
          <UnoptimizedImage
            src="/images/pexels-justin-wolfert.jpg"
            alt="Search background"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="w-full max-w-4xl px-4 md:px-6 lg:px-8">
            <SearchDock 
              variant="compact" 
              defaultLocation={location}
              defaultGuests={guests}
              defaultPets={petsAllowed}
              defaultDateRange={
                checkinDate && checkoutDate 
                  ? { from: checkinDate, to: checkoutDate } 
                  : undefined
              }
            />
          </div>
        </div>
      </section>
      
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full lg:w-1/4">
            <FiltersPanel className="sticky top-24" />
          </div>
          
          {/* Listings grid */}
          <div className="flex-1">
            <SearchPageClient
              listings={listings || []}
              error={error}
              location={location}
            />
          </div>
        </div>
      </div>

      {/* Promotional Banner */}
      <PromotionalBanner />

      {/* Additional Sections */}
      <AdditionalSections />

    </div>
  );
}
