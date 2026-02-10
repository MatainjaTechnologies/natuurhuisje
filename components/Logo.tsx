import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const heights = {
    sm: 24,
    md: 32,
    lg: 40,
  };

  return (
    <Link href="/" className={`flex items-center group ${className}`}>
      <Image
        src="/images/natuurhuisje.svg"
        alt="natuurhuisje"
        width={heights[size] * 5.6}
        height={heights[size]}
        className="transition-opacity group-hover:opacity-80"
        priority
      />
    </Link>
  );
}
