/**
 * Logger utility
 * Simple logging wrapper
 */

export interface ILogger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, data?: any): void;
}

export function createLogger(name: string): ILogger {
  return {
    debug: (message: string, data?: any) => {
      console.debug(`[${name}] ${message}`, data || '');
    },
    info: (message: string, data?: any) => {
      console.log(`[${name}] ${message}`, data || '');
    },
    warn: (message: string, data?: any) => {
      console.warn(`[${name}] ${message}`, data || '');
    },
    error: (message: string, data?: any) => {
      console.error(`[${name}] ${message}`, data || '');
    },
  };
}
