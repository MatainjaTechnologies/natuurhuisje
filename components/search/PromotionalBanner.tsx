import Link from 'next/link';
import UnoptimizedImage from '../UnoptimizedImage';

export function PromotionalBanner() {
  return (
    <section className="relative h-[400px] overflow-hidden group">
      <UnoptimizedImage
        src="/images/banner3.jpeg"
        alt="Together we protect local biodiversity"
        fill
        className="object-cover group-hover:scale-110 transition-transform duration-500"
        priority
      />
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Together we protect local biodiversity
          </h2>
          <Link
            href="/about"
            className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            More information
          </Link>
        </div>
      </div>
    </section>
  );
}
