import { NextResponse } from 'next/server';
import { UserManager } from '../../../lib/UserManager';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  // Kiểm tra xem có tham số get_token không
  if (searchParams.has('get_token')) {
    return NextResponse.json({
      status: "Luna API Online",
      info: "Dữ liệu JSON đã sẵn sàng cho Launcher",
      version: "1.0.2"
    }, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Nếu không có biến, chúng ta trả về một tín hiệu để Next.js biết 
  // là không xử lý ở đây (để nó rơi xuống file HTML/Page)
  return NextResponse.next(); 
}

export async function POST(req: Request) {
  // ... Giữ nguyên logic xử lý Đăng nhập/Đăng ký của Minh ...
  try {
    const { u, p, id, l } = await req.json();
    if (l) {
        await UserManager.register(u, p, id, l);
        return NextResponse.json({ a1: true, msg: "Signup Success" });
    }
    const result = await UserManager.authenticate(u, p, id);
    return NextResponse.json({ a1: true, z9: result.token, l: result.license });
  } catch (err: any) {
    return NextResponse.json({ a1: false, msg: err.message }, { status: 401 });
  }
}
