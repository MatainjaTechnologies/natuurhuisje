"use client";

import { useState } from 'react';
import { X, Wifi, Car, Utensils, Flame, Waves, Wind, Trees, Mountain, Home } from 'lucide-react';

interface ShowAllAmenitiesModalProps {
  amenities: string[];
}

const amenityIcons: Record<string, any> = {
  'WiFi': Wifi,
  'Parking': Car,
  'Kitchen': Utensils,
  'Fireplace': Flame,
  'BBQ': Flame,
  'Pool': Waves,
  'Lake Access': Waves,
  'Mountain Views': Mountain,
  'Forest': Trees,
  'Secluded': Trees,
  'Hot Tub': Waves,
};

export function ShowAllAmenitiesModal({ amenities }: ShowAllAmenitiesModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeModal = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };
  
  const getIcon = (amenity: string) => {
    const Icon = amenityIcons[amenity] || Home;
    return <Icon size={20} />;
  };
  
  return (
    <>
      <button
        onClick={openModal}
        className="mt-4 px-6 py-2.5 border border-neutral-900 text-neutral-900 rounded-lg font-semibold hover:bg-neutral-50 transition-colors"
      >
        Show all amenities
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-neutral-200">
              <h2 className="text-2xl font-semibold">All amenities</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-3 py-3">
                    <div className="text-neutral-700">
                      {getIcon(amenity)}
                    </div>
                    <span className="text-neutral-900">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
