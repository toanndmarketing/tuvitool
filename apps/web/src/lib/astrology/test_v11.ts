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
    console.log("Can Chi NX:", parsed.info.cc.nx);
    console.log("Cung Phi:", parsed.info.phi);
    console.log("Nap Am:", parsed.info.nap_am);

    console.log("\n=== PALACE 0 (Tý) ===");
    const p0 = parsed.p[0];
    console.log("Name:", p0.name);
    console.log("Stars (Sample):", p0.ct.slice(0, 1).map((s: any) => `${s.s} (${s.st}) - ${s.ah}`));

    console.log("\n✅ Test completed. JSON size:", compressed.length, "bytes");
}

// Chạy test nếu môi trường cho phép, hoặc chỉ để review code
// test();
