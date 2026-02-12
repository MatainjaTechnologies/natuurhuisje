'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { Menu, Search, User as UserIcon, Calendar, Users } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { SearchDock } from '@/components/SearchDock';
import { useState, useEffect } from 'react';

interface HeaderProps {
  user?: User | null;
}

export function Header({ user }: HeaderProps) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showSearchDock, setShowSearchDock] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<'where' | 'dates' | 'people' | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
        setShowSearchDock(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="w-full fixed top-0 z-50">
      {/* Top Banner */}
      <div className="w-full bg-white border-b border-gray-200 py-2">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-8 text-xs">
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-700">In the middle of nature</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-700">Away from the crowd</span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-gray-700">Contribute to nature projects</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Header */}
      <div className="w-full py-4 bg-white border-b border-black/5 shadow-sm transition-all duration-300">
        <div className="container-custom flex justify-between items-center">
          <Logo size="md" />
        
          {/* Search Bar - Shows on Scroll */}
          <div className={`hidden md:flex items-center transition-all duration-300 ${showSearchBar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
            {!showSearchDock ? (
              <div className="flex items-center bg-blue-50 rounded-xl overflow-hidden shadow-sm">
                {/* Where/What Input */}
                <button 
                  onClick={() => {
                    setActiveSearchTab('where');
                    setShowSearchDock(true);
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-white rounded-l-xl hover:bg-gray-50 transition-colors"
                >
                  <Search className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700 font-medium">Where or what?</span>
                </button>
                
                {/* Date Picker */}
                <button 
                  onClick={() => {
                    setActiveSearchTab('dates');
                    setShowSearchDock(true);
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-white ml-px hover:bg-gray-50 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700 font-medium">Choose dates</span>
                </button>
                
                {/* Guests */}
                <button 
                  onClick={() => {
                    setActiveSearchTab('people');
                    setShowSearchDock(true);
                  }}
                  className="flex items-center gap-2 px-5 py-3 bg-white ml-px hover:bg-gray-50 transition-colors"
                >
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-700 font-medium">people</span>
                </button>
                
                {/* Search Button */}
                <button 
                  onClick={() => setShowSearchDock(true)}
                  className="bg-teal-500 text-white px-6 py-3 rounded-r-xl ml-px flex items-center justify-center hover:bg-teal-600 transition-colors"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="w-full max-w-3xl">
                <SearchDock variant="compact" maxWidth="max-w-3xl" initialTab={activeSearchTab} />
              </div>
            )}
          </div>
        
          <div className="flex items-center gap-3">
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
      </div>

    </header>
  );
}
