import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Menu, Search, User as UserIcon } from 'lucide-react';
import { Logo } from '@/components/Logo';

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="w-full py-4 fixed top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-black/5 shadow-sm">
      <div className="container-custom flex justify-between items-center">
        <Logo size="md" />
        
        <div className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all">Home</Link>
          <Link href="/search" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all">Explore</Link>
          <Link href="/host" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all">Become a Host</Link>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/search" className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors">
            <Search className="h-4 w-4 text-gray-600" />
          </Link>
          
          {user ? (
            <div className="flex items-center gap-3">
              <Link href="/host" className="hidden md:block text-sm btn-outline">
                Manage Listings
              </Link>
              <Link 
                href="/account" 
                className="p-2 rounded-xl text-white transition-all hover:shadow-md" style={{ background: 'linear-gradient(135deg, #7B3FA0, #5B2D8E)' }}
              >
                <UserIcon className="h-5 w-5" />
              </Link>
            </div>
          ) : (
            <Link 
              href="/login"
              className="hidden md:block text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:shadow-md hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #7B3FA0, #5B2D8E)' }}
            >
              Sign in
            </Link>
          )}
          
          <button className="p-2.5 rounded-xl hover:bg-gray-100 md:hidden transition-colors">
            <Menu className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
