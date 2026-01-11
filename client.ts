// Configuration du client Mollie
import { createMollieClient, OrderStatus } from '@mollie/api-client';

if (!process.env.MOLLIE_API_KEY) {
  throw new Error('MOLLIE_API_KEY n\'est pas défini dans les variables d\'environnement');
}

export const mollieClient = createMollieClient({
  apiKey: process.env.MOLLIE_API_KEY,
});

export function mapMollieStatusToQuoteStatus(mollieStatus: OrderStatus): string {
  const statusMap: Record<OrderStatus, string> = {
    [OrderStatus.created]: 'PENDING',
    [OrderStatus.pending]: 'PROCESSING',
    [OrderStatus.authorized]: 'PROCESSING',
    [OrderStatus.paid]: 'PAID',
    [OrderStatus.shipping]: 'PAID',
    [OrderStatus.completed]: 'PAID',
    [OrderStatus.canceled]: 'CANCELLED',
    [OrderStatus.expired]: 'FAILED',
  };

  return statusMap[mollieStatus] || 'PENDING';
}

export function getRedirectUrls() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return {
    redirectUrl: `${baseUrl}/client/payment-result?status=success`,
    webhookUrl: `${baseUrl}/api/mollie-webhook`,
  };
}
