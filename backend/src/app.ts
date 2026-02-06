import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import bookingRoutes from './routes/bookingRoutes';
import serviceRoutes from './routes/serviceRoutes';
import customerRoutes from './routes/customerRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import logger from './utils/logger';

export const createApp = () => {
  const app = express();

  // ─── Security & Middleware ───────────────────────────────────────────────
  app.use(helmet());
  
  app.use(cors({
    origin: config.FRONTEND_URL || 'http://localhost:3000', // fallback for local dev
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  // Rate limiting on all API routes
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // limit each IP to 100 requests per window
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
  });
  app.use('/api', apiLimiter);

  // Body parsing with size limit (prevent DoS)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Compression
  app.use(compression());

  // ─── Logging ───────────────────────────────────────────────────────────────
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
    next();
  });

  // ─── Public endpoints ──────────────────────────────────────────────────────
  // Health check (always useful)
  app.get('/health', (req, res) => {
    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AquaGlow API',
      version: '1.0.0',
      environment: config.NODE_ENV || 'development'
    });
  });

  // Root welcome message (good for debugging)
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to AquaGlow API',
      version: '1.0.0',
      endpoints: {
        health: '/health',
        bookings: '/api/bookings',
        services: '/api/services',
        customers: '/api/customers'
      }
    });
  });

  app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'AquaGlow API is running',
    endpoints: {
      auth: '/api/auth',
      bookings: '/api/bookings',
      services: '/api/services',
      customers: '/api/customers'
    }
  });
});

  // ─── API Routes ────────────────────────────────────────────────────────────
  app.use('/api/auth', authRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/services', serviceRoutes);
  app.use('/api/customers', customerRoutes);

  // ─── Error & 404 Handling ──────────────────────────────────────────────────
  // 404 - must be after all routes
  app.use(notFoundHandler);

  // Global error handler - must be last middleware
  app.use(errorHandler);

  return app;
};