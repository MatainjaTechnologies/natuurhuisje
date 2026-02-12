"use client";

import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="bg-neutral-100 h-full rounded-xl flex items-center justify-center">
      <p className="text-neutral-600">Loading map...</p>
    </div>
  ),
}) as React.ComponentType<{ listings: any[] }>;

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  listings: any[];
}

export function MapModal({ isOpen, onClose, listings }: MapModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-semibold">Map View</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full rounded-xl overflow-hidden">
            <MapComponent listings={listings} />
          </div>
        </div>
      </div>
    </div>
  );
}
