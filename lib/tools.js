import { query } from '@/lib/postgres';

function mapTool(row) {
  return {
    _id: String(row.id),
    title: row.title,
    version: row.version,
    description: row.description,
    size: row.size,
    link: row.link,
    iconName: row.icon_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function normalizeToolInput(data, { partial = false } = {}) {
  const normalized = {};

  for (const field of ['title', 'description', 'link']) {
    if (!partial || data[field] !== undefined) {
      const value = data[field]?.trim();
      if (!value) {
        throw new Error(`Please provide a ${field}`);
      }
      normalized[field] = value;
    }
  }

  if (!partial || data.version !== undefined) {
    normalized.version = data.version?.trim() || 'v1.0.0';
  }

  if (!partial || data.size !== undefined) {
    normalized.size = data.size?.trim() || 'N/A';
  }

  if (!partial || data.iconName !== undefined) {
    normalized.iconName = data.iconName?.trim() || 'Wrench';
  }

  return normalized;
}

function parseToolId(id) {
  const parsed = Number.parseInt(id, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error('Invalid tool id');
  }

  return parsed;
}

export async function getTools() {
  const result = await query(`
    SELECT id, title, version, description, size, link, icon_name, created_at, updated_at
    FROM tools
    ORDER BY created_at DESC, id DESC
  `);

  return result.rows.map(mapTool);
}

export async function createTool(data) {
  const tool = normalizeToolInput(data);
  const result = await query(
    `
      INSERT INTO tools (title, version, description, size, link, icon_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, version, description, size, link, icon_name, created_at, updated_at
    `,
    [tool.title, tool.version, tool.description, tool.size, tool.link, tool.iconName]
  );

  return mapTool(result.rows[0]);
}

export async function updateTool(id, data) {
  const toolId = parseToolId(id);
  const tool = normalizeToolInput(data, { partial: true });
  const result = await query(
    `
      UPDATE tools
      SET
        title = COALESCE($1, title),
        version = COALESCE($2, version),
        description = COALESCE($3, description),
        size = COALESCE($4, size),
        link = COALESCE($5, link),
        icon_name = COALESCE($6, icon_name),
        updated_at = NOW()
      WHERE id = $7
      RETURNING id, title, version, description, size, link, icon_name, created_at, updated_at
    `,
    [
      tool.title,
      tool.version,
      tool.description,
      tool.size,
      tool.link,
      tool.iconName,
      toolId,
    ]
  );

  return result.rows[0] ? mapTool(result.rows[0]) : null;
}

export async function deleteTool(id) {
  const toolId = parseToolId(id);
  const result = await query('DELETE FROM tools WHERE id = $1 RETURNING id', [toolId]);

  return result.rowCount > 0;
}
