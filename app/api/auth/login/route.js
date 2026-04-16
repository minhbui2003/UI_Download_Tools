import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getAuthCookieOptions, isConfigError, signAuthToken } from '@/lib/auth';
import { getUserByUsername } from '@/lib/users';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Please provide username and password' }, { status: 400 });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signAuthToken({
      id: user._id.toString(),
      username: user.username,
    });

    const response = NextResponse.json({ message: 'Login successful' }, { status: 200 });
    response.cookies.set({
      ...getAuthCookieOptions(),
      value: token,
    });

    return response;
  } catch (error) {
    if (isConfigError(error)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
