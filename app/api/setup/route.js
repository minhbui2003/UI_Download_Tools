import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createUser, getUserCount } from '@/lib/users';

function getBearerToken(req) {
  const authHeader = req.headers.get('authorization') || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

function getSetupConfig() {
  const { SETUP_TOKEN, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;

  if (!SETUP_TOKEN || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error('SETUP_TOKEN, ADMIN_USERNAME, and ADMIN_PASSWORD must be configured');
  }

  return { SETUP_TOKEN, ADMIN_USERNAME, ADMIN_PASSWORD };
}

export async function POST(req) {
  try {
    const config = getSetupConfig();
    const token = getBearerToken(req);

    if (token !== config.SETUP_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userCount = await getUserCount();
    if (userCount > 0) {
      return NextResponse.json({ message: 'Setup already completed. Admin user exists.' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(config.ADMIN_PASSWORD, salt);

    const newAdmin = await createUser({
      username: config.ADMIN_USERNAME,
      password: hashedPassword,
    });

    return NextResponse.json({ message: 'Default admin created successfully', username: newAdmin.username }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
