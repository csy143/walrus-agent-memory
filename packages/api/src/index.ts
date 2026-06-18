/**
 * Walrus Agent Memory API Server
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3000;

// Simple in-memory store for testing
const memoryStore: Record<string, any> = {};

function createServer(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get('/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      timestamp: Date.now(),
    });
  });

  // Memory CRUD endpoints
  app.post('/api/memory', (req: Request, res: Response) => {
    const { key, type, data } = req.body;
    if (!key || !type || !data) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: key, type, data',
      });
      return;
    }

    const id = `mem_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const record = {
      id,
      key,
      type,
      data,
      owner: 'test_agent',
      walrus_id: `walrus_${id}`,
      encrypted: false,
      checksum: `sha256:${id}`,
      timestamp: Date.now(),
      version: 1,
    };

    memoryStore[key] = record;

    res.status(201).json({
      success: true,
      data: record,
    });
  });

  app.get('/api/memory/:key', (req: Request, res: Response) => {
    const { key } = req.params;
    const record = memoryStore[key];

    if (!record) {
      res.status(404).json({
        success: false,
        error: 'Memory not found',
      });
      return;
    }

    res.json({
      success: true,
      data: record,
    });
  });

  app.delete('/api/memory/:key', (req: Request, res: Response) => {
    const { key } = req.params;
    if (memoryStore[key]) {
      delete memoryStore[key];
      res.json({
        success: true,
        message: 'Memory deleted',
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'Memory not found',
      });
    }
  });

  // Query endpoint
  app.post('/api/query', (req: Request, res: Response) => {
    const results = Object.values(memoryStore);
    res.json({
      success: true,
      data: results,
      count: results.length,
    });
  });

  // Stats endpoint
  app.get('/api/stats', (req: Request, res: Response) => {
    const records = Object.values(memoryStore);
    const byType: Record<string, number> = {};
    let totalSize = 0;

    records.forEach((r: any) => {
      byType[r.type] = (byType[r.type] || 0) + 1;
      totalSize += JSON.stringify(r).length;
    });

    res.json({
      success: true,
      data: {
        total_memories: records.length,
        total_size: totalSize,
        by_type: byType,
      },
    });
  });

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'Not found',
    });
  });

  return app;
}

// Start server
if (require.main === module) {
  const app = createServer();

  app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log(`  GET  /health`);
    console.log(`  POST /api/memory`);
    console.log(`  GET  /api/memory/:key`);
    console.log(`  PUT  /api/memory/:key`);
    console.log(`  DELETE /api/memory/:key`);
    console.log(`  POST /api/query`);
    console.log(`  POST /api/search`);
    console.log(`  GET  /api/stats`);
  });
}

export { createServer };
