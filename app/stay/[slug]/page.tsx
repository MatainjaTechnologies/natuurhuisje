import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MapPin, User, Users, Home, BedDouble, Bath, Star, Wifi, Car, Utensils, Flame, Check, ChevronRight } from 'lucide-react';
import { GalleryMosaic } from '@/components/GalleryMosaic';
import { BookingBox } from '@/components/BookingBox';
import { ReadMoreText } from '@/components/stay/ReadMoreText';
import { ShowAllAmenitiesModal } from '@/components/stay/ShowAllAmenitiesModal';
import { promises as fs } from 'fs';
import path from 'path';
// import { createClient } from '@/utils/supabase/server';

// Revalidate the data every 3600 seconds (1 hour)
// export const revalidate = 3600;

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  // COMMENTED OUT SUPABASE - WILL BE UPDATED LATER
  // const supabase = await createClient();
  const { slug } = await params;
  
  // Load static data from JSON file system
  const filePath = path.join(process.cwd(), 'public', 'data', 'listings.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const data = JSON.parse(fileContents);
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
  
  // Amenity icons mapping
  const amenityIconMap: Record<string, any> = {
    'WiFi': Wifi,
    'Parking': Car,
    'Kitchen': Utensils,
    'Fireplace': Flame,
    'BBQ': Flame,
  };
  
  const getAmenityIcon = (amenity: string) => {
    const Icon = amenityIconMap[amenity] || Check;
    return <Icon size={20} />;
  };

  return (
    <div className="flex flex-col bg-white min-h-screen">
      {/* Full-width gallery section */}
      <section className="bg-white">
        <div className="max-w-[1400px] mx-auto px-0 md:px-4 pt-0 md:pt-4">
          <GalleryMosaic images={listing.images} alt={listing.title} />
        </div>
      </section>
      
      {/* Breadcrumb + Title + Meta section */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
            <Link href="/" className="hover:text-neutral-700 transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href="/search" className="hover:text-neutral-700 transition-colors">Search</Link>
            <ChevronRight size={14} />
            <span className="text-neutral-700 truncate">{listing.title}</span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">{listing.title}</h1>
          
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-neutral-700">
              <MapPin size={16} className="text-neutral-500" />
              <span>{listing.location}</span>
            </div>
            <span className="text-neutral-300">·</span>
            <div className="flex items-center gap-1.5 text-neutral-700">
              <Home size={16} className="text-neutral-500" />
              <span className="capitalize">{listing.property_type.replace('-', ' ')}</span>
            </div>
            <span className="text-neutral-300">·</span>
            <div className="flex items-center gap-1.5 text-neutral-700">
              <Users size={16} className="text-neutral-500" />
              <span>{listing.max_guests} guests</span>
            </div>
            <span className="text-neutral-300">·</span>
            <div className="flex items-center gap-1.5 text-neutral-700">
              <BedDouble size={16} className="text-neutral-500" />
              <span>{listing.bedrooms} bedrooms</span>
            </div>
            <span className="text-neutral-300">·</span>
            <div className="flex items-center gap-1.5 text-neutral-700">
              <Bath size={16} className="text-neutral-500" />
              <span>{listing.bathrooms} bathrooms</span>
            </div>
            {listing.avg_rating && (
              <>
                <span className="text-neutral-300">·</span>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-full">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="font-semibold text-neutral-900">{listing.avg_rating.toFixed(1)}</span>
                  <span className="text-neutral-600">({reviews?.length || 0})</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
      
      {/* Main content - 2 column layout */}
      <section className="bg-white py-10">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
            {/* Left column - Content */}
            <div className="w-full lg:w-[60%] space-y-10">
              
              {/* Host info */}
              <div className="flex items-center justify-between pb-8 border-b border-neutral-200">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900 mb-1">
                    Hosted by {host?.first_name} {host?.last_name}
                  </h2>
                  <p className="text-neutral-600">
                    {listing.max_guests} guests · {listing.bedrooms} bedrooms · {listing.beds} beds · {listing.bathrooms} baths
                  </p>
                </div>
                <div className="flex-shrink-0">
                  {host?.avatar_url ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden">
                      <Image
                        src={host.avatar_url}
                        alt={`${host.first_name} ${host.last_name}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center">
                      <User className="h-7 w-7 text-neutral-500" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Highlights */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <Home size={24} className="text-neutral-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Entire {listing.property_type}</h3>
                    <p className="text-neutral-600 text-sm">You'll have the whole place to yourself</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                    <MapPin size={24} className="text-neutral-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">Great location</h3>
                    <p className="text-neutral-600 text-sm">Located in {listing.location}</p>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="pb-8 border-b border-neutral-200">
                <ReadMoreText text={listing.description} maxLength={250} />
              </div>
              
              {/* Popular amenities */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Popular amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formattedAmenities?.slice(0, 6).map((amenity: string) => (
                    <div key={amenity} className="flex items-center gap-3">
                      <div className="text-neutral-700">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span className="text-neutral-900">{amenity}</span>
                    </div>
                  ))}
                </div>
                {formattedAmenities && formattedAmenities.length > 6 && (
                  <ShowAllAmenitiesModal amenities={formattedAmenities} />
                )}
              </div>
              
              {/* Room layout */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Room layout</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-neutral-200 rounded-xl p-4">
                    <BedDouble size={24} className="text-neutral-700 mb-2" />
                    <h3 className="font-semibold text-neutral-900 mb-1">Bedroom</h3>
                    <p className="text-neutral-600 text-sm">{listing.bedrooms} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</p>
                  </div>
                  <div className="border border-neutral-200 rounded-xl p-4">
                    <Bath size={24} className="text-neutral-700 mb-2" />
                    <h3 className="font-semibold text-neutral-900 mb-1">Bathroom</h3>
                    <p className="text-neutral-600 text-sm">{listing.bathrooms} {listing.bathrooms === 1 ? 'bathroom' : 'bathrooms'}</p>
                  </div>
                </div>
              </div>
              
              {/* Practical info */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Practical information</h2>
                <div className="space-y-4">
                  <div className="flex justify-between py-3">
                    <span className="text-neutral-700">Check-in</span>
                    <span className="text-neutral-900 font-medium">After 3:00 PM</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-neutral-200">
                    <span className="text-neutral-700">Check-out</span>
                    <span className="text-neutral-900 font-medium">Before 11:00 AM</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-neutral-200">
                    <span className="text-neutral-700">Minimum stay</span>
                    <span className="text-neutral-900 font-medium">2 nights</span>
                  </div>
                </div>
              </div>
              
              {/* House rules */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-6">House rules</h2>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Check size={20} className="text-neutral-700 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">No smoking</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={20} className="text-neutral-700 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">No parties or events</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check size={20} className="text-neutral-700 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Pets allowed with prior approval</span>
                  </li>
                </ul>
              </div>
              
              {/* Cancellation policy */}
              <div className="pb-8 border-b border-neutral-200">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Cancellation policy</h2>
                <p className="text-neutral-700 leading-relaxed">
                  Free cancellation up to 48 hours before check-in. After that, cancel before check-in and get a 50% refund of the nightly rate and the cleaning fee, but not the service fee.
                </p>
              </div>
              
              {/* Location */}
              <div className="pb-8">
                <h2 className="text-2xl font-semibold text-neutral-900 mb-4">Location</h2>
                <p className="text-neutral-700 mb-4">{listing.location}</p>
                <div className="bg-neutral-100 h-80 rounded-xl flex items-center justify-center text-neutral-500">
                  <div className="text-center">
                    <MapPin size={32} className="mx-auto mb-2" />
                    <p>Map would be displayed here</p>
                  </div>
                </div>
              </div>
              
              {/* Reviews */}
              {listing.avg_rating && (
                <div className="pb-8">
                  <div className="flex items-center gap-2 mb-6">
                    <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
                    <h2 className="text-2xl font-semibold text-neutral-900">
                      {listing.avg_rating.toFixed(1)} · {reviews?.length || 0} reviews
                    </h2>
                  </div>
                  
                  {reviews && reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {reviews.map((review) => (
                        <div key={review.id}>
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
                              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mr-3">
                                <User className="h-5 w-5 text-neutral-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-neutral-900">
                                {review.profiles?.first_name} {review.profiles?.last_name}
                              </p>
                              <p className="text-sm text-neutral-600">
                                {new Date(review.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-neutral-700 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-neutral-600">This listing has no reviews yet.</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Right column - Sticky booking box */}
            <div className="w-full lg:w-[40%]">
              <div className="lg:sticky lg:top-24">
                <BookingBox 
                  pricePerNight={listing.price_per_night} 
                  rating={listing.avg_rating}
                  reviewCount={reviews?.length || 0}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mobile sticky booking bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 z-40 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-neutral-900">€{listing.price_per_night}</div>
            <div className="text-sm text-neutral-600">per night</div>
          </div>
          <Link
            href="#booking"
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
          >
            Reserve
          </Link>
        </div>
      </div>
    </div>
  );
}
