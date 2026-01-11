// lib/db/quotes.ts
// Fonctions de base de données pour les devis - VERSION PRODUCTION avec Prisma

import { Quote, QuoteStatus, Prisma } from '@prisma/client';
import prisma from './prisma';

// Types pour la création de devis
export type CreateQuoteInput = Omit<
  Quote,
  'id' | 'createdAt' | 'updatedAt' | 'paidAt' | 'mollieOrderId' | 'mollieCheckoutUrl'
>;

// Récupérer un devis par son numéro
export async function getQuoteByNumber(quoteNumber: string): Promise<Quote | null> {
  try {
    return await prisma.quote.findUnique({
      where: { quoteNumber },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error('Erreur getQuoteByNumber:', error);
    throw new Error('Erreur lors de la récupération du devis');
  }
}

// Récupérer un devis par son ID
export async function getQuoteById(id: string): Promise<Quote | null> {
  try {
    return await prisma.quote.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error('Erreur getQuoteById:', error);
    throw new Error('Erreur lors de la récupération du devis');
  }
}

// Récupérer un devis par son ID Mollie Order
export async function getQuoteByMollieOrderId(mollieOrderId: string): Promise<Quote | null> {
  try {
    return await prisma.quote.findUnique({
      where: { mollieOrderId },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error('Erreur getQuoteByMollieOrderId:', error);
    throw new Error('Erreur lors de la récupération du devis');
  }
}

// Mettre à jour un devis
export async function updateQuote(
  id: string,
  data: Partial<Quote>
): Promise<Quote> {
  try {
    return await prisma.quote.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error('Erreur updateQuote:', error);
    throw new Error('Erreur lors de la mise à jour du devis');
  }
}

// Créer un devis
export async function createQuote(data: CreateQuoteInput): Promise<Quote> {
  try {
    return await prisma.quote.create({
      data,
      include: {
        items: true,
      },
    });
  } catch (error) {
    console.error('Erreur createQuote:', error);
    throw new Error('Erreur lors de la création du devis');
  }
}

// Récupérer les devis d'un client
export async function getQuotesByEmail(email: string): Promise<Quote[]> {
  try {
    return await prisma.quote.findMany({
      where: { customerEmail: email },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Erreur getQuotesByEmail:', error);
    throw new Error('Erreur lors de la récupération des devis');
  }
}

// Récupérer les devis avec un certain statut
export async function getQuotesByStatus(status: QuoteStatus): Promise<Quote[]> {
  try {
    return await prisma.quote.findMany({
      where: { status },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Erreur getQuotesByStatus:', error);
    throw new Error('Erreur lors de la récupération des devis');
  }
}

// Supprimer un devis (soft delete en changeant le statut)
export async function cancelQuote(id: string): Promise<Quote> {
  try {
    return await prisma.quote.update({
      where: { id },
      data: {
        status: QuoteStatus.CANCELLED,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Erreur cancelQuote:', error);
    throw new Error('Erreur lors de l\'annulation du devis');
  }
}

// Vérifier si un devis peut être payé
export async function canQuoteBePaid(quoteNumber: string, email: string): Promise<{
  can: boolean;
  reason?: string;
  quote?: Quote;
}> {
  try {
    const quote = await getQuoteByNumber(quoteNumber);

    if (!quote) {
      return { can: false, reason: 'Devis introuvable' };
    }

    if (quote.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return { can: false, reason: 'Email ne correspond pas au devis' };
    }

    if (quote.status === QuoteStatus.PAID) {
      return { can: false, reason: 'Ce devis a déjà été payé' };
    }

    if (quote.status === QuoteStatus.CANCELLED) {
      return { can: false, reason: 'Ce devis a été annulé' };
    }

    if (quote.status === QuoteStatus.EXPIRED) {
      return { can: false, reason: 'Ce devis a expiré' };
    }

    // Vérifier la date d'expiration
    if (quote.expiresAt && new Date(quote.expiresAt) < new Date()) {
      await updateQuote(quote.id, { status: QuoteStatus.EXPIRED });
      return { can: false, reason: 'Ce devis a expiré' };
    }

    return { can: true, quote };
  } catch (error) {
    console.error('Erreur canQuoteBePaid:', error);
    return { can: false, reason: 'Erreur lors de la vérification' };
  }
}

// Enregistrer un événement webhook
export async function createWebhookEvent(data: {
  quoteId?: string;
  mollieOrderId: string;
  eventType: string;
  status: string;
  payload: any;
}): Promise<void> {
  try {
    await prisma.webhookEvent.create({
      data: {
        ...data,
        processed: false,
      },
    });
  } catch (error) {
    console.error('Erreur createWebhookEvent:', error);
    // Ne pas throw ici pour ne pas bloquer le webhook
  }
}

// Marquer un webhook comme traité
export async function markWebhookAsProcessed(id: string): Promise<void> {
  try {
    await prisma.webhookEvent.update({
      where: { id },
      data: { processed: true },
    });
  } catch (error) {
    console.error('Erreur markWebhookAsProcessed:', error);
  }
}

// Nettoyer les devis expirés (à exécuter périodiquement)
export async function cleanupExpiredQuotes(): Promise<number> {
  try {
    const result = await prisma.quote.updateMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        status: {
          in: [QuoteStatus.PENDING, QuoteStatus.PROCESSING],
        },
      },
      data: {
        status: QuoteStatus.EXPIRED,
      },
    });

    return result.count;
  } catch (error) {
    console.error('Erreur cleanupExpiredQuotes:', error);
    return 0;
  }
}
