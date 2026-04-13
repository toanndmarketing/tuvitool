
const AmLich = require('./public/am-lich.js');
const TuViCalc = require('./public/tu-vi-calc.js');

const jd = AmLich.lunarToSolarJd(13, 12, 1990, 0);
const solar = AmLich.jdToDate(jd);

const laso = TuViCalc.calculate({
    ngay: solar[0],
    thang: solar[1],
    nam: solar[2],
    gioSinh: 6,
    gioiTinh: 'nam',
    namXem: 2024
});

console.log('--- DAI VAN ---');
laso.daiVan.forEach(dv => {
    console.log(`Cung index ${dv.cungPos}: ${dv.tuoiFrom}-${dv.tuoiTo}`);
});

console.log('\n--- TRANG SINH ---');
for(let i=0; i<12; i++) {
    console.log(`Cung index ${i}: ${laso.truongSinhMap[i]}`);
}
