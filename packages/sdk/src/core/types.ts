/**
 * Core type definitions for Agent Memory
 */

export enum MemoryType {
  CONVERSATION = 'conversation',
  KNOWLEDGE = 'knowledge',
  STATE = 'state',
  GOAL = 'goal',
  TOOL_RESULT = 'tool_result',
  CUSTOM = 'custom',
}

export enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  SHARE = 'share',
  ADMIN = 'admin',
}

export enum AccessLevel {
  PRIVATE = 'private',
  AGENT_ONLY = 'agent_only',
  TEAM = 'team',
  PUBLIC = 'public',
}

export interface MemoryMetadata {
  tags?: string[];
  importance?: number; // 1-10
  ttl?: number; // milliseconds
  source?: string; // source agent ID
  context?: string[];
  custom?: Record<string, any>;
}

export interface MemoryContent {
  type: MemoryType | string;
  data: Record<string, any>;
  metadata?: MemoryMetadata;
  timestamp: number;
  version: number;
}

export interface MemoryRecord extends MemoryContent {
  id: string;
  owner: string;
  walrus_id?: string;
  sui_object_id?: string;
  encrypted: boolean;
  checksum: string;
  access_control?: {
    public: boolean;
    grants: MemoryGrant[];
  };
}

export interface MemoryGrant {
  id: string;
  memory_id: string;
  grantor: string;
  grantee: string;
  permissions: Permission[];
  granted_at: number;
  expires_at?: number;
  revoked: boolean;
}

export interface MemoryQuery {
  type?: string | string[];
  owner?: string;
  tags?: string[];
  importance?: {
    $gte?: number;
    $lte?: number;
  };
  created_at?: {
    $gte?: number;
    $lte?: number;
  };
  custom?: Record<string, any>;
}

export interface StoreOptions {
  ttl?: number;
  importance?: number;
  tags?: string[];
  encrypted?: boolean;
  isPublic?: boolean;
}

export interface RetrieveOptions {
  includeMetadata?: boolean;
  decrypt?: boolean;
  verifyChecksum?: boolean;
}

export interface UpdateOptions {
  incrementVersion?: boolean;
  updateTimestamp?: boolean;
  preserveMetadata?: boolean;
}

export interface QueryOptions {
  limit?: number;
  offset?: number;
  sort?: Array<{
    field: string;
    order: 'asc' | 'desc';
  }>;
}

export interface SearchOptions {
  limit?: number;
  type?: string;
  fuzzy?: boolean;
  minScore?: number;
}

export interface BatchStoreRequest {
  key: string;
  content: MemoryContent;
  options?: StoreOptions;
}

export interface ShareMemoryRequest {
  key: string;
  grantee: string;
  permissions: Permission[];
  expiresAt?: number;
}

export interface MemoryStats {
  total_memories: number;
  total_size: number;
  by_type: Record<string, number>;
  by_importance: Record<string, number>;
  oldest_memory?: number;
  newest_memory?: number;
}

export interface MemoryChange {
  version: number;
  changed_at: number;
  changed_by: string;
  changes: Record<string, any>;
}

export type MemoryEvent = 'stored' | 'retrieved' | 'updated' | 'deleted' | 'shared' | 'error';

export type EventCallback = (event: {
  type: MemoryEvent;
  data: any;
  timestamp: number;
}) => void | Promise<void>;

export interface WalrusBlob {
  blobId: string;
  blobCertificate: string;
  encoding: string;
  storedAt: number;
  size: number;
  redundancy: number;
  certifiedEpoch: number;
}

export interface BlobMetadata {
  blobId: string;
  owner: string;
  size: number;
  createdAt: number;
  updatedAt: number;
  contentType: string;
  checksum: string;
  isPublic: boolean;
  tags?: string[];
}

export interface WalrusOptions {
  encrypted?: boolean;
  redundancy?: number;
  publiclyVerifiable?: boolean;
}

export interface SuiConfig {
  rpcUrl: string;
  packageId: string;
  moduleName?: string;
}

export interface WalrusConfig {
  endpoint: string;
  timeout?: number;
}

export interface SDKConfig {
  sui: SuiConfig;
  walrus: WalrusConfig;
  encryption?: {
    enabled: boolean;
    algorithm: 'XChaCha20-Poly1305' | 'AES-256-GCM';
  };
  cache?: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
}
