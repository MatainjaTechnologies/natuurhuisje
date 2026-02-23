"use client";

import Link from 'next/link';
import { SearchDock } from '@/components/SearchDock';
import { ListingCard } from '@/components/ListingCard';
import { useRef, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { getHomepageDictionary } from '@/i18n/get-homepage-dictionary';

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
  const params = useParams();
  const lang = params.lang as Locale;
  const natureHousesRef = useRef<HTMLDivElement>(null);
  const countriesRef = useRef<HTMLDivElement>(null);
  const regionsRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<DataType>({
    featuredListings: [],
    destinations: [],
  });
  const [carouselData, setCarouselData] = useState<CarouselData>({
    natureHouses: [],
    countries: [],
    regions: [],
  });
  const [hideHeroSearch, setHideHeroSearch] = useState(false);
  const [loading, setLoading] = useState(true);
  const [t, setT] = useState<any>(null);

  useEffect(() => {
    const loadTranslations = async () => {
      const translations = await getHomepageDictionary(lang);
      setT(translations);
    };
    loadTranslations();
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHideHeroSearch(true);
      } else {
        setHideHeroSearch(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  useEffect(() => {
    fetch(`/data/listings-${lang}.json`)
      .then(response => response.json())
      .then((jsonData: DataType) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading data:', error);
        setLoading(false);
      });
  }, [lang]);

  const scrollNatureHouses = (direction: 'left' | 'right') => {
    if (natureHousesRef.current) {
      const scrollAmount = 280;
      const newScrollPosition = natureHousesRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      natureHousesRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollCountries = (direction: 'left' | 'right') => {
    if (countriesRef.current) {
      const scrollAmount = 280;
      const newScrollPosition = countriesRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      countriesRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollRegions = (direction: 'left' | 'right') => {
    if (regionsRef.current) {
      const scrollAmount = 280;
      const newScrollPosition = regionsRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
      regionsRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const featuredListings = data.featuredListings;
  const destinations = data.destinations;

  if (!t) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] w-full overflow-visible -mt-20 z-40">
        {/* Background Image Slider */}
        <div className="absolute inset-0 z-0 overflow-hidden">
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
        <div className="relative z-10 container-custom h-full min-h-[85vh] flex flex-col justify-center items-center text-center px-4 pt-20 overflow-visible">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-purple-300 rounded-full animate-pulse"></span>
            <span className="text-sm text-white/90 font-medium tracking-wide">{t.hero.badge}</span>
          </div>
          
          <h1 className="text-lg md:text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight font-poppins">
            {t.hero.title}
            <span className="block mt-2 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
              {t.hero.subtitle}
            </span>
          </h1>
          
          <p className="text-lg md:text-base md:text-lg text-white/80 mb-12 max-w-2xl leading-relaxed">
            {t.hero.description}
          </p>
          
          {/* Search Dock - Hidden on mobile when scrolled */}
          <div className={`w-full max-w-4xl relative z-50 transition-opacity duration-300 ${hideHeroSearch ? 'md:opacity-100 opacity-0 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
            <SearchDock variant="hero" maxWidth="max-w-4xl" lang={lang}/>
          </div>
          
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>{t.hero.trustBadges.cancellation}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>{t.hero.trustBadges.verified}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <span>{t.hero.trustBadges.support}</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Aanbevolen Accommodaties Sectie */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">{t.sections.oftenBooked}</h2>
            </div>
            <Link href={`/${lang}/search`} className="text-purple-600 hover:text-purple-700 font-medium text-sm flex items-center gap-1 transition-colors">
              {t.sections.viewAll}
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
                  lang={lang}
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
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins text-center">{t.sections.exploreByDestination}</h2>
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
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins text-center">{t.sections.mostVisitedCountries}</h2>
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
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins text-center">{t.sections.popularRegions}</h2>
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

      {/* Recently Viewed Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 font-poppins">{t.sections.recentlyViewed}</h2>
            <p className="text-gray-600 mt-2">{t.sections.continueWhereYouLeftOff}</p>
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
                  lang={lang}
                />
              ))
            )}
          </div>

          <div className="text-center mt-10">
            <Link 
              href={`/${lang}/search`}
              className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-900 text-gray-900 rounded-xl hover:bg-gray-900 hover:text-white transition-colors font-medium"
            >
              {t.sections.browseMore}
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins">{t.rentOut.title}</h2>
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
              <h3 className="text-xl font-semibold mb-3 text-gray-900 font-poppins">{t.rentOut.conservation.title}</h3>
              <p className="text-gray-600 leading-relaxed">{t.rentOut.conservation.description}</p>
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
              <h3 className="text-xl font-semibold mb-3 text-gray-900 font-poppins">{t.rentOut.targetGroup.title}</h3>
              <p className="text-gray-600 leading-relaxed">{t.rentOut.targetGroup.description}</p>
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
              <h3 className="text-xl font-semibold mb-3 text-gray-900 font-poppins">{t.rentOut.youDecide.title}</h3>
              <p className="text-gray-600 leading-relaxed">{t.rentOut.youDecide.description}</p>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-12">
            <Link 
              href={`/${lang}/host`}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-white font-semibold text-lg transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: '#5B2D8E' }}
            >
              {t.rentOut.moreInfo}
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
              {t.biodiversity.title}
            </h2>
            <p className="text-lg text-white mb-8 leading-relaxed">
              {t.biodiversity.description}
            </p>
            <Link 
              href={`/${lang}/biodiversity`}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg"
              style={{ background: '#C084FC' }}
            >
              {t.biodiversity.moreInfo}
            </Link>
          </div>
        </div>
      </section>

      {/* Holiday Home in Nature Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 font-poppins">
              {t.holidayHome.title}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-4 text-base">
              <p>
                {t.holidayHome.paragraph1}
              </p>
              <p>
                {t.holidayHome.paragraph2}
              </p>
            </div>
            <div className="mt-8">
              <Link 
                href={`/${lang}/about`}
                className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-purple-700 transition-colors"
              >
                {t.holidayHome.moreAboutUs}
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
              {t.newsletter.title}
            </h2>
            
            <form className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
              <input 
                type="text" 
                placeholder={t.newsletter.firstNamePlaceholder}
                className="px-6 py-3 rounded-lg border-b-2 border-gray-900 bg-transparent placeholder:text-gray-700 outline-none focus:border-purple-700 transition-colors w-full md:w-64"
              />
              <input 
                type="email" 
                placeholder={t.newsletter.emailPlaceholder}
                className="px-6 py-3 rounded-lg border-b-2 border-gray-900 bg-transparent placeholder:text-gray-700 outline-none focus:border-purple-700 transition-colors w-full md:w-64"
              />
              <button 
                type="submit"
                className="px-8 py-3 rounded-xl text-white font-semibold transition-all hover:shadow-lg whitespace-nowrap"
                style={{ background: '#5B2D8E' }}
              >
                {t.newsletter.subscribe}
              </button>
            </form>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
              <input 
                type="checkbox" 
                id="privacy" 
                className="w-4 h-4 rounded border-gray-900"
              />
              <label htmlFor="privacy">
                {t.newsletter.privacyText} <Link href={`/${lang}/privacy`} className="underline hover:text-purple-700">{t.newsletter.privacyLink}</Link>.
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
