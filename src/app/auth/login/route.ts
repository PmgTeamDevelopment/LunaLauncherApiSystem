import { NextResponse } from 'next/server';
// Chú ý lùi 4 cấp để vào thư mục lib
import { UserManager } from '../../../lib/UserManager';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // Kiểm tra tham số ?get_token để trả về trạng thái API
  if (searchParams.has('get_token')) {
    return NextResponse.json({
      status: "Luna API Online",
      endpoint: "/auth/login/api",
      message: "Ready for Launcher connections"
    });
  }

  return NextResponse.json({ error: "Access Denied" }, { status: 401 });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { u, p, id, l } = body;

    // Logic Đăng ký nếu có License Key
    if (l !== undefined) {
      await UserManager.register(u, p, id, l);
      return NextResponse.json({ a1: true, msg: "Registered!" });
    }

    // Logic Đăng nhập
    const result = await UserManager.authenticate(u, p, id);
    return NextResponse.json({
      a1: true,
      z9: result.token,
      l: result.license
    });
  } catch (err: any) {
    return NextResponse.json({ a1: false, msg: err.message }, { status: 401 });
  }
}
