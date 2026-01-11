// app/client/payment-result/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const quoteId = searchParams.get('quoteId');
  
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ici vous pouvez faire un appel API pour récupérer les détails du devis
    // Pour l'instant, on simule juste un délai
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [quoteId]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700 mb-4"></div>
          <p className="text-stone-600">Vérification du paiement...</p>
        </div>
      );
    }

    switch (status) {
      case 'success':
        return (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-stone-800 mb-3">
              Paiement réussi !
            </h1>
            <p className="text-stone-600 mb-6">
              Votre paiement a été accepté avec succès.
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-green-800">
                Un email de confirmation vous a été envoyé.<br />
                Nous préparons votre commande.
              </p>
            </div>
          </div>
        );

      case 'pending':
        return (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-stone-800 mb-3">
              Paiement en cours
            </h1>
            <p className="text-stone-600 mb-6">
              Votre paiement est en cours de traitement.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Cela peut prendre quelques instants.<br />
                Vous recevrez un email de confirmation dès validation.
              </p>
            </div>
          </div>
        );

      case 'failed':
      case 'canceled':
        return (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-stone-800 mb-3">
              {status === 'canceled' ? 'Paiement annulé' : 'Paiement échoué'}
            </h1>
            <p className="text-stone-600 mb-6">
              {status === 'canceled'
                ? 'Vous avez annulé le paiement.'
                : 'Une erreur est survenue lors du paiement.'}
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Aucun montant n'a été débité.<br />
                Vous pouvez réessayer ou nous contacter pour assistance.
              </p>
            </div>
            <Link
              href="/client/payer-devis"
              className="inline-block bg-stone-700 hover:bg-stone-800 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Réessayer le paiement
            </Link>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-8 h-8 text-stone-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-stone-800 mb-3">
              Statut inconnu
            </h1>
            <p className="text-stone-600 mb-6">
              Nous n'avons pas pu déterminer le statut de votre paiement.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header avec logo */}
        <div className="flex justify-center mb-12">
          <div className="relative w-64 h-24">
            <Image
              src="/logo-eonite.png"
              alt="Éonite"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Carte principale */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-200">
            {renderContent()}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-stone-200 text-center">
              <p className="text-sm text-stone-600 mb-2">
                Besoin d'aide ?
              </p>
              <a
                href="mailto:contact@eonite.com"
                className="text-sm text-stone-700 hover:text-stone-900 underline"
              >
                Contactez notre service client
              </a>
            </div>

            {status === 'success' && (
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="text-sm text-stone-600 hover:text-stone-800 underline"
                >
                  Retour à l'accueil
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-700"></div>
      </div>
    }>
      <PaymentResultContent />
    </Suspense>
  );
}
