// components/ui/Logo.tsx
// Composant Logo Éonite

import Image from 'next/image';

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export function Logo({ width = 256, height = 96, className = '' }: LogoProps) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src="/logo-eonite.png"
        alt="Éonite"
        fill
        className="object-contain"
        priority
      />
    </div>
  );
}
