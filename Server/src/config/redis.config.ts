import { createClient } from 'redis';

export const redisClient = createClient({
  url: process.env.REDIS_URL  
});

redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});

redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

(async () => {
  await redisClient.connect();
})();
