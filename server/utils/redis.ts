import { Redis } from 'ioredis';
require('dotenv').config();
import logger from './logger';

const redisClient = () => {
    if (process.env.REDIS_URL) {
        logger.info('Redis configured with URL', { url: process.env.REDIS_URL });
        return process.env.REDIS_URL;
    }
    
    // Fallback to default localhost Redis for development
    logger.info('Redis configured with default localhost URL');
    return 'redis://localhost:6379';
};

export const redis = new Redis(redisClient());

// Handle Redis connection events
redis.on('connect', () => {
    logger.info('Redis client connected');
});

redis.on('error', (err) => {
    logger.error('Redis connection error', { message: err?.message, stack: err?.stack });
    // Don't crash the app on Redis errors
});

redis.on('ready', () => {
    logger.info('Redis client ready');
});

redis.on('close', () => {
    logger.warn('Redis connection closed');
});

redis.on('reconnecting', () => {
    logger.warn('Redis reconnecting...');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('Closing Redis connection...');
    await redis.quit();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('Closing Redis connection...');
    await redis.quit();
    process.exit(0);
});
