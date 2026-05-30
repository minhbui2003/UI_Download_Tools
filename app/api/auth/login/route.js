import { NextResponse } from 'next/server';
import { getAuthCookieOptions, isConfigError, signAuthToken } from '@/lib/auth';

export async function POST(req) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập tài khoản và mật khẩu' }, { status: 400 });
    }

    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const employeeUsername = process.env.EMPLOYEE_USERNAME;
    const employeePassword = process.env.EMPLOYEE_PASSWORD;

    let role = null;
    let userId = null;

    // Ưu tiên check admin trước
    if (username === adminUsername && password === adminPassword) {
      role = 'admin';
      userId = 'admin_id';
    } else if (username === employeeUsername && password === employeePassword) {
      role = 'employee';
      userId = 'employee_id';
    } else {
      return NextResponse.json({ error: 'Tài khoản hoặc mật khẩu không chính xác' }, { status: 401 });
    }

    const token = await signAuthToken({
      id: userId,
      username: username,
      role: role
    });

    const response = NextResponse.json({ message: 'Đăng nhập thành công', role: role }, { status: 200 });
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
