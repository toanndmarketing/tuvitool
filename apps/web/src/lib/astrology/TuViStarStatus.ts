// src/lib/astrology/TuViStarStatus.ts

// Miếu (rất mạnh), Vượng (mạnh), Đắc (khá), Hãm (yếu/xấu)
// Index: 0=Tý, 1=Sửu, 2=Dần, 3=Mão, 4=Thìn, 5=Tỵ, 6=Ngọ, 7=Mùi, 8=Thân, 9=Dậu, 10=Tuất, 11=Hợi
const MIEU_HAM: Record<string, { mieu: number[], vuong: number[], dac: number[], ham: number[] }> = {
    'Tử Vi': {
        mieu: [6, 5],        // Ngọ, Tỵ
        vuong: [4, 7],       // Thìn, Mùi
        dac: [1, 2, 8],      // Sửu, Dần, Thân
        ham: []              // Đế tinh không hãm
    },
    'Thiên Cơ': {
        mieu: [0, 2],        // Tý, Dần
        vuong: [3, 6],       // Mão, Ngọ
        dac: [8, 11],        // Thân, Hợi
        ham: [5, 9]          // Tỵ, Dậu
    },
    'Thái Dương': {
        mieu: [3, 4, 5, 6],  // Mão, Thìn, Tỵ, Ngọ
        vuong: [2],          // Dần
        dac: [1, 7],         // Sửu, Mùi
        ham: [9, 10, 11, 0]  // Dậu, Tuất, Hợi, Tý
    },
    'Vũ Khúc': {
        mieu: [4, 10],       // Thìn, Tuất
        vuong: [1, 7],       // Sửu, Mùi
        dac: [2, 8],         // Dần, Thân
        ham: [3, 9]          // Mão, Dậu
    },
    'Thiên Đồng': {
        mieu: [2, 8],        // Dần, Thân
        vuong: [0, 6],       // Tý, Ngọ
        dac: [1, 7],         // Sửu, Mùi
        ham: [5, 11]         // Tỵ, Hợi
    },
    'Liêm Trinh': {
        mieu: [8, 9],        // Thân, Dậu
        vuong: [2, 3],       // Dần, Mão
        dac: [4, 10],        // Thìn, Tuất
        ham: [5, 11]         // Tỵ, Hợi
    },
    'Thiên Phủ': {
        mieu: [1, 7, 0, 6],  // Sửu, Mùi, Tý, Ngọ
        vuong: [2, 8],       // Dần, Thân
        dac: [4, 10],        // Thìn, Tuất
        ham: [3, 9]          // Mão, Dậu
    },
    'Thái Âm': {
        mieu: [9, 10, 11, 0], // Dậu, Tuất, Hợi, Tý
        vuong: [8],           // Thân
        dac: [1, 7],          // Sửu, Mùi
        ham: [3, 4, 5, 6]     // Mão, Thìn, Tỵ, Ngọ
    },
    'Tham Lang': {
        mieu: [4, 10],       // Thìn, Tuất
        vuong: [2, 8],       // Dần, Thân
        dac: [0, 6],         // Tý, Ngọ
        ham: [5, 11]         // Tỵ, Hợi
    },
    'Cự Môn': {
        mieu: [0, 4],        // Tý, Thìn
        vuong: [1, 7],       // Sửu, Mùi
        dac: [2, 8],         // Dần, Thân
        ham: [5, 11]         // Tỵ, Hợi
    },
    'Thiên Tướng': {
        mieu: [1, 7],        // Sửu, Mùi
        vuong: [2, 8],       // Dần, Thân
        dac: [0, 6],         // Tý, Ngọ
        ham: [5, 11]         // Tỵ, Hợi
    },
    'Thiên Lương': {
        mieu: [0, 6],        // Tý, Ngọ
        vuong: [2, 8],       // Dần, Thân
        dac: [1, 7],         // Sửu, Mùi
        ham: [5, 11]         // Tỵ, Hợi
    },
    'Thất Sát': {
        mieu: [2, 8],        // Dần, Thân
        vuong: [0, 6],       // Tý, Ngọ
        dac: [1, 7],         // Sửu, Mùi
        ham: [4, 10]         // Thìn, Tuất
    },
    'Phá Quân': {
        mieu: [0, 6],        // Tý, Ngọ
        vuong: [2, 8],       // Dần, Thân
        dac: [1, 7],         // Sửu, Mùi
        ham: [4, 10]         // Thìn, Tuất
    }
};

const HANH_SAO: Record<string, string> = {
    'Tử Vi': 'Thổ',
    'Thiên Cơ': 'Mộc',
    'Thái Dương': 'Hoả',
    'Vũ Khúc': 'Kim',
    'Thiên Đồng': 'Thuỷ',
    'Liêm Trinh': 'Hoả',
    'Thiên Phủ': 'Thổ',
    'Thái Âm': 'Thuỷ',
    'Tham Lang': 'Thuỷ',
    'Cự Môn': 'Thuỷ',
    'Thiên Tướng': 'Thuỷ',
    'Thiên Lương': 'Mộc',
    'Thất Sát': 'Kim',
    'Phá Quân': 'Thuỷ'
};

export const TuViStarStatus = {
    /**
     * Xác định trạng thái miếu/hãm của 1 sao tại 1 cung
     */
    getStarStatus(starName: string, cungPos: number): string {
        const name = (starName || '').trim();
        const entry = MIEU_HAM[name];
        if (!entry) return 'binh';
        if (entry.mieu?.includes(cungPos)) return 'mieu';
        if (entry.vuong?.includes(cungPos)) return 'vuong';
        if (entry.dac?.includes(cungPos)) return 'dac';
        if (entry.ham?.includes(cungPos)) return 'ham';
        return 'binh';
    },

    /**
     * Lấy Ngũ Hành của sao
     */
    getStarHanh(starName: string): string {
        const name = (starName || '').trim();
        return HANH_SAO[name] || '';
    }
};
