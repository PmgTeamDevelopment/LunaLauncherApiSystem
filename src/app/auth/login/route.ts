import { NextResponse } from 'next/server';
import { UserManager } from '../../../lib/UserManager';

// Xử lý yêu cầu GET: Kiểm tra biến ?get_token
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const getToken = searchParams.get('get_token');

  // Nếu URL có dạng ?get_token=... (bất kể giá trị gì hoặc rỗng)
  if (getToken !== null) {
    return NextResponse.json({
      status: "Luna API Online",
      version: "1.1.0",
      auth_service: "Active",
      database_type: "GitHub-JSON-DB"
    });
  }

  // Nếu không có biến ?get_token, trả về lỗi 401. 
  // Lúc này vercel.json sẽ tự động ưu tiên file HTML nếu có cấu hình rewrite.
  return new Response("Unauthorized Access", { status: 401 });
}

// Xử lý yêu cầu POST: Đăng nhập & Đăng ký
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { u, p, id, l } = body; // u: user, p: pass, id: hwid, l: licenseKey

    // Logic Đăng ký: Nếu có trường 'l' (licenseKey) gửi lên
    if (l !== undefined) {
      await UserManager.register(u, p, id, l);
      return NextResponse.json({ a1: true, msg: "Sensei đã đăng ký thành công!" });
    }

    // Logic Đăng nhập
    const result = await UserManager.authenticate(u, p, id);

    return NextResponse.json({
      a1: true,
      z9: result.token,
      l: result.license
    });
  } catch (err: any) {
    // Trả về lỗi kèm message từ UserManager (ví dụ: "Sai mật khẩu")
    return NextResponse.json({ a1: false, msg: err.message }, { status: 401 });
  }
}
