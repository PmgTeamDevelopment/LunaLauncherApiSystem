import { NextResponse } from 'next/server';
// Lùi 3 cấp để vào thư mục lib từ app/auth/login
import { UserManager } from '../../../../../lib/UserManager';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // Nếu URL có tham số ?get_token, trả về JSON cho Launcher
  if (searchParams.has('get_token')) {
    return NextResponse.json({
      status: "Luna API Online",
      message: "Ready for Launcher",
      endpoint: "/auth/login",
      timestamp: new Date().toISOString()
    });
  }

  // Nếu không có query, trả về lỗi 404 để vercel.json kích hoạt rewrite sang login.html
  return new Response(null, { status: 404 }); 
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { u, p, id, l } = body;

    // Nếu có license key 'l' gửi lên -> Thực hiện Đăng ký
    if (l !== undefined) {
      await UserManager.register(u, p, id, l);
      return NextResponse.json({ a1: true, msg: "Đăng ký thành công!" });
    }

    // Ngược lại -> Thực hiện Đăng nhập
    const result = await UserManager.authenticate(u, p, id);
    return NextResponse.json({ 
      a1: true, 
      z9: result.token, 
      l: result.license 
    });
  } catch (err: any) {
    // Trả về lỗi từ UserManager (ví dụ: "Sai mật khẩu")
    return NextResponse.json({ a1: false, msg: err.message }, { status: 401 });
  }
}
