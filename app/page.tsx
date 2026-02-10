import Link from 'next/link';
import { SearchDock } from '@/components/SearchDock';
import { ListingCard } from '@/components/ListingCard';
import { createClient } from '@/utils/supabase/server';

// Define listing type
type Listing = {
  id: string;
  slug: string;
  title: string;
  location: string;
  images: string[];
  price_per_night: number;
  avg_rating?: number;
  is_published: boolean;
};

export const revalidate = 3600; // Revalidate this page every hour

export default async function Home() {
  // Default featured listings
  const featuredListings: Listing[] = [
    {
      id: '1',
      slug: 'cozy-cabin-forest',
      title: 'Cozy Cabin in the Forest',
      location: 'Gelderland, Netherlands',
      images: ['https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=500&q=80'],
      price_per_night: 150,
      avg_rating: 9.2,
      is_published: true
    },
    {
      id: '2',
      slug: 'treehouse-adventure',
      title: 'Treehouse Adventure',
      location: 'Utrecht, Netherlands',
      images: ['https://images.unsplash.com/photo-1618767689160-da3fb810aad7?w=500&q=80'],
      price_per_night: 180,
      avg_rating: 9.5,
      is_published: true
    },
    {
      id: '3',
      slug: 'luxury-glamping-tent',
      title: 'Luxury Glamping Tent',
      location: 'Limburg, Netherlands',
      images: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=500&q=80'],
      price_per_night: 120,
      avg_rating: 9.0,
      is_published: true
    },
    {
      id: '4',
      slug: 'windmill-experience',
      title: 'Experience a night in a Windmill from 1590',
      location: 'Noord-Holland, Netherlands',
      images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&q=80'],
      price_per_night: 250,
      avg_rating: 9.7,
      is_published: true
    },
    {
      id: '5',
      slug: 'lakeside-cottage',
      title: 'Peaceful Lakeside Cottage',
      location: 'Friesland, Netherlands',
      images: ['https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=500&q=80'],
      price_per_night: 140,
      avg_rating: 9.3,
      is_published: true
    },
    {
      id: '6',
      slug: 'tiny-house-nature',
      title: 'Modern Tiny House in Nature',
      location: 'Drenthe, Netherlands',
      images: ['https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=500&q=80'],
      price_per_night: 110,
      avg_rating: 8.9,
      is_published: true
    },
    {
      id: '7',
      slug: 'mountain-chalet',
      title: 'Rustic Mountain Chalet',
      location: 'Overijssel, Netherlands',
      images: ['https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=500&q=80'],
      price_per_night: 165,
      avg_rating: 9.1,
      is_published: true
    },
    {
      id: '8',
      slug: 'countryside-villa',
      title: 'Charming Countryside Villa',
      location: 'Zeeland, Netherlands',
      images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80'],
      price_per_night: 200,
      avg_rating: 9.4,
      is_published: true
    }
  ];
    
  const typedListings = featuredListings;
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full overflow-hidden -mt-20">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full">
            {/* Banner 1 */}
            <div className="absolute inset-0 animate-[fadeInOut_15s_ease-in-out_infinite]">
              <img 
                src="/images/banner1.jpeg" 
                alt="Nature banner 1"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Banner 2 */}
            <div className="absolute inset-0 animate-[fadeInOut_15s_ease-in-out_5s_infinite]">
              <img 
                src="/images/banner2.jpeg" 
                alt="Nature banner 2"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Banner 3 */}
            <div className="absolute inset-0 animate-[fadeInOut_15s_ease-in-out_10s_infinite]">
              <img 
                src="/images/banner3.jpeg" 
                alt="Nature banner 3"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container-custom h-full min-h-[85vh] flex flex-col justify-center items-center text-center px-4 pt-20">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></span>
            <span className="text-sm text-white/90 font-medium tracking-wide">Discover 500+ unique nature stays</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight font-poppins">
            De natuur opent je ogen.
            <span className="block mt-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Vind hier jouw vakantiehuisje midden in de natuur.
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-white/80 mb-12 max-w-2xl leading-relaxed">
            Book unique cabins, treehouses and more, surrounded by the most beautiful natural settings
          </p>
          
          {/* Search Dock */}
          <div className="w-full max-w-4xl">
            <SearchDock variant="hero" />
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>Free cancellation</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>Verified properties</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Listings Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">Vaak geboekt op natuurhuisje</h2>
            </div>
            <Link href="/search" className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 transition-colors">
              Bekijk alles
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            {typedListings.length > 0 ? (
              typedListings.map((listing) => (
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
            ) : (
              Array.from({ length: 6 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-2xl overflow-hidden h-80 flex flex-col card-shadow"
                >
                  <div className="h-48 image-placeholder"></div>
                  <div className="p-5 flex-1">
                    <div className="h-4 bg-stone-200 rounded-full w-3/4 mb-3"></div>
                    <div className="h-3 bg-stone-100 rounded-full w-1/2 mb-4"></div>
                    <div className="h-4 bg-stone-200 rounded-full w-1/3 mt-auto"></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Property Types Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">Browse by property type</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
              { type: 'cabin', label: 'Cabins', emoji: '🏡', gradient: 'from-amber-800 to-amber-600' },
              { type: 'treehouse', label: 'Treehouses', emoji: '🌳', gradient: 'from-emerald-800 to-emerald-600' },
              { type: 'glamping', label: 'Glamping', emoji: '⛺', gradient: 'from-orange-800 to-orange-600' },
              { type: 'tiny-house', label: 'Tiny Houses', emoji: '🏠', gradient: 'from-sky-800 to-sky-600' },
              { type: 'farm', label: 'Farm Stays', emoji: '🌾', gradient: 'from-lime-800 to-lime-600' },
            ].map((item) => (
              <Link 
                key={item.type}
                href={`/search?type=${item.type}`}
                className="group"
              >
                <div className={`relative h-52 overflow-hidden rounded-2xl bg-gradient-to-br ${item.gradient} transition-all duration-300 group-hover:scale-[1.03] group-hover:shadow-xl`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-4xl mb-3">{item.emoji}</span>
                    <h3 className="text-lg font-semibold text-white font-poppins">{item.label}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20" style={{ background: 'linear-gradient(135deg, #2d1052 0%, #4a1d7a 50%, #5B2D8E 100%)' }}>
        <div className="container-custom">
          <div className="text-center mb-14">
            <span className="text-sm font-semibold tracking-widest uppercase text-purple-300 mb-3 block">Why choose us</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-poppins">Why Book with NatureStays</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-400/20 text-purple-300 flex items-center justify-center rounded-2xl mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white font-poppins">Verified Properties</h3>
              <p className="text-white/60 leading-relaxed">All our properties are carefully vetted to ensure the best quality and experience for our guests.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-400/20 text-purple-300 flex items-center justify-center rounded-2xl mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white font-poppins">Flexible Booking</h3>
              <p className="text-white/60 leading-relaxed">Many of our properties offer flexible cancellation policies to accommodate your travel plans.</p>
            </div>
            
            <div className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
              <div className="w-16 h-16 bg-purple-400/20 text-purple-300 flex items-center justify-center rounded-2xl mx-auto mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white font-poppins">24/7 Support</h3>
              <p className="text-white/60 leading-relaxed">Our dedicated support team is always ready to assist you before, during, and after your stay.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, #2d1052 0%, #5B2D8E 50%, #7B3FA0 100%)' }}>
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <div className="relative z-10">
              <span className="inline-block text-sm font-semibold tracking-widest uppercase text-purple-300 mb-4">For property owners</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight font-poppins">
                Own a unique property<br />in nature?
              </h2>
              <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join our community of hosts and start earning by sharing your special place with nature lovers
              </p>
              <Link href="/host" className="inline-flex items-center gap-2 bg-white text-purple-900 font-semibold py-4 px-8 rounded-xl text-lg hover:bg-purple-50 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                Become a Host
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
