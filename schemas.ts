// lib/validation/schemas.ts
// Schémas de validation Zod pour les API routes

import { z } from 'zod';

// Validation pour la demande de paiement
export const PayQuoteSchema = z.object({
  quoteNumber: z
    .string()
    .min(1, 'Numéro de devis requis')
    .max(50, 'Numéro de devis trop long')
    .regex(/^[A-Z0-9-]+$/, 'Format de numéro de devis invalide'),
  email: z
    .string()
    .email('Format d\'email invalide')
    .toLowerCase(),
});

export type PayQuoteInput = z.infer<typeof PayQuoteSchema>;

// Validation pour la création d'un devis
export const CreateQuoteSchema = z.object({
  quoteNumber: z.string().min(1).max(50),
  customerEmail: z.string().email().toLowerCase(),
  customerName: z.string().optional(),
  customerSiret: z.string().optional(),
  customerPhone: z.string().optional(),
  companyName: z.string().optional(),
  amount: z.number().int().positive(),
  currency: z.string().default('EUR'),
  vatRate: z.number().default(20),
  vatAmount: z.number().int().nonnegative(),
  description: z.string().min(1),
  notes: z.string().optional(),
  streetAndNumber: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('FR'),
  expiresAt: z.date().optional(),
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;

// Validation pour la mise à jour d'un devis
export const UpdateQuoteSchema = z.object({
  id: z.string().cuid(),
  status: z.enum(['PENDING', 'PROCESSING', 'PAID', 'FAILED', 'CANCELLED', 'EXPIRED']).optional(),
  mollieOrderId: z.string().optional(),
  mollieCheckoutUrl: z.string().url().optional(),
  molliePaymentMethod: z.string().optional(),
  paidAt: z.date().optional(),
});

export type UpdateQuoteInput = z.infer<typeof UpdateQuoteSchema>;

// Validation du webhook Mollie
export const MollieWebhookSchema = z.object({
  id: z.string().startsWith('ord_'), // Les orders Mollie commencent par "ord_"
});

export type MollieWebhookInput = z.infer<typeof MollieWebhookSchema>;
