'use client';

import React from 'react';
import { ChartMatrix } from '../lib/astrology/interfaces';

interface PalaceMatrixProps {
  chart: ChartMatrix;
}

const STAR_NATURE_COLOR: Record<string, string> = {
  cat: 'text-emerald-400',
  hung: 'text-red-400',
  trung: 'text-amber-400',
};

const HANH_COLORS: Record<string, string> = {
  'Kim': 'text-[#d4d4d8] border-[#d4d4d8]/30 bg-[#d4d4d8]/5',
  'Mộc': 'text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/5',
  'Thuỷ': 'text-[#60a5fa] border-[#60a5fa]/30 bg-[#60a5fa]/5',
  'Hoả': 'text-[#f87171] border-[#f87171]/30 bg-[#f87171]/5',
  'Thổ': 'text-[#fbbf24] border-[#fbbf24]/30 bg-[#fbbf24]/5'
};

const PALACE_GRID_POSITIONS = [
    { index: 5, gridArea: '1 / 4 / 2 / 5' }, { index: 6, gridArea: '1 / 3 / 2 / 4' }, { index: 7, gridArea: '1 / 2 / 2 / 3' }, { index: 8, gridArea: '1 / 1 / 2 / 2' },
    { index: 4, gridArea: '2 / 4 / 3 / 5' },                                                                            { index: 9, gridArea: '2 / 1 / 3 / 2' },
    { index: 3, gridArea: '3 / 4 / 4 / 5' },                                                                            { index: 10, gridArea: '3 / 1 / 4 / 2' },
    { index: 2, gridArea: '4 / 4 / 5 / 5' }, { index: 1, gridArea: '4 / 3 / 5 / 4' }, { index: 0, gridArea: '4 / 2 / 5 / 3' }, { index: 11, gridArea: '4 / 1 / 5 / 2' },
];

export function PalaceMatrix({ chart }: PalaceMatrixProps) {
  if (!chart || !chart.palaces) return null;

  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-4 grid-rows-4 gap-1 lg:gap-2 p-1 lg:p-4 bg-[#050508] rounded-xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] font-k2d">
      {PALACE_GRID_POSITIONS.map((pos) => {
        const palace = chart.palaces[pos.index];
        const isMenh = pos.index === chart.cungMenhPos;
        const isThan = pos.index === chart.cungThanPos;

        return (
          <div
            key={pos.index}
            className={`relative flex flex-col p-2 bg-[#0a0a0f]/80 border border-white/5 transition-all hover:bg-white/[0.07] hover:border-white/20 overflow-hidden group/palace backdrop-blur-sm`}
            style={{ gridArea: pos.gridArea }}
          >
            {/* Palace Header */}
            <div className="flex justify-between items-start mb-1 relative z-10">
              <div className="flex flex-col">
                <span className={`text-[10px] lg:text-[11px] font-black uppercase tracking-wider ${isMenh ? 'text-purple-400 ring-1 ring-purple-500/40 px-1 bg-purple-500/5 rounded' : 'text-white/40'}`}>
                    {palace.cungName} {isThan ? '(THÂN)' : ''}
                </span>
                {/* Hạn Markers */}
                <div className="flex gap-1 mt-0.5">
                    {pos.index === chart.canChiNamXem?.chiIndex && (
                        <span className="text-[7px] px-1 bg-red-600 text-white font-black rounded-sm leading-none py-0.5 shadow-sm" title="Lưu Thái Tuế">L.TT</span>
                    )}
                    {pos.index === chart.luuNienPos && (
                        <span className="text-[7px] px-1 bg-orange-500 text-white font-black rounded-sm leading-none py-0.5 shadow-sm" title="Tiểu Vận">T.V</span>
                    )}
                    {pos.index === chart.luuDaiHanPos && (
                        <span className="text-[7px] px-1 bg-blue-600 text-white font-black rounded-sm leading-none py-0.5 shadow-sm" title="Lưu Đại Hạn">L.ĐH</span>
                    )}
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] text-white/40 font-bold">{palace.canChi}</span>
                <span className={`text-[7px] px-1 rounded border mt-0.5 font-bold ${HANH_COLORS[palace.palaceHanh] || ''}`}>
                    {palace.palaceHanh}
                </span>
              </div>
            </div>

            {/* Palace Age Corner */}
            <div className="absolute top-10 right-2 text-[12px] font-black text-white/[0.03] italic group-hover/palace:text-white/10 transition-colors">
               {palace.daiVanAge}
            </div>

            {/* Chinh Tinh (Center-top) */}
            <div className="flex flex-col gap-0.5 items-center mb-2 relative z-10">
              {palace.chinhTinh.map((s, idx) => (
                <div key={idx} className="flex items-center gap-1 group relative">
                  <span className={`text-xs lg:text-[13px] font-black ${STAR_NATURE_COLOR[s.nature] || 'text-white'} drop-shadow-sm`}>
                    {s.name}
                  </span>
                  {s.brightness && s.brightness !== 'B' && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm ml-1 ring-1 ring-inset ${
                      s.brightness === 'M' || s.brightness === 'V' ? 'bg-amber-500/20 text-amber-400 ring-amber-500/30' : 
                      s.brightness === 'Đ' ? 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30' : 
                      s.brightness === 'H' ? 'bg-red-500/20 text-red-400 ring-red-500/30' : 
                      'bg-white/10 text-white/40 ring-white/20'
                    }`}>
                      {s.brightness}
                    </span>
                  )}
                  {s.hoa && (
                     <span className="text-[7px] px-1 bg-blue-500 text-white font-bold rounded-sm border border-blue-400" title={`Hóa ${s.hoa} Niên`}>
                        {s.hoa.charAt(0)}
                     </span>
                  )}
                  {s.luuHoa && (
                     <span className="text-[7px] px-1 bg-orange-500 text-white font-bold rounded-sm border border-orange-400" title={`Hóa ${s.luuHoa} Lưu`}>
                        L.{s.luuHoa.charAt(0)}
                     </span>
                  )}
                </div>
              ))}
            </div>

            {/* Phu Tinh (Columns) */}
            <div className="flex-1 grid grid-cols-2 gap-x-1.5 overflow-hidden relative z-10">
              <div className="flex flex-col gap-0.5">
                 {/* Left column stars */}
                 {[...palace.phuTinh].filter(s => s.type !== 'luu' && (s.nature === 'cat' || s.nature === 'trung')).map((s, idx) => (
                    <span key={idx} className={`text-[8px] lg:text-[9.5px] leading-none break-words font-medium ${STAR_NATURE_COLOR[s.nature] || 'text-white/50'}`}>
                        {s.name}{s.hoa ? ` (${s.hoa})` : ''}
                    </span>
                 ))}
                 {/* Lưu stars */}
                 {palace.phuTinh.filter(s => s.type === 'luu').map((s, idx) => (
                    <span key={`l-${idx}`} className="text-[8px] text-orange-400 italic font-bold leading-none mb-0.5 mt-0.5">
                        L.{s.name.replace('Lưu ', '')}
                    </span>
                 ))}
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                 {/* Right column stars */}
                 {[...palace.phuTinh].filter(s => s.type !== 'luu' && s.nature === 'hung').map((s, idx) => (
                    <span key={idx} className={`text-[8px] lg:text-[9.5px] leading-none break-words font-medium ${STAR_NATURE_COLOR[s.nature] || 'text-red-400/70'}`}>
                        {s.name}{s.hoa ? ` (${s.hoa})` : ''}
                    </span>
                 ))}
              </div>
            </div>

            {/* Bottom info */}
            <div className="mt-1 pt-1 border-t border-white/5 flex justify-between items-center text-[7px] text-white/20 uppercase font-black tracking-tight relative z-10">
              <span className="truncate max-w-[50px]">{palace.truongSinh}</span>
              {palace.tuanTriet && (
                <div className="flex gap-1 text-red-500 font-black shrink-0 scale-90">
                    {palace.tuanTriet.tuan ? 'TUẦN' : ''}
                    {palace.tuanTriet.triet ? 'TRIỆT' : ''}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* CENTER AREA */}
      <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-[#0d0d15]/90 flex flex-col items-center justify-center p-3 text-center border border-purple-500/30 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.15)] backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.08)_0%,_transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 w-full flex flex-col items-center justify-between h-full py-1">
            <div className="w-full">
                <div className="text-[7px] text-purple-400/50 uppercase tracking-[0.3em] font-black mb-1">Thiên Bản • {chart.tinhHe || 'Lá Số Tử Vi'}</div>
                <div className="text-xl lg:text-2xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-md">
                    {chart.hoTen || 'Vô Danh'}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mb-1 mt-1">
                <div className="text-center group/info">
                    <div className="text-[7px] text-white/20 uppercase tracking-widest group-hover/info:text-purple-400 transition-colors">Chủ Mệnh</div>
                    <div className="text-[10px] font-black text-white/90">{chart.chuMenh || '--'}</div>
                </div>
                <div className="text-center group/info">
                    <div className="text-[7px] text-white/20 uppercase tracking-widest group-hover/info:text-pink-400 transition-colors">Chủ Thân</div>
                    <div className="text-[10px] font-black text-white/90">{chart.chuThan || '--'}</div>
                </div>
            </div>

            <div className="flex items-center gap-2 w-full mb-1 opacity-50">
                <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-white/10"></div>
                <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest px-2">{chart.amDuong}</div>
                <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-white/10"></div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 w-full mb-2">
                <div className="flex flex-col p-1 rounded bg-white/[0.02] border border-white/5">
                    <div className="text-[7px] text-white/30 uppercase">Phi Cung</div>
                    <div className="text-[10px] font-black text-white">{chart.cungPhi || '--'}</div>
                </div>
                <div className="flex flex-col p-1 rounded bg-amber-500/[0.02] border border-amber-500/10">
                    <div className="text-[7px] text-amber-500/30 uppercase">Bản Mệnh</div>
                    <div className="text-[9px] font-black text-amber-500 truncate mt-0.5">{chart.menhNapAm}</div>
                    <div className="text-[6px] text-amber-500/60 uppercase font-black">{chart.hanhMenh}</div>
                </div>
                <div className="flex flex-col p-1 rounded bg-blue-500/[0.02] border border-blue-500/10">
                    <div className="text-[7px] text-blue-500/30 uppercase">Cục Số</div>
                    <div className="text-[9px] font-black text-blue-400 truncate mt-0.5">{chart.cucName}</div>
                    <div className="text-[6px] text-blue-400/60 uppercase font-black">{chart.hanhCuc}</div>
                </div>
            </div>

            <div className="w-full bg-black/40 rounded-md p-1.5 grid grid-cols-4 gap-1 text-[7px] border border-white/10">
                <div>
                     <div className="text-white/20 uppercase font-bold mb-0.5">Giờ</div>
                     <div className="font-black text-white/80 leading-none">{chart.canChiGio?.full.split(' ')[0]}</div>
                     <div className="text-white/50 leading-none mt-0.5">{chart.canChiGio?.full.split(' ')[1]}</div>
                </div>
                <div>
                     <div className="text-white/20 uppercase font-bold mb-0.5">Ngày</div>
                     <div className="font-black text-white/80 leading-none">{chart.canChiNgay?.full.split(' ')[0]}</div>
                     <div className="text-white/50 leading-none mt-0.5">{chart.canChiNgay?.full.split(' ')[1]}</div>
                </div>
                <div>
                     <div className="text-white/20 uppercase font-bold mb-0.5">Tháng</div>
                     <div className="font-black text-white/80 leading-none">{chart.canChiThang?.full.split(' ')[0]}</div>
                     <div className="text-white/50 leading-none mt-0.5">{chart.canChiThang?.full.split(' ')[1]}</div>
                </div>
                <div>
                     <div className="text-white/20 uppercase font-bold mb-0.5">Năm</div>
                     <div className="font-black text-white/80 leading-none">{chart.canChiNam?.full.split(' ')[0]}</div>
                     <div className="text-white/50 leading-none mt-0.5">{chart.canChiNam?.full.split(' ')[1]}</div>
                </div>
            </div>
        </div>
      </div>

      {chart.luuNienAnalysis?.monthly && (
        <div className="col-span-4 mt-2 bg-white/[0.02] rounded-xl p-3 border border-white/5 overflow-x-auto backdrop-blur-md">
            <div className="flex gap-3 min-w-max items-center">
                <div className="text-[11px] font-black text-purple-400/70 uppercase tracking-tighter leading-none border-r border-white/10 pr-3 mr-1">
                    VẬN HẠN 12 THÁNG NIÊN {chart.input.namXem}
                </div>
                {chart.luuNienAnalysis.monthly.map((m: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 p-2 bg-black/40 rounded-lg border border-white/5 min-w-[75px] hover:border-purple-500/30 transition-all hover:translate-y-[-2px]">
                        <div className="text-[8px] text-white/40 uppercase font-black">Tháng {m.thang}</div>
                        <div className="flex items-end gap-0.5">
                            <div className={`text-base font-black leading-none ${m.energy >= 8 ? 'text-emerald-400' : m.energy <= 3 ? 'text-red-500' : 'text-amber-400'}`}>
                                {m.energy}
                            </div>
                            <div className="text-[8px] text-white/20 font-bold mb-0.5">/10</div>
                        </div>
                        <div className="text-[7px] text-white/60 font-bold uppercase tracking-tight text-center bg-white/5 px-1 rounded-sm w-full">
                            Cung {m.cungName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
