"use client";

import { useState } from 'react';
import UnoptimizedImage from './UnoptimizedImage';
import { X, ChevronLeft, ChevronRight, Heart, Camera } from 'lucide-react';

interface GalleryMosaicProps {
  images: string[];
  alt: string;
}

export function GalleryMosaic({ images, alt }: GalleryMosaicProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };
  
  const navigateImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') navigateImage('prev');
    if (e.key === 'ArrowRight') navigateImage('next');
  };
  
  // If no images are provided, render a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-[16/9] image-placeholder rounded-xl flex items-center justify-center">
        <div className="text-center text-white/60">
          <Camera className="w-10 h-10 mx-auto mb-2" />
          <span className="text-sm">No images available</span>
        </div>
      </div>
    );
  }
  
  // Vipio-style: large left image + 2x2 grid on right
  const displayImages = images.slice(0, 5);
  const hasMoreImages = images.length > 5;
  
  return (
    <>
      <div className="relative grid grid-cols-1 md:grid-cols-12 gap-2 rounded-xl overflow-hidden" style={{ height: '480px' }}>
        {/* Main (large) image - left half */}
        <div 
          className="col-span-1 md:col-span-6 relative overflow-hidden cursor-pointer group"
          onClick={() => openModal(0)}
        >
          <UnoptimizedImage
            src={displayImages[0]}
            alt={`${alt} - main view`}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        </div>
        
        {/* Right side - 2x2 grid */}
        <div className="hidden md:grid md:col-span-6 grid-cols-2 grid-rows-2 gap-2 h-full">
          {displayImages.slice(1, 5).map((image, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden cursor-pointer group"
              onClick={() => openModal(index + 1)}
            >
              <UnoptimizedImage
                src={image}
                alt={`${alt} - view ${index + 2}`}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
            </div>
          ))}
          
          {/* Fill empty slots with placeholders if less than 5 images */}
          {Array.from({ length: Math.max(0, 4 - displayImages.slice(1).length) }).map((_, i) => (
            <div key={`placeholder-${i}`} className="image-placeholder" />
          ))}
        </div>
        
        {/* Action buttons overlay */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-800 py-2 px-4 rounded-lg text-sm font-medium shadow-sm hover:bg-white transition-all hover:shadow-md">
            <Heart size={16} />
            Save
          </button>
        </div>
        
        {/* View all photos button */}
        {hasMoreImages && (
          <button 
            onClick={() => openModal(0)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm text-gray-800 py-2.5 px-5 rounded-lg text-sm font-semibold shadow-sm hover:bg-white transition-all hover:shadow-md z-10"
          >
            <Camera size={16} />
            View all {images.length} photos
          </button>
        )}
      </div>
      
      {/* Full-screen lightbox modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-50"
          >
            <X size={20} />
          </button>
          
          {/* Image */}
          <div className="w-full h-full flex items-center justify-center px-16 py-16">
            <div className="relative w-full max-w-5xl h-full">
              <UnoptimizedImage
                src={images[currentImageIndex]}
                alt={`${alt} - full view ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
          </div>
          
          {/* Navigation */}
          <button
            onClick={() => navigateImage('prev')}
            className="absolute left-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => navigateImage('next')}
            className="absolute right-5 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Image counter + thumbnails */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <div className="bg-white/10 backdrop-blur-sm text-white text-sm font-medium py-2 px-4 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
