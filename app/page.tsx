"use client";

import Link from 'next/link';
import { SearchDock } from '@/components/SearchDock';
import { ListingCard } from '@/components/ListingCard';
import { useRef, useState, useEffect } from 'react';

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

type Destination = {
  country: string;
  label: string;
  image: string;
};

type CarouselItem = {
  id: string;
  label: string;
  type?: string;
  country?: string;
  region?: string;
  image: string;
  href: string;
};

type CarouselData = {
  natureHouses: CarouselItem[];
  countries: CarouselItem[];
  regions: CarouselItem[];
};

type DataType = {
  featuredListings: Listing[];
  destinations: Destination[];
};

export default function Home() {
  const natureHousesRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const regionsRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataType>({
    featuredListings: [],
    destinations: []
  });
  const [carouselData, setCarouselData] = useState<CarouselData>({
    natureHouses: [],
    countries: [],
    regions: []
  });

  // Load carousel data
  useEffect(() => {
    const loadCarouselData = async () => {
      try {
        const response = await fetch('/data/homepage-carousels.json');
        const data = await response.json();
        setCarouselData(data);
      } catch (error) {
        console.error('Error loading carousel data:', error);
      }
    };

    loadCarouselData();
  }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/listings.json')
      .then(response => response.json())
      .then((jsonData: DataType) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, []);

  const scrollNatureHouses = (direction: 'left' | 'right') => {
    if (natureHousesRef.current) {
      const scrollAmount = 280; // Card width (256px) + gap (24px)
      const newScrollPosition = natureHousesRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      natureHousesRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollCountries = (direction: 'left' | 'right') => {
    if (countriesRef.current) {
      const scrollAmount = 280; // Card width (256px) + gap (24px)
      const newScrollPosition = countriesRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      countriesRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollRegions = (direction: 'left' | 'right') => {
    if (regionsRef.current) {
      const scrollAmount = 280; // Card width (256px) + gap (24px)
      const newScrollPosition = regionsRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      regionsRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const featuredListings = data.featuredListings;
  const destinations = data.destinations;
  
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
            <span className="text-sm text-white/90 font-medium tracking-wide">Ontdek 500+ unieke natuurverblijven</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight font-poppins">
            De natuur opent je ogen.
            <span className="block mt-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              Vind hier jouw vakantiehuisje midden in de natuur.
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-white/80 mb-12 max-w-2xl leading-relaxed">
            Boek unieke hutten, boomhutten en meer, omgeven door de mooiste natuurgebieden
          </p>
          
          {/* Search Dock */}
          <div className="w-full max-w-4xl">
            <SearchDock variant="hero" maxWidth="max-w-4xl" />
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>Gratis annulering</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>Geverifieerde accommodaties</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>24/7 ondersteuning</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Aanbevolen Accommodaties Sectie */}
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
            {!loading && featuredListings.length > 0 ? (
              featuredListings.map((listing) => (
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
      
      {/* Ontdek Natuurhuisjes Sectie */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins text-center">Verken per bestemming</h2>
          </div>
          
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={() => scrollNatureHouses('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scrollNatureHouses('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div ref={natureHousesRef} className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 pb-4">
                {carouselData.natureHouses.length > 0 ? carouselData.natureHouses.map((item) => (
                  <Link 
                    key={item.id}
                    href={item.href}
                    className="group block flex-shrink-0 w-72"
                  >
                    <div className="relative h-48 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                      <img 
                        src={item.image}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-900">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="flex gap-4 pb-4">
                    <div className="text-gray-500 text-center py-8">Carousel data wordt geladen...</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meest Bezochte Landen Sectie */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins text-center">Meest bezochte landen</h2>
          </div>
          
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={() => scrollCountries('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scrollCountries('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div ref={countriesRef} className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 pb-4">
                {carouselData.countries.map((item) => (
                  <Link 
                    key={item.id}
                    href={item.href}
                    className="group block flex-shrink-0 w-72"
                  >
                    <div className="relative h-48 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                      <img 
                        src={item.image}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-900">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Populaire Regio's Sectie */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins text-center">Populaire regio's</h2>
          </div>
          
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={() => scrollRegions('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scrollRegions('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-gray-800 shadow-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Carousel Container */}
            <div ref={regionsRef} className="overflow-x-auto scrollbar-hide">
              <div className="flex gap-4 pb-4">
                {carouselData.regions.map((item) => (
                  <Link 
                    key={item.id}
                    href={item.href}
                    className="group block flex-shrink-0 w-72"
                  >
                    <div className="relative h-48 overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
                      <img 
                        src={item.image}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>
                      <div className="absolute top-4 left-4">
                        <span className="inline-block px-4 py-2 bg-white rounded-full text-sm font-semibold text-gray-900">
                          {item.label}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Most Visited Section */}
      {/* <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">Most Visited</h2>
            <p className="text-gray-600 mt-2">Popular stays loved by our guests</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 rounded-2xl h-64 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-stone-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-stone-200 rounded-full w-1/2"></div>
                    <div className="h-4 bg-stone-200 rounded-full w-1/3 mt-auto"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredListings.slice(0, 4).map((listing) => (
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
            )}
          </div>

          <div className="text-center mt-10">
            <Link 
              href="/search" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
            >
              View All Popular Stays
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Recently Viewed Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">Recently Viewed</h2>
            <p className="text-gray-600 mt-2">Continue where you left off</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-stone-200 rounded-2xl h-64 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-stone-200 rounded-full w-3/4"></div>
                    <div className="h-4 bg-stone-200 rounded-full w-1/2"></div>
                    <div className="h-4 bg-stone-200 rounded-full w-1/3 mt-auto"></div>
                  </div>
                </div>
              ))
            ) : (
              featuredListings.slice(4, 8).map((listing) => (
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
            )}
          </div>

          <div className="text-center mt-10">
            <Link 
              href="/search" 
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-colors font-medium"
            >
              Browse More Properties
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Want to Rent Out Your Place Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins">Want to rent out your place?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {/* Contribute to Conservation */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <img 
                  src="/images/rent-out_behoud-natuur.png" 
                  alt="Contribute to conservation" 
                  className="h-32 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect fill="%2334D399" width="120" height="120" rx="60"/%3E%3Cpath fill="white" d="M60 30c-5 0-10 2-13 6l-15 18c-2 3-2 7 0 10l15 18c3 4 8 6 13 6s10-2 13-6l15-18c2-3 2-7 0-10l-15-18c-3-4-8-6-13-6z"/%3E%3C/svg%3E';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 font-poppins">Contribute to the conservation of nature</h3>
              <p className="text-gray-600 leading-relaxed">With your booking you contribute to local nature projects.</p>
            </div>
            
            {/* Reach Target Group */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <img 
                  src="/images/rent-out_juiste-doelgroep.png" 
                  alt="Reach the right target group" 
                  className="h-32 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Ccircle fill="%2334D399" cx="60" cy="40" r="15"/%3E%3Cpath fill="%2334D399" d="M60 60c-15 0-27 8-27 18v12h54V78c0-10-12-18-27-18z"/%3E%3Cpath fill="%2310B981" d="M45 75l8 8 15-15"/%3E%3C/svg%3E';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 font-poppins">Reach the right target group</h3>
              <p className="text-gray-600 leading-relaxed">By being part of an exclusive offer you reach the right people.</p>
            </div>
            
            {/* You Decide */}
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <img 
                  src="/images/rent-out_jij-bepaalt.png" 
                  alt="You decide" 
                  className="h-32 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"%3E%3Crect fill="%2310B981" x="30" y="40" width="60" height="50" rx="5"/%3E%3Crect fill="%2334D399" x="40" y="30" width="40" height="8" rx="2"/%3E%3Cpath fill="white" d="M50 60h20M50 70h15M50 80h20" stroke="white" stroke-width="3"/%3E%3C/svg%3E';
                  }}
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 font-poppins">You decide</h3>
              <p className="text-gray-600 leading-relaxed">Keep full control over your availability, rates, and how you communicate with guests.</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link 
              href="/host" 
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: '#5B2D8E' }}
            >
              More information
            </Link>
          </div>
        </div>
      </section>
      
      {/* Biodiversity Protection Section */}
      <section className="relative py-32 bg-cover bg-center" style={{ backgroundImage: 'url(/images/pexels-justin-wolfert.jpg)' }}>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="container-custom relative z-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight font-poppins">
              Together we protect local biodiversity
            </h2>
            <p className="text-lg text-white mb-8 leading-relaxed">
              In this way we help to restore the balance between people and nature.
            </p>
            <Link 
              href="/biodiversity" 
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
              style={{ background: '#C084FC' }}
            >
              More information
            </Link>
          </div>
        </div>
      </section>

      {/* Holiday Home in Nature Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-poppins">
              Holiday home in the heart of nature
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-base">
              <p>
                In a nature house, you can wonderfully escape the hustle and bustle of everyday life and completely unwind surrounded by nature. A nature house is a place where you gather with friends to celebrate life and where you can introduce your (grand)children to the beautiful European countryside. It's the ideal starting point for exploring rolling hills, expansive meadows, or towering mountains. You can fish, mountain bike, hike, or simply unwind with a book on a rainy day.
              </p>
              <p>
                From cabins to villas, nature houses come in all shapes and sizes. They weather storms and are sometimes located in inhospitable regions, but always offer you, the holidaymaker, a pleasant place to stay. A nature house isn't just a place to sleep during your trip; it's a way of spending your holiday...
              </p>
            </div>
            <div className="mt-8">
              <Link 
                href="/about" 
                className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-purple-700 transition-colors"
              >
                More about us
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto rounded-3xl p-12 text-center" style={{ background: 'linear-gradient(135deg, #F9A8D4, #F0ABFC, #E9D5FF)' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-poppins">
              Discover even more idyllic spots in nature.
            </h2>
            
            <form className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
              <input 
                type="text" 
                placeholder="Your first name" 
                className="px-6 py-3 rounded-lg border-b-2 border-gray-900 bg-transparent placeholder:text-gray-700 outline-none focus:border-purple-700 transition-colors w-full md:w-64"
              />
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-6 py-3 rounded-lg border-b-2 border-gray-900 bg-transparent placeholder:text-gray-700 outline-none focus:border-purple-700 transition-colors w-full md:w-64"
              />
              <button 
                type="submit"
                className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg whitespace-nowrap"
                style={{ background: '#5B2D8E' }}
              >
                Subscribe to newsletter
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <input 
                type="checkbox" 
                id="privacy" 
                className="w-4 h-4 rounded border-gray-900"
              />
              <label htmlFor="privacy">
                I agree to the <Link href="/privacy" className="underline hover:text-purple-700">privacy policy</Link>.
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
