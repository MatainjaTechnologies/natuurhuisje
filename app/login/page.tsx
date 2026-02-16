'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AuthForm } from '@/components/auth/AuthForm';
import { LandlordRegistrationModal } from '@/components/auth/LandlordRegistrationModal';

export default function LoginPage() {
  const [isLandlordModalOpen, setIsLandlordModalOpen] = useState(false);
  
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-forest-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-forest-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <AuthForm type="login" />
        
        <div className="space-y-3 mt-6">
          <Link 
            href="/register?role=guest" 
            className="flex w-full justify-center rounded-full bg-amber-100 px-4 py-3 text-sm font-semibold text-purple-700 shadow-sm hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors"
          >
            Register as a guest
          </Link>
          
          <button
            onClick={() => setIsLandlordModalOpen(true)}
            className="flex w-full justify-center rounded-full bg-amber-100 px-4 py-3 text-sm font-semibold text-purple-700 shadow-sm hover:bg-amber-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 transition-colors"
          >
            Register as a landlord
          </button>
        </div>
      </div>
      
      <LandlordRegistrationModal 
        isOpen={isLandlordModalOpen}
        onClose={() => setIsLandlordModalOpen(false)}
      />
    </div>
  );
}
