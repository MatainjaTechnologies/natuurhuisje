import Link from 'next/link';
import { Instagram, Facebook, Twitter } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-14">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-gray-500 leading-relaxed">
              Find your perfect escape in nature&apos;s embrace. Book unique cabins, treehouses, and more.
            </p>
            <div className="flex gap-3 mt-6">
              <Link href="#" className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <Instagram size={16} />
              </Link>
              <Link href="#" className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <Facebook size={16} />
              </Link>
              <Link href="#" className="p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-700 transition-colors">
                <Twitter size={16} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Discover</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/search" className="text-gray-500 hover:text-gray-900 transition-colors">All Stays</Link></li>
              <li><Link href="/search?type=cabin" className="text-gray-500 hover:text-gray-900 transition-colors">Cabins</Link></li>
              <li><Link href="/search?type=treehouse" className="text-gray-500 hover:text-gray-900 transition-colors">Treehouses</Link></li>
              <li><Link href="/search?type=glamping" className="text-gray-500 hover:text-gray-900 transition-colors">Glamping</Link></li>
              <li><Link href="/search?type=tiny-house" className="text-gray-500 hover:text-gray-900 transition-colors">Tiny Houses</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Host</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/host" className="text-gray-500 hover:text-gray-900 transition-colors">Become a Host</Link></li>
              <li><Link href="/host/listings" className="text-gray-500 hover:text-gray-900 transition-colors">Manage Listings</Link></li>
              <li><Link href="/host/bookings" className="text-gray-500 hover:text-gray-900 transition-colors">View Bookings</Link></li>
              <li><Link href="/host/insights" className="text-gray-500 hover:text-gray-900 transition-colors">Host Insights</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Support</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/help" className="text-gray-500 hover:text-gray-900 transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="text-gray-500 hover:text-gray-900 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-500 hover:text-gray-900 transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="text-gray-500 hover:text-gray-900 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-12 pt-6 text-sm text-gray-400 flex flex-col md:flex-row justify-between">
          <p>&copy; {currentYear} NatureStays. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-gray-700 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-700 transition-colors">Terms</Link>
            <Link href="/cookies" className="hover:text-gray-700 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
