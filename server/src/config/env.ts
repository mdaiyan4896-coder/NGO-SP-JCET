import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/voluneease?schema=public',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || 'voluneease_dev_secret_access_key',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'voluneease_dev_secret_refresh_key',
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',
  STORAGE_DRIVER: process.env.STORAGE_DRIVER || 'local',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
};
