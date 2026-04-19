import 'dotenv/config';
import { createApp } from './app';

const PORT = Number(process.env.PORT ?? 3000);

const app = createApp();

app.listen(PORT, () => {
  console.log(`Bookify API server running on port ${PORT} [${process.env.NODE_ENV ?? 'development'}]`);
});
