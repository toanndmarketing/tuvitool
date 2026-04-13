
const AmLich = require('./public/am-lich.js');
const TuViCalc = require('./public/tu-vi-calc.js');

const inputSolar = {
    ngay: 13,
    thang: 12,
    nam: 1990,
    gioSinh: 6, // Giờ Ngọ
    gioiTinh: 'nam',
    namXem: 2024
};

const laso = TuViCalc.calculate(inputSolar);
console.log('Result for Solar 13/12/1990:');
console.log('Lunar Date:', laso.lunarDate.day + '/' + laso.lunarDate.month + '/' + laso.lunarDate.year);
console.log('Cung Menh Pos:', laso.cungMenhPos);
console.log('Cuc Name:', laso.cucName);
console.log('Cuc Value:', laso.cucValue);
console.log('-------------------------');

const inputLunar = {
    ngay: 13,
    thang: 12,
    nam: 1990,
    gioSinh: 6, // Giờ Ngọ
    gioiTinh: 'nam'
};

// If input is Lunar 13/12/1990
// First find solar date for Lunar 13/12/1990
const jd = AmLich.lunarToSolarJd(13, 12, 1990, 0);
const solar = AmLich.jdToDate(jd);
console.log('Lunar 13/12/1990 corresponds to Solar:', solar[0]+'/'+solar[1]+'/'+solar[2]);

const lasoLunar = TuViCalc.calculate({
    ngay: solar[0],
    thang: solar[1],
    nam: solar[2],
    gioSinh: 6,
    gioiTinh: 'nam',
    namXem: 2024
});

console.log('Result for Lunar 13/12/1990:');
console.log('Cung Menh Pos:', lasoLunar.cungMenhPos);
console.log('Cuc Name:', lasoLunar.cucName);
console.log('Cuc Value:', lasoLunar.cucValue);
console.log('Dai Van 1:', lasoLunar.daiVanList[0].tuoiFrom + '-' + lasoLunar.daiVanList[0].tuoiTo);
