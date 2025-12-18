import { NextResponse } from 'next/server';
import { UserManager } from '@/lib/UserManager';

export async function POST(req: Request) {
  try {
    const { u, p, id } = await req.json();
    
    // Gọi module xử lý
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
