"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Grid,
  Building,
  MessageSquare,
  Heart,
  Calendar,
  Settings,
  Home,
  LogOut,
  DollarSign,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface AccountSidebarProps {
  lang: string;
  className?: string;
}

export default function AccountSidebar({
  lang,
  className = "",
}: AccountSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user !== null) {
      const getUserProfile = async () => {
        const supabase = createClient();
        const { data: profile, error } = await supabase
          .from("users")
          .select("display_name, avatar_url")
          .eq("auth_user_id", user.id)
          .single();

        setUserProfile(profile);
      };

      getUserProfile();
    }
  }, [user]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${lang}/login`);
  };

  const menuItems = [
    {
      href: `/${lang}/account`,
      label: "Dashboard",
      icon: Home,
      description: "Overview of your account",
    },
    {
      href: `/${lang}/account/profile`,
      label: "Profile",
      icon: User,
      description: "Manage your personal information",
    },
    {
      href: `/${lang}/account/change-password`,
      label: "Password change",
      icon: Settings,
      description: "Change your password",
    },
    {
      href: `/${lang}/account/bookings`,
      label: "My Bookings",
      icon: Calendar,
      description: "View your booking history",
    },
    {
      href: `/${lang}/account/host-bookings`,
      label: "Booking Management",
      icon: Grid,
      description: "Manage property bookings",
    },
    // {
    //   href: `/${lang}/account/favorites`,
    //   label: 'Favorites',
    //   icon: Heart,
    //   description: 'Saved properties'
    // },
    // {
    //   href: `/${lang}/account/messages`,
    //   label: 'Messages',
    //   icon: MessageSquare,
    //   description: 'Host communications'
    // },
    {
      href: `/${lang}/account/listings`,
      label: "My Properties",
      icon: Building,
      description: "Manage your listings",
    },
    {
      href: `/${lang}/account/special-pricing`,
      label: "Special Pricing",
      icon: DollarSign,
      description: "Manage seasonal pricing",
    },
    // {
    //   href: `/${lang}/account/settings`,
    //   label: 'Settings',
    //   icon: Settings,
    //   description: 'Account preferences'
    // }
  ];

  const isActive = (href: string) => {
    if (href === `/${lang}/account`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const fullName =
    user?.user_metadata?.first_name + " " + user?.user_metadata?.last_name;

  return (
    <div className={`w-64 ${className}`}>
      {/* User Profile Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            {userProfile?.avatar_url ? (
              <img
                src={userProfile?.avatar_url}
                alt={userProfile?.display_name || "Account"}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  console.error(
                    "Avatar failed to load:",
                    userProfile?.avatar_url,
                  );
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "User")}&background=7B3FA0&color=fff&size=16`}
                alt={fullName || "Account"}
                className="h-4 w-4 rounded-full object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {fullName || user?.email || "Guest"}
            </p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-white rounded-lg shadow-sm p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? "bg-purple-50 text-purple-700 border-l-4 border-purple-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
