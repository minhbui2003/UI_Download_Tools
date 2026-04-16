import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, isConfigError, verifyAuthToken } from '@/lib/auth';
import { deleteTool, updateTool } from '@/lib/tools';

async function checkAuth(req) {
  try {
    const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    await verifyAuthToken(token);
    return { authenticated: true };
  } catch (error) {
    if (isConfigError(error)) {
      return { authenticated: false, error, status: 500 };
    }

    return { authenticated: false, status: 401 };
  }
}

export async function PUT(req, { params }) {
  const auth = await checkAuth(req);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: auth.error?.message || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const data = await req.json();
    const { id } = params;
    const updatedTool = await updateTool(id, data);
    
    if (!updatedTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTool, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  const auth = await checkAuth(req);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: auth.error?.message || 'Unauthorized' },
      { status: auth.status }
    );
  }

  try {
    const { id } = params;
    const deletedTool = await deleteTool(id);
    if (!deletedTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tool deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
