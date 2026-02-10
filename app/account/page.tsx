import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListingCard } from '@/components/ListingCard';
import { BookingItem } from '@/components/account/BookingItem';
import { createClient } from '@/utils/supabase/server';

export default async function AccountPage() {
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
  
  // Format user name
  const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User' : 'User';
  
  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="container-custom py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Account Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 rounded-full overflow-hidden bg-forest-100">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={fullName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-forest-500 text-2xl font-medium">
                    {fullName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-forest-900">{fullName}</h1>
                <p className="text-forest-600">{session.user.email}</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Link href="/account/profile" className="btn-outline">
                Edit Profile
              </Link>
              <form action="/auth/signout" method="post">
                <button type="submit" className="btn-outline text-rose-600 border-rose-300 hover:bg-rose-50">
                  Sign Out
                </button>
              </form>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="bookings">My Bookings</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <div className="space-y-6">
                {bookings && bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <BookingItem key={booking.id} booking={booking} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-cream-50 rounded-xl">
                    <h3 className="text-lg font-medium text-forest-700 mb-2">You haven't made any bookings yet</h3>
                    <p className="text-forest-600 mb-6">Explore our unique stays and find your perfect nature getaway</p>
                    <Link href="/search" className="btn-primary">
                      Explore Stays
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="favorites">
              {favorites && favorites.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((favorite) => (
                    <ListingCard
                      key={favorite.id}
                      id={favorite.listings.id}
                      slug={favorite.listings.slug}
                      title={favorite.listings.title}
                      location={favorite.listings.location}
                      images={favorite.listings.images}
                      pricePerNight={favorite.listings.price_per_night}
                      rating={favorite.listings.avg_rating}
                      isFavorited={true}
                      onToggleFavorite={() => {}}  // This would be handled client-side
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-cream-50 rounded-xl">
                  <h3 className="text-lg font-medium text-forest-700 mb-2">You haven't saved any favorites yet</h3>
                  <p className="text-forest-600 mb-6">Click the heart icon on listings you love to save them here</p>
                  <Link href="/search" className="btn-primary">
                    Explore Stays
                  </Link>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
