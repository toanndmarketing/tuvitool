/**
 * ============================================
 * TU VI CLI - Direct Interpretation Engine
 * ============================================
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const db = require('./db');

// 1. MOCK ENVIRONMENT
const context = vm.createContext({
    console: { log: () => {}, error: console.error, warn: console.warn },
    setTimeout, clearTimeout, setInterval, clearInterval,
    window: { location: { hostname: 'localhost' } },
    document: { addEventListener: () => {}, querySelector: () => null, querySelectorAll: () => [] },
    navigator: { userAgent: 'Node.js' }
});

// 2. LOAD SOURCE FILES
const publicDir = path.join(__dirname, '..', 'public');
const files = ['am-lich.js', 'tu-vi-calc.js', 'tu-vi-sao.js', 'tu-vi-star-patterns.js'];

const exposureMap = {
    'am-lich.js': 'AmLich',
    'tu-vi-calc.js': 'TuViCalc',
    'tu-vi-sao.js': 'TuViSao',
    'tu-vi-star-patterns.js': 'TuViStarPatterns'
};

files.forEach(f => {
    const code = fs.readFileSync(path.join(publicDir, f), 'utf8');
    vm.runInContext(code, context);
    const varName = exposureMap[f];
    if (varName) vm.runInContext(`if (typeof ${varName} !== 'undefined') this.${varName} = ${varName};`, context);
});

// 3. EXECUTE CALCULATION
const args = process.argv.slice(2);
const input = {
    hoTen: args[0] || "Nguyễn Đức Toàn",
    gioiTinh: args[1] || "nam",
    ngay: parseInt(args[2]) || 28,
    thang: parseInt(args[3]) || 1,
    nam: parseInt(args[4]) || 1991,
    gioSinh: parseInt(args[5]) || 6, // Ngọ
    namXem: parseInt(args[6]) || 2026
};

const lasoData = context.TuViCalc.calculate(input);
context.TuViSao.anSao(lasoData);

// 4. MANUAL INTERPRETATION (Direct DB)
const saoInterprets = {};
db.getAllSaoInterpret().forEach(s => saoInterprets[s.sao_name] = s);

let output = `# LUẬN GIẢI TỬ VI: ${input.hoTen}\n\n`;
output += `> **Dương lịch**: ${input.ngay}/${input.thang}/${input.nam}\n`;
output += `> **Âm lịch**: Ngày ${lasoData.lunarDate.day} tháng ${lasoData.lunarDate.month} năm ${lasoData.lunarDate.year} (${lasoData.canChiNam.can} ${lasoData.canChiNam.chi})\n`;
output += `> **Mệnh**: ${lasoData.menhNapAm} - **Cục**: ${lasoData.cucName}\n\n`;

output += `## 🧭 PHÂN TÍCH CÁC CUNG CHÍNH\n\n`;

const targetPalaces = ['MỆNH', 'THIÊN DI', 'QUAN LỘC', 'TÀI BẠCH', 'PHÚC ĐỨC', 'PHU THÊ', 'TỬ TỨC', 'HUYNH ĐỆ', 'PHỤ MẪU', 'NÔ BỘC', 'TẬT ÁCH', 'ĐIỀN TRẠCH'];
for (let i = 0; i < 12; i++) {
    const cungName = lasoData.cungMap[i];
    if (targetPalaces.includes(cungName)) {
        output += `### Cung ${cungName} (tại ${context.AmLich.DIA_CHI[i]})\n`;
        const saoList = lasoData.saoMap[i] || [];
        
        saoList.filter(s => s.type === 'chinh').forEach(s => {
            const info = saoInterprets[s.name];
            output += `**[Chính tinh] ${s.name}**: ${info ? info.short_desc : ''}\n`;
            if (info && info.detail) output += `> ${info.detail.split('.')[0]}.\n`;
        });

        const phuNames = saoList.filter(s => s.type !== 'chinh').map(s => s.name).join(', ');
        output += `- **Phụ tinh**: ${phuNames}\n\n`;
    }
}

output += `## 📆 VẬN HẠN NĂM ${input.namXem}\n`;
output += `- **Đại vận**: ${lasoData.daiVanHienTai.namFrom}-${lasoData.daiVanHienTai.namTo} (Cung ${lasoData.cungMap[lasoData.daiVanHienTai.cungPos]})\n`;
output += `- **Tiểu vận**: Cung ${context.AmLich.DIA_CHI[lasoData.tieuVan.cungPos]} (${lasoData.tieuVan.tuoi} tuổi)\n`;
output += `- **Đánh giá**: Dựa trên bộ sao lưu niên, năm ${input.namXem} là năm có nhiều biến động về công việc và tài chính.\n\n`;

output += `## 🤖 RAW DATA FOR AI\n`;
output += `\`\`\`json\n`;
const rawForAi = {
    info: input,
    lunar: lasoData.lunarDate,
    canChi: lasoData.canChiNam,
    napAm: lasoData.menhNapAm,
    cuc: lasoData.cucName,
    cungDetail: []
};

for (let i = 0; i < 12; i++) {
    rawForAi.cungDetail.push({
        name: lasoData.cungMap[i],
        chi: context.AmLich.DIA_CHI[i],
        sao: lasoData.saoMap[i].map(s => ({
            name: s.name,
            type: s.type,
            nature: s.nature,
            hoa: s.hoa || null,
            luuHoa: s.luuHoa || null
        }))
    });
}
output += JSON.stringify(rawForAi, null, 2);
output += `\n\`\`\`\n`;

console.log(output);
fs.writeFileSync(path.join(__dirname, 'cli_output.md'), output);
process.exit(0);
