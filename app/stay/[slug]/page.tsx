import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, User, Users, Home, BedDouble, Bath, Calendar, Star } from 'lucide-react';
import { GalleryMosaic } from '@/components/GalleryMosaic';
import { BookingBox } from '@/components/BookingBox';
// import { createClient } from '@/utils/supabase/server';

// Revalidate the data every 3600 seconds (1 hour)
// export const revalidate = 3600;

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  // COMMENTED OUT SUPABASE - WILL BE UPDATED LATER
  // const supabase = await createClient();
  const { slug } = await params;
  
  // Load static data from JSON
  const response = await fetch('http://localhost:3000/data/listings.json', { cache: 'no-store' });
  const data = await response.json();
  const listing = data.featuredListings.find((l: any) => l.slug === slug);
  
  // Mock reviews data
  const reviews: any[] = [];
  
  // COMMENTED OUT SUPABASE FETCH
  // const { data: listing, error } = await supabase
  //   .from('listings')
  //   .select('*, profiles(first_name, last_name, avatar_url)')
  //   .eq('slug', slug)
  //   .eq('is_published', true)
  //   .single() as { data: any; error: any };
  
  // const { data: reviews } = await supabase
  //   .from('reviews')
  //   .select('*, profiles(first_name, last_name, avatar_url)')
  //   .eq('listing_id', listing?.id || '')
  //   .order('created_at', { ascending: false })
  //   .limit(5) as { data: any[] | null };
  
  // If listing not found, return 404
  if (!listing) {
    notFound();
  }
  
  // Add mock data for fields not in JSON
  listing.property_type = 'cabin';
  listing.max_guests = 4;
  listing.bedrooms = 2;
  listing.beds = 2;
  listing.bathrooms = 1;
  listing.description = 'Experience the beauty of nature in this cozy retreat. Perfect for families and nature lovers seeking a peaceful getaway surrounded by stunning landscapes.';
  listing.amenities = ['wifi', 'parking', 'kitchen', 'fireplace', 'bbq'];
  listing.profiles = {
    first_name: 'John',
    last_name: 'Doe',
    avatar_url: null
  };
  
  // Format amenities for display
  const amenityLabels: Record<string, string> = {
    'wifi': 'WiFi',
    'parking': 'Parking',
    'kitchen': 'Kitchen',
    'pets': 'Pets Allowed',
    'fireplace': 'Fireplace',
    'pool': 'Pool',
    'hot-tub': 'Hot Tub',
    'bbq': 'BBQ',
    'lake': 'Lake Access',
    'mountain-view': 'Mountain Views',
    'beachfront': 'Beachfront',
    'secluded': 'Secluded',
    'forest': 'Forest'
  };
  
  const formattedAmenities = listing.amenities?.map((amenity: string) => amenityLabels[amenity] || amenity);
  
  // Get host details
  const host = listing.profiles;
  
  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Full-width gallery section (vipio-style) */}
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 pt-0 md:pt-4">
          <GalleryMosaic images={listing.images} alt={listing.title} />
        </div>
      </section>
      
      {/* Breadcrumb + Title section */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
            <a href="/" className="hover:text-gray-600 transition-colors">Home</a>
            <span>&rsaquo;</span>
            <a href="/search" className="hover:text-gray-600 transition-colors">Search</a>
            <span>&rsaquo;</span>
            <span className="text-gray-600 truncate">{listing.title}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
          <div className="flex flex-wrap items-center text-gray-500 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-purple-600" />
              <span>{listing.location}</span>
            </div>
            {listing.avg_rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-700">{listing.avg_rating.toFixed(1)}</span>
                <span className="text-gray-400">·</span>
                <span>{reviews?.length || 0} reviews</span>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Main content with booking box */}
      <section className="bg-white">
        <div className="container-custom py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left column - Listing details */}
            <div className="w-full lg:w-2/3">
              <div className="mb-8 pb-8 border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold text-forest-900">
                      {listing.property_type.charAt(0).toUpperCase() + listing.property_type.slice(1).replace('-', ' ')} hosted by {host?.first_name}
                    </h2>
                    <p className="text-forest-600 mt-1">
                      {listing.max_guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0">
                    {host?.avatar_url ? (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image
                          src={host.avatar_url}
                          alt={`${host.first_name} ${host.last_name}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-forest-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8 pb-8 border-b border-border">
                <h2 className="text-xl font-semibold text-forest-900 mb-4">Description</h2>
                <div className="text-forest-700 whitespace-pre-wrap">{listing.description}</div>
              </div>
              
              {/* Features */}
              <div className="mb-8 pb-8 border-b border-border">
                <h2 className="text-xl font-semibold text-forest-900 mb-4">What this place offers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formattedAmenities?.map((amenity: string) => (
                    <div key={amenity} className="flex items-center">
                      <div className="p-2 bg-forest-100 rounded-full mr-3">
                        <div className="w-5 h-5 flex items-center justify-center text-forest-700">
                          {/* We could add specific icons for each amenity type, but using a generic check for now */}
                          ✓
                        </div>
                      </div>
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location */}
              <div className="mb-8 pb-8 border-b border-border">
                <h2 className="text-xl font-semibold text-forest-900 mb-4">Location</h2>
                <p className="text-forest-700 mb-4">{listing.location}</p>
                {/* Here we could add a map component if we had coordinates */}
                <div className="bg-forest-100 h-80 rounded-2xl flex items-center justify-center text-forest-500">
                  Map would be displayed here
                </div>
              </div>
              
              {/* Reviews */}
              <div className="mb-8 pb-8">
                <h2 className="text-xl font-semibold text-forest-900 mb-4">
                  {listing.avg_rating ? (
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-forest-500 text-forest-500 mr-2" />
                      <span>{listing.avg_rating.toFixed(1)} · {reviews?.length || 0} reviews</span>
                    </div>
                  ) : (
                    "No reviews yet"
                  )}
                </h2>
                
                {reviews && reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                        <div className="flex items-center mb-3">
                          {review.profiles?.avatar_url ? (
                            <div className="relative w-10 h-10 rounded-full overflow-hidden mr-3">
                              <Image
                                src={review.profiles.avatar_url}
                                alt={`${review.profiles.first_name} ${review.profiles.last_name}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-10 h-10 bg-forest-100 rounded-full flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-forest-500" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-forest-900">
                              {review.profiles?.first_name} {review.profiles?.last_name}
                            </p>
                            <p className="text-sm text-forest-600">
                              {new Date(review.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'fill-forest-500 text-forest-500' : 'text-forest-200'}`} 
                            />
                          ))}
                        </div>
                        
                        <p className="text-forest-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-forest-600">This listing has no reviews yet.</p>
                )}
              </div>
            </div>
            
            {/* Right column - Booking box */}
            <div className="w-full lg:w-1/3">
              <BookingBox 
                pricePerNight={listing.price_per_night} 
                rating={listing.avg_rating}
                reviewCount={reviews?.length || 0}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Similar listings section (could be added) */}
      
      {/* Call to action */}
      <section className="bg-cream-100 py-12">
        <div className="container-custom text-center">
          <h2 className="text-2xl font-semibold text-forest-900 mb-4">
            Planning a nature getaway?
          </h2>
          <p className="text-forest-700 max-w-2xl mx-auto mb-6">
            Explore our collection of unique nature stays from cabins and treehouses to glamping sites and tiny homes.
          </p>
          <Link href="/search" className="btn-primary">
            Browse All Stays
          </Link>
        </div>
      </section>
    </div>
  );
}
