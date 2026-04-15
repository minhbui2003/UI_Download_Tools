import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Tool from '@/models/Tool';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_12345';
const encodedSecret = new TextEncoder().encode(JWT_SECRET);

async function checkAuth(req) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, encodedSecret);
    return true;
  } catch (err) {
    return false;
  }
}

export async function PUT(req, { params }) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const data = await req.json();
    const { id } = params;
    const updatedTool = await Tool.findByIdAndUpdate(id, data, { new: true });
    
    if (!updatedTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTool, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  if (!(await checkAuth(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id } = params;
    const deletedTool = await Tool.findByIdAndDelete(id);
    if (!deletedTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Tool deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
