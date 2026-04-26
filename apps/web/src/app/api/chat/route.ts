// @ts-nocheck
import { createGoogleGenerativeAI } from '@ai-sdk/google';
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

        const aiModel = process.env.GEMINI_MODEL || process.env.GOOGLE_MODEL || "gemini-2.5-pro";
        const google = createGoogleGenerativeAI({
            apiKey: getGoogleApiKey(),
        });

        let systemContent = `Bạn là một chuyên gia Tử Vi Đẩu Số chuyên nghiệp. Hãy phân tích chuyên sâu dựa trên lá số được cung cấp. BẮT BUỘC bỏ tất cả các biểu tượng cảm xúc (emoji/icon) trong câu trả lời. Trình bày văn bản chuyên nghiệp, nghiêm túc, như một cuốn sách luận giải học thuật. Giọng văn dứt khoát, chắc chắn, không sử dụng các từ ngữ nước đôi hay mơ hồ. Tuyệt đối KHÔNG DÙNG bất kỳ loại emoji nào.`;

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
        console.log('[API] Starting streamText for model:', aiModel);
        const result = streamText({
            model: google(aiModel),
            system: systemContent,
            messages: coreMessages,
            maxOutputTokens: 8192,
            temperature: 0.7,
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
