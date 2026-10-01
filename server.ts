import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './src/server/routes/authRoutes';
import { studentRouter } from './src/server/routes/studentRoutes';
import { publicRouter } from './src/server/routes/publicRoutes';
import { adminRouter } from './src/server/routes/adminRoutes';
import { initDb } from './src/server/db';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Initialize SQLite DB with 20 tables & Seed Data
  await initDb();

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/student', studentRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api', publicRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  if (!isProduction) {
    // Vite Dev Middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Serve static files from Vite build output
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[HKSURYA Server] Education platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[HKSURYA Server] Fatal startup error:', err);
  process.exit(1);
});
