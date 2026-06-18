/**
 * Encryption Adapter
 * Handles encryption/decryption of memory data
 */

import { createLogger } from '../utils/logger';
import { MemoryContent } from '../core/types';

export interface EncryptionConfig {
  enabled: boolean;
  algorithm: 'XChaCha20-Poly1305' | 'AES-256-GCM';
}

export class EncryptionAdapter {
  private config?: EncryptionConfig;
  private logger;

  constructor(config?: EncryptionConfig) {
    this.config = config;
    this.logger = createLogger('EncryptionAdapter');
  }

  async encrypt(data: MemoryContent): Promise<MemoryContent> {
    if (!this.config?.enabled) {
      return data;
    }

    try {
      // For MVP, simulate encryption
      // In production, use tweetnacl or libsodium

      const encrypted: MemoryContent = {
        ...data,
        data: {
          ...data.data,
          __encrypted: true,
          __algorithm: this.config.algorithm,
        },
      };

      this.logger.debug('Data encrypted', {
        algorithm: this.config.algorithm,
      });

      return encrypted;
    } catch (error) {
      this.logger.error('Encryption failed', { error });
      throw error;
    }
  }

  async decrypt(data: MemoryContent): Promise<MemoryContent> {
    if (!this.config?.enabled || !data.data.__encrypted) {
      return data;
    }

    try {
      // For MVP, simulate decryption
      const decrypted: MemoryContent = {
        ...data,
        data: Object.fromEntries(
          Object.entries(data.data).filter(([k]) => !k.startsWith('__'))
        ),
      };

      this.logger.debug('Data decrypted');

      return decrypted;
    } catch (error) {
      this.logger.error('Decryption failed', { error });
      throw error;
    }
  }
}
