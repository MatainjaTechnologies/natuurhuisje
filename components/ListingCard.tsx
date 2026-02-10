"use client";

import Link from 'next/link';
import UnoptimizedImage from './UnoptimizedImage';
import { Heart, Star, MapPin } from 'lucide-react';
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
}: ListingCardProps) {
  const [favorited, setFavorited] = useState(isFavorited);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavorited(!favorited);
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  return (
    <Link
      href={`/stay/${slug}`}
      className="group block"
    >
      <div className="overflow-hidden rounded-2xl card-shadow h-full flex flex-col">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          {images && images.length > 0 ? (
            <UnoptimizedImage
              src={images[0]}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full image-placeholder" />
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 p-2.5 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-sm transition-all hover:scale-110"
          >
            <Heart
              size={16}
              className={`${favorited ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-semibold text-base text-gray-900 line-clamp-1 group-hover:text-purple-700 transition-colors">{title}</h3>
            {rating !== undefined && (
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span className="text-sm font-semibold text-gray-700">{rating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          
          <div className="mt-auto pt-2 border-t border-gray-100">
            <p className="font-bold text-gray-900">
              &euro;{pricePerNight} <span className="text-gray-400 font-normal text-sm">/ night</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
