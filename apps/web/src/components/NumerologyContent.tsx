'use client'

import React from 'react';
import { NumerologyResult } from '@/lib/astrology/Numerology';
import { 
    LIFE_PATH_DATA, 
    BIRTH_DAY_DATA, 
    ATTITUDE_DATA, 
    ARROW_DATA, 
    PERSONAL_YEAR_DATA 
} from '@/lib/astrology/NumerologyData';

interface NumerologyContentProps {
    result: NumerologyResult;
    fullName: string;
    day: number;
    month: number;
    year: number;
}

const NumerologyContent: React.FC<NumerologyContentProps> = ({ result, fullName, day, month, year }) => {
    const lp = LIFE_PATH_DATA[result.lifePath] || LIFE_PATH_DATA[result.lifePath % 9 || 9];
    const bdDesc = BIRTH_DAY_DATA[result.birthDay] || '';
    const attDesc = ATTITUDE_DATA[result.attitude] || '';

    // Layout grid cho biểu đồ ngày sinh: 3-6-9 / 2-5-8 / 1-4-7
    const gridOrder = [
        [3, 6, 9],
        [2, 5, 8],
        [1, 4, 7]
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* 1. SỐ CHỦ ĐẠO (LIFE PATH) */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-indigo-100 dark:border-indigo-900 overflow-hidden relative group">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none animate-pulse">
                            {result.lifePath}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
                            Số Chủ Đạo
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 mb-2">
                            {lp?.title || `Số Chủ Đạo ${result.lifePath}`}
                        </h3>
                        <div className="flex flex-wrap justify-center md:justify-start gap-2">
                            {lp?.keywords?.map((k, i) => (
                                <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 text-xs rounded-full border border-indigo-100 dark:border-indigo-800 font-medium">
                                    {k}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 font-semibold">
                            <span>💎</span> <span>Điểm mạnh</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{lp?.strengths}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400 font-semibold">
                            <span>⚠️</span> <span>Cần lưu ý</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{lp?.weaknesses}</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span>💼</span> <span>Sự nghiệp</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{lp?.career}</p>
                    </div>
                    <div className="p-4 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider text-xs">
                            <span>🎯</span> <span>Sứ mệnh tối thượng</span>
                        </div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">"{lp?.mission}"</p>
                    </div>
                </div>
            </div>

            {/* 2. BIỂU ĐỒ NGÀY SINH & MŨI TÊN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Biểu đồ */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="flex items-center gap-2 text-lg font-bold mb-6">
                        <span className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">📊</span>
                        Biểu Đồ Ngày Sinh
                    </h4>
                    
                    <div className="flex flex-col items-center">
                        <div className="grid grid-cols-3 gap-1 relative p-1 bg-slate-200 dark:bg-slate-700 rounded-lg">
                            {gridOrder.map((rowArr, rowIndex) => (
                                rowArr.map((num, colIndex) => {
                                    const count = result.birthChart[num] || 0;
                                    return (
                                        <div 
                                            key={num} 
                                            className={`w-20 h-20 md:w-24 md:h-24 bg-white dark:bg-slate-900 flex flex-col items-center justify-center rounded-md transition-all ${count > 0 ? 'ring-2 ring-indigo-500 inset-0' : 'opacity-40'}`}
                                        >
                                            <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{num}</span>
                                            <div className="flex gap-0.5 mt-1">
                                                {count > 0 ? (
                                                    Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                                                        <div key={i} className="w-2 h-2 rounded-full bg-indigo-500" />
                                                    ))
                                                ) : (
                                                    <div className="w-2 h-2 rounded-full border border-slate-300" />
                                                )}
                                                {count > 3 && <span className="text-[10px] font-bold">+{count-3}</span>}
                                            </div>
                                        </div>
                                    )
                                })
                            ))}
                        </div>
                        <div className="mt-4 flex gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span>Thể lý</span>
                            <span>Cảm xúc</span>
                            <span>Trí tuệ</span>
                        </div>
                    </div>
                </div>

                {/* Mũi tên */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="flex items-center gap-2 text-lg font-bold mb-6">
                        <span className="p-2 bg-amber-100 dark:bg-amber-900 rounded-lg">🏹</span>
                        Mũi Tên Cá Tính
                    </h4>
                    
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {result.arrows.length > 0 ? (
                            result.arrows.map((arrow, i) => {
                                const arrowMeta = ARROW_DATA[arrow.name];
                                return (
                                    <div key={i} className={`p-4 rounded-xl border ${arrow.isStrength ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900' : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900'}`}>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-xl">{arrowMeta?.icon || (arrow.isStrength ? '✨' : '⚠️')}</span>
                                            <span className={`font-bold ${arrow.isStrength ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                                                {arrow.name}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">[{arrow.nums.join('-')}]</span>
                                        </div>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {arrowMeta?.desc}
                                        </p>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-8 text-slate-400 italic">Không nhận diện được mũi tên đặc biệt.</div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. CÁC CHỈ SỐ PHỤ */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-blue-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mb-3 shadow-md shadow-blue-200 dark:shadow-none">
                        {result.soulUrge}
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">Số Linh Hồn</div>
                    <div className="text-[10px] text-indigo-500 font-bold mb-3 uppercase">Khát vọng nội tâm</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "Phản ánh những khao khát tiềm ẩn sâu thẳm trong tâm hồn bạn."
                    </p>
                </div>
                
                <div className="p-5 bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-purple-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold mb-3 shadow-md shadow-purple-200 dark:shadow-none">
                        {result.personality}
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">Số Nhân Cách</div>
                    <div className="text-[10px] text-purple-500 font-bold mb-3 uppercase">Ấn tượng bề ngoài</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "Phản ánh cách mà thế giới nhìn nhận bạn qua hành động bên ngoài."
                    </p>
                </div>

                <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-emerald-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold mb-3 shadow-md shadow-emerald-200 dark:shadow-none">
                        {result.expression}
                    </div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 mb-1">Số Sứ Mệnh</div>
                    <div className="text-[10px] text-emerald-500 font-bold mb-3 uppercase">Tiềm năng bản thân</div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        "Những tài năng và mục tiêu mà bạn được sinh ra để thực hiện."
                    </p>
                </div>
            </div>

            {/* 4. CHU KỲ ĐỈNH CAO */}
            <div className="bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden relative">
                <div className="flex items-center justify-between mb-8">
                    <h4 className="flex items-center gap-2 text-lg font-bold">
                        <span className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">🌋</span>
                        Bốn Đỉnh Cao Đời Người
                    </h4>
                    <span className="text-xs text-slate-400">Phương pháp Pythagoras</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block" />
                    {result.pinnacles.map((p, i) => (
                        <div key={i} className="relative z-10 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-indigo-200 dark:shadow-none">
                                {p.number}
                            </div>
                            <div className="text-xs font-bold text-slate-400 mb-1">Đỉnh cao {i+1}</div>
                            <div className="text-[10px] font-mono mb-2">
                                {p.endAge ? `${p.startAge} - ${p.endAge} tuổi` : `Từ ${p.startAge} tuổi`}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                                Năm {year + p.startAge} - {p.endAge ? year + p.endAge : '∞'}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* WATERMARK */}
            <div className="text-center opacity-20 text-[10px] select-none pointer-events-none pb-4">
                Lập trình bởi Nguyễn Đức Toàn - Webest.asia - Chuyển đổi số & AI
            </div>
        </div>
    );
};

export default NumerologyContent;
