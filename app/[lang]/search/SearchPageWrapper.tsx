"use client";

import { Suspense } from 'react';
import SearchPageContent from './SearchPageContent';

export default function SearchPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
