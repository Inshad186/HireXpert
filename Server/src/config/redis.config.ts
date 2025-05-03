// src/config/redis.config.ts
import { createClient } from 'redis';

export const redisClient = createClient({
  url: 'redis://localhost:6379'  // default Redis running locally
});

redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// IMPORTANT: Connect the client
(async () => {
  await redisClient.connect();
})();
