/**
 * Walrus Storage Adapter
 * Handles upload/retrieve/verify operations with Walrus
 */

import axios from 'axios';
import { createLogger } from '../utils/logger';
import {
  MemoryContent,
  WalrusBlob,
  BlobMetadata,
  WalrusConfig,
  WalrusOptions,
} from '../core/types';

export class WalrusAdapter {
  private config: WalrusConfig;
  private logger;
  private client;
  private useRealWalrus: boolean;

  constructor(config: WalrusConfig) {
    this.config = config;
    this.logger = createLogger('WalrusAdapter');
    this.useRealWalrus = config.endpoint.includes('walrus') ||
                         process.env.WALRUS_ENDPOINT?.includes('walrus') ||
                         config.endpoint !== 'http://localhost:31415';

    this.client = axios.create({
      baseURL: config.endpoint,
      timeout: config.timeout || 30000,
    });

    this.logger.info('WalrusAdapter initialized', {
      endpoint: config.endpoint,
      mode: this.useRealWalrus ? 'REAL' : 'MOCK',
    });
  }

  async upload(
    data: MemoryContent,
    options?: WalrusOptions
  ): Promise<WalrusBlob> {
    try {
      const payload = JSON.stringify(data);

      if (this.useRealWalrus) {
        return await this.uploadToRealWalrus(payload, options);
      } else {
        return await this.simulateWalrusUpload(payload, options);
      }
    } catch (error) {
      this.logger.error('Failed to upload to Walrus', { error });
      throw error;
    }
  }

  async retrieve(blobId: string): Promise<MemoryContent> {
    try {
      if (this.useRealWalrus) {
        return await this.retrieveFromRealWalrus(blobId);
      } else {
        return await this.simulateWalrusRetrieve(blobId);
      }
    } catch (error) {
      this.logger.error('Failed to retrieve from Walrus', { blobId, error });
      throw error;
    }
  }

  async verify(
    blobId: string,
    blobCertificate: string
  ): Promise<boolean> {
    try {
      if (this.useRealWalrus) {
        return await this.verifyRealWalrus(blobId, blobCertificate);
      }
      this.logger.info('Walrus verification (mock)', {
        blobId,
        certificateValid: true,
      });
      return true;
    } catch (error) {
      this.logger.error('Verification failed', { blobId, error });
      return false;
    }
  }

  async delete(blobId: string): Promise<boolean> {
    try {
      this.logger.warn('Walrus deletion not supported in current version', { blobId });
      return true;
    } catch (error) {
      this.logger.error('Failed to delete from Walrus', { blobId, error });
      throw error;
    }
  }

  async getMetadata(blobId: string): Promise<BlobMetadata> {
    try {
      if (this.useRealWalrus) {
        return await this.getMetadataFromRealWalrus(blobId);
      }

      const metadata: BlobMetadata = {
        blobId,
        owner: 'unknown',
        size: 1024,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        contentType: 'application/json',
        checksum: `checksum_${blobId}`,
        isPublic: false,
        tags: [],
      };

      return metadata;
    } catch (error) {
      this.logger.error('Failed to get metadata', { blobId, error });
      throw error;
    }
  }

  /**
   * Upload to real Walrus storage
   * Uses Walrus public API
   */
  private async uploadToRealWalrus(
    data: string,
    options?: WalrusOptions
  ): Promise<WalrusBlob> {
    try {
      // Convert string data to binary
      const buffer = Buffer.from(data, 'utf-8');

      // POST to Walrus /store endpoint
      const response = await this.client.post('/store', buffer, {
        headers: {
          'Content-Type': 'application/octet-stream',
        },
      });

      // Parse Walrus response
      const blobId = response.data.blobId || response.data.blob_id;
      const blobCertificate = response.data.blobCertificate || response.data.blob_certificate;

      this.logger.info('Data uploaded to real Walrus', {
        blobId,
        size: buffer.length,
      });

      return {
        blobId,
        blobCertificate,
        encoding: 'utf-8',
        storedAt: Date.now(),
        size: buffer.length,
        redundancy: options?.redundancy || 3,
        certifiedEpoch: response.data.certifiedEpoch || 1,
      };
    } catch (error: any) {
      this.logger.error('Real Walrus upload failed', {
        status: error.response?.status,
        error: error.message,
      });
      throw new Error(`Walrus upload failed: ${error.message}`);
    }
  }

  /**
   * Retrieve from real Walrus storage
   */
  private async retrieveFromRealWalrus(blobId: string): Promise<MemoryContent> {
    try {
      // GET from Walrus /read endpoint
      const response = await this.client.get(`/read/${blobId}`);

      let data: MemoryContent;

      if (typeof response.data === 'string') {
        data = JSON.parse(response.data);
      } else {
        data = response.data;
      }

      this.logger.info('Data retrieved from real Walrus', { blobId });

      return data;
    } catch (error: any) {
      this.logger.error('Real Walrus retrieval failed', {
        blobId,
        error: error.message,
      });
      throw new Error(`Walrus retrieval failed: ${error.message}`);
    }
  }

  /**
   * Verify with real Walrus
   */
  private async verifyRealWalrus(
    blobId: string,
    blobCertificate: string
  ): Promise<boolean> {
    try {
      // Try to retrieve to verify validity
      await this.retrieveFromRealWalrus(blobId);
      this.logger.info('Walrus blob verified', { blobId });
      return true;
    } catch (error) {
      this.logger.error('Walrus blob verification failed', { blobId });
      return false;
    }
  }

  /**
   * Get metadata from real Walrus
   */
  private async getMetadataFromRealWalrus(blobId: string): Promise<BlobMetadata> {
    try {
      // Get blob metadata
      const response = await this.client.get(`/meta/${blobId}`);

      return {
        blobId,
        owner: response.data.owner || 'unknown',
        size: response.data.size || 0,
        createdAt: response.data.createdAt || Date.now(),
        updatedAt: response.data.updatedAt || Date.now(),
        contentType: response.data.contentType || 'application/json',
        checksum: response.data.checksum || '',
        isPublic: response.data.isPublic || false,
        tags: response.data.tags || [],
      };
    } catch (error) {
      this.logger.warn('Could not get metadata from Walrus, using defaults', { blobId });
      return {
        blobId,
        owner: 'unknown',
        size: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        contentType: 'application/json',
        checksum: '',
        isPublic: false,
        tags: [],
      };
    }
  }

  /**
   * Simulate Walrus upload for local testing
   */
  private async simulateWalrusUpload(
    data: string,
    options?: WalrusOptions
  ): Promise<WalrusBlob> {
    const blobId = `walrus_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const blobCertificate = `cert_${blobId}`;

    this.logger.info('Data uploaded to mock Walrus', {
      blobId,
      size: data.length,
    });

    return {
      blobId,
      blobCertificate,
      encoding: 'utf-8',
      storedAt: Date.now(),
      size: data.length,
      redundancy: options?.redundancy || 3,
      certifiedEpoch: 1,
    };
  }

  /**
   * Simulate Walrus retrieval for local testing
   */
  private async simulateWalrusRetrieve(blobId: string): Promise<MemoryContent> {
    return {
      type: 'conversation',
      data: {
        message: 'Mock retrieved content',
        blobId,
      },
      timestamp: Date.now(),
      version: 1,
    };
  }
}
