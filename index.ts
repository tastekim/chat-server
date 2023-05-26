import { redisClient } from './src/config/redis';
import pkg from './package.json';
import { server } from './app';

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => console.log(`listening on ${PORT}`));

process.on('SIGTERM', async () => {
  console.log(`${pkg.name}: received SIGTERM`);
  await redisClient.quit();
  process.exit(0);
});

export { server };