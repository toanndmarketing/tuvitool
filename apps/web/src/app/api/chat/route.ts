import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { compactAstrologyData } from '@/lib/astrology/AiUtils';
import fs from 'fs';
import path from 'path';

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

        // Đọc System Prompt từ file template
        let systemContent = "";
        try {
            const promptPath = path.join(process.cwd(), 'public/prompts/tuvi_master_compact.v11.prompt');
            let template = fs.readFileSync(promptPath, 'utf8');
            
            // Nén dữ liệu lá số
            const compressedData = chartData ? compactAstrologyData(chartData) : "{}";
            const hoTen = chartData?.hoTen || (chartData?.A ? `${chartData.A.hoTen} & ${chartData.B.hoTen}` : "Đương Số");
            const namXem = chartData?.input?.namXem || chartData?.A?.input?.namXem || new Date().getFullYear();

            // Thay thế placeholders
            systemContent = template
                .replace(/{{hoTen}}/g, hoTen)
                .replace(/{{namXem}}/g, String(namXem))
                .replace(/{{JSON_DATA}}/g, compressedData);
        } catch (e) {
            console.error('[API] Failed to read prompt file:', e);
            // Fallback prompt đơn giản nếu lỗi file
            systemContent = "Bạn là chuyên gia Tử Vi. Hãy trả lời dựa trên dữ liệu lá số được cung cấp.";
        }

        // AI SDK streamText
        const result = streamText({
            model: google(process.env.GEMINI_MODEL || 'gemini-1.5-flash-latest'),
            system: systemContent,
            messages,
            maxOutputTokens: 2048,
            temperature: 0.7,
            onFinish: async ({ text }) => {
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

        // Hỗ trợ cả toDataStreamResponse (V3+) và legacy StreamingTextResponse
        if (typeof result.toDataStreamResponse === 'function') {
            return result.toDataStreamResponse();
        }
        
        // Fallback cho các bản SDK khác
        return new Response(result.textStream, {
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

