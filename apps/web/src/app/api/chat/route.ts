// @ts-nocheck
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';

function getGoogleApiKey() {
    const apiKey = process.env.GEMINI_API_KEY
        || process.env.GOOGLE_GENERATIVE_AI_API_KEY
        || process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        throw new Error('Missing GEMINI_API_KEY');
    }

    return apiKey;
}

function getGroqApiKey() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('Missing GROQ_API_KEY');
    }
    return apiKey;
}

function getProviderMode() {
    const raw = (process.env.AI_PROVIDER || process.env.LLM_PROVIDER || 'gemini').toLowerCase().trim();
    if (raw === 'groq' || raw === 'grog') return 'groq';
    return 'gemini';
}

function getTemperature(providerMode: 'gemini' | 'groq') {
    const raw = process.env.AI_TEMPERATURE;
    if (raw !== undefined && raw !== null && raw !== '') {
        const parsed = Number(raw);
        if (!Number.isNaN(parsed)) {
            return Math.max(0, Math.min(1, parsed));
        }
    }
    return providerMode === 'gemini' ? 0.25 : 0.4;
}

export async function POST(req: NextRequest) {
    try {
        const { messages, sessionId, chartData } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: 'Invalid messages format' }), { status: 400 });
        }

        // Lưu message của user vào DB (nếu có sessionId)
        const lastUserMessage = messages[messages.length - 1];
        let session = null;
        if (sessionId) {
            try {
                session = await db.chatSession.findUnique({ where: { id: sessionId } });
                if (session && lastUserMessage?.role === 'user') {
                    await db.chatMessage.create({
                        data: { sessionId, role: 'user', content: lastUserMessage.content }
                    });
                }
            } catch (e) {
                console.error('[DB] Failed to save message:', e);
            }
        }

        const providerMode = getProviderMode();
        const aiModel = providerMode === 'groq'
            ? (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile')
            : (process.env.GEMINI_MODEL || process.env.GOOGLE_MODEL || 'gemini-2.5-pro');

        const model =
            providerMode === 'groq'
                ? createGroq({ apiKey: getGroqApiKey() })(aiModel)
                : createGoogleGenerativeAI({ apiKey: getGoogleApiKey() })(aiModel);

        const systemContent = [
            'Bạn là chuyên gia Tử Vi Đẩu Số, luận giải theo dữ liệu JSON được cung cấp.',
            'BẮT BUỘC dùng tiếng Việt UTF-8, không emoji, không icon.',
            'BẮT BUỘC trình bày theo markdown, tách dòng rõ, không viết thành 1 đoạn dài.',
            'CẤM mơ hồ: không dùng các cụm kiểu "có thể sẽ", "khả năng cao thấp" nếu không gắn mức độ và điều kiện.',
            'Mỗi kết luận quan trọng phải có đủ: Năm cụ thể | Cửa sổ ±1 năm | Mức độ | Căn cứ sao+cung | Neo hạn (Đại vận/Tiểu hạn/Lưu niên) | Hành động.',
            'Nếu dữ liệu yếu hoặc xung đột: ghi rõ "độ chắc chắn: thấp/trung bình/cao" + điều kiện kích hoạt; không kết luận tuyệt đối.',
            'Khi có EVENT SIGNALS và TOP_EVENTS_TABLE: phải ưu tiên bám đúng dữ liệu này khi kết luận sự kiện.',
            'Khi luận giải 12 cung: mỗi cung phải có điểm tốt, điểm xấu, mức độ tác động, chiến lược và vận hạn năm xem.',
            'Tuyệt đối không thêm dữ liệu ngoài JSON đầu vào.',
        ].join(' ');

        const validRoles = ['user', 'assistant', 'system', 'tool'];
        const coreMessages = messages
            .filter((m: any) => m.role !== 'system')
            .map((m: any) => {
            // Guard against undefined content or unexpected formats causing AI SDK schema validation errors
            const role = validRoles.includes(m.role) ? m.role : 'user';
            return {
                role: role,
                content: typeof m.content === 'string' ? m.content : (m.content ? JSON.stringify(m.content) : "")
            };
        });

        console.log('[API] coreMessages payload length:', coreMessages.length);

        // AI SDK streamText
        console.log('[API] Starting streamText provider/model:', providerMode, aiModel);
        const temperature = getTemperature(providerMode);
        const result = streamText({
            model,
            system: systemContent,
            messages: coreMessages,
            maxOutputTokens: 8192,
            temperature,
            onFinish: async ({ text }) => {
                console.log('[API] streamText onFinish trigger, text length:', text?.length);
                if (sessionId && session) {
                    try {
                        await db.chatMessage.create({
                            data: { sessionId, role: 'assistant', content: text }
                        });
                    } catch (e) {
                        console.error('[DB] Failed to save AI response:', e);
                    }
                }
            }
        });

        console.log('[API] Streaming result initialized.');

        if (typeof (result as any).toUIMessageStreamResponse === 'function') {
            console.log('[API] Calling toUIMessageStreamResponse');
            return (result as any).toUIMessageStreamResponse();
        } else if (typeof (result as any).toTextStreamResponse === 'function') {
            console.log('[API] Calling toTextStreamResponse');
            return (result as any).toTextStreamResponse();
        }

        // Fallback
        console.log('[API] Falling back to textStream Response');
        return new Response(result.textStream || "Lỗi stream", {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
    } catch (e: any) {
        console.error('[API /api/chat] Error:', e);
        return new Response(JSON.stringify({ error: e.message || 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
