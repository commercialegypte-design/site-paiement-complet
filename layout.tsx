import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Éonite - Paiement Sécurisé',
  description: 'Payez vos devis Éonite en ligne de manière sécurisée',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
