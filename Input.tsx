// components/ui/Input.tsx
// Composant Input réutilisable

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-stone-700 mb-2"
        >
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 border rounded-lg outline-none transition-all ${
          error
            ? 'border-red-300 focus:ring-2 focus:ring-red-400'
            : 'border-stone-300 focus:ring-2 focus:ring-stone-400 focus:border-transparent'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
