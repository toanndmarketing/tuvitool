import { NextRequest, NextResponse } from 'next/server';
import { TuViEngine } from '@/lib/astrology/TuViEngine';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { isTwin, profileA, profileB, namXem } = body;

        const currentYear = parseInt(namXem) || new Date().getFullYear();

        if (!profileA) {
            return NextResponse.json({ error: 'Thiếu thông tin Đương Số A' }, { status: 400 });
        }

        // 1. Tính toán cho Đương Số A
        const chartA = TuViEngine.generateChart({
            ngay: parseInt(profileA.ngay),
            thang: parseInt(profileA.thang),
            nam: parseInt(profileA.nam),
            gioSinh: parseInt(profileA.gioSinh),
            gioiTinh: profileA.gioiTinh,
            namXem: currentYear,
            hoTen: profileA.hoTen,
        });

        // 2. Tính toán cho Đương Số B (nếu có chế độ sinh đôi)
        let chartB = null;
        if (isTwin && profileB) {
            chartB = TuViEngine.generateChart({
                ngay: parseInt(profileB.ngay),
                thang: parseInt(profileB.thang),
                nam: parseInt(profileB.nam),
                gioSinh: parseInt(profileB.gioSinh),
                gioiTinh: profileB.gioiTinh,
                namXem: currentYear,
                hoTen: profileB.hoTen,
                isTwin: true,
                isYounger: true, // B là em
                isSameGenderTwin: profileA.gioiTinh === profileB.gioiTinh
            });
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                isTwin: !!isTwin,
                chartA,
                chartB
            } 
        });
    } catch (e: any) {
        console.error('[API /api/chart] Error:', e);
        return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
    }
}
