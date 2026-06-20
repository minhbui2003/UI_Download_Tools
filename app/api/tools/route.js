import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, isConfigError, verifyAuthToken } from '@/lib/auth';
import { createTool, getTools } from '@/lib/tools';

export async function GET() {
  try {
    const tools = await getTools();
    return NextResponse.json(tools, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    try {
      const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      const payload = await verifyAuthToken(token);
      if (payload.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch (err) {
      if (isConfigError(err)) {
        return NextResponse.json({ error: err.message }, { status: 500 });
      }

      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const newTool = await createTool(data);
    
    return NextResponse.json(newTool, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
