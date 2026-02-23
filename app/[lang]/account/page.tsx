"use client";

import { useParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';

export default function AccountPage() {
  const params = useParams();
  const lang = params.lang as Locale;

  return (
    <div className="container-custom py-16">
      <h1 className="text-3xl font-bold mb-8">Account</h1>
      <p className="text-gray-600 mb-4">Language: {lang}</p>
      <p className="text-sm text-gray-500">
        This is the account page. User information will be displayed in {lang}.
      </p>
    </div>
  );
}
