// v2-web/src/lib/astrology/test_v11.ts
import { TuViEngine } from './TuViEngine';
import { compactAstrologyData } from './AiUtils';
import { Gender } from './interfaces';

async function test() {
    const input = {
        ngay: 28,
        thang: 1,
        nam: 1991,
        gioSinh: 6,
        gioiTinh: "nam" as Gender,
        namXem: 2026,
        hoTen: "Trần Thế Toàn"
    };

    console.log("--- Generating Chart ---");
    const chart = TuViEngine.generateChart(input);
    
    console.log("--- Compacting Data ---");
    const compressed = compactAstrologyData(chart);
    
    const parsed = JSON.parse(compressed);
    
    console.log("\n=== COMPACTED OVERVIEW ===");
    console.log("Name:", parsed.info.name);
    console.log("Chu Menh:", parsed.info.cm);
    console.log("Chu Than:", parsed.info.ct);
    console.log("Can Chi:", parsed.info.can_chi);
    console.log("Nam Xem:", parsed.info.nam_xem);
    console.log("Mệnh:", parsed.info.menh);

    console.log("\n=== PALACE 0 (Tý) ===");
    const p0 = parsed.p[0];
    console.log("Name:", p0.c);
    console.log("Stars (Full):", p0.ct);

    console.log("\n✅ Test completed. JSON size:", compressed.length, "bytes");
}

// Chạy test nếu môi trường cho phép, hoặc chỉ để review code
test();
