import pg from 'pg';

const { Pool } = pg;

const globalForPg = globalThis;
const pgState = globalForPg.pgState || {
  schemaReady: null,
  loggedConfig: false,
  loggedConnected: false,
  loggedSchemaReady: false,
  listenersAttached: false,
};

function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured`);
  }

  return value;
}

function getSslConfig() {
  if (process.env.POSTGRES_SSL === 'true') {
    return { rejectUnauthorized: false };
  }

  if (process.env.POSTGRES_SSL === 'false') {
    return false;
  }

  return process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : false;
}

function getPoolConfig() {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;
  const ssl = getSslConfig();

  if (connectionString) {
    return {
      connectionString,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
      max: 10,
      ssl,
    };
  }

  return {
    host: getRequiredEnv('POSTGRES_HOST'),
    port: Number(process.env.POSTGRES_PORT || 5432),
    user: getRequiredEnv('POSTGRES_USER'),
    password: getRequiredEnv('POSTGRES_PASSWORD'),
    database: getRequiredEnv('POSTGRES_DATABASE'),
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 10,
    ssl,
  };
}

const poolConfig = getPoolConfig();

export const pool = globalForPg.pgPool || new Pool(poolConfig);

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool;
  globalForPg.pgState = pgState;
}

if (!pgState.loggedConfig) {
  pgState.loggedConfig = true;
  console.info('[postgres] pool created', {
    host: poolConfig.host || 'connection-string',
    port: poolConfig.port || 'connection-string',
    database: poolConfig.database || 'connection-string',
    user: poolConfig.user || 'connection-string',
    ssl: Boolean(poolConfig.ssl),
  });
}

if (!pgState.listenersAttached) {
  pgState.listenersAttached = true;

  pool.on('connect', (client) => {
    if (!pgState.loggedConnected) {
      pgState.loggedConnected = true;
      console.info('[postgres] connected', {
        database: client.database,
        user: client.user,
        host: client.host,
        port: client.port,
      });
    }
  });

  pool.on('error', (error) => {
    console.error('[postgres] pool error', {
      code: error.code,
      message: error.message,
    });
  });
}

async function ensureSchema() {
  if (!pgState.schemaReady) {
    pgState.schemaReady = pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        version TEXT NOT NULL DEFAULT 'v1.0.0',
        description TEXT NOT NULL,
        size TEXT NOT NULL DEFAULT 'N/A',
        link TEXT NOT NULL,
        icon_name TEXT NOT NULL DEFAULT 'Wrench',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS tools_created_at_idx ON tools (created_at DESC);
    `);
  }

  try {
    await pgState.schemaReady;
    if (!pgState.loggedSchemaReady) {
      pgState.loggedSchemaReady = true;
      console.info('[postgres] schema ready', {
        tables: ['users', 'tools'],
      });
    }
  } catch (error) {
    pgState.schemaReady = null;
    console.error('[postgres] schema/init failed', {
      code: error.code,
      message: error.message,
    });
    throw error;
  }
}

export async function query(text, params = []) {
  await ensureSchema();
  return pool.query(text, params);
}
