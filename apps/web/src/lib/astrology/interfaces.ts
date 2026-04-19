// src/lib/astrology/interfaces.ts

export type Gender = 'nam' | 'nữ';
export type YinYang = 'Dương Nam' | 'Âm Nam' | 'Dương Nữ' | 'Âm Nữ';

export interface LunarDate {
    day: number;
    month: number;
    year: number;
    leap: number;
    jd: number;
}

export interface CanChi {
    canName: string;
    canIndex: number; // 0-9
    chiName: string;
    chiIndex: number; // 0-11
}

export type StarNature = 'cat' | 'hung' | 'trung';
export type StarType = 'chinh' | 'phu';
export type StarBrightness = 'M' | 'V' | 'D' | 'B' | 'H'; // Miếu, Vượng, Đắc, Bình, Hãm
export type TuHoa = 'Lộc' | 'Quyền' | 'Khoa' | 'Kỵ';

export interface Star {
    name: string;
    type: StarType;
    nature: StarNature;
    brightness?: StarBrightness;
    hoa?: TuHoa; // Hóa Lộc, Hóa Quyền, v.v.
    luuHoa?: TuHoa; // Đặc biệt cho Lưu Niên
}

export interface Palace {
    index: number; // 0-11
    cungName: string; // MỆNH, HUYNH ĐỆ...
    chiName: string; // Tý, Sửu...
    chinhTinh: Star[];
    phuTinh: Star[];
    tuanTriet?: { tuan: boolean; triet: boolean };
    truongSinh: string;
    canChi: string; // VD: Nhâm Thân
    daiVanAge: number; // Tuổi bắt đầu đại vận
    palaceHanh: string; // Ngũ hành của cung (Kim, Thủy...)
}

export interface DaiVan {
    index: number;
    cungPos: number;
    tuoiFrom: number;
    tuoiTo: number;
    namFrom: number;
    namTo: number;
}

export interface ChartMatrix {
    input: {
        ngay: number;
        thang: number;
        nam: number;
        gioSinh: number;
        gioiTinh: Gender;
        namXem: number;
        hoTen?: string;
    };
    hoTen?: string;
    isTwin?: boolean;
    isYounger?: boolean;
    lunarDate: LunarDate;
    amDuong: YinYang;
    thuan: boolean;
    cungMenhPos: number;
    cungThanPos: number;
    cucValue: number;
    cucName: string;
    menhNapAm: string;
    hanhMenh: string;
    hanhCuc: string;
    palaces: Palace[];
    daiVan: DaiVan[];
    chuMenh?: string;
    chuThan?: string;
    cungPhi?: string;
    canChiNam?: any;
    canChiThang?: any;
    canChiNgay?: any;
    canChiGio?: any;
    tinhHe?: string;
    luuDaiHanPos?: number;
    luuNienAnalysis?: {
        luuTuHoa?: any;
        hungTinhOverlay?: any;
        energyScore?: any;
        monthly?: any[];
    };
}
