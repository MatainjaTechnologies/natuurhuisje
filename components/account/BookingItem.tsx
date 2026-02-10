"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { CalendarDays, MapPin, Users, ChevronDown, ChevronUp } from 'lucide-react';

interface BookingItemProps {
  booking: {
    id: string;
    check_in_date: string;
    check_out_date: string;
    guest_count: number;
    total_price: number;
    status: string;
    created_at: string;
    listings: {
      id: string;
      title: string;
      slug: string;
      location: string;
      images: string[];
      price_per_night: number;
      avg_rating: number | null;
    };
  };
}

export function BookingItem({ booking }: BookingItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Format dates
  const checkInDate = new Date(booking.check_in_date);
  const checkOutDate = new Date(booking.check_out_date);
  const formattedCheckIn = format(checkInDate, 'MMM d, yyyy');
  const formattedCheckOut = format(checkOutDate, 'MMM d, yyyy');
  
  // Calculate nights
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  
  // Determine status badge style
  const getStatusBadgeStyles = () => {
    switch (booking.status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-white">
      {/* Booking summary */}
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="w-full md:w-1/4 relative h-48 md:h-auto">
          <Link href={`/stay/${booking.listings.slug}`}>
            <Image
              src={booking.listings.images[0] || '/images/placeholder.jpg'}
              alt={booking.listings.title}
              fill
              className="object-cover"
            />
          </Link>
        </div>
        
        {/* Info */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Link 
                href={`/stay/${booking.listings.slug}`}
                className="text-lg font-medium text-forest-900 hover:text-forest-700"
              >
                {booking.listings.title}
              </Link>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyles()}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center text-forest-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{booking.listings.location}</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 text-forest-700 mr-2" />
                <div>
                  <p className="text-forest-600">Check-in</p>
                  <p className="font-medium">{formattedCheckIn}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 text-forest-700 mr-2" />
                <div>
                  <p className="text-forest-600">Check-out</p>
                  <p className="font-medium">{formattedCheckOut}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="h-4 w-4 text-forest-700 mr-2" />
                <div>
                  <p className="text-forest-600">Guests</p>
                  <p className="font-medium">{booking.guest_count}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Toggle expand & price */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center text-sm text-forest-700 hover:text-forest-900"
            >
              {isExpanded ? (
                <>
                  <span>Less details</span>
                  <ChevronUp className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  <span>More details</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </>
              )}
            </button>
            
            <div className="text-right">
              <p className="text-forest-600 text-sm">Total</p>
              <p className="font-semibold text-forest-900">€{booking.total_price}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Expanded details */}
      {isExpanded && (
        <div className="p-4 bg-cream-50 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-forest-900 mb-2">Booking Details</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span className="text-forest-600">Booking ID</span>
                  <span className="font-mono text-forest-700">{booking.id.slice(0, 8)}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-forest-600">Date Booked</span>
                  <span>{format(new Date(booking.created_at), 'MMM d, yyyy')}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-forest-600">Duration</span>
                  <span>{nights} night{nights !== 1 ? 's' : ''}</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-forest-900 mb-2">Payment Summary</h4>
              <ul className="space-y-1 text-sm">
                <li className="flex justify-between">
                  <span className="text-forest-600">€{booking.listings.price_per_night} × {nights} nights</span>
                  <span>€{booking.listings.price_per_night * nights}</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-forest-600">Service fee</span>
                  <span>€{booking.total_price - (booking.listings.price_per_night * nights)}</span>
                </li>
                <li className="flex justify-between font-medium border-t border-border pt-1 mt-1">
                  <span>Total</span>
                  <span>€{booking.total_price}</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Action buttons based on status */}
          <div className="mt-4 flex gap-3 justify-end">
            {booking.status === 'confirmed' && (
              <>
                <button className="btn-outline text-sm py-2">Contact Host</button>
                <button className="btn-outline text-rose-600 text-sm py-2">Cancel Booking</button>
              </>
            )}
            
            {booking.status === 'completed' && (
              <Link href={`/reviews/write?booking=${booking.id}`} className="btn-primary text-sm py-2">
                Leave a Review
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
