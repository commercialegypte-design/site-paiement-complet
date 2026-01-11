// components/ui/Card.tsx
// Composant Card réutilisable

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-xl p-8 border border-stone-200 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }: CardProps) {
  return (
    <h1 className={`text-3xl font-serif text-stone-800 mb-2 text-center ${className}`}>
      {children}
    </h1>
  );
}

export function CardDescription({ children, className = '' }: CardProps) {
  return (
    <p className={`text-stone-600 text-center text-sm ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }: CardProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardProps) {
  return (
    <div className={`mt-6 pt-6 border-t border-stone-200 ${className}`}>
      {children}
    </div>
  );
}
