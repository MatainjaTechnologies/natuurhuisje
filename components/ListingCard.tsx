"use client";

import Link from 'next/link';
import UnoptimizedImage from './UnoptimizedImage';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface ListingCardProps {
  id: string;
  slug: string;
  title: string;
  location: string;
  images: string[];
  pricePerNight: number;
  rating?: number;
  isFavorited?: boolean;
  onToggleFavorite?: (id: string) => void;
  showImageCarousel?: boolean;
}

export function ListingCard({
  id,
  slug,
  title,
  location,
  images,
  pricePerNight,
  rating,
  isFavorited = false,
  onToggleFavorite,
  showImageCarousel = true,
}: ListingCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorited(!favorited);
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  const handlePreviousImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFading) return;
    
    setIsFading(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setTimeout(() => setIsFading(false), 50);
    }, 200);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFading) return;
    
    setIsFading(true);
    setTimeout(() => {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsFading(false), 50);
    }, 200);
  };

  return (
    <Link
      href={`/stay/${slug}`}
      className="group block"
    >
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          {images && images.length > 0 ? (
            <div className={`w-full h-full transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              <UnoptimizedImage
                key={currentImageIndex}
                src={images[currentImageIndex]}
                alt={title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ) : (
            <div className="w-full h-full image-placeholder" />
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
          >
            <Heart
              size={20}
              className={`${favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
            />
          </button>

          {/* Image Navigation Buttons - Only show if carousel enabled and multiple images */}
          {showImageCarousel && images && images.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={handlePreviousImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronLeft size={16} className="text-gray-900" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/90 hover:bg-white transition-all opacity-0 group-hover:opacity-100 z-10"
              >
                <ChevronRight size={16} className="text-gray-900" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-4 bg-white'
                        : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Capacity Badge */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 text-white text-xs font-medium z-10">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
            </svg>
            4
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-sm text-gray-500 mb-1">{location}</p>
          <h3 className="text-base font-semibold text-gray-900 mb-3 font-poppins truncate">
            {title}
          </h3>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">from</span>
              <p className="text-lg font-bold text-gray-900">
                €{pricePerNight} <span className="text-sm font-normal text-gray-500">per night</span>
              </p>
            </div>
            {rating !== undefined && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-amber-400 text-white">
                <Star className="w-3 h-3 fill-white" />
                <span className="text-xs font-bold">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
