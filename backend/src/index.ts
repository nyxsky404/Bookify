import 'dotenv/config';
import { createApp } from './app';

const PORT = Number(process.env.PORT ?? 3000);

try {
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Bookify API server running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
  });
} catch (err) {
  console.error('Failed to start server:', err);
  process.exit(1);
}
