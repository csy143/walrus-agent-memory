# Walrus Agent Memory Framework

A production-grade persistent memory solution for AI agents using Sui and Walrus.

## Overview

Walrus Agent Memory Framework (WAMF) addresses the fundamental limitation that AI agents are stateless and lose context across sessions. It provides:

- **Persistent Memory Storage** - Distributed, verifiable data storage via Walrus
- **Framework Integration** - Compatible with LangChain, AutoGen, and custom frameworks
- **On-Chain Indexing** - Move contracts for access control and metadata
- **Cross-Agent Sharing** - Secure knowledge transfer between agents
- **End-to-End Encryption** - Privacy-preserving memory storage
- **REST API** - Complete CRUD operations for memory management

## Architecture

```
Agent Framework Layer (LangChain, AutoGen, etc.)
         ↓
    Agent Memory SDK (TypeScript)
         ↓
   ┌─────┴──────┐
   ↓            ↓
Sui Contracts  Walrus Storage
   ↓            ↓
   └─────┬──────┘
         ↓
   REST API Service
```

## Quick Start

### Prerequisites
- Node.js 18+
- Pnpm or Yarn
- Sui CLI (for contract deployment)

### Installation

```bash
git clone <repo-url>
cd walrus-agent-memory
pnpm install
pnpm build
```

### Development

```bash
# Start development mode
pnpm dev

# Run tests
pnpm test

# Build all packages
pnpm build
```

## Project Structure

```
packages/
├── sdk/          # Core TypeScript SDK
├── contracts/    # Sui Move contracts
└── api/          # REST API service

examples/
├── langchain-bot/           # LangChain integration example
├── autogen-agent/           # AutoGen integration example
└── multi-agent-collab/      # Multi-agent collaboration example
```

## Packages

### `@walrus-memory/sdk`
Core memory SDK with TypeScript interfaces and implementations.

```typescript
import { AgentMemory, MemoryStore } from '@walrus-memory/sdk';

const memory = new MemoryStore({
  walrusEndpoint: 'https://walrus-api.mainnet.sui.io',
  suiRpcUrl: 'https://fullnode.mainnet.sui.io:443',
});

// Store memory
await memory.store('key', {
  type: 'conversation',
  data: { message: 'Hello' },
});

// Retrieve memory
const content = await memory.retrieve('key');
```

### `@walrus-memory/api`
Production REST API for memory management.

### `@walrus-memory/contracts`
Sui Move smart contracts for on-chain memory indexing.

## Key Innovations

This project introduces several novel features that differentiate it from traditional memory solutions:

### 1. **Intelligent Multi-Tier Caching Strategy**
Automatically adjusts data placement across storage layers based on access patterns:
- Hot data (frequent access) → Local cache
- Warm data (moderate access) → Sui on-chain indexing
- Cold data (infrequent access) → Walrus distributed storage
- Dynamic promotion/demotion optimizes costs and performance

### 2. **Memory Lifecycle Management (TTL)**
Context-aware memory expiration for different memory types:
- Conversation history: Auto-expire after 7 days
- Task state: Expire when task completes
- Knowledge base: Manual or permanent retention
- Tool results: Immediate expiration
- Significantly reduces storage costs while maintaining data freshness

### 3. **Multi-Dimensional Composite Query & Vector Search**
Advanced information retrieval beyond simple key-value lookups:
- Time-range queries
- Multi-tag filtering
- Semantic similarity search (embedding-based)
- Complex AND/OR conditions
- Enables AI agents to find contextually relevant memories, not just keyword matches

### 4. **Real-Time Memory Synchronization (WebSocket)**
Enables seamless multi-agent collaboration:
- WebSocket subscription to memory changes
- Agent A writes → Agent B receives in real-time
- Event-driven architecture for complex workflows
- Permission-isolated sharing between agents

## Contributing

This is a competition project for Sui Overflow 2026.

## License

MIT
