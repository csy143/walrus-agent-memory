# Security & Privacy Guidelines

This document outlines the security considerations and best practices for using Walrus Agent Memory Framework in production environments.

## Overview

Walrus Agent Memory Framework provides multiple layers of security to protect sensitive agent data:

1. **End-to-End Encryption** - Optional client-side encryption
2. **Access Control** - Fine-grained permission management
3. **Audit Logging** - Immutable on-chain records
4. **Data Integrity** - Cryptographic checksums
5. **Transport Security** - HTTPS/TLS required for production

---

## 1. End-to-End Encryption

### Enabling Encryption

Memory can be optionally encrypted before being sent to Walrus:

```typescript
const memory = new MemoryStore({
  walrus: { endpoint: 'https://walrus-testnet.walrus.live' },
  sui: { rpc: 'https://fullnode.testnet.sui.io:443' },
  encryption: {
    enabled: true,
    algorithm: 'AES-256-GCM',
    keyDerivation: 'PBKDF2',
  },
});

// Store encrypted memory
await memory.store('sensitive_key', content, {
  encrypted: true,
});
```

### Key Management

**Best Practices:**

```
1. Key Storage
   ✅ Store keys in environment variables: ENCRYPTION_KEY
   ✅ Use key management services: AWS KMS, HashiCorp Vault
   ✅ Rotate keys regularly (every 90 days)
   ❌ Never commit keys to version control
   ❌ Never log or transmit unencrypted keys

2. Key Derivation
   ✅ Use PBKDF2 with 100,000+ iterations
   ✅ Use unique salts per agent
   ❌ Don't use simple passwords as keys
   ❌ Don't reuse keys across agents

3. Key Rotation
   When rotating encryption keys:
   - Create new keys
   - Re-encrypt existing data
   - Maintain old keys for decryption during transition
   - Remove old keys after transition period
```

### Example: Secure Key Setup

```bash
# Generate a strong encryption key
openssl rand -base64 32 > .env.keys

# Protect the key file
chmod 600 .env.keys

# Load it in your application
source .env.keys
export ENCRYPTION_KEY=$(<.env.keys)
```

---

## 2. Access Control & Permissions

### Permission Model

Walrus Memory implements role-based access control (RBAC):

```typescript
// Define granular permissions
enum Permission {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
  SHARE = 'share',
  ADMIN = 'admin',
}

// Share memory with specific permissions
await memory.shareMemory('key', 'agent_xyz', [
  Permission.READ,
  Permission.WRITE,
]);
```

### Access Levels

```typescript
enum AccessLevel {
  OWNER = 'owner',              // Full control
  COLLABORATOR = 'collaborator', // Read + write
  VIEWER = 'viewer',             // Read-only
  NONE = 'none',                 // No access
}
```

### Best Practices

**1. Principle of Least Privilege**
```typescript
// ❌ Don't grant unnecessary permissions
await memory.shareMemory(key, agent, [
  Permission.READ,
  Permission.WRITE,
  Permission.DELETE,
  Permission.SHARE,
  Permission.ADMIN,
]);

// ✅ Grant only what's needed
await memory.shareMemory(key, agent, [
  Permission.READ,
  Permission.WRITE,
]);
```

**2. Regular Access Reviews**
```typescript
// Periodically audit access grants
const grants = await memory.listAccessGrants('memory_id');
for (const grant of grants) {
  // Review and revoke if no longer needed
  if (isExpired(grant) || !isStillNeeded(grant)) {
    await memory.revokeAccess(grant.id);
  }
}
```

**3. Time-Limited Grants**
```typescript
// Issue temporary access tokens
const grant = await memory.shareMemory(key, agent, perms, {
  expiresIn: '7days', // Auto-revoke after 7 days
  notes: 'Temporary access for project X',
});
```

---

## 3. Audit & Compliance

### On-Chain Audit Trail

Every operation is logged on the Sui blockchain:

```typescript
// Retrieve audit history
const history = await memory.getHistory('key');
// Returns:
// [
//   { action: 'stored', agent: 'agent_001', timestamp: 1234567890, tx_hash: '0xabc...' },
//   { action: 'retrieved', agent: 'agent_002', timestamp: 1234567891, tx_hash: '0xdef...' },
//   { action: 'updated', agent: 'agent_001', timestamp: 1234567892, tx_hash: '0x123...' },
// ]
```

### Compliance Features

**1. Data Retention Policies**
```typescript
// Set retention based on memory type
const retention = {
  conversation: '7 days',      // GDPR compliance
  personal_data: '30 days',    // Regulatory requirement
  logs: '1 year',              // Audit requirement
  knowledge: 'permanent',      // Business value
};
```

**2. Export for Audit**
```typescript
// Export all memories in standardized format
const auditExport = await memory.exportAuditLog({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  format: 'JSON',
  includeMetadata: true,
});

// Save for regulatory compliance
fs.writeFileSync('audit_log_2024.json', JSON.stringify(auditExport));
```

**3. Data Deletion (Right to be Forgotten)**
```typescript
// Securely delete personal data
await memory.deleteMemory('key', {
  shredMethod: 'DOD_5220.22M', // US DoD standard
  auditTrail: true,             // Log deletion
});
```

---

## 4. Data Integrity

### Checksum Verification

Walrus Memory automatically calculates and verifies checksums:

```typescript
// Enable checksum verification on retrieval
const content = await memory.retrieve('key', {
  verifyChecksum: true,
});

// If checksum doesn't match, throws error
// Indicates data corruption or tampering
```

### Integrity Guarantees

```
Storage Layer    | Integrity Check
─────────────────┼──────────────────────────────
Local Cache      | Memory checksum
Sui Blockchain   | Merkle tree root + signature
Walrus Storage   | Content-addressed (Merkle DAG)
```

---

## 5. Transport Security

### HTTPS/TLS Configuration

**Development:**
```bash
# Self-signed certificate (dev only)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

**Production:**
```typescript
// Use proper SSL certificates
import https from 'https';
import fs from 'fs';

const options = {
  key: fs.readFileSync('/path/to/key.pem'),
  cert: fs.readFileSync('/path/to/cert.pem'),
};

const app = express();
https.createServer(options, app).listen(3000);
```

### API Security

**1. Rate Limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**2. Input Validation**
```typescript
// Validate all inputs before processing
const validateMemoryInput = (data) => {
  if (!data.key || typeof data.key !== 'string') {
    throw new Error('Invalid key');
  }
  if (!['conversation', 'knowledge', 'state', 'tool_result'].includes(data.type)) {
    throw new Error('Invalid memory type');
  }
  // Additional validations...
};
```

**3. CORS Configuration**
```typescript
// Restrict cross-origin requests
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'DELETE'],
}));
```

---

## 6. Secrets Management

### Environment Variables

**Required Secrets:**
```bash
# .env.local (never commit)
ENCRYPTION_KEY=<base64-encoded-key>
SUI_PRIVATE_KEY=<sui-wallet-private-key>
WALRUS_API_KEY=<walrus-api-key-if-required>
API_JWT_SECRET=<jwt-signing-secret>
```

**Secure Storage:**
```bash
# Use a .gitignore to prevent accidental commits
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
echo ".secrets/" >> .gitignore

# Use environment variable encryption for CI/CD
# GitHub: encrypted secrets
# GitLab: protected CI/CD variables
# AWS: Secrets Manager
```

### Secret Rotation

```
Schedule: Rotate secrets every 90 days
Process:
1. Generate new secret
2. Test with new secret in staging
3. Update production with zero-downtime
4. Revoke old secret
5. Monitor for issues
```

---

## 7. Network Security

### Recommended Architecture

```
┌──────────────┐
│   Agent      │
└──────┬───────┘
       │ HTTPS/TLS
       ↓
┌──────────────────────┐
│ API Gateway / WAF    │ ← Rate limiting, DDoS protection
└──────┬───────────────┘
       │
       ├─→ Sui RPC (Public)
       │   └─→ HTTPS + certificate pinning
       │
       └─→ Walrus API (Public)
           └─→ HTTPS + certificate pinning
```

### Firewall Rules

```
Inbound:
  - Allow HTTPS (443) from: Agent networks
  - Allow HTTP (80) for: Let's Encrypt validation only
  
Outbound:
  - Allow Sui RPC endpoints
  - Allow Walrus API endpoints
  - Deny other internet access
```

---

## 8. Threat Model & Mitigations

### Threat 1: Encryption Key Compromise

**Risk:** Attacker obtains encryption key, can decrypt all memories

**Mitigation:**
- Store keys in HSM or KMS
- Rotate keys regularly
- Monitor key access logs
- Use key versioning
- Per-agent key isolation

### Threat 2: Unauthorized Access

**Risk:** Attacker gains access to Sui wallet or API credentials

**Mitigation:**
- Multi-signature wallets for production
- Hardware wallet enforcement
- API key rotation
- IP whitelisting
- Audit logging

### Threat 3: Data Tampering

**Risk:** Attacker modifies memory on Walrus

**Mitigation:**
- Verify checksums on retrieval
- Use immutable storage (content-addressed)
- Maintain audit trail on Sui
- Regular integrity checks

### Threat 4: Replay Attacks

**Risk:** Attacker replays old operations to modify state

**Mitigation:**
- Timestamp validation
- Nonce checking
- Sequence number validation
- Blockchain timestamp as source of truth

### Threat 5: Side-Channel Attacks

**Risk:** Timing attacks leak information about keys or operations

**Mitigation:**
- Use constant-time comparison for secrets
- Avoid branching on secret data
- Use cryptographic libraries (libsodium, etc.)
- No timing-dependent operations

---

## 9. Security Checklist for Production

- [ ] Enable end-to-end encryption
- [ ] Configure HTTPS/TLS with valid certificates
- [ ] Enable audit logging
- [ ] Implement access control policies
- [ ] Set up rate limiting
- [ ] Configure firewall rules
- [ ] Store secrets in KMS/vault
- [ ] Enable CORS restrictions
- [ ] Implement input validation
- [ ] Set up monitoring/alerting
- [ ] Regular security audits
- [ ] Incident response plan
- [ ] Backup & disaster recovery
- [ ] Regular penetration testing

---

## 10. Compliance Standards

### Supported Compliance Frameworks

| Standard | Support | Notes |
|----------|---------|-------|
| **GDPR** | ✅ Full | Right to erasure, data portability, audit logs |
| **CCPA** | ✅ Full | Consumer privacy rights, opt-out mechanisms |
| **HIPAA** | ✅ Partial | With encryption + audit logs enabled |
| **SOC 2** | ✅ Partial | Walrus operator SOC 2 certified |
| **ISO 27001** | ⚠️ Depends | Your deployment responsibility |

### GDPR Data Processing

```typescript
// 1. Data Subject Rights
// - Right to access: memory.retrieve(key)
// - Right to deletion: memory.delete(key)
// - Right to portability: memory.exportAuditLog()

// 2. Data Processing Agreement (DPA)
// Ensure DPA with Walrus operator for compliance

// 3. Privacy Impact Assessment
// Conduct DPIA before deploying with personal data
```

---

## 11. Incident Response

### Security Incident Process

```
Detection
    ↓
Containment (immediate action to prevent spread)
    ↓
Investigation (determine root cause)
    ↓
Recovery (restore normal operations)
    ↓
Post-Mortem (prevent future incidents)
```

### Incident Response Checklist

1. **Suspected Key Compromise:**
   - Immediately revoke compromised keys
   - Rotate all keys
   - Audit all access logs
   - Check for unauthorized access
   - Notify affected users

2. **Unauthorized Access:**
   - Revoke compromised credentials
   - Audit access logs
   - Check for data exfiltration
   - Enable additional monitoring
   - Implement IP restrictions

3. **Data Corruption:**
   - Activate backup recovery
   - Verify checksum mismatches
   - Audit transaction history
   - Restore from known-good state

---

## 12. Resources & Further Reading

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Sui Security Best Practices](https://docs.sui.io/)
- [Walrus Documentation](https://docs.walrus.ai/)
- [Cryptography Best Practices](https://crypto.stackexchange.com/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

---

## Support

For security concerns or vulnerabilities, please:

1. **Do NOT** open public GitHub issues
2. Email: security@walrusmemory.dev
3. Include detailed description and reproduction steps
4. Allow 48 hours for initial response

We take security seriously and appreciate responsible disclosure.

---

**Last Updated:** 2026-06-18  
**Version:** 1.0  
**Status:** Production Ready
