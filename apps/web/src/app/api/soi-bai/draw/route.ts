import { NextRequest, NextResponse } from 'next/server';
import { performSoiBai } from '@/lib/soibai/engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { count, name, gender, year, topic } = body;

    const result = performSoiBai({ count, name, year, gender, topic });
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Lỗi server';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
