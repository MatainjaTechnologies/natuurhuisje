"use client";

import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapComponentProps {
  listings: any[];
}

const locationCoordinates: Record<string, [number, number]> = {
  'Gelderland, Netherlands': [52.0451, 5.8718],
  'Utrecht, Netherlands': [52.0907, 5.1214],
  'Limburg, Netherlands': [51.4427, 6.0608],
  'Noord-Brabant, Netherlands': [51.4826, 5.4814],
  'Overijssel, Netherlands': [52.4384, 6.5017],
  'Zeeland, Netherlands': [51.4940, 3.8497],
  'Friesland, Netherlands': [53.1641, 5.7818],
  'Drenthe, Netherlands': [52.9476, 6.6234],
  'Groningen, Netherlands': [53.2194, 6.5665],
  'Flevoland, Netherlands': [52.5271, 5.5985],
  'Noord-Holland, Netherlands': [52.5208, 4.7881],
  'Zuid-Holland, Netherlands': [51.9225, 4.4792],
};

const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div style="
      background-color: #14b8a6;
      width: 32px;
      height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function MapComponent({ listings }: MapComponentProps) {
  const listingsWithCoords = useMemo(() => {
    return listings
      .map(listing => ({
        ...listing,
        coordinates: locationCoordinates[listing.location] || null,
      }))
      .filter(listing => listing.coordinates !== null);
  }, [listings]);

  const center: [number, number] = useMemo(() => {
    if (listingsWithCoords.length === 0) {
      return [52.1326, 5.2913];
    }
    
    const avgLat = listingsWithCoords.reduce((sum, l) => sum + l.coordinates[0], 0) / listingsWithCoords.length;
    const avgLng = listingsWithCoords.reduce((sum, l) => sum + l.coordinates[1], 0) / listingsWithCoords.length;
    
    return [avgLat, avgLng];
  }, [listingsWithCoords]);

  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  if (listingsWithCoords.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-100 rounded-xl">
        <p className="text-neutral-600">No locations available to display on map</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={center}
      zoom={8}
      style={{ height: '100%', width: '100%' }}
      className="rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {listingsWithCoords.map((listing) => (
        <Marker
          key={listing.id}
          position={listing.coordinates}
          icon={customIcon}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-sm mb-1">{listing.title}</h3>
              <p className="text-xs text-neutral-600 mb-2">{listing.location}</p>
              <p className="text-sm font-semibold text-teal-600">
                €{listing.price_per_night} / night
              </p>
              {listing.avg_rating && (
                <p className="text-xs text-neutral-600 mt-1">
                  ⭐ {listing.avg_rating}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
