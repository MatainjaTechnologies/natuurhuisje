import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/utils/supabase/server';
import { PlusCircle, Home, Calendar, LineChart, Settings } from 'lucide-react';

export default async function HostDashboardPage() {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single() as { data: any };
    
  // If the user is not a host, update their profile to become a host
  if (profile && !profile.is_host) {
    await (supabase.from('profiles') as any).update({ is_host: true }).eq('id', session.user.id);
  }
  
  // Fetch host's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('host_id', session.user.id)
    .order('created_at', { ascending: false }) as { data: any[] | null };
    
  // Fetch host's bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      listings(id, title, slug)
    `)
    .in('listing_id', listings?.map((listing: any) => listing.id) || [])
    .order('created_at', { ascending: false }) as { data: any[] | null };
    
  // Calculate basic statistics
  const totalListings = listings?.length || 0;
  const activeBookings = bookings?.filter(b => b.status === 'confirmed').length || 0;
  const totalBookings = bookings?.length || 0;
  const totalEarnings = bookings?.reduce((sum, booking) => sum + booking.total_price, 0) || 0;
  
  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="bg-forest-900 text-white py-6">
        <div className="container-custom">
          <h1 className="text-2xl font-semibold mb-2">Host Dashboard</h1>
          <p className="text-cream-100">Manage your properties and bookings</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Host Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <nav className="flex flex-wrap gap-2">
            <Link href="/host" className="p-3 rounded-lg bg-forest-100 text-forest-800 font-medium flex items-center gap-2">
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/host/listings" className="p-3 rounded-lg hover:bg-cream-100 text-forest-700 font-medium flex items-center gap-2">
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
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-forest-600 text-sm mb-1">Active Listings</h3>
            <p className="text-3xl font-semibold text-forest-900">{totalListings}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-forest-600 text-sm mb-1">Current Bookings</h3>
            <p className="text-3xl font-semibold text-forest-900">{activeBookings}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-forest-600 text-sm mb-1">Total Bookings</h3>
            <p className="text-3xl font-semibold text-forest-900">{totalBookings}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-forest-600 text-sm mb-1">Total Earnings</h3>
            <p className="text-3xl font-semibold text-forest-900">€{totalEarnings}</p>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Listings Section */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-forest-900">Your Listings</h2>
                <Link href="/host/listings/new" className="btn-primary flex items-center gap-2">
                  <PlusCircle size={18} /> Add New Listing
                </Link>
              </div>
              
              {listings && listings.length > 0 ? (
                <div className="space-y-4">
                  {listings.map((listing) => (
                    <div key={listing.id} className="border border-border rounded-lg overflow-hidden flex flex-col sm:flex-row">
                      {/* Listing Image */}
                      <div className="w-full sm:w-40 h-32 relative">
                        <Image 
                          src={listing.images[0] || '/images/placeholder.jpg'} 
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                        <div className={`absolute top-2 right-2 text-xs px-2 py-1 rounded-full ${listing.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {listing.is_published ? 'Published' : 'Draft'}
                        </div>
                      </div>
                      
                      {/* Listing Info */}
                      <div className="p-4 flex-1">
                        <h3 className="font-medium text-forest-900 mb-1">{listing.title}</h3>
                        <p className="text-sm text-forest-600 mb-3">{listing.location}</p>
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/stay/${listing.slug}`} className="text-sm text-forest-700 hover:text-forest-900 underline">
                            View
                          </Link>
                          <Link href={`/host/listings/${listing.id}/edit`} className="text-sm text-forest-700 hover:text-forest-900 underline">
                            Edit
                          </Link>
                          {!listing.is_published && (
                            <button className="text-sm text-forest-700 hover:text-forest-900 underline">
                              Publish
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Listing Stats */}
                      <div className="bg-cream-50 p-4 flex flex-row sm:flex-col justify-around sm:w-32 border-t sm:border-t-0 sm:border-l border-border">
                        <div className="text-center">
                          <p className="text-sm text-forest-600">Price</p>
                          <p className="font-medium">€{listing.price_per_night}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-forest-600">Bookings</p>
                          <p className="font-medium">{bookings?.filter(b => b.listing_id === listing.id).length || 0}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                  <h3 className="text-lg font-medium text-forest-700 mb-2">You haven't added any listings yet</h3>
                  <p className="text-forest-600 mb-6">Start earning by sharing your unique nature property with guests</p>
                  <Link href="/host/listings/new" className="btn-primary">
                    Add Your First Listing
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Recent Activity Section */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-forest-900 mb-6">Recent Activity</h2>
              
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-forest-900">{booking.listings.title}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm text-forest-600 mb-1">
                        {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-forest-600">€{booking.total_price} · {booking.guest_count} guests</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-forest-600">No bookings yet</p>
              )}
              
              {bookings && bookings.length > 0 && (
                <div className="mt-4 text-center">
                  <Link href="/host/bookings" className="text-sm text-forest-700 hover:text-forest-900">
                    View All Bookings →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
