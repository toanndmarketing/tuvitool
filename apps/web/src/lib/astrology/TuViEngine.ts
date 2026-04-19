// src/lib/astrology/TuViEngine.ts
import { AmLich } from './AmLich';
import { TuViCalc } from './TuViCalc';
import { TuViSao } from './TuViSao';
import { TuViTinhHe } from './TuViTinhHe';
import { TuViLuuNien } from './TuViLuuNien';
import { TuViStarStatus } from './TuViStarStatus';
import { ChartMatrix, Gender } from './interfaces';

export class TuViEngine {
    /**
     * Khởi tạo toàn bộ lá số Tử Vi.
     * @param input Ngày, tháng, năm, giờ sinh, giới tính, và năm xem
     * @returns ChartMatrix (Lá số full JSON)
     */
    static generateChart(input: { 
        ngay: number, 
        thang: number, 
        nam: number, 
        gioSinh: number, 
        gioiTinh: Gender, 
        namXem: number,
        hoTen?: string,
        isTwin?: boolean,
        isYounger?: boolean,
        isSameGenderTwin?: boolean
    }): any {
        // Validation cơ bản
        if (!input.ngay || !input.thang || !input.nam || input.gioSinh == null) {
            throw new Error("Vui lòng nhập đầy đủ thông tin ngày, tháng, năm sinh.");
        }

        // Đảm bảo dữ liệu là số nguyên
        const ngay = parseInt(String(input.ngay));
        const thang = parseInt(String(input.thang));
        const nam = parseInt(String(input.nam));
        const namXem = parseInt(String(input.namXem));

        if (isNaN(ngay) || isNaN(thang) || isNaN(nam) || nam < 100) {
              throw new Error("Dữ liệu ngày tháng năm sinh không hợp lệ.");
        }

        // Bước 1: Tính toán cơ bản (Cung, Mệnh, Cục, Thân)
        const baseResult = TuViCalc.calculate(input);
        baseResult.cungPhi = TuViCalc.getCungPhi(input.nam, input.gioiTinh);

        // --- HỆ THỐNG XỬ LÝ SINH ĐÔI CHUYỂN CUNG (DI CUNG) ---
        if (input.isTwin && input.isYounger && input.isSameGenderTwin) {
            // Dịch chuyển Cung Mệnh sang mượn cung Thiên Di (đối diện)
            baseResult.cungMenhPos = (baseResult.cungMenhPos + 6) % 12;
            
            // Vẽ lại tên 12 cung theo Mệnh mới
            const newCungMap = TuViCalc.anCung(baseResult.cungMenhPos);
            baseResult.cungMap = newCungMap;

            // Tính lại Đại Vận theo Mệnh mới
            baseResult.daiVan = TuViCalc.tinhDaiVan(
                baseResult.cucValue, 
                baseResult.cungMenhPos, 
                baseResult.thuan, 
                baseResult.lunarDate.year
            );
        }

        baseResult.hoTen = input.hoTen || "Đương Số";
        baseResult.isTwin = input.isTwin;
        baseResult.isYounger = input.isYounger;

        // Bước 2: An Sao
        const saoMap = TuViSao.anSao(baseResult);
        baseResult.saoMap = saoMap;

        // Lưu Hóa cho Năm Sinh (can năm)
        const canNam = baseResult.canChiNam.canIndex;
        const tuHoa = TuViSao.anTuHoa(canNam);
        
        // Gán thuộc tính hoa cho sao trong saoMap
        for (let i = 0; i < 12; i++) {
            if (saoMap[i]) {
                saoMap[i].forEach((sao: any) => {
                    if (sao.name === tuHoa['Hoá Lộc']) sao.hoa = 'Lộc';
                    if (sao.name === tuHoa['Hoá Quyền']) sao.hoa = 'Quyền';
                    if (sao.name === tuHoa['Hoá Khoa']) sao.hoa = 'Khoa';
                    if (sao.name === tuHoa['Hoá Kỵ']) sao.hoa = 'Kỵ';
                });
            }
        }

        // Bước 3: Phân tích Tinh Hệ (Lục thập tinh hệ)
        baseResult.tinhHeMap = TuViTinhHe.getAllTinhHe(saoMap);

        // Bước 4: Lưu Niên (Phân tích hạn năm)
        try {
            baseResult.luuNienAnalysis = TuViLuuNien.analyzeFull(baseResult);
        } catch (e) {
            console.error("Lưu Niên Error:", e);
        }

        // Transform slightly to return standard ChartMatrix
        return this.formatToEntity(baseResult);
    }

    /**
     * Map cấu trúc của baseResult (legacy JS) sang cấu trúc Interface định chuẩn.
     */
    private static formatToEntity(raw: any): any {
        const palaces = [];
        for (let i = 0; i < 12; i++) {
            const cungName = raw.cungMap[i];
            const chiName = AmLich.DIA_CHI[i];
            
            let chinhTinh = [];
            let phuTinh = [];
            
            // Populate logic if mapped
            if(raw.saoMap && raw.saoMap[i]) {
                 chinhTinh = raw.saoMap[i].filter((s:any) => s.type === 'chinh').map((s: any) => {
                     const status = TuViStarStatus.getStarStatus(s.name, i);
                     const brightnessMap: Record<string, string> = {
                         'mieu': 'M',
                         'vuong': 'V',
                         'dac': 'Đ',
                         'binh': 'B',
                         'ham': 'H'
                     };
                     return {
                         ...s,
                         brightness: brightnessMap[status] || 'B',
                         hanh: TuViStarStatus.getStarHanh(s.name)
                     };
                 });
                 phuTinh = raw.saoMap[i].filter((s:any) => s.type !== 'chinh').map((s: any) => {
                    return {
                        ...s,
                        hanh: TuViStarStatus.getStarHanh(s.name)
                    };
                });
            }

            // Tìm đại vận tương ứng với cung này
            const dv = raw.daiVan?.find((d: any) => d.cungPos === i);

            // Tính Can Chi cho cung
            const yearCanIndex = raw.canChiNam.canIndex;
            const canOfDan = (yearCanIndex * 2 + 2) % 10;
            const palaceCanIndex = (canOfDan + (i - 2 + 12) % 12) % 10;
            const palaceCanName = AmLich.THIEN_CAN[palaceCanIndex];
            const palaceCanChi = `${palaceCanName} ${chiName}`;

            // Ngũ hành của cung chi
            const CHI_HANH: Record<number, string> = {
                0: 'Thuỷ', 1: 'Thổ', 2: 'Mộc', 3: 'Mộc', 4: 'Thổ', 5: 'Hoả', 
                6: 'Hoả', 7: 'Thổ', 8: 'Kim', 9: 'Kim', 10: 'Thổ', 11: 'Thuỷ'
            };

            palaces.push({
                index: i,
                cungName,
                chiName,
                chinhTinh,
                phuTinh,
                tuanTriet: raw.tuanTrietMap ? raw.tuanTrietMap[i] : undefined,
                truongSinh: raw.truongSinhMap ? raw.truongSinhMap[i] : null,
                rating: raw.palaceRating ? raw.palaceRating[i] : undefined,
                canChi: palaceCanChi,
                daiVanAge: dv ? dv.tuoiFrom : 0,
                palaceHanh: CHI_HANH[i] || 'Thổ'
            });
        }

        // Tìm Lưu Đại Hạn
        const currentDaiVan = raw.daiVan?.find((d: any) => raw.tuoi >= d.tuoiFrom && raw.tuoi <= d.tuoiTo);
        const luuDaiHanPos = currentDaiVan ? currentDaiVan.cungPos : undefined;

        // Xác định tinh hệ cung Mệnh
        const tinhHeObj = TuViTinhHe.getTinhHe(raw.cungMenhPos, raw.saoMap);

        return {
            input: raw.input,
            lunarDate: raw.lunarDate,
            amDuong: raw.amDuong,
            thuan: raw.thuan,
            cungMenhPos: raw.cungMenhPos,
            cungThanPos: raw.cungThanPos,
            cucValue: raw.cucValue,
            cucName: raw.cucName,
            menhNapAm: raw.menhNapAm,
            hanhMenh: raw.hanhMenh,
            hanhCuc: raw.hanhCuc,
            specials: raw.specials,
            vanHan: raw.tieuVan || {}, 
            palaces: palaces,
            daiVan: raw.daiVan,
            hoTen: raw.hoTen,
            isTwin: raw.isTwin,
            isYounger: raw.isYounger,
            chuMenh: raw.chuMenh,
            chuThan: raw.chuThan,
            cungPhi: raw.cungPhi,
            canChiNam: raw.canChiNam,
            canChiThang: raw.canChiThang,
            canChiNgay: raw.canChiNgay,
            canChiGio: raw.canChiGio,
            canChiNamXem: raw.canChiNamXem,
            luuNienPos: raw.luuNienPos,
            tuoi: raw.tuoi,
            luuNienAnalysis: raw.luuNienAnalysis,
            tinhHe: tinhHeObj ? tinhHeObj.name : undefined,
            luuDaiHanPos: luuDaiHanPos,
        };
    }
}
