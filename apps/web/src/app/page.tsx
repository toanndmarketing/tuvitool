// @ts-nocheck
'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useChat } from '@ai-sdk/react';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { toPng } from 'html-to-image';
import { AmLich } from '@/lib/astrology/AmLich';
import { Numerology, NumerologyResult } from '@/lib/astrology/Numerology';
import { compactAstrologyData } from '@/lib/astrology/AiUtils';

// Import các component con
const PalaceMatrix = dynamic(() => import('@/components/PalaceMatrix').then(mod => mod.PalaceMatrix), { ssr: false });
const NumerologyContent = dynamic(() => import('@/components/NumerologyContent'), { ssr: false });

const CHIGIO_LIST = [
    { label: 'Tý (23h - 1h)', value: 0 },
    { label: 'Sửu (1h - 3h)', value: 1 },
    { label: 'Dần (3h - 5h)', value: 2 },
    { label: 'Mão (5h - 7h)', value: 3 },
    { label: 'Thìn (7h - 9h)', value: 4 },
    { label: 'Tỵ (9h - 11h)', value: 5 },
    { label: 'Ngọ (11h - 13h)', value: 6 },
    { label: 'Mùi (13h - 15h)', value: 7 },
    { label: 'Thân (15h - 17h)', value: 8 },
    { label: 'Dậu (17h - 19h)', value: 9 },
    { label: 'Tuất (19h - 21h)', value: 10 },
    { label: 'Hợi (21h - 23h)', value: 11 },
];

interface ProfileData {
    hoTen: string;
    ngay: string;
    thang: string;
    nam: string;
    gioSinh: string;
    gioiTinh: 'nam' | 'nữ';
    isYounger?: boolean;
}

const DEMO_SINGLE: ProfileData = {
    hoTen: "NN",
    ngay: "26",
    thang: "3",
    nam: "2019",
    gioiTinh: "nam",
    gioSinh: "6"
};

const DEMO_TWIN_A: ProfileData = {
    hoTen: "HV",
    ngay: "05",
    thang: "7",
    nam: "2021",
    gioiTinh: "nữ",
    gioSinh: "6"
};

const DEMO_TWIN_B: ProfileData = {
    hoTen: "HVix",
    ngay: "05",
    thang: "7",
    nam: "2021",
    gioiTinh: "nam",
    gioSinh: "6"
};

function TuViMain() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hasInitializedFromUrl = useRef(false);
    const chartRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // States
    const [step, setStep] = useState<'form' | 'loading' | 'chat'>('form');
    const [isTwin, setIsTwin] = useState(false);
    const [profileA, setProfileA] = useState<ProfileData>(DEMO_SINGLE);
    const [profileB, setProfileB] = useState<ProfileData>(DEMO_TWIN_B);
    const [promptTemplate, setPromptTemplate] = useState('');
    const [syncMode, setSyncMode] = useState(true);
    const [downloadLoading, setDownloadLoading] = useState(false);

    const [chartDataA, setChartDataA] = useState<any>(null);
    const [chartDataB, setChartDataB] = useState<any>(null);
    const [numerologyA, setNumerologyA] = useState<NumerologyResult | null>(null);
    const [numerologyB, setNumerologyB] = useState<NumerologyResult | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [formError, setFormError] = useState('');
    const [inputText, setInputText] = useState('');
    const [activeTab, setActiveTab] = useState<'A' | 'B' | 'chat' | 'tsh'>('chat');
    const [tshSubTab, setTshSubTab] = useState<'A' | 'B'>('A');
    const [showRawModal, setShowRawModal] = useState(false);
    const [rawContent, setRawContent] = useState('');
    const [isChatExpanded, setIsChatExpanded] = useState(false);
    const [historySessions, setHistorySessions] = useState<any[]>([]);
    const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/sessions')
            .then(res => res.json())
            .then(data => {
                if (data.success && data.sessions) {
                    setHistorySessions(data.sessions);
                }
            })
            .catch(err => console.error('Lỗi tải lịch sử:', err));

        fetch('/prompts/tuvi_master.v11.prompt?t=' + Date.now())
            .then(res => res.text())
            .then(setPromptTemplate)
            .catch(err => console.error('Lỗi tải prompt:', err));
    }, []);

    useEffect(() => {
        if (sessionId && pendingPrompt && step === 'chat') {
            triggerSend({ role: 'user', content: pendingPrompt });
            setPendingPrompt(null);
        }
    }, [sessionId, pendingPrompt, step]);

    useEffect(() => {
        if (sessionId) {
            fetch(`/api/sessions?sessionId=${sessionId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.messages && data.messages.length > 0) {
                        const msgs = data.messages.map((m: any, i: number) => ({
                            id: m.id || `${sessionId}-${i}`,
                            role: m.role,
                            content: m.content,
                            createdAt: m.createdAt ? new Date(m.createdAt) : undefined
                        }));
                        if (typeof (chatInfo as any).setMessages === 'function') {
                            (chatInfo as any).setMessages(msgs);
                        }
                    }
                })
                .catch(err => console.error("Lỗi get chat info:", err));
        }
    }, [sessionId]);

    const chatInfo = useChat({
        id: sessionId || 'default-chat',
        api: '/api/chat',
        body: { 
            chartData: isTwin ? { A: chartDataA, B: chartDataB } : chartDataA, 
            sessionId 
        },
    });

    console.log("[DEBUG] chatInfo keys:", Object.keys(chatInfo));
    console.log("[DEBUG] messages:", chatInfo.messages);
    if (chatInfo.error) console.error("[DEBUG] chat error:", chatInfo.error);

    const messages = chatInfo.messages || [];
    const status = chatInfo.status;
    const isLoadingChat = status === 'streaming' || status === 'submitted';

    function triggerSend(msgData: any) {
        if (typeof (chatInfo as any).append === 'function') {
            (chatInfo as any).append(msgData);
        } else if (typeof (chatInfo as any).sendMessage === 'function') {
            (chatInfo as any).sendMessage(msgData);
        } else {
            console.error("AI SDK useChat provided no append or sendMessage method!", Object.keys(chatInfo));
        }
    }

    // Handlers
    function handleSend() {
        if (!inputText.trim() || isLoadingChat) return;
        triggerSend({ role: 'user', content: inputText.trim() });
        setInputText('');
    }

    function generateStandardPrompt(data: any, tsh: any, personaConfig?: any) {
        if (!data || !promptTemplate) return "";
        let p = promptTemplate;
        const gioSinhChi = AmLich.DIA_CHI[data.input?.gioSinh] || "";
        const tieuVanChi = AmLich.DIA_CHI[data.vanHan?.cungPos] || "";
        const luuNienChi = AmLich.DIA_CHI[data.luuNienPos] || "";

        p = p.replace(/{{hoTen}}/g, data.hoTen || "Đương Số");
        p = p.replace(/{{ngaySinhDL}}/g, `${data.input?.ngay}/${data.input?.thang}/${data.input?.nam}`);
        p = p.replace(/{{ngaySinhAL}}/g, `${data.lunarDate?.day}/${data.lunarDate?.month}/${data.lunarDate?.year}`);
        p = p.replace(/{{gioSinh}}/g, gioSinhChi);
        p = p.replace(/{{menhNapAm}}/g, data.menhNapAm || "");
        p = p.replace(/{{hanhMenh}}/g, data.hanhMenh || "");
        p = p.replace(/{{cucName}}/g, data.cucName || "");
        p = p.replace(/{{cungPhi}}/g, data.cungPhi || "");
        p = p.replace(/{{tieuVanChi}}/g, tieuVanChi);
        p = p.replace(/{{luuNienChi}}/g, luuNienChi);
        p = p.replace(/{{namXem}}/g, String(data.input?.namXem || new Date().getFullYear()));
        p = p.replace(/{{tuoiMu}}/g, String(data.tuoi || ""));
        
        if (personaConfig) {
            p = p.replace(/{{aiSelfFull}}/g, personaConfig.aiSelfFull || "Anh Toàn Tử Vi AI");
            p = p.replace(/{{aiSelfShort}}/g, personaConfig.aiSelfShort || "Anh");
            p = p.replace(/{{userPronoun}}/g, personaConfig.userPronoun || "bạn");
            p = p.replace(/{{namSinh}}/g, personaConfig.namSinh || "");
        }
        
        const jsonPayload = {
            astrology: data,
            numerology: tsh
        };
        // Sử dụng phiên bản NÉN (compact) thay vì in nguyên xi JSON gốc
        p = p.replace(/{{JSON_DATA}}/g, compactAstrologyData(jsonPayload.astrology));
        return p;
    }

    async function handleDownloadImage() {
        if (!chartRef.current) return;
        setDownloadLoading(true);
        try {
            const dataUrl = await toPng(chartRef.current, {
                quality: 0.95,
                backgroundColor: '#0a0a0f',
                pixelRatio: 2,
                style: {
                    borderRadius: '0'
                }
            });
            const link = document.createElement('a');
            link.download = `la-so-tu-vi-${profileA.hoTen.replace(/\s+/g, '-')}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Lỗi download:', err);
            alert('Không thể tạo ảnh lá số. Vui lòng thử lại.');
        } finally {
            setDownloadLoading(false);
        }
    }

    function handleShowRaw() {
        let fullPrompt = "";
        if (isTwin) {
            const olderKey = profileA.isYounger ? 'B' : 'A';
            const youngerKey = profileA.isYounger ? 'A' : 'B';
            const dataA = olderKey === 'A' ? chartDataA : chartDataB;
            const dataB = youngerKey === 'A' ? chartDataA : chartDataB;
            
            const pronA = profileA.gioiTinh === 'nam' ? 'Anh' : 'Chị';
            let twinNote = `\n====================================================\n`;
            twinNote += `       BÁO CÁO TỬ VI SINH ĐÔI (A VÀ B)\n`;
            twinNote += `====================================================\n\n`;
            twinNote += `[HỆ THỐNG LƯU Ý CHO AI]:\nĐây là cặp sinh đôi. Đương số A là ${pronA} (Sinh trước), Đương số B là Em (Sinh sau).\n`;
            
            if (profileA.gioiTinh === profileB.gioiTinh) {
                twinNote += `- Hệ thống áp dụng Di Cung (Mượn Thiên Di làm Mệnh cho người sinh sau), giữ nguyên 108 sao gốc.\n`;
            } else {
                twinNote += `- Khác giới tính nên giữ nguyên Mệnh gốc (Đại vận chạy nghịch nhau).\n`;
            }

            let twinPronoun = "hai bạn";
            const userNam = parseInt(profileA.nam);
            let aiSelfFull = "Anh Toàn Tử Vi AI";
            let aiSelfShort = "Anh";
            
            if (!isNaN(userNam)) {
                if (userNam < 1990) {
                    aiSelfFull = "Em Toàn Tử Vi AI";
                    aiSelfShort = "Em";
                    twinPronoun = profileA.gioiTinh === 'nam' ? 'hai anh' : 'hai chị'; 
                } else if (userNam === 1990) {
                    aiSelfFull = "Mình Toàn Tử Vi AI";
                    aiSelfShort = "Mình";
                    twinPronoun = "hai bạn";
                } else {
                    aiSelfFull = "Anh Toàn Tử Vi AI";
                    aiSelfShort = "Anh";
                    twinPronoun = "hai em";
                }
            }
            
            const twinHoTen = `${profileA.hoTen} và ${profileB.hoTen}`;
            const personaConfig = { aiSelfFull, aiSelfShort, userPronoun: twinPronoun, namSinh: profileA.nam, hoTen: twinHoTen };
            
            const promptA = generateStandardPrompt({ ...dataA, hoTen: twinHoTen }, numerologyA, personaConfig);
            const promptB = generateStandardPrompt({ ...dataB, hoTen: twinHoTen }, numerologyB, personaConfig);
            
            fullPrompt = `${twinNote}\n\n>>> [PHẦN 1: ĐƯƠNG SỐ A] <<<\n${promptA}\n\n----------------------------\n>>> [PHẦN 2: ĐƯƠNG SỐ B] <<<\n${promptB}`;
        } else {
            const userNam = parseInt(profileA.nam);
            let aiSelfFull = "Anh Toàn Tử Vi AI";
            let aiSelfShort = "Anh";
            let userPronoun = "bạn";
            if (!isNaN(userNam)) {
                if (userNam < 1990) {
                    aiSelfFull = "Em Toàn Tử Vi AI";
                    aiSelfShort = "Em";
                    userPronoun = profileA.gioiTinh === 'nam' ? 'anh' : 'chị';
                } else if (userNam === 1990) {
                    aiSelfFull = "Mình Toàn Tử Vi AI";
                    aiSelfShort = "Mình";
                    userPronoun = "bạn";
                } else {
                    aiSelfFull = "Anh Toàn Tử Vi AI";
                    aiSelfShort = "Anh";
                    userPronoun = "em";
                }
            }
            const personaConfig = { aiSelfFull, aiSelfShort, userPronoun, namSinh: profileA.nam };
            fullPrompt = generateStandardPrompt(chartDataA, numerologyA, personaConfig);
        }
        setRawContent(fullPrompt);
        setShowRawModal(true);
    }

    function resetToForm() {
        setStep('form');
        setChartDataA(null);
        setChartDataB(null);
        setNumerologyA(null);
        setNumerologyB(null);
        setSessionId(null);
        // Clean chat messages hack
        if (typeof (chatInfo as any).setMessages === 'function') {
            (chatInfo as any).setMessages([]);
        }
        setFormError('');
        router.replace('/');
    }

    function loadSession(session: any) {
        if (!session.astrologyData) return;
        try {
            const parsed = JSON.parse(session.astrologyData);
            setProfileA(parsed.profileA);
            setIsTwin(parsed.isTwin);
            if (parsed.profileB) setProfileB(parsed.profileB);
            setChartDataA(parsed.chartA);
            setChartDataB(parsed.chartB);
            setSessionId(session.id); // Triggers useEffect to restore history

            setStep('chat');
            setActiveTab('chat');
        } catch (e) {
            console.error("Lỗi khi load lịch sử:", e);
        }
    }

    function updateProfileA(data: Partial<ProfileData>) {
        setProfileA(prev => {
            const current = { ...prev, ...data };
            if (syncMode && isTwin) {
                setProfileB(prevB => {
                    const nextB = { ...prevB };
                    if (data.hoTen !== undefined) nextB.hoTen = data.hoTen ? `${data.hoTen} (Sinh đôi)` : "";
                    if (data.gioiTinh !== undefined) nextB.gioiTinh = data.gioiTinh;
                    if (data.gioSinh !== undefined) nextB.gioSinh = data.gioSinh;
                    if (data.ngay !== undefined) nextB.ngay = data.ngay;
                    if (data.thang !== undefined) nextB.thang = data.thang;
                    if (data.nam !== undefined && data.nam.length === 4) nextB.nam = data.nam;
                    return nextB;
                });
            }
            return current;
        });
    }

    function updateProfileB(data: Partial<ProfileData>) {
        setProfileB(prev => ({ ...prev, ...data }));
        if (Object.keys(data).length > 0) setSyncMode(false);
    }

    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError('');
        setStep('loading');

        const newParams = new URLSearchParams();
        newParams.set('t', isTwin ? '1' : '0');
        newParams.set('a_n', profileA.hoTen);
        newParams.set('a_d', profileA.ngay);
        newParams.set('a_m', profileA.thang);
        newParams.set('a_y', profileA.nam);
        newParams.set('a_g', profileA.gioiTinh);
        newParams.set('a_h', profileA.gioSinh);
        
        if (isTwin) {
            newParams.set('b_n', profileB.hoTen);
            newParams.set('b_d', profileB.ngay);
            newParams.set('b_m', profileB.thang);
            newParams.set('b_y', profileB.nam);
            newParams.set('b_g', profileB.gioiTinh);
            newParams.set('b_h', profileB.gioSinh);
        }
        router.replace(`?${newParams.toString()}`);

        try {
            const chartRes = await fetch('/api/chart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isTwin, profileA, profileB: isTwin ? profileB : null, namXem: new Date().getFullYear() }),
            });
            const chartJson = await chartRes.json();
            if (!chartJson.success) throw new Error(chartJson.error || 'Lỗi tính toán');

            const tshA = Numerology.calculate({ day: parseInt(profileA.ngay), month: parseInt(profileA.thang), year: parseInt(profileA.nam), fullName: profileA.hoTen });
            setNumerologyA(tshA);
            chartJson.data.chartA.numerology = tshA;
            if (isTwin) {
                const tshB = Numerology.calculate({ day: parseInt(profileB.ngay), month: parseInt(profileB.thang), year: parseInt(profileB.nam), fullName: profileB.hoTen });
                setNumerologyB(tshB);
                chartJson.data.chartB.numerology = tshB;
            }

            setChartDataA(chartJson.data.chartA);
            setChartDataB(chartJson.data.chartB);

            try {
                const sessionPayload = {
                    topic: isTwin ? `${profileA.hoTen} & ${profileB.hoTen} - Sinh đôi` : `${profileA.hoTen} - ${profileA.ngay}/${profileA.thang}/${profileA.nam} - Giờ: ${AmLich.DIA_CHI[parseInt(profileA.gioSinh)]}`,
                    astrologyData: {
                        isTwin,
                        profileA,
                        profileB,
                        chartA: chartJson.data.chartA,
                        chartB: chartJson.data.chartB,
                    }
                };
                const sessionRes = await fetch('/api/sessions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(sessionPayload)
                });
                const sessionData = await sessionRes.json();
                if (sessionData.success && sessionData.sessionId) {
                    setSessionId(sessionData.sessionId);
                    
                    if (!sessionData.isExisting) {
                        let fullPrompt = "";
                        if (isTwin) {
                            const pronA = profileA.gioiTinh === 'nam' ? 'Anh' : 'Chị';
                            let twinNote = `\n====================================================\n`;
                            twinNote += `       BÁO CÁO TỬ VI SINH ĐÔI (A VÀ B)\n`;
                            twinNote += `====================================================\n\n`;
                            twinNote += `[HỆ THỐNG LƯU Ý CHO AI]:\nĐây là cặp sinh đôi. Đương số A là ${pronA} (Sinh trước), Đương số B là Em (Sinh sau).\n`;
                            
                            if (profileA.gioiTinh === profileB.gioiTinh) {
                                twinNote += `- Hệ thống áp dụng Di Cung (Mượn Thiên Di làm Mệnh cho người sinh sau), giữ nguyên 108 sao gốc.\n`;
                            } else {
                                twinNote += `- Khác giới tính nên giữ nguyên Mệnh gốc (Đại vận chạy nghịch nhau).\n`;
                            }
                            let twinPronoun = "hai bạn";
                            const userNam = parseInt(profileA.nam);
                            let aiSelfFull = "Anh Toàn Tử Vi AI";
                            let aiSelfShort = "Anh";
                            if (!isNaN(userNam)) {
                                if (userNam < 1990) {
                                    aiSelfFull = "Em Toàn Tử Vi AI";
                                    aiSelfShort = "Em";
                                    twinPronoun = profileA.gioiTinh === 'nam' ? 'hai anh' : 'hai chị'; 
                                } else if (userNam === 1990) {
                                    aiSelfFull = "Mình Toàn Tử Vi AI";
                                    aiSelfShort = "Mình";
                                    twinPronoun = "hai bạn";
                                } else {
                                    aiSelfFull = "Anh Toàn Tử Vi AI";
                                    aiSelfShort = "Anh";
                                    twinPronoun = "hai em";
                                }
                            }
                            
                            const twinHoTen = `${profileA.hoTen} và ${profileB.hoTen}`;
                            const personaConfig = { aiSelfFull, aiSelfShort, userPronoun: twinPronoun, namSinh: profileA.nam, hoTen: twinHoTen };
                            
                            const promptA = generateStandardPrompt({ ...chartJson.data.chartA, hoTen: twinHoTen }, tshA, personaConfig);
                            const promptB = generateStandardPrompt({ ...chartJson.data.chartB, hoTen: twinHoTen }, tshB, personaConfig);
                            fullPrompt = `${twinNote}\n\n>>> [PHẦN 1: ĐƯƠNG SỐ A] <<<\n${promptA}\n\n----------------------------\n>>> [PHẦN 2: ĐƯƠNG SỐ B] <<<\n${promptB}`;
                        } else {
                            const userNam = parseInt(profileA.nam);
                            let aiSelfFull = "Anh Toàn Tử Vi AI";
                            let aiSelfShort = "Anh";
                            let userPronoun = "bạn";
                            if (!isNaN(userNam)) {
                                if (userNam < 1990) {
                                    aiSelfFull = "Em Toàn Tử Vi AI";
                                    aiSelfShort = "Em";
                                    userPronoun = profileA.gioiTinh === 'nam' ? 'anh' : 'chị';
                                } else if (userNam === 1990) {
                                    aiSelfFull = "Mình Toàn Tử Vi AI";
                                    aiSelfShort = "Mình";
                                    userPronoun = "bạn";
                                } else {
                                    aiSelfFull = "Anh Toàn Tử Vi AI";
                                    aiSelfShort = "Anh";
                                    userPronoun = "em";
                                }
                            }
                            const personaConfig = { aiSelfFull, aiSelfShort, userPronoun, namSinh: profileA.nam };
                            fullPrompt = generateStandardPrompt(chartJson.data.chartA, tshA, personaConfig);
                        }
                        setPendingPrompt(fullPrompt);
                    }
                }
            } catch (e) {
                console.error("Lỗi tạo session:", e);
            }

            setStep('chat');
            setActiveTab('chat');
        } catch (err: any) {
            setFormError(err.message);
            setStep('form');
        }
    }

    function getParam(params: URLSearchParams, key: string, fallback: string): string {
        const val = params.get(key);
        return val !== null ? val : fallback;
    }

    function formatMarkdown(text: string): string {
        if (!text) return "";
        return text
            .replace(/### (.*)/g, '<h3>$1</h3>')
            .replace(/## (.*)/g, '<h2>$1</h2>')
            .replace(/# (.*)/g, '<h1>$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/---/g, '<hr/>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n- (.*)/g, '<li>$1</li>');
    }

    useEffect(() => {
        fetch('/prompts/tuvi_master_compact.v11.prompt')
            .then(res => res.text())
            .then(setPromptTemplate)
            .catch(err => console.error('Lỗi tải prompt:', err));
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (hasInitializedFromUrl.current) return;
        const t = searchParams.get('t');
        if (t !== null) {
            const twinState = t === '1';
            setIsTwin(twinState);
            setProfileA({
                hoTen: getParam(searchParams, 'a_n', twinState ? DEMO_TWIN_A.hoTen : DEMO_SINGLE.hoTen),
                ngay: getParam(searchParams, 'a_d', twinState ? DEMO_TWIN_A.ngay : DEMO_SINGLE.ngay),
                thang: getParam(searchParams, 'a_m', twinState ? DEMO_TWIN_A.thang : DEMO_SINGLE.thang),
                nam: getParam(searchParams, 'a_y', twinState ? DEMO_TWIN_A.nam : DEMO_SINGLE.nam),
                gioiTinh: getParam(searchParams, 'a_g', twinState ? DEMO_TWIN_A.gioiTinh : DEMO_SINGLE.gioiTinh) as any,
                gioSinh: getParam(searchParams, 'a_h', twinState ? DEMO_TWIN_A.gioSinh : DEMO_SINGLE.gioSinh),
            });
            if (twinState) {
                setProfileB({
                    hoTen: getParam(searchParams, 'b_n', DEMO_TWIN_B.hoTen),
                    ngay: getParam(searchParams, 'b_d', DEMO_TWIN_B.ngay),
                    thang: getParam(searchParams, 'b_m', DEMO_TWIN_B.thang),
                    nam: getParam(searchParams, 'b_y', DEMO_TWIN_B.nam),
                    gioiTinh: getParam(searchParams, 'b_g', DEMO_TWIN_B.gioiTinh) as any,
                    gioSinh: getParam(searchParams, 'b_h', DEMO_TWIN_B.gioSinh),
                });
                setSyncMode(false);
            }
        }
        hasInitializedFromUrl.current = true;
    }, [searchParams]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (step === 'loading') {
        return (
            <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-4">
                <span className="text-5xl animate-pulse">🔮</span>
                <h2 className="text-xl font-bold text-white mt-6">Đang lập lá số...</h2>
            </div>
        );
    }

    if (step === 'chat' && chartDataA) {
        return (
            <div className="flex flex-col lg:flex-row h-screen bg-[#0a0a0f] text-white">
                <div className="flex-1 flex flex-col">
                    <header className="p-3 border-b border-white/5 bg-[#111118] flex justify-between items-center">
                        <div className="flex gap-1">
                            <button onClick={() => setActiveTab('A')} className={`px-2 py-1 text-[10px] rounded border ${activeTab === 'A' ? 'bg-purple-600' : 'bg-white/5 opacity-50'}`}>Đương Số A</button>
                            {isTwin && <button onClick={() => setActiveTab('B')} className={`px-2 py-1 text-[10px] rounded border ${activeTab === 'B' ? 'bg-pink-600' : 'bg-white/5 opacity-50'}`}>Đương Số B</button>}
                            <button onClick={() => setActiveTab('tsh')} className={`px-2 py-1 text-[10px] rounded border ${activeTab === 'tsh' ? 'bg-indigo-600' : 'bg-white/5 opacity-50'}`}>Thần Số Học</button>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleDownloadImage} disabled={downloadLoading} className="text-[9px] bg-slate-800 px-2 py-1 rounded border border-white/10 uppercase">
                                {downloadLoading ? '⌛ Đang tạo...' : '📷 Tải ảnh'}
                            </button>
                            <button onClick={handleShowRaw} className="text-[9px] bg-slate-800 px-2 py-1 rounded border border-white/10 uppercase">📋 Raw Data</button>
                            <button onClick={resetToForm} className="text-[9px] bg-red-900/40 px-2 py-1 rounded border border-red-500/30 uppercase">⟲ Mới</button>
                        </div>
                    </header>
                    <div className="flex-1 overflow-auto p-4 bg-[#050510]">
                        {activeTab === 'tsh' ? (
                            <div className="max-w-4xl mx-auto py-10">
                                {isTwin && (
                                    <div className="flex justify-center gap-4 mb-8">
                                        <button onClick={() => setTshSubTab('A')} className={`px-4 py-2 rounded-full text-xs font-bold ${tshSubTab === 'A' ? 'bg-purple-600' : 'bg-white/5'}`}>Đương số A</button>
                                        <button onClick={() => setTshSubTab('B')} className={`px-4 py-2 rounded-full text-xs font-bold ${tshSubTab === 'B' ? 'bg-pink-600' : 'bg-white/5'}`}>Đương số B</button>
                                    </div>
                                )}
                                {tshSubTab === 'A' && numerologyA && <NumerologyContent result={numerologyA} day={parseInt(profileA.ngay)} month={parseInt(profileA.thang)} year={parseInt(profileA.nam)} fullName={profileA.hoTen} />}
                                {tshSubTab === 'B' && numerologyB && <NumerologyContent result={numerologyB} day={parseInt(profileB.ngay)} month={parseInt(profileB.thang)} year={parseInt(profileB.nam)} fullName={profileB.hoTen} />}
                            </div>
                        ) : (
                            <div ref={chartRef} className="flex items-center justify-center min-h-full">
                                <PalaceMatrix chart={activeTab === 'B' ? chartDataB : chartDataA} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={`
                    ${isChatExpanded ? 'fixed inset-0 z-[60] flex' : 'hidden lg:flex'} 
                    w-full lg:w-[450px] lg:relative lg:border-l lg:border-white/10 flex-col bg-[#111118]
                `}>
                    <header className="p-4 border-b border-white/5 flex items-center justify-between">
                        <span className="font-bold">LỜI LUẬN GIẢI AI</span>
                        <div className="flex gap-2">
                            <button onClick={handleDownloadImage} disabled={downloadLoading} className="lg:hidden text-[10px] bg-slate-800 px-2 py-1 rounded border border-white/10 uppercase">
                                📷 Tải ảnh
                            </button>
                            <button onClick={() => setIsChatExpanded(false)} className="lg:hidden text-lg bg-white/5 px-3 py-1 rounded-full">✕</button>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] px-4 py-2 rounded-xl text-xs ${m.role === 'user' ? 'bg-purple-600/20' : 'bg-white/5'}`}>
                                    {m.role === 'assistant' ? (
                                        <>
                                            <div className="prose prose-invert prose-xs" dangerouslySetInnerHTML={{ __html: formatMarkdown(m.content || '') }} />
                                            {/* Render parts manually if they exist */}
                                            {m.parts && m.parts.map((p: any, i: number) => (
                                                p.type === 'text' ? <div key={i} className="mt-2 prose prose-invert prose-xs" dangerouslySetInnerHTML={{ __html: formatMarkdown(p.text || '') }} /> : null
                                            ))}
                                        </>
                                    ) : <p>{m.content}</p>}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="p-4 bg-[#1c1c27]">
                        <div className="flex gap-2">
                            <textarea
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-xs outline-none resize-none"
                                rows={2}
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                                placeholder="Hỏi thêm về lá số..."
                            />
                            <button onClick={handleSend} disabled={isLoadingChat || !inputText.trim()} className="bg-purple-600 px-4 rounded-xl">✦</button>
                        </div>
                    </div>
                </div>

                {/* Floating Chat Bubble for Mobile */}
                {!isChatExpanded && (
                    <button 
                        onClick={() => setIsChatExpanded(true)}
                        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl flex items-center justify-center text-2xl animate-pulse ring-4 ring-purple-500/20"
                    >
                        🔮
                    </button>
                )}

                {showRawModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4">
                        <div className="bg-[#11111a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                            <div className="p-4 border-b border-white/5 flex justify-between">
                                <span className="font-bold">RAW DATA REPORT</span>
                                <button onClick={() => setShowRawModal(false)}>✕</button>
                            </div>
                            <div className="flex-1 overflow-auto p-4 font-mono text-[10px] text-emerald-400">
                                <pre>{rawContent}</pre>
                            </div>
                            <div className="p-4 border-t border-white/5 flex justify-end gap-2">
                                <button onClick={() => { navigator.clipboard.writeText(rawContent); alert('Copied!'); }} className="bg-purple-600 px-4 py-2 rounded-full text-xs font-bold">COPY</button>
                                <button onClick={() => setShowRawModal(false)} className="bg-white/10 px-4 py-2 rounded-full text-xs font-bold">CLOSE</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050510] flex flex-col items-center py-10 px-4">
            <div className="max-w-[1600px] w-full">
                <div className="text-center mb-10">
                    <h1 className="text-4xl lg:text-5xl font-black text-white">TỬ VI LÁ SỐ AI</h1>
                    <p className="text-white/30 text-xs uppercase tracking-widest mt-2">Huyền học kỷ nguyên AI</p>
                </div>

                {historySessions.length > 0 && (
                    <div className="bg-[#0a0a0f] rounded-3xl p-6 lg:p-8 border border-white/10 max-w-4xl mx-auto shadow-2xl mb-8">
                        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span>📜</span> Lịch Sử Đã Xem</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                            {historySessions.map(session => (
                                <button key={session.id} onClick={() => loadSession(session)} className="bg-white/5 hover:bg-white/10 text-left p-3 rounded-xl border border-white/5 hover:border-purple-500/50 transition-all group flex flex-col justify-center">
                                    <h3 className="text-sm font-bold text-purple-300 group-hover:text-purple-200 line-clamp-1">{session.topic}</h3>
                                    <div className="text-[10px] text-white/40 mt-1">{new Date(session.createdAt).toLocaleString('vi-VN')}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-[#0a0a0f] rounded-3xl p-6 lg:p-10 border border-white/10 max-w-4xl mx-auto shadow-2xl">
                    <form onSubmit={handleFormSubmit} className="space-y-8">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                            <span className="text-xs font-bold text-white uppercase">Chế độ Sinh Đôi</span>
                            <button type="button" onClick={() => setIsTwin(!isTwin)} className={`w-12 h-6 rounded-full relative transition-all ${isTwin ? 'bg-purple-600' : 'bg-white/10'}`}>
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isTwin ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>

                        <div className={`grid gap-10 ${isTwin ? 'lg:grid-cols-2' : ''}`}>
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-white/40 uppercase">Đương số A {isTwin && '(Anh/Chị)'}</h3>
                                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Họ và Tên" value={profileA.hoTen} onChange={e=>updateProfileA({hoTen:e.target.value})} required/>
                                <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={()=>updateProfileA({gioiTinh:'nam'})} className={`py-3 rounded-xl border text-xs font-bold ${profileA.gioiTinh==='nam'?'bg-purple-600':'opacity-30'}`}>♂ Nam</button>
                                    <button type="button" onClick={()=>updateProfileA({gioiTinh:'nữ'})} className={`py-3 rounded-xl border text-xs font-bold ${profileA.gioiTinh==='nữ'?'bg-purple-600':'opacity-30'}`}>♀ Nữ</button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center" placeholder="Ngày" value={profileA.ngay} onChange={e=>updateProfileA({ngay:e.target.value})} required/>
                                    <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center" placeholder="Tháng" value={profileA.thang} onChange={e=>updateProfileA({thang:e.target.value})} required/>
                                    <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center" placeholder="Năm" value={profileA.nam} onChange={e=>updateProfileA({nam:e.target.value})} required/>
                                </div>
                                <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center outline-none" value={profileA.gioSinh} onChange={e=>updateProfileA({gioSinh:e.target.value})}>
                                    {CHIGIO_LIST.map(g=><option key={g.value} value={g.value} className="bg-[#111122]">{g.label}</option>)}
                                </select>
                            </div>
                            {isTwin && (
                                <div className="space-y-4 lg:border-l lg:border-white/5 lg:pl-10">
                                    <h3 className="text-xs font-bold text-white/40 uppercase">Đương số B (Em)</h3>
                                    <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none" placeholder="Họ và Tên" value={profileB.hoTen} onChange={e=>updateProfileB({hoTen:e.target.value})} required/>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button type="button" onClick={()=>updateProfileB({gioiTinh:'nam'})} className={`py-3 rounded-xl border text-xs font-bold ${profileB.gioiTinh==='nam'?'bg-pink-600':'opacity-30'}`}>♂ Nam</button>
                                        <button type="button" onClick={()=>updateProfileB({gioiTinh:'nữ'})} className={`py-3 rounded-xl border text-xs font-bold ${profileB.gioiTinh==='nữ'?'bg-pink-600':'opacity-30'}`}>♀ Nữ</button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center" placeholder="Ngày" value={profileB.ngay} onChange={e=>updateProfileB({ngay:e.target.value})} required/>
                                        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center" placeholder="Tháng" value={profileB.thang} onChange={e=>updateProfileB({thang:e.target.value})} required/>
                                        <input className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center" placeholder="Năm" value={profileB.nam} onChange={e=>updateProfileB({nam:e.target.value})} required/>
                                    </div>
                                    <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-center outline-none" value={profileB.gioSinh} onChange={e=>updateProfileB({gioSinh:e.target.value})}>
                                        {CHIGIO_LIST.map(g=><option key={g.value} value={g.value} className="bg-[#111122]">{g.label}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>

                        {formError && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-100 text-xs text-center">{formError}</div>}
                        <button type="submit" className="w-full py-4 bg-purple-600 rounded-xl font-bold uppercase tracking-widest hover:bg-purple-500 transition-all">Lập Lá Số</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function HomePage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050510] flex items-center justify-center text-white/20">Đang nạp...</div>}>
            <TuViMain />
        </Suspense>
    );
}
