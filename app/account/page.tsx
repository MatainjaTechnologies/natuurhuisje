import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import { User, Grid, Building, MessageSquare, Heart, Calendar, HelpCircle, Settings, LogOut, Home } from 'lucide-react';

export default async function AccountPage() {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Get user profile from users table
  let profile: any = null;
  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', session.user.id)
      .single();
    profile = data;
  } catch (error) {
    console.log('Profile fetch failed, using metadata fallback');
  }
  
  // Get user's bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select(`
      *,
      listings(
        id, title, slug, images, location, price_per_night, avg_rating
      )
    `)
    .eq('guest_id', session.user.id)
    .order('check_in_date', { ascending: false }) as { data: any[] | null };
  
  // Get user's favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select(`
      *,
      listings(
        id, title, slug, images, location, price_per_night, avg_rating
      )
    `)
    .eq('user_id', session.user.id) as { data: any[] | null };
  
  // Format user name - prioritize metadata since it's more reliable
  const firstName = session.user.user_metadata?.first_name;
  const lastName = session.user.user_metadata?.last_name;
  
  const fullName = firstName && lastName ? 
    `${firstName} ${lastName}` : 
    profile?.display_name || 
    (profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : 'User');
  
  return (
    <div className="flex h-screen bg-gray-50 py-6">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-1 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white text-sm font-medium">
                  {fullName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{fullName}</h3>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="px-4">
          <div className="space-y-1">
            <Link
              href="/account"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-purple-50 text-purple-700 border-l-4 border-purple-600"
            >
              <Grid className="h-5 w-5" />
              Overview
            </Link>
            <Link
              href="/account/landlord"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Building className="h-5 w-5" />
              Landlord
            </Link>
            <Link
              href="/account/messages"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              Messages
            </Link>
            <Link
              href="/account/favorites"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Heart className="h-5 w-5" />
              Favorites
            </Link>
            <Link
              href="/account/bookings"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              Bookings
            </Link>
            <Link
              href="/account/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
            <Link
              href="/account/change-password"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-5 w-5" />
              Change password
            </Link>
            <Link
              href="/account/communication"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              Communication
            </Link>
          </div>

          {/* Sign Out Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <form action="/auth/signout" method="post">
              <button 
                type="submit" 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </form>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Overview</h1>
              <p className="text-gray-600">Welcome back! Here's what's happening with your properties today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Properties</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Bookings</p>
                    <p className="text-2xl font-bold text-gray-900">{bookings?.length || 0}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">€0</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Home className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Messages</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h2>
              {bookings && bookings.length > 0 ? (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        {booking.listings?.images?.[0] && (
                          <Image
                            src={booking.listings.images[0]}
                            alt={booking.listings.title}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">{booking.listings?.title}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">€{booking.total_price}</p>
                        <p className="text-sm text-gray-600">{booking.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No bookings yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
