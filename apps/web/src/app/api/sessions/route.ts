import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/sessions — Tạo phiên chat mới
export async function POST(req: NextRequest) {
    try {
        const rawText = await req.text();
        let body;
        try {
            body = JSON.parse(rawText);
        } catch (parseError) {
            console.error('[API /api/sessions] JSON Parse error. Raw body was:', rawText);
            return NextResponse.json({ error: 'Payload không hợp lệ' }, { status: 400 });
        }
        
        const { topic, astrologyData } = body;

        const sessionTopic = topic || 'Luận giải Tử Vi';

        const session = await db.chatSession.create({
            data: {
                topic: sessionTopic,
                astrologyData: astrologyData ? JSON.stringify(astrologyData) : null,
            },
        });

        return NextResponse.json({ success: true, sessionId: session.id, isExisting: false });
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
            const sessions = await db.chatSession.findMany({
                orderBy: { createdAt: 'desc' },
                select: { id: true, topic: true, astrologyData: true, createdAt: true },
                take: 50
            });
            return NextResponse.json({ success: true, sessions });
        }

        const messages = await db.chatMessage.findMany({
            where: { sessionId },
            orderBy: { createdAt: 'asc' },
            select: { id: true, role: true, content: true, createdAt: true },
        });

        return NextResponse.json({ success: true, messages });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
