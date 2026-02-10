import { SearchDock } from '@/components/SearchDock';
import { FiltersPanel } from '@/components/FiltersPanel';
import { ListingCard } from '@/components/ListingCard';
import { createClient } from '@/utils/supabase/server';

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
    type?: string;
    filters?: string;
  }>;
}) {
  const supabase = await createClient();
  const params = await searchParams;
  
  // Parse search parameters
  const location = params.location || '';
  const checkinDate = params.checkin ? new Date(params.checkin) : undefined;
  const checkoutDate = params.checkout ? new Date(params.checkout) : undefined;
  const guests = params.guests ? parseInt(params.guests) : undefined;
  const petsAllowed = params.pets === 'true';
  const propertyType = params.type;
  const filtersParam = params.filters ? params.filters.split(',') : [];
  
  // Set up Supabase query
  let query = supabase
    .from('listings')
    .select('*')
    .eq('is_published', true);
  
  // Apply filters
  if (location) {
    query = query.ilike('location', `%${location}%`);
  }
  
  if (guests) {
    query = query.gte('max_guests', guests);
  }
  
  if (petsAllowed) {
    query = query.contains('amenities', ['pets']);
  }
  
  if (propertyType) {
    query = query.eq('property_type', propertyType);
  }
  
  // Handle additional filters from FiltersPanel
  const amenityFilters = filtersParam.filter(filter => 
    ['wifi', 'fireplace', 'pool', 'hot-tub', 'bbq', 'lake', 'mountain-view', 'beachfront', 'secluded', 'forest'].includes(filter)
  );
  
  if (amenityFilters.length > 0) {
    // For each amenity, we need to check if it's in the amenities array
    amenityFilters.forEach(amenity => {
      query = query.contains('amenities', [amenity]);
    });
  }
  
  // Fetch listings
  const { data: listings, error } = await query.order('created_at', { ascending: false }) as { data: any[] | null; error: any };
  
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Search header with compact SearchDock */}
      <section className="bg-white border-b border-border shadow-sm py-6">
        <div className="container-custom">
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
      </section>
      
      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters sidebar */}
          <div className="w-full lg:w-1/4">
            <FiltersPanel
              className="sticky top-24"
            />
          </div>
          
          {/* Listings grid */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-forest-900">
                {listings?.length || 0} {listings?.length === 1 ? 'stay' : 'stays'} found
                {location && ` in ${location}`}
              </h1>
            </div>
            
            {error && (
              <div className="bg-rose-50 text-rose-700 p-4 rounded-md mb-6">
                An error occurred while fetching listings. Please try again.
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {listings && listings.length > 0 ? (
                listings.map((listing) => (
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
                  <h2 className="text-xl font-medium text-forest-700 mb-2">No listings found</h2>
                  <p className="text-forest-600">
                    Try adjusting your search filters or exploring a different location.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
