import { query } from '@/lib/postgres';

function mapUser(row) {
  return {
    _id: String(row.id),
    username: row.username,
    password: row.password,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getUserByUsername(username) {
  const result = await query(
    `
      SELECT id, username, password, created_at, updated_at
      FROM users
      WHERE username = $1
      LIMIT 1
    `,
    [username]
  );

  return result.rows[0] ? mapUser(result.rows[0]) : null;
}

export async function getUserCount() {
  const result = await query('SELECT COUNT(*)::int AS count FROM users');

  return result.rows[0].count;
}

export async function createUser({ username, password }) {
  const result = await query(
    `
      INSERT INTO users (username, password)
      VALUES ($1, $2)
      RETURNING id, username, password, created_at, updated_at
    `,
    [username, password]
  );

  return mapUser(result.rows[0]);
}
