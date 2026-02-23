"use client";

import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export default function HostPage() {
  const params = useParams();
  const lang = params.lang as Locale;

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-8">Host Dashboard</h1>
      <p className="text-gray-600 mb-4">Language: {lang}</p>
      <p className="text-sm text-gray-500">
        This is the host dashboard. Hosting information will be displayed in {lang}.
      </p>
    </div>
  );
}
