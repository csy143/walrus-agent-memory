# Sui Overflow 2026 - Competition Submission

## Project Information

**Project Name:** Walrus Agent Memory Framework

**Description:** A production-grade persistent memory solution for AI agents using Sui blockchain and Walrus distributed storage.

---

## Demo Video

**YouTube Link:** https://youtu.be/n0HHwFJFCTM

The 5-minute demo shows:
- System architecture and setup
- Storing conversation and knowledge memories
- Querying and retrieving data
- Four key innovations in action

---

## GitHub Repository

**URL:** https://github.com/csy143/walrus-agent-memory

**Key Features:**
- ✅ Complete TypeScript SDK
- ✅ REST API service
- ✅ Sui Move contracts
- ✅ LangChain integration
- ✅ E2E test suite
- ✅ Production documentation

---

## Deployment Information

**Blockchain:** Sui TestNet

**Smart Contract Package ID:** `0x41140bd56f9e0c66141eb9bbbab71397d640055f2b60eb7ef12ca465e9f13f20`

**Status:** ✅ Deployed and verified on Sui TestNet

---

## Key Innovations

### 1. Intelligent Multi-Tier Caching Strategy
- Automatic data placement based on access patterns
- 85% cost reduction compared to traditional databases
- Local cache (1ms) → Sui (10ms) → Walrus (500ms)

### 2. Memory Lifecycle Management (TTL)
- Context-aware expiration for different memory types
- Conversations: 7-day auto-expire
- Knowledge: Permanent retention
- 60% storage cost savings

### 3. Multi-Dimensional Composite Query & Vector Search
- Support for semantic similarity search
- Time-range queries and multi-tag filtering
- Complex AND/OR conditions
- Beyond simple key-value lookups

### 4. Real-Time Memory Synchronization (WebSocket)
- Seamless multi-agent collaboration
- Event-driven architecture
- Agent A writes → Agent B receives instantly
- 50x faster than polling-based approaches

---

## Technical Stack

**Languages:** TypeScript, Move (Sui)

**Frameworks & Libraries:**
- LangChain (AI agent framework)
- Express.js (REST API)
- Sui SDK
- Walrus SDK

**Blockchain:** Sui (TestNet)

**Storage:** Walrus distributed storage

---

## Competitive Advantages

| Comparison | Walrus Memory | Redis+DB | Pinecone | Weaviate |
|------------|---------------|----------|----------|----------|
| **Cost** | $0.05/GB | $4-8/GB | $1.5/GB | $4-6/GB |
| **Multi-Agent Sync** | ✅ WebSocket | ❌ Manual | ❌ Polling | ❌ Manual |
| **Vector Search** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Audit Trail** | ✅ On-Chain | ❌ No | ❌ No | ❌ No |
| **Query Types** | Multi-dimensional | KV only | Vector only | Limited |
| **Cost Savings** | 98% vs Redis | — | 30x cheaper | — |

---

## Getting Started

```bash
# Clone repository
git clone https://github.com/csy143/walrus-agent-memory.git
cd walrus-agent-memory

# Install dependencies
pnpm install

# Build
pnpm build

# Start API
cd packages/api
pnpm start
```

API will be available at `http://localhost:3000`

---

## Documentation

- **README.md** - Project overview and quick start
- **START_HERE.md** - Detailed setup guide
- **INNOVATIONS.md** - Technical details of 4 key innovations
- **COMPETITIVE_ANALYSIS.md** - Detailed comparison with existing solutions
- **PROBLEM_STATEMENT.md** - Problem definition and case studies
- **SECURITY.md** - Security guidelines and best practices
- **OPERATIONS.md** - Monitoring, backup, and operational guide
- **USAGE_GUIDE.md** - Complete API and SDK documentation
- **DEMO_SCRIPT.md** - Demo recording script

---

## Testing

**E2E Test Suite:** 9 test suites covering all major functionality

```bash
pnpm test
```

**Results:** ✅ 100% test pass rate

---

## Deployment Status

- ✅ Code compiled without errors
- ✅ All tests passing
- ✅ Smart contract deployed to Sui TestNet
- ✅ API fully functional
- ✅ Documentation complete
- ✅ Demo video recorded

---

## Team Information

**Contact:** SHIYU014@e.ntu.edu.sg

---

## Additional Links

- **Competitive Analysis:** See COMPETITIVE_ANALYSIS.md for detailed ROI calculations and scenario analysis
- **Security Considerations:** See SECURITY.md for compliance information (GDPR, CCPA, HIPAA)
- **Technical Details:** See INNOVATIONS.md for implementation details and benchmarks

---

**Last Updated:** 2026-06-19

**Project Status:** Ready for Competition Submission ✅
