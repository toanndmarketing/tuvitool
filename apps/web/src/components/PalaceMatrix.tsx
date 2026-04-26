// @ts-nocheck
'use client';

import React from 'react';
import { ChartMatrix } from '../lib/astrology/interfaces';

interface PalaceMatrixProps {
  chart: ChartMatrix;
}

const STAR_HANH_COLOR: Record<string, string> = {
  'Kim': 'text-[#d4d4d8]', // Xám trắng
  'Mộc': 'text-[#4ade80]', // Xanh lá
  'Thuỷ': 'text-[#60a5fa]', // Xanh dương
  'Hoả': 'text-[#f87171]', // Đỏ
  'Thổ': 'text-[#fbbf24]'  // Vàng/Nâu
};

const HANH_BG_COLORS: Record<string, string> = {
  'Kim': 'text-[#d4d4d8]',
  'Mộc': 'text-[#4ade80]',
  'Thuỷ': 'text-[#60a5fa]',
  'Hoả': 'text-[#f87171]',
  'Thổ': 'text-[#fbbf24]'
};

const GIO_SINH_RANGES = [
  '23:00-00:59',
  '01:00-02:59',
  '03:00-04:59',
  '05:00-06:59',
  '07:00-08:59',
  '09:00-10:59',
  '11:00-12:59',
  '13:00-14:59',
  '15:00-16:59',
  '17:00-18:59',
  '19:00-20:59',
  '21:00-22:59',
];

function shouldRenderWide(value: string): boolean {
  if (!value) return false;
  return value.length > 18 || value.includes('|');
}

// Cấu trúc 4x4 chuẩn truyền thống Việt Nam:
// Top: Tị, Ngọ, Mùi, Thân
// Phải: Dậu, Tuất, Hợi
// Dưới: Tí, Sửu, Dần
// Trái: Mão, Thìn
const PALACE_GRID_POSITIONS = [
    { index: 5, gridArea: '1 / 1 / 2 / 2' }, // Tị
    { index: 6, gridArea: '1 / 2 / 2 / 3' }, // Ngọ
    { index: 7, gridArea: '1 / 3 / 2 / 4' }, // Mùi
    { index: 8, gridArea: '1 / 4 / 2 / 5' }, // Thân
    { index: 4, gridArea: '2 / 1 / 3 / 2' }, // Thìn
    { index: 9, gridArea: '2 / 4 / 3 / 5' }, // Dậu
    { index: 3, gridArea: '3 / 1 / 4 / 2' }, // Mão
    { index: 10, gridArea: '3 / 4 / 4 / 5' }, // Tuất
    { index: 2, gridArea: '4 / 1 / 5 / 2' }, // Dần
    { index: 1, gridArea: '4 / 2 / 5 / 3' }, // Sửu
    { index: 0, gridArea: '4 / 3 / 5 / 4' }, // Tí
    { index: 11, gridArea: '4 / 4 / 5 / 5' }, // Hợi
];

export function PalaceMatrix({ chart }: PalaceMatrixProps) {
  if (!chart || !chart.palaces) return null;

  // Tính Thân Cư
  const cungThan = chart.palaces.find(p => p.index === chart.cungThanPos);
  const thanCu = cungThan ? cungThan.cungName : '';
  const isNam = chart.input?.gioiTinh === 'nam';
  const gioSinhIndex = Number(chart.input?.gioSinh);
  const gioChi = chart.canChiGio?.full?.split(' ')[1] || '--';
  const gioRange = Number.isFinite(gioSinhIndex) ? GIO_SINH_RANGES[gioSinhIndex] : '';

  const leftRows = [
    { label: 'Năm:', value: `${chart.input?.nam ?? '--'} (${chart.canChiNam?.full ?? '--'})` },
    { label: 'Tháng:', value: `DL ${chart.input?.thang ?? '--'} | AL ${chart.lunarDate?.month ?? '--'} (${chart.canChiThang?.full ?? '--'})` },
    { label: 'Ngày:', value: `DL ${chart.input?.ngay ?? '--'} | AL ${chart.lunarDate?.day ?? '--'}` },
    { label: 'Giờ:', value: `${Number.isFinite(gioSinhIndex) ? gioSinhIndex : '--'} (${gioChi}${gioRange ? `, ${gioRange}` : ''})` },
    { label: 'Âm Dương:', value: chart.amDuong || '--' },
    { label: 'Mệnh:', value: chart.menhNapAm || '--', wide: true },
    { label: 'Cục:', value: chart.cucName || '--', valueClass: 'uppercase text-red-400' },
  ];

  const rightRows = [
    { label: 'Đương Số:', value: chart.hoTen || 'Vô Danh', valueClass: 'font-black text-emerald-400 uppercase', wide: true },
    { label: 'Giới tính:', value: isNam ? 'Nam' : 'Nữ' },
    { label: 'Thân cư:', value: thanCu || '--' },
    { label: 'Mệnh chủ:', value: chart.chuMenh || '--' },
    { label: 'Thân chủ:', value: chart.chuThan || '--' },
  ];

  const leftCompactRows = leftRows.filter((row) => !row.wide && !shouldRenderWide(row.value));
  const rightCompactRows = rightRows.filter((row) => !row.wide && !shouldRenderWide(row.value));
  const leftWideRows = leftRows.filter((row) => row.wide || shouldRenderWide(row.value));
  const rightWideRows = rightRows.filter((row) => row.wide || shouldRenderWide(row.value));

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-2 font-k2d">
      <div className="w-full grid grid-cols-4 grid-rows-4 gap-px bg-white/20 p-px rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        {PALACE_GRID_POSITIONS.map((pos) => {
          const palace = chart.palaces[pos.index];
          const isMenh = pos.index === chart.cungMenhPos;
          const isThan = pos.index === chart.cungThanPos;
          
          const titleCan = palace.canChi.split(' ')[0].charAt(0);

          return (
            <div
              key={pos.index}
              className={`relative flex flex-col p-1.5 justify-between min-h-[140px] lg:min-h-[160px] bg-[#0a0a0f] hover:bg-white/[0.04] transition-colors`}
              style={{ gridArea: pos.gridArea }}
            >
              {/* Palace Header */}
              <div className="flex justify-between items-start leading-none relative z-10 w-full mb-1">
                <div className="flex flex-col gap-1 items-start">
                  <div className="flex gap-1 items-center">
                      <span className="text-[10px] text-white/50">{titleCan}. {palace.chiName}</span>
                      <span className={`text-[11px] lg:text-[12px] font-black uppercase tracking-tight ${isMenh ? 'text-red-500' : 'text-white/90'}`}>
                          {palace.cungName}
                      </span>
                      {isThan && <span className="text-[9px] px-1 border border-red-500 text-red-500 ml-1 rounded-[2px] leading-none py-0.5">Thân</span>}
                  </div>
                  {/* Hạn Markers */}
                  <div className="flex gap-1 hidden">
                      {pos.index === chart.canChiNamXem?.chiIndex && (
                          <span className="text-[8px] text-red-500 font-black leading-none" title="Lưu Thái Tuế">L.TT</span>
                      )}
                      {pos.index === chart.luuNienPos && (
                          <span className="text-[8px] text-orange-400 font-black leading-none" title="Tiểu Vận">T.Vận</span>
                      )}
                      {pos.index === chart.luuDaiHanPos && (
                          <span className="text-[8px] text-blue-400 font-black leading-none" title="Lưu Đại Hạn">L.ĐH</span>
                      )}
                  </div>
                </div>
                <span className="text-[12px] font-black text-white/70">{palace.daiVanAge}</span>
              </div>

              {/* Chinh Tinh (Center) */}
              <div className="flex flex-col items-center justify-center my-1.5 flex-wrap z-10 w-full">
                {palace.chinhTinh.map((s, idx) => (
                  <div key={idx} className={`text-[13px] lg:text-[14px] leading-tight font-black uppercase tracking-tight ${STAR_HANH_COLOR[s.hanh] || 'text-white'}`}>
                    {s.name} {s.brightness && s.brightness !== 'B' ? `(${s.brightness})` : ''}
                    {s.hoa && <span className="text-[8px] bg-blue-500/20 text-blue-400 ml-1 px-1 rounded-sm border border-blue-500/30 float-right leading-relaxed">{s.hoa.charAt(0)}</span>}
                  </div>
                ))}
              </div>

              {/* Phu Tinh (Left - Right) */}
              <div className="flex justify-between items-start flex-1 w-full relative z-10 overflow-hidden">
                {/* Cát Tinh / Trung Tinh */}
                <div className="flex flex-col items-start gap-[2px] w-1/2 pr-1">
                  {[...palace.phuTinh].filter(s => s.type !== 'luu' && (s.nature === 'cat' || s.nature === 'trung')).map((s, idx) => (
                    <span key={idx} className={`text-[9.5px] lg:text-[10.5px] font-medium leading-[1.1] ${STAR_HANH_COLOR[s.hanh] || 'text-white/70'}`}>
                      {s.name}{s.hoa ? ` (${s.hoa})` : ''}
                    </span>
                  ))}
                  {/* Lưu Sao Cát */}
                  {palace.phuTinh.filter(s => s.type === 'luu' && s.nature !== 'hung').map((s, idx) => (
                    <span key={`l-c-${idx}`} className="text-[9.5px] lg:text-[10.5px] font-medium text-orange-400/90 leading-[1.1]">
                      L.{s.name.replace('Lưu ', '')}
                    </span>
                  ))}
                </div>
                
                {/* Sát Tinh / Bại Tinh */}
                <div className="flex flex-col items-end gap-[2px] w-1/2 text-right pl-1">
                  {[...palace.phuTinh].filter(s => s.type !== 'luu' && s.nature === 'hung').map((s, idx) => (
                    <span key={idx} className={`text-[9.5px] lg:text-[10.5px] font-medium leading-[1.1] ${STAR_HANH_COLOR[s.hanh] || 'text-white/70'}`}>
                      {s.name}
                    </span>
                  ))}
                  {/* Lưu Sao Hung */}
                  {palace.phuTinh.filter(s => s.type === 'luu' && s.nature === 'hung').map((s, idx) => (
                    <span key={`l-h-${idx}`} className="text-[9.5px] lg:text-[10.5px] font-medium text-orange-400/90 leading-[1.1]">
                      L.{s.name.replace('Lưu ', '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Row */}
              <div className="flex justify-between items-end w-full mt-2 leading-none relative z-10 bottom-0">
                <div className="text-[11px] font-bold text-white/50 w-1/3 text-left">{palace.chiName}</div>
                <div className="text-[10px] text-white/50 w-1/3 text-center">{palace.truongSinh}</div>
                <div className="flex flex-col items-end w-1/3 gap-[2px]">
                  <div className={`text-[9px] uppercase font-bold tracking-wider ${HANH_BG_COLORS[palace.palaceHanh] || 'text-white/30'}`}>
                    {palace.palaceHanh === 'Kim' ? '+KIM' : palace.palaceHanh === 'Mộc' ? '-MỘC' : palace.palaceHanh === 'Thuỷ' ? '+THỦY' : palace.palaceHanh === 'Hoả' ? '+HỎA' : '-THỔ'}
                  </div>
                  {palace.tuanTriet && (
                    <div className="flex gap-[2px] mt-[1px]">
                        {palace.tuanTriet.triet && <span className="bg-[#444] text-white text-[9px] px-1 font-bold rounded-[2px]">TRIỆT</span>}
                        {palace.tuanTriet.tuan && <span className="bg-red-700 text-white text-[9px] px-1 font-bold rounded-[2px]">TUẦN</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* CENTER AREA */}
        <div className="col-start-2 col-end-4 row-start-2 row-end-4 bg-[#050508] p-4 lg:p-6 flex flex-col items-center justify-center relative z-0">
            <div className="text-xl lg:text-3xl font-black text-red-500 mb-6 tracking-wide uppercase text-center shadow-red-500/20 drop-shadow-md">
                Hệ Thống Tử Vi Cổ Học
            </div>
            
            <div className="grid grid-cols-2 gap-x-5 lg:gap-x-10 gap-y-2 w-full max-w-[95%] text-[12px] lg:text-[14px]">
                {/* Cột trái */}
                <div className="flex flex-col gap-2">
                    {leftCompactRows.map((row) => (
                      <div key={row.label} className="grid grid-cols-[78px_minmax(0,1fr)] gap-2 items-start">
                        <span className="font-bold text-white/50">{row.label}</span>
                        <span className={`font-bold text-white/90 break-words leading-5 ${row.valueClass || ''}`}>{row.value}</span>
                      </div>
                    ))}
                </div>

                {/* Cột phải */}
                <div className="flex flex-col gap-2">
                    {rightCompactRows.map((row) => (
                      <div key={row.label} className="grid grid-cols-[78px_minmax(0,1fr)] gap-2 items-start">
                        <span className="font-bold text-white/50">{row.label}</span>
                        <span className={`font-bold text-white/90 break-words leading-5 ${row.valueClass || ''}`}>{row.value}</span>
                      </div>
                    ))}
                </div>
            </div>

            {(leftWideRows.length > 0 || rightWideRows.length > 0) && (
              <div className="w-full max-w-[95%] mt-4 pt-3 border-t border-white/10 flex flex-col gap-2 text-[12px] lg:text-[14px]">
                {leftWideRows.map((row) => (
                  <div key={`left-${row.label}`} className="grid grid-cols-[78px_minmax(0,1fr)] gap-2 items-start">
                    <span className="font-bold text-white/50">{row.label}</span>
                    <span className={`font-bold text-white/90 break-words leading-5 ${row.valueClass || ''}`}>{row.value}</span>
                  </div>
                ))}
                {rightWideRows.map((row) => (
                  <div key={`right-${row.label}`} className="grid grid-cols-[78px_minmax(0,1fr)] gap-2 items-start">
                    <span className="font-bold text-white/50">{row.label}</span>
                    <span className={`font-bold text-white/90 break-words leading-5 ${row.valueClass || ''}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {/* Phụ Chú Đại Vận Lục Thập Hoa Giáp */}
            <div className="mt-8 pt-4 border-t border-white/10 w-full text-center">
              <span className="text-[10px] lg:text-[11px] tracking-[0.08em] text-white/40 font-bold break-words">
                Tên Tác giả: Toàn Tử Vi - Zalo: 0916867294 - Quản trị cuộc đời
              </span>
            </div>
        </div>
      </div>

      {chart.luuNienAnalysis?.monthly && (
        <div className="w-full mt-2 bg-[#0a0a0f] rounded-sm p-3 border border-white/20 overflow-x-auto">
            <div className="flex gap-3 min-w-max items-center">
                <div className="text-[12px] font-black text-red-500 uppercase tracking-tighter leading-none border-r border-white/20 pr-4 mr-2">
                    VẬN HẠN 12 THÁNG NĂM {chart.input.namXem}
                </div>
                {chart.luuNienAnalysis.monthly.map((m: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 p-2 bg-white/5 rounded border border-white/10 min-w-[75px]">
                        <div className="text-[9px] text-white/50 uppercase font-bold">Tháng {m.thang}</div>
                        <div className="flex items-end gap-0.5">
                            <div className={`text-lg font-black leading-none ${m.energy >= 8 ? 'text-emerald-400' : m.energy <= 3 ? 'text-red-500' : 'text-amber-400'}`}>
                                {m.energy}
                            </div>
                            <div className="text-[9px] text-white/30 font-bold mb-0.5">/10</div>
                        </div>
                        <div className="text-[8px] text-white/70 font-bold uppercase tracking-tight text-center bg-white/10 px-1.5 py-0.5 rounded-sm w-full">
                            {m.cungName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
