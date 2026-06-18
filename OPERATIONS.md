# Operations Guide - Monitoring, Maintenance & Support

## Overview

This guide covers operational aspects of running Walrus Agent Memory Framework in production, including monitoring, alerting, troubleshooting, and maintenance.

---

## 1. Health Monitoring

### Health Check Endpoint

The API provides a health check endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": 1718728393123
}
```

### Health Check Intervals

```
Development: Manual or every 5 minutes
Staging: Every 2 minutes
Production: Every 30 seconds
```

### Monitoring Service Example

```typescript
// Prometheus metrics endpoint
import { promClient } from 'prom-client';

app.get('/metrics', (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(promClient.register.metrics());
});
```

---

## 2. Performance Metrics

### Key Metrics to Monitor

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| API Latency (p95) | <100ms | >200ms | >500ms |
| API Latency (p99) | <200ms | >400ms | >1000ms |
| Error Rate | <0.1% | >1% | >5% |
| Cache Hit Rate | >80% | <70% | <50% |
| Walrus Latency | <500ms | >800ms | >2000ms |
| Sui TX Latency | <30s | >60s | >120s |
| Memory Usage | <500MB | >750MB | >1000MB |
| Disk Usage | <80% | >90% | >95% |

### Measuring Performance

```typescript
// API latency tracking
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metrics.apiLatency.observe({ method: req.method, path: req.path }, duration);
  });
  next();
});

// Cache hit rate
const cacheHitRate = (cacheHits / (cacheHits + cacheMisses)) * 100;
metrics.cacheHitRate.set(cacheHitRate);
```

---

## 3. Logging

### Log Levels

```
DEBUG:   Detailed information for debugging
INFO:    General operational information
WARN:    Warning conditions
ERROR:   Error conditions
FATAL:   Fatal conditions (restart required)
```

### Structured Logging

```json
{
  "timestamp": "2024-06-18T10:30:45.123Z",
  "level": "info",
  "service": "walrus-memory-api",
  "version": "1.0.0",
  "message": "Memory stored successfully",
  "correlationId": "req_abc123",
  "metadata": {
    "key": "conversation_001",
    "type": "conversation",
    "walrusId": "walrus_xyz",
    "duration": 245
  }
}
```

### Log Aggregation

**Recommended Tools:**
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Datadog
- CloudWatch (AWS)
- Stackdriver (Google Cloud)
- New Relic

**Configuration:**
```bash
# Enable structured logging
export LOG_FORMAT=json
export LOG_LEVEL=info

# Send to centralized logging
export LOG_ENDPOINT=https://logs.example.com/ingest
```

### Alerting Rules

```yaml
# Alert if error rate exceeds 1%
- alert: HighErrorRate
  expr: |
    (rate(errors_total[5m]) / rate(requests_total[5m])) > 0.01
  for: 5m
  action: PagerDuty alert

# Alert if Walrus is unreachable
- alert: WalrusUnreachable
  expr: walrus_health_check_failures > 3
  for: 1m
  action: PagerDuty critical + Slack
```

---

## 4. Backup & Disaster Recovery

### Backup Strategy

**Backup Types:**
```
Point-in-Time: Daily snapshots at midnight UTC
Incremental: Every 6 hours
Transaction Log: Continuous

Retention:
- Daily backups: 30 days
- Weekly backups: 90 days
- Monthly backups: 1 year
```

### Backup Procedures

**1. Export Audit Trail**
```bash
# Export all memory operations (on-chain)
curl http://localhost:3000/api/admin/export-audit \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  > audit_backup_$(date +%Y%m%d_%H%M%S).json
```

**2. Export Memory Data**
```bash
# Export all stored memories
curl http://localhost:3000/api/admin/export-memories \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  > memory_backup_$(date +%Y%m%d_%H%M%S).json
```

**3. Backup Configuration**
```bash
# Backup environment and configuration
tar -czf config_backup_$(date +%Y%m%d_%H%M%S).tar.gz \
  .env.prod \
  config/ \
  secrets/
```

### Recovery Procedures

**In Case of Data Loss:**

```
Step 1: Identify affected period
  └─ Check Sui blockchain for last successful transaction
  
Step 2: Restore from backup
  └─ Restore from latest backup before incident
  
Step 3: Verify data integrity
  └─ Run integrity check on all memories
  └─ Verify checksums match
  
Step 4: Rebuild indices
  └─ Rebuild Sui indices from audit trail
  
Step 5: Monitor for issues
  └─ Monitor for 1 hour for discrepancies
```

### Disaster Recovery Plan

```
RTO (Recovery Time Objective): 1 hour
RPO (Recovery Point Objective): 1 hour

Scenario 1: Single machine failure
  → Failover to secondary (automatic)
  → Time: <1 minute

Scenario 2: Data corruption
  → Restore from backup
  → Verify checksums
  → Time: 15-30 minutes

Scenario 3: Walrus unavailable
  → Use local cache (TTL: 24 hours)
  → Queue operations for Walrus
  → Time: 0 (graceful degradation)

Scenario 4: Sui blockchain congestion
  → Buffer operations
  → Batch submit when network clears
  → Time: automatic
```

---

## 5. Capacity Planning

### Growth Projections

```
Metrics to track:
- Total memories stored: Growth rate per month
- Total memory size: Growth rate per month
- Concurrent agents: Growth rate
- Daily transactions: Growth rate

Example:
Month 1: 1,000 memories, 100MB
Month 2: 2,500 memories, 250MB (2.5x growth)
Month 3: 5,000 memories, 500MB (2x growth)
```

### Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| Total Size | >80% budget | Increase Walrus allocation |
| Latency p95 | >200ms | Profile and optimize |
| Error Rate | >1% | Investigate issues |
| Cache Hit | <60% | Increase cache size |

### Estimated Costs

```
Development:
- Walrus: $0-5/month (minimal usage)
- Sui Fees: $1-10/month
- Total: ~$10/month

Production (100GB):
- Walrus: $5/month (100GB × $0.05)
- Sui Fees: $50-100/month (10k+ transactions)
- Total: ~$60/month

Large Scale (1TB):
- Walrus: $50/month (1TB × $0.05)
- Sui Fees: $500-1000/month (100k+ transactions)
- Total: ~$600/month
```

---

## 6. Maintenance Tasks

### Daily

- [ ] Check health endpoint responds
- [ ] Review error logs for critical issues
- [ ] Monitor API latency metrics

### Weekly

- [ ] Review performance trends
- [ ] Check backup completion
- [ ] Test recovery procedure (staging)
- [ ] Review security logs

### Monthly

- [ ] Full system audit
- [ ] Capacity analysis
- [ ] Dependency updates
- [ ] Disaster recovery drill
- [ ] Performance optimization review

### Quarterly

- [ ] Security audit
- [ ] Infrastructure review
- [ ] Cost optimization
- [ ] Compliance check

---

## 7. Troubleshooting Guide

### Issue 1: High API Latency

**Symptoms:** p95 latency >200ms

**Diagnosis Steps:**
```bash
# 1. Check service health
curl http://localhost:3000/health

# 2. Check system resources
ps aux | grep node
free -h
df -h

# 3. Check Walrus connectivity
curl https://walrus-testnet.walrus.live/health

# 4. Check Sui connectivity
curl https://fullnode.testnet.sui.io:443/health

# 5. Check logs for errors
tail -100 logs/app.log | grep -i error
```

**Solutions:**
- [ ] Increase cache size
- [ ] Enable query caching
- [ ] Optimize Walrus queries
- [ ] Increase API server resources
- [ ] Check network bandwidth

### Issue 2: High Error Rate

**Symptoms:** >1% of requests fail

**Diagnosis Steps:**
```bash
# 1. Count errors by type
tail -1000 logs/app.log | grep ERROR | cut -d'|' -f3 | sort | uniq -c

# 2. Check Walrus errors
curl http://localhost:3000/api/admin/diagnostics | grep -A 5 walrus

# 3. Check Sui errors
curl http://localhost:3000/api/admin/diagnostics | grep -A 5 sui

# 4. Check error rate by endpoint
tail -1000 logs/app.log | grep ERROR | cut -d'|' -f5 | sort | uniq -c
```

**Solutions:**
- [ ] Check Walrus status page
- [ ] Check Sui network status
- [ ] Review recent deployments
- [ ] Rollback if recent changes caused it
- [ ] Check rate limiting

### Issue 3: Out of Memory

**Symptoms:** Process crashes with OOM error

**Diagnosis Steps:**
```bash
# 1. Check current memory usage
ps aux | grep node | head -1
→ Look at RSS column

# 2. Check cache size
curl http://localhost:3000/api/admin/cache-stats

# 3. Check for memory leaks
# If memory grows continuously:
node --inspect app.js
# Then use Chrome DevTools to profile

# 4. Check for large queries
tail logs/app.log | grep "query size" | sort -k3 -rn | head -5
```

**Solutions:**
- [ ] Reduce cache size
- [ ] Increase node memory: `NODE_OPTIONS=--max-old-space-size=2048`
- [ ] Implement pagination for large queries
- [ ] Check for memory leaks in dependencies

### Issue 4: Walrus Upload Failures

**Symptoms:** Memory store operations timeout or fail

**Diagnosis Steps:**
```bash
# 1. Check Walrus connectivity
curl -v https://walrus-testnet.walrus.live/health

# 2. Check network connectivity
ping -c 5 walrus-testnet.walrus.live

# 3. Check Walrus endpoint configuration
grep WALRUS_ENDPOINT .env

# 4. Test direct upload
curl -X POST https://walrus-testnet.walrus.live/v1/blobs \
  -F "blob=@test.json" \
  --verbose
```

**Solutions:**
- [ ] Check Walrus service status
- [ ] Verify network connectivity
- [ ] Check API credentials
- [ ] Retry with exponential backoff
- [ ] Enable local caching fallback

### Issue 5: Sui Transaction Timeout

**Symptoms:** Storing memory succeeds but doesn't appear in Sui

**Diagnosis Steps:**
```bash
# 1. Check Sui network status
curl https://fullnode.testnet.sui.io:443/api/health

# 2. Check transaction status
sui client execute-signed-tx <transaction-bytes>

# 3. Check recent transactions
sui client query-tx 0x<tx_hash>

# 4. Check Sui balance
sui client balance
```

**Solutions:**
- [ ] Wait for network to clear
- [ ] Increase gas budget
- [ ] Batch transactions
- [ ] Check account balance
- [ ] Verify Sui RPC endpoint

---

## 8. Performance Optimization

### Caching Strategy

```
Optimization: Enable multi-tier caching

Benefits:
- L1 (Local):   1-10ms latency
- L2 (Redis):   10-50ms latency
- L3 (Walrus):  300-500ms latency

Configuration:
CACHE_ENABLED=true
CACHE_MAX_SIZE=1000
CACHE_TTL_HOT=3600      # 1 hour
CACHE_TTL_WARM=86400    # 1 day
```

### Query Optimization

```
Before Optimization:
- Query latency: 500ms
- Cache hit: 40%

After:
- Add indexing: -40% latency
- Add pre-warming: +30% hit rate
- Result: 300ms latency, 70% hit rate

Commands:
curl -X POST http://localhost:3000/api/admin/optimize \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"strategy": "aggressive"}'
```

### Batch Operations

```typescript
// Instead of storing 1000 items individually
// Store in batches of 10-100

const items = [...]; // 1000 items

// ❌ Slow: 1000 API calls
for (const item of items) {
  await memory.store(item.key, item.content);
}

// ✅ Fast: 10 batch calls
const batches = chunk(items, 100);
for (const batch of batches) {
  await memory.batchStore(batch);
}
```

---

## 9. Upgrading

### Version Update Procedure

```
Step 1: Test in staging
  └─ Deploy new version to staging
  └─ Run full E2E tests
  └─ Monitor for 24 hours

Step 2: Backup production
  └─ Export audit trail
  └─ Backup all configuration

Step 3: Blue-green deployment
  └─ Deploy new version alongside old
  └─ Route traffic gradually (10% → 50% → 100%)
  └─ Keep old version running for rollback

Step 4: Monitor
  └─ Watch error rates and latency
  └─ Check logs for issues
  └─ Be ready to rollback if needed

Step 5: Cleanup
  └─ Remove old version after 1 hour
  └─ Archive logs and metrics
```

### Rollback Procedure

```bash
# Quick rollback to previous version
docker pull walrus-memory:v1.0.0
docker stop walrus-memory-api
docker run -d --name walrus-memory-api walrus-memory:v1.0.0

# Verify
curl http://localhost:3000/health
```

---

## 10. Incident Response

### Severity Levels

| Level | Impact | Response Time | Escalation |
|-------|--------|----------------|------------|
| **Critical** | Service down, data loss risk | <15 minutes | Executive |
| **High** | Significant degradation | <1 hour | Management |
| **Medium** | Partial functionality affected | <4 hours | Team Lead |
| **Low** | Minor issues | <24 hours | Tracking only |

### On-Call Procedures

```
1. Alert received → Page on-call engineer
2. On-call confirms issue (5 min)
3. Implement temporary fix if available (15 min)
4. Begin root cause analysis (ongoing)
5. Communicate status every 30 minutes
6. Implement permanent fix
7. Post-mortem within 24 hours
```

---

## Resources

- **Monitoring**: Prometheus, Grafana, DataDog
- **Logging**: ELK Stack, CloudWatch, Stackdriver
- **Alerting**: PagerDuty, OpsGenie, VictorOps
- **Status Page**: StatusPage.io, Atlassian Status
- **Documentation**: Confluence, Notion, GitHub Wiki

---

**Last Updated:** 2026-06-18  
**Version:** 1.0
