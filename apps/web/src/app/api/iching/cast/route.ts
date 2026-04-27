import { NextRequest, NextResponse } from 'next/server';
import { castHexagram } from '@/lib/iching/castService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const throws = body.throws || 3;

    if (throws !== 3 && throws !== 6) {
      return NextResponse.json({ error: 'Chỉ hỗ trợ 3 hoặc 6 đồng xu.' }, { status: 400 });
    }

    const result = castHexagram(throws);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
