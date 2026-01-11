// lib/logging/logger.ts
// Système de logging pour production

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
  };
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, context, data, error } = entry;
    
    let log = `[${timestamp}] [${level.toUpperCase()}]`;
    
    if (context) {
      log += ` [${context}]`;
    }
    
    log += ` ${message}`;
    
    if (data) {
      log += `\nData: ${JSON.stringify(data, null, 2)}`;
    }
    
    if (error) {
      log += `\nError: ${error.message}`;
      if (error.stack && this.isDevelopment) {
        log += `\nStack: ${error.stack}`;
      }
    }
    
    return log;
  }

  private log(level: LogLevel, message: string, context?: string, data?: any, error?: Error) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      error: error ? {
        message: error.message,
        stack: error.stack,
      } : undefined,
    };

    const formattedLog = this.formatLog(entry);

    switch (level) {
      case 'error':
        console.error(formattedLog);
        // En production, envoyer à un service de monitoring (Sentry, etc.)
        if (!this.isDevelopment) {
          // this.sendToMonitoring(entry);
        }
        break;
      case 'warn':
        console.warn(formattedLog);
        break;
      case 'debug':
        if (this.isDevelopment) {
          console.debug(formattedLog);
        }
        break;
      default:
        console.log(formattedLog);
    }
  }

  info(message: string, context?: string, data?: any) {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: any) {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, error?: Error, data?: any) {
    this.log('error', message, context, data, error);
  }

  debug(message: string, context?: string, data?: any) {
    this.log('debug', message, context, data);
  }

  // Logs spécifiques pour les paiements
  paymentInitiated(quoteNumber: string, amount: number, email: string) {
    this.info('Paiement initié', 'Payment', {
      quoteNumber,
      amount: amount / 100,
      email,
    });
  }

  paymentSuccess(quoteNumber: string, mollieOrderId: string) {
    this.info('Paiement réussi', 'Payment', {
      quoteNumber,
      mollieOrderId,
    });
  }

  paymentFailed(quoteNumber: string, reason: string) {
    this.warn('Paiement échoué', 'Payment', {
      quoteNumber,
      reason,
    });
  }

  webhookReceived(orderId: string, status: string) {
    this.info('Webhook reçu', 'Webhook', {
      orderId,
      status,
    });
  }

  webhookProcessed(orderId: string, quoteNumber: string) {
    this.info('Webhook traité', 'Webhook', {
      orderId,
      quoteNumber,
    });
  }

  webhookError(orderId: string, error: Error) {
    this.error('Erreur webhook', 'Webhook', error, {
      orderId,
    });
  }
}

// Export singleton
export const logger = new Logger();
export default logger;
