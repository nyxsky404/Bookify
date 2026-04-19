import 'dotenv/config';
import { createApp } from '../backend/src/app';

const app = createApp();

export default function handler(req: any, res: any) {
  req.url = (req.url as string || '/').replace(/^\/api/, '') || '/';
  app(req, res);
}
