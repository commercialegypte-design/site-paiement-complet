// app/api/pay-quote/route.ts
// Route API pour initier le paiement d'un devis via Mollie - VERSION FINALE

import { NextRequest, NextResponse } from 'next/server';
import { mollieClient, getRedirectUrls } from '@/lib/mollie/client';
import { canQuoteBePaid, updateQuote } from '@/lib/db/quotes-production';
import { PayQuoteSchema } from '@/lib/validation/schemas';
import { logger } from '@/lib/logging/logger';
import { QuoteStatus } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    // Récupération et validation du body
    const body = await request.json();
    
    const validation = PayQuoteSchema.safeParse(body);
    
    if (!validation.success) {
      logger.warn('Validation échouée', 'PayQuote', {
        errors: validation.error.errors,
        body,
      });
      
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors.map(e => e.message),
        },
        { status: 400 }
      );
    }

    const { quoteNumber, email } = validation.data;

    logger.info('Demande de paiement reçue', 'PayQuote', {
      quoteNumber,
      email,
    });

    // Vérification si le devis peut être payé
    const check = await canQuoteBePaid(quoteNumber, email);

    if (!check.can) {
      logger.warn('Devis non payable', 'PayQuote', {
        quoteNumber,
        email,
        reason: check.reason,
      });
      
      return NextResponse.json(
        { error: check.reason },
        { status: 400 }
      );
    }

    const quote = check.quote!;

    // Si un paiement est déjà en cours, retourner l'URL existante
    if (quote.mollieCheckoutUrl && quote.status === QuoteStatus.PROCESSING) {
      logger.info('Paiement déjà en cours', 'PayQuote', {
        quoteNumber,
        mollieOrderId: quote.mollieOrderId,
      });
      
      return NextResponse.json({
        success: true,
        checkoutUrl: quote.mollieCheckoutUrl,
        orderId: quote.mollieOrderId,
      });
    }

    // Création de l'Order Mollie
    const { redirectUrl, webhookUrl } = getRedirectUrls();
    
    logger.debug('Création order Mollie', 'PayQuote', {
      amount: quote.amount / 100,
      currency: quote.currency,
      quoteNumber,
    });

    const mollieOrder = await mollieClient.orders.create({
      amount: {
        value: (quote.amount / 100).toFixed(2),
        currency: quote.currency,
      },
      redirectUrl: `${redirectUrl}&quoteId=${quote.id}`,
      webhookUrl: webhookUrl,
      locale: 'fr_FR',
      metadata: {
        quoteId: quote.id,
        quoteNumber: quote.quoteNumber,
      },
      billingAddress: {
        givenName: quote.customerName || 'Client',
        familyName: quote.companyName || 'Éonite',
        email: quote.customerEmail,
        streetAndNumber: quote.streetAndNumber || 'N/A',
        city: quote.city || 'Paris',
        region: quote.region || 'Île-de-France',
        postalCode: quote.postalCode || '75000',
        country: quote.country || 'FR',
      },
      lines: [
        {
          name: quote.description,
          quantity: 1,
          unitPrice: {
            value: (quote.amount / 100).toFixed(2),
            currency: quote.currency,
          },
          totalAmount: {
            value: (quote.amount / 100).toFixed(2),
            currency: quote.currency,
          },
          vatRate: quote.vatRate.toString(),
          vatAmount: {
            value: (quote.vatAmount / 100).toFixed(2),
            currency: quote.currency,
          },
        },
      ],
      // Décommenter pour forcer l'affichage de Billie uniquement
      // methods: ['billie', 'banktransfer'],
    });

    // Mise à jour du devis avec l'ID Mollie
    await updateQuote(quote.id, {
      mollieOrderId: mollieOrder.id,
      mollieCheckoutUrl: mollieOrder._links.checkout?.href,
      status: QuoteStatus.PROCESSING,
    });

    logger.paymentInitiated(quote.quoteNumber, quote.amount, quote.customerEmail);

    // Retour de l'URL de checkout
    return NextResponse.json({
      success: true,
      checkoutUrl: mollieOrder._links.checkout?.href,
      orderId: mollieOrder.id,
    });

  } catch (error: any) {
    logger.error('Erreur lors de la création du paiement', 'PayQuote', error, {
      message: error?.message,
    });
    
    return NextResponse.json(
      { error: 'Erreur lors de l\'initialisation du paiement' },
      { status: 500 }
    );
  }
}

// Récupérer les informations d'un devis (pour pré-remplir le formulaire par exemple)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const quoteNumber = searchParams.get('quoteNumber');

    if (!quoteNumber) {
      return NextResponse.json(
        { error: 'Numéro de devis requis' },
        { status: 400 }
      );
    }

    const { canQuoteBePaid } = await import('@/lib/db/quotes-production');
    const check = await canQuoteBePaid(quoteNumber, '');

    if (!check.can || !check.quote) {
      return NextResponse.json(
        { error: 'Devis non trouvé' },
        { status: 404 }
      );
    }

    // Retourner seulement les infos publiques
    return NextResponse.json({
      quoteNumber: check.quote.quoteNumber,
      amount: check.quote.amount,
      currency: check.quote.currency,
      description: check.quote.description,
      status: check.quote.status,
    });

  } catch (error) {
    logger.error('Erreur lors de la récupération du devis', 'PayQuote', error as Error);
    
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
