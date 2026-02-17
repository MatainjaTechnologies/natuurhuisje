import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server';
import ProfileForm from '@/components/account/ProfileForm';

export default async function ProfilePage() {
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

  // Get user metadata for additional info
  const firstName = session.user.user_metadata?.first_name;
  const lastName = session.user.user_metadata?.last_name;
  
  const fullName = firstName && lastName ? 
    `${firstName} ${lastName}` : 
    profile?.display_name || 
    (profile?.first_name && profile?.last_name ? `${profile.first_name} ${profile.last_name}` : 'User');

  const avatarUrl = profile?.avatar_url || '';

  return (
    <div className="flex h-screen bg-gray-50 py-6">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        <div className="p-6">
          <div className="flex items-center gap-1 mb-6">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
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
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Overview
            </Link>
            <Link
              href="/account/landlord"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Landlord
            </Link>
            <Link
              href="/account/messages"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Messages
            </Link>
            <Link
              href="/account/favorites"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Favorites
            </Link>
            <Link
              href="/account/bookings"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Bookings
            </Link>
            <Link
              href="/account/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-purple-50 text-purple-700 border-l-4 border-purple-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </Link>
            <Link
              href="/account/change-password"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Change password
            </Link>
            <Link
              href="/account/communication"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
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
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </form>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h1>
              <p className="text-gray-600">Manage your personal information and account details</p>
            </div>

            <ProfileForm 
              profile={profile} 
              session={session}
              fullName={fullName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
