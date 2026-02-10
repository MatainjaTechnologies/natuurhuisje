import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { Home, Calendar, LineChart, Settings } from 'lucide-react';

export default async function HostBookingsPage() {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Get user's listings
  const { data: listings } = await supabase
    .from('listings')
    .select('*')
    .eq('host_id', session.user.id)
    .order('created_at', { ascending: false }) as { data: any[] | null };
    
  // Fetch all bookings for user's listings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      listings(id, title, slug, images),
      profiles(id, first_name, last_name, avatar_url)
    `)
    .in('listing_id', listings?.map((listing: any) => listing.id) || [])
    .order('created_at', { ascending: false }) as { data: any[] | null };

  // Group bookings by status
  const pendingBookings = bookings?.filter((b: any) => b.status === 'pending') || [];
  const confirmedBookings = bookings?.filter((b: any) => b.status === 'confirmed') || [];
  const completedBookings = bookings?.filter((b: any) => b.status === 'completed') || [];
  const cancelledBookings = bookings?.filter((b: any) => b.status === 'cancelled') || [];

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="bg-forest-900 text-white py-6">
        <div className="container-custom">
          <h1 className="text-2xl font-semibold mb-2">Manage Bookings</h1>
          <p className="text-cream-100">Review and manage guest reservations</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Host Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8">
          <nav className="flex flex-wrap gap-2">
            <Link href="/host" className="p-3 rounded-lg hover:bg-cream-100 text-forest-700 font-medium flex items-center gap-2">
              <Home size={18} /> Dashboard
            </Link>
            <Link href="/host/listings" className="p-3 rounded-lg hover:bg-cream-100 text-forest-700 font-medium flex items-center gap-2">
              <Home size={18} /> My Listings
            </Link>
            <Link href="/host/bookings" className="p-3 rounded-lg bg-forest-100 text-forest-800 font-medium flex items-center gap-2">
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
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="h-12 w-12 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-forest-600">Pending</p>
              <p className="text-2xl font-semibold">{pendingBookings.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="h-12 w-12 flex items-center justify-center bg-green-100 text-green-600 rounded-full mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-forest-600">Confirmed</p>
              <p className="text-2xl font-semibold">{confirmedBookings.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="h-12 w-12 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-forest-600">Completed</p>
              <p className="text-2xl font-semibold">{completedBookings.length}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center">
            <div className="h-12 w-12 flex items-center justify-center bg-rose-100 text-rose-600 rounded-full mr-4">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-forest-600">Cancelled</p>
              <p className="text-2xl font-semibold">{cancelledBookings.length}</p>
            </div>
          </div>
        </div>
        
        {/* Booking Tabs */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-border">
            <nav className="flex">
              <button className="px-6 py-4 border-b-2 border-forest-600 font-medium text-forest-800">
                All Bookings ({bookings?.length || 0})
              </button>
              <button className="px-6 py-4 text-forest-600 hover:text-forest-800">
                Pending ({pendingBookings.length})
              </button>
              <button className="px-6 py-4 text-forest-600 hover:text-forest-800">
                Confirmed ({confirmedBookings.length})
              </button>
              <button className="px-6 py-4 text-forest-600 hover:text-forest-800">
                Completed ({completedBookings.length})
              </button>
              <button className="px-6 py-4 text-forest-600 hover:text-forest-800">
                Cancelled ({cancelledBookings.length})
              </button>
            </nav>
          </div>
          
          {bookings && bookings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-cream-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-600 uppercase tracking-wider">Guest</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-600 uppercase tracking-wider">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-600 uppercase tracking-wider">Dates</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-600 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-forest-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-white">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-cream-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full overflow-hidden bg-forest-100 relative">
                            {booking.profiles.avatar_url ? (
                              <Image 
                                src={booking.profiles.avatar_url}
                                alt={`${booking.profiles.first_name} ${booking.profiles.last_name}`}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-forest-600 font-medium">
                                {booking.profiles.first_name?.[0]}{booking.profiles.last_name?.[0]}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-forest-900">{booking.profiles.first_name} {booking.profiles.last_name}</div>
                            <div className="text-sm text-forest-500">#{booking.id.slice(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded overflow-hidden bg-forest-100 relative">
                            {booking.listings.images && booking.listings.images[0] ? (
                              <Image 
                                src={booking.listings.images[0]}
                                alt={booking.listings.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-forest-600 font-medium">
                                {booking.listings.title.substring(0, 1)}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-forest-900">{booking.listings.title}</div>
                            <div className="text-sm text-forest-500">
                              <Link href={`/stay/${booking.listings.slug}`} className="hover:underline">
                                View listing
                              </Link>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-forest-900">
                          {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-forest-500">
                          {booking.guest_count} {booking.guest_count === 1 ? 'guest' : 'guests'} · {booking.nights} {booking.nights === 1 ? 'night' : 'nights'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-forest-900">€{booking.total_price}</div>
                        <div className="text-xs text-forest-500">{booking.payment_status || 'Paid'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <Link href={`/host/bookings/${booking.id}`} className="text-forest-600 hover:text-forest-900">
                          Details
                        </Link>
                        {booking.status === 'pending' && (
                          <>
                            <button className="text-green-600 hover:text-green-900">
                              Approve
                            </button>
                            <button className="text-rose-600 hover:text-rose-900">
                              Decline
                            </button>
                          </>
                        )}
                        {booking.status === 'confirmed' && (
                          <button className="text-rose-600 hover:text-rose-900">
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-forest-700 mb-2">No bookings yet</h3>
              <p className="text-forest-500 mb-6">When guests book your properties, you'll see their reservations here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
