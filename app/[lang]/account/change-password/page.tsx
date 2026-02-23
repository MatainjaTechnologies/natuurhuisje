'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ChangePasswordForm } from '@/components/account/ChangePasswordForm';
import { Session } from '@supabase/supabase-js';
import { User, Grid, Building, MessageSquare, Heart, Calendar, Lock, LogOut, Settings } from 'lucide-react';
import React from 'react';

function ChangePasswordPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
        return;
      }

      // Get user profile for avatar
      try {
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', session.user.id)
          .single();
        setProfile(data);
      } catch (error) {
        console.log('Profile fetch failed');
      }

      setSession(session);
      setLoading(false);
    };

    checkSession();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

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
                  alt={session.user.user_metadata?.first_name && session.user.user_metadata?.last_name 
                    ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`
                    : 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-purple-600 text-white text-sm font-medium">
                  {(session.user.user_metadata?.first_name && session.user.user_metadata?.last_name 
                    ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`
                    : 'User').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {session.user.user_metadata?.first_name && session.user.user_metadata?.last_name 
                  ? `${session.user.user_metadata.first_name} ${session.user.user_metadata.last_name}`
                  : 'User'}
              </h3>
              <p className="text-sm text-gray-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="px-4">
          <div className="space-y-1">
            <a
              href="/account"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Grid className="h-5 w-5" />
              Overview
            </a>
            <a
              href="/account/landlord"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Building className="h-5 w-5" />
              Landlord
            </a>
            <a
              href="/account/messages"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              Messages
            </a>
            <a
              href="/account/favorites"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Heart className="h-5 w-5" />
              Favorites
            </a>
            <a
              href="/account/bookings"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Calendar className="h-5 w-5" />
              Bookings
            </a>
            <a
              href="/account/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="h-5 w-5" />
              Profile
            </a>
            <a
              href="/account/change-password"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg bg-purple-50 text-purple-700 border-l-4 border-purple-600"
            >
              <Settings className="h-5 w-5" />
              Change password
            </a>
            <a
              href="/account/communication"
              className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <MessageSquare className="h-5 w-5" />
              Communication
            </a>
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
          <div className="mx-auto">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="px-6 py-4 border-b border-gray-200">
                <h1 className="text-2xl font-semibold text-gray-900">Change Password</h1>
                <p className="text-sm text-gray-600 mt-1">Update your account password</p>
              </div>
              
              <div className="p-6">
                <ChangePasswordForm session={session} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePasswordPage;
