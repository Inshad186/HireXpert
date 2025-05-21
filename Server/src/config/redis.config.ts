import { createClient } from 'redis';

export const redisClient = createClient({
  url: 'redis://localhost:6379'  
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
