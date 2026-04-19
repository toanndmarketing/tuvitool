import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/sessions — Tạo phiên chat mới
export async function POST(req: NextRequest) {
    try {
        const { topic, astrologyData } = await req.json();

        const session = await db.chatSession.create({
            data: {
                topic: topic || 'Luận giải Tử Vi',
                astrologyData: astrologyData ? JSON.stringify(astrologyData) : null,
            },
        });

        return NextResponse.json({ success: true, sessionId: session.id });
    } catch (e: any) {
        console.error('[API /api/sessions] Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

// GET /api/sessions?sessionId=xxx — Lấy lịch sử chat
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const sessionId = searchParams.get('sessionId');

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
        }

        const messages = await db.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            select: { role: true, content: true, createdAt: true },
        });

        return NextResponse.json({ success: true, messages });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
