import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../db/schema';

class DatabaseConnection {
  private static instance: DatabaseConnection;
  private db: ReturnType<typeof drizzle>;

  private constructor() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('ERROR: DATABASE_URL environment variable is not set');
      throw new Error('DATABASE_URL environment variable is not set');
    }
    try {
      const dbUrl = new URL(connectionString);
      const sslMode = dbUrl.searchParams.get('sslmode');
      const client = postgres({
        host: dbUrl.hostname,
        port: dbUrl.port ? parseInt(dbUrl.port, 10) : 5432,
        database: dbUrl.pathname.replace(/^\//, ''),
        username: decodeURIComponent(dbUrl.username),
        password: decodeURIComponent(dbUrl.password),
        ssl: sslMode === 'require' ? 'require' : sslMode === 'disable' ? false : undefined,
        prepare: false,
      });
      this.db = drizzle({ client, schema });
      console.log('Database connected successfully');
    } catch (err) {
      console.error('Failed to connect to database:', err);
      throw err;
    }
  }

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  getDb() {
    return this.db;
  }
}

export const getDb = () => DatabaseConnection.getInstance().getDb();
export const initDb = () => { DatabaseConnection.getInstance(); };
