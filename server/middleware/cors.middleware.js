import cors from 'cors';

export const corsMiddleware = () =>
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  });
