/**
 * I Ching Cast Service — Gieo quẻ Kinh Dịch
 * Port từ server/iching/hexagramService.js sang TypeScript
 */

import { getHexagramByBinary, type Hexagram } from './hexagrams';

export interface CastResult {
  hexagramId: number;
  name: string;
  unicode: string;
  description: string;
  lines: number[];
  changingLines: number[];
}

/**
 * Ba đồng xu → giá trị hào
 * 6 = Lão Âm (hào động), 7 = Thiếu Dương, 8 = Thiếu Âm, 9 = Lão Dương (hào động)
 */
function coinToLine(throws: number[]): number {
  const sum = throws.reduce((a, b) => a + b, 0);
  if (sum === 0) return 6; // 3 sấp → Lão Âm
  if (sum === 3) return 9; // 3 ngửa → Lão Dương
  if (sum === 1) return 8; // 1 ngửa → Thiếu Âm
  return 7; // 2 ngửa → Thiếu Dương
}

/**
 * Gieo quẻ Kinh Dịch
 * @param throws 3 (phổ thông) hoặc 6 (nâng cao)
 */
export function castHexagram(throws: number = 3): CastResult {
  const totalLines = 6;
  const lineValues: number[] = [];
  const changing: number[] = [];

  for (let i = 0; i < totalLines; i++) {
    // Tung 3 đồng xu
    const three = [
      Math.round(Math.random()),
      Math.round(Math.random()),
      Math.round(Math.random()),
    ];
    const line = coinToLine(three);
    lineValues.unshift(line); // hào 1 ở dưới cùng
    if (line === 6 || line === 9) {
      changing.push(i); // index hào động
    }
  }

  // Chuyển thành binary (yang=1, yin=0)
  const binary = lineValues
    .map((l) => (l === 7 || l === 9 ? 1 : 0))
    .reverse();
  const index = parseInt(binary.join(''), 2);

  const hex = getHexagramByBinary(index);
  if (!hex) {
    throw new Error('Không tìm thấy quẻ cho index ' + index);
  }

  return {
    hexagramId: hex.id,
    name: hex.name,
    unicode: hex.unicode,
    description: hex.judgment,
    lines: lineValues,
    changingLines: changing,
  };
}
