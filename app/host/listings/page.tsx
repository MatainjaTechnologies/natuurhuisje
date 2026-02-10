import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { PlusCircle, Home, Calendar, LineChart, Settings, Eye, Edit, Trash2 } from 'lucide-react';

export default async function HostListingsPage() {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Fetch host's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*, bookings(*)')
    .eq('host_id', session.user.id)
    .order('created_at', { ascending: false }) as { data: any[] | null };

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="bg-forest-900 text-white py-6">
        <div className="container-custom">
          <h1 className="text-2xl font-semibold mb-2">My Listings</h1>
          <p className="text-cream-100">Manage your properties</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Host Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <nav className="flex flex-wrap gap-2">
            <Link href="/host" className="p-3 rounded-lg hover:bg-cream-100 text-forest-700 font-medium flex items-center gap-2">
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/host/listings" className="p-3 rounded-lg bg-forest-100 text-forest-800 font-medium flex items-center gap-2">
              <Home size={18} /> My Listings
            </Link>
            <Link href="/host/bookings" className="p-3 rounded-lg hover:bg-cream-100 text-forest-700 font-medium flex items-center gap-2">
              <Calendar size={18} /> Bookings
            </Link>
            <Link href="/host/insights" className="p-3 rounded-lg hover:bg-cream-100 text-forest-700 font-medium flex items-center gap-2">
              <LineChart size={18} /> Insights
            </Link>
            <Link href="/host/settings" className="p-3 rounded-lg hover:bg-cream-100 text-forest-700 font-medium flex items-center gap-2">
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>
        
        {/* Add New Listing Button */}
        <div className="flex justify-end mb-6">
          <Link href="/host/listings/new" className="btn-primary flex items-center gap-2">
            <PlusCircle size={18} /> Add New Listing
          </Link>
        </div>
        
        {listings && listings.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {listings.map((listing: any) => {
              const bookingCount = listing.bookings ? listing.bookings.length : 0;
              const activeBookings = listing.bookings ? listing.bookings.filter((b: any) => b.status === 'confirmed').length : 0;
              
              return (
                <div key={listing.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    {/* Listing Image */}
                    <div className="md:w-64 h-48 md:h-auto relative">
                      <Image 
                        src={listing.images?.[0] || '/images/placeholder.jpg'} 
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                      <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${
                        listing.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {listing.is_published ? 'Published' : 'Draft'}
                      </div>
                    </div>
                    
                    {/* Listing Details */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between">
                        <div>
                          <h2 className="text-xl font-semibold text-forest-900 mb-1">{listing.title}</h2>
                          <p className="text-sm text-forest-600 mb-4">{listing.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-forest-900">€{listing.price_per_night}</p>
                          <p className="text-sm text-forest-600">per night</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-forest-600">Max Guests</p>
                          <p className="font-medium">{listing.max_guests}</p>
                        </div>
                        <div>
                          <p className="text-sm text-forest-600">Bedrooms</p>
                          <p className="font-medium">{listing.bedrooms}</p>
                        </div>
                        <div>
                          <p className="text-sm text-forest-600">Bathrooms</p>
                          <p className="font-medium">{listing.bathrooms}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {listing.amenities?.map((amenity: string, index: number) => (
                          <span key={index} className="inline-block text-xs px-2 py-1 rounded-full bg-cream-100 text-forest-700">
                            {amenity}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-border">
                        <div className="flex gap-4">
                          <div>
                            <p className="text-sm text-forest-600">Bookings</p>
                            <p className="font-medium">{bookingCount}</p>
                          </div>
                          <div>
                            <p className="text-sm text-forest-600">Active</p>
                            <p className="font-medium">{activeBookings}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link 
                            href={`/stay/${listing.slug}`}
                            className="p-2 rounded-md hover:bg-cream-100"
                            title="View Listing"
                          >
                            <Eye size={18} className="text-forest-600" />
                          </Link>
                          <Link 
                            href={`/host/listings/${listing.id}/edit`}
                            className="p-2 rounded-md hover:bg-cream-100"
                            title="Edit Listing"
                          >
                            <Edit size={18} className="text-forest-600" />
                          </Link>
                          <button 
                            className="p-2 rounded-md hover:bg-cream-100"
                            title="Delete Listing"
                          >
                            <Trash2 size={18} className="text-rose-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center">
            <div className="flex justify-center mb-4">
              <Home size={48} className="text-forest-300" />
            </div>
            <h2 className="text-xl font-semibold text-forest-900 mb-2">No listings yet</h2>
            <p className="text-forest-600 mb-6">Share your nature property and start earning</p>
            <Link href="/host/listings/new" className="btn-primary">
              Add Your First Listing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
