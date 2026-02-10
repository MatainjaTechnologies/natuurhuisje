"use client";

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

// Create a component that uses unoptimized images to avoid the Next.js image optimization errors
export default function UnoptimizedImage({
  src,
  alt,
  className,
  ...rest
}: ImageProps) {
  const [error, setError] = useState(false);
  
  // Use a beautiful gradient placeholder if image fails to load
  if (error) {
    return (
      <div 
        className={`image-placeholder ${className || ''}`}
        style={{ width: '100%', height: '100%', position: rest.fill ? 'absolute' : 'relative', inset: rest.fill ? 0 : undefined }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt || ''}
      unoptimized={true}
      onError={() => setError(true)}
      className={className}
      {...rest}
    />
  );
}
