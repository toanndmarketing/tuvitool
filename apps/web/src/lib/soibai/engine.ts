/**
 * ============================================
 * SOI BÀI 52 LÁ — Engine TypeScript
 * Port từ server/soi-bai/* sang TypeScript module
 * ============================================
 */

// ===== TYPES =====
export interface Card {
  id: string;
  rank: string;
  rankValue: number;
  rankLabel: string;
  suit: string;
  suitSymbol: string;
  suitWeight: number;
  element: string;
  color: 'red' | 'black';
  depthLayer: string;
}

export interface CardWithMeaning extends Card {
  interpretation: {
    suitInfo: { name: string; keyword: string; element: string; description: string };
    meaning: string;
    depth: string;
  };
}

export interface ScanResult {
  title: string;
  icon: string;
  results: string[];
  score: number;
}

export interface ComboDetected {
  name: string;
  description: string;
  severity: string;
}

export interface SoiBaiResult {
  timestamp: string;
  user_info: { name: string; year: string; gender: string };
  authentication: {
    seed_hash: string;
    time_lock: string;
    is_time_locked: boolean;
    hint: string;
  };
  cards_drawn: CardWithMeaning[];
  scan_summary: {
    verdict: string;
    overall_score: number;
    confidence: number;
  };
  compatibility: {
    person_name: string;
    person_element: string;
    land_dominant_element: string;
    result_type: string;
    description: string;
  } | null;
  detailed_analysis: {
    physicalSoil: ScanResult;
    ancestralGrave: ScanResult;
    entityDetection: ScanResult;
    riskOpportunity: ScanResult;
  };
  combos_detected: ComboDetected[];
  remedy_suggestion: string[];
}

// ===== CONSTANTS =====
const SUITS = [
  { name: 'Bích', symbol: '♠', color: 'black' as const, element: 'Thổ / Âm', weight: 10 },
  { name: 'Chuồn', symbol: '♣', weight: 5, element: 'Mộc', color: 'black' as const },
  { name: 'Cơ', symbol: '♥', weight: 10, element: 'Thủy', color: 'red' as const },
  { name: 'Rô', symbol: '♦', weight: 10, element: 'Kim', color: 'red' as const },
];

const RANKS = [
  { name: 'A', value: 14, label: 'Ace' },
  { name: '2', value: 2, label: '2' },
  { name: '3', value: 3, label: '3' },
  { name: '4', value: 4, label: '4' },
  { name: '5', value: 5, label: '5' },
  { name: '6', value: 6, label: '6' },
  { name: '7', value: 7, label: '7' },
  { name: '8', value: 8, label: '8' },
  { name: '9', value: 9, label: '9' },
  { name: '10', value: 10, label: '10' },
  { name: 'J', value: 11, label: 'Jack' },
  { name: 'Q', value: 12, label: 'Queen' },
  { name: 'K', value: 13, label: 'King' },
];

// ===== DECODING TABLE =====
const SUIT_MEANINGS: Record<string, { name: string; keyword: string; element: string; description: string }> = {
  'Bích': { name: 'Bích (♠) - Âm Khí', keyword: 'Mồ mả, đất nghịch, âm khí cao', element: 'Thổ / Âm', description: 'Đại diện cho đất đai, mồ mả, năng lượng của những người đã khuất hoặc âm khí đang tồn tại.' },
  'Chuồn': { name: 'Chuồn (♣) - Biến Động', keyword: 'Rễ cây, sụt lún, tranh chấp', element: 'Mộc', description: 'Đại diện cho thực vật, rễ cây đâm sâu, hoặc các chuyển động cơ học ngầm dưới lòng đất.' },
  'Cơ': { name: 'Cơ (♥) - Sinh Khí', keyword: 'Mạch nước, sinh lực, đạo đức gia môn', element: 'Thủy', description: 'Đại diện cho mạch nước ngầm, độ ẩm, sinh khí và các mối quan hệ tình cảm của người sống trên đất.' },
  'Rô': { name: 'Rô (♦) - Tài Lộc', keyword: 'Vật cứng dưới đất, tiền bạc', element: 'Kim', description: 'Đại diện cho kim loại, đá tảng, phế tích cổ hoặc các giá trị vật chất tiềm ẩn dưới lòng đất.' },
};

const FACE_CARDS_MEANING: Record<string, string> = {
  'J-Bích': 'Vong lính gác mộ hoặc người quản gia đã khuất cực kỳ nghiêm khắc.',
  'Q-Bích': 'Bà cô tổ hoặc nữ vong linh cai quản khu vực này.',
  'K-Bích': 'Thổ công, Thần đất, ông tổ.',
  'J-Chuồn': 'Rễ cây trẻ (tơ) đang phát triển mạnh, cần lưu ý tương lai.',
  'Q-Chuồn': 'Cây đại thụ mẹ, hệ rễ đã bao trùm diện rộng.',
  'K-Chuồn': 'Rừng rễ cây lâu năm, có thể đã đâm vào móng/mộ.',
  'J-Cơ': 'Mạch nước nhỏ hoặc dòng nước thay đổi theo mùa.',
  'Q-Cơ': 'Dòng sông ngầm hoặc hồ chứa nước bên dưới.',
  'K-Cơ': 'Long mạch chính đang tụ khí, cực tốt cho việc cầu tự.',
  'J-Rô': 'Phế tích kim loại vụn hoặc đá nhỏ rải rác.',
  'Q-Rô': 'Tài sản quý hoặc vật dụng giá trị của tiền nhân để lại.',
  'K-Rô': 'Mỏ khoáng sản hoặc nền móng cung điện/đền đài cổ.',
};

const ACE_MEANING: Record<string, string> = {
  'Bích': 'Huyệt mộ cổ lâu năm, năng lượng cực kỳ lạnh.',
  'Chuồn': 'Gốc cây tổ ngàn năm giữ linh khí cho vùng đất.',
  'Cơ': 'Dòng mạch nước thiêng, được ví như cam lộ.',
  'Rô': 'Vàng bạc, ngọc ngà tích tụ từ linh khí đất trời.',
};

// ===== DECK ENGINE =====
function createDeck(): Card[] {
  const deck: Card[] = [];
  SUITS.forEach((suit) => {
    RANKS.forEach((rank) => {
      let depthLayer = '';
      if (rank.value === 14) depthLayer = 'Nguyên tố gốc (Năng lượng cực mạnh)';
      else if (rank.value >= 2 && rank.value <= 5) depthLayer = 'Bề mặt (0m - 1m)';
      else if (rank.value >= 6 && rank.value <= 9) depthLayer = 'Tầng sâu (1m - 3m)';
      else depthLayer = 'Tầng tâm linh (Năng lượng vô hình)';

      deck.push({
        id: `${rank.name}-${suit.name}`,
        rank: rank.name,
        rankValue: rank.value,
        rankLabel: rank.label,
        suit: suit.name,
        suitSymbol: suit.symbol,
        suitWeight: suit.weight,
        element: suit.element,
        color: suit.color,
        depthLayer,
      });
    });
  });
  return deck;
}

// Simple seedrandom (mulberry32)
function seedRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return function () {
    h |= 0; h = h + 0x6D2B79F5 | 0;
    let t = Math.imul(h ^ h >>> 15, 1 | h);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function shuffle(deck: Card[], seedString: string | null): Card[] {
  const rng = seedString ? seedRandom(seedString) : Math.random;
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function drawCards(count: number = 9, seedString: string | null = null): Card[] {
  const deck = createDeck();
  return shuffle(deck, seedString).slice(0, count);
}

// ===== CARD MEANING =====
function getCardMeaning(card: Card) {
  const key = `${card.rank}-${card.suit}`;
  let meaning = '';
  if (['J', 'Q', 'K'].includes(card.rank)) {
    meaning = FACE_CARDS_MEANING[key] || '';
  } else if (card.rank === 'A') {
    meaning = ACE_MEANING[card.suit] || '';
  } else {
    const intensity = card.rankValue > 5 ? 'Sâu' : 'Nông';
    meaning = `${intensity} - Tác động vào ${SUIT_MEANINGS[card.suit].keyword.toLowerCase()}.`;
  }
  return {
    suitInfo: SUIT_MEANINGS[card.suit],
    meaning,
    depth: card.depthLayer,
  };
}

// ===== SCANNER ENGINE =====
function scanPhysicalSoil(cards: Card[]): ScanResult {
  const roCards = cards.filter((c) => c.suit === 'Rô');
  const coCards = cards.filter((c) => c.suit === 'Cơ');
  let ratio = 0;
  roCards.forEach((c) => (ratio += c.rankValue));
  coCards.forEach((c) => (ratio -= c.rankValue / 2));
  const verdict = ratio > 10 ? 'Đất khô ráo, có nhiều đá tảng/kim loại bên dưới.' :
    ratio < -5 ? 'Đất ẩm ướt, mạch nước ngầm dồi dào.' :
      'Đất cân bằng giữa Kim (đá) và Thủy (nước).';
  return {
    title: 'Soi Địa Tầng (Physical Soil Scan)', icon: '🌍',
    results: [verdict, `Tìm thấy ${roCards.length} lá Kim (Rô) báo hiệu vật cứng hoặc đá tảng.`, `Tìm thấy ${coCards.length} lá Thủy (Cơ) báo hiệu mạch nước ngầm.`],
    score: ratio,
  };
}

function scanAncestralGrave(cards: Card[]): ScanResult {
  const bich = cards.filter((c) => c.suit === 'Bích');
  const chuon = cards.filter((c) => c.suit === 'Chuồn');
  const w = bich.length * 20 + chuon.length * 10;
  let status = 'Thanh thản, mộ phần yên ổn.';
  if (w > 50) status = 'Mồ mả đang bị động mạnh, cần chú ý gốc rễ cây hoặc sụt lún.';
  else if (w > 25) status = 'Mồ mả ở mức trung bình, có chút huyên náo của âm khí.';
  return {
    title: 'Soi Mồ Mả & Hài Cốt (Ancestral Grave)', icon: '🕯️',
    results: [status, `Phát hiện ${bich.length} lá Âm (Bích) thể hiện sự tồn tại của mộ phần.`, `Phát hiện ${chuon.length} lá Mộc (Chuồn) thể hiện sự xâm lấn của rễ cây.`],
    score: w,
  };
}

function scanEntityDetection(cards: Card[]): ScanResult {
  const heads = cards.filter((c) => ['J', 'Q', 'K'].includes(c.rank));
  const entities = heads.map((c) => {
    const n = c.rank === 'J' ? 'Lính/Vong tiền chủ' : c.rank === 'Q' ? 'Bà Cô Tổ/Nữ thần đất' : 'Thổ Địa/Thần Linh/Vua Đất';
    return `${n} (${c.suit})`;
  });
  const red = cards.filter((c) => ['Cơ', 'Rô'].includes(c.suit)).length;
  const black = cards.filter((c) => ['Bích', 'Chuồn'].includes(c.suit)).length;
  const reaction = red > black ? 'Thái độ: Hoan hỉ, đồng thuận, ủng hộ gia chủ.' : 'Thái độ: Nghiêm khắc, có phần quấy phá hoặc chưa bằng lòng.';
  return {
    title: 'Soi Thực Thể Tâm Linh (Entity Detection)', icon: '👻',
    results: [heads.length > 0 ? `Đã phát hiện thực thể quản lý: ${entities.join(', ')}.` : 'Không thấy thực thể mạnh hiển lộ.', reaction],
    score: heads.length * 10,
  };
}

function scanRiskOpportunity(cards: Card[]): ScanResult {
  const red = cards.filter((c) => c.color === 'red').length;
  const black = cards.filter((c) => c.color === 'black').length;
  const ace = cards.filter((c) => c.rank === 'A').length;
  let useCase = 'Đất ở trung bình.';
  if (red > black + 2) useCase = 'Đất cực tốt để kinh doanh, buôn bán phát đạt.';
  else if (black > red + 2) useCase = 'Đất nặng âm khí, chỉ hợp để thờ tự hoặc làm nhà kho, đình chùa.';
  else if (red > black) useCase = 'Đất lành chim đậu, hợp để ở lâu dài, con cái thành đạt.';
  if (ace > 0) useCase += ` Có năng lượng Ace hiển thị (${ace} lá), mảnh đất này có gốc gác linh thiêng hoặc long mạch lớn.`;
  return {
    title: 'Dự báo Cát - Hung (Risk & Opportunity)', icon: '⚖️',
    results: [`Tỷ lệ Đỏ/Đen: ${red}/${black}.`, useCase],
    score: (red - black) * 5 + ace * 15,
  };
}

// ===== COMBO DETECTOR =====
const COMBOS = [
  {
    id: 'dong-mo', name: 'Động Mộ',
    check: (cards: Card[]) => cards.some((c) => c.rank === '7' && c.suit === 'Bích') && cards.some((c) => c.suit === 'Chuồn'),
    description: 'Mồ mả đang trong tình trạng nguy cấp, có thể bị rễ cây xâm hại hoặc biến dạng.',
    severity: 'Cực kỳ nguy hiểm',
  },
  {
    id: 'dat-ket', name: 'Đất Kết (Long mạch)',
    check: (cards: Card[]) => cards.some((c) => c.rank === 'A' && c.suit === 'Cơ') && cards.some((c) => c.rank === 'A' && c.suit === 'Rô'),
    description: 'Đất long mạch cực hiếm, vượng phu ích tử, cầu tài lộc tất thành.',
    severity: 'Đại cát',
  },
  {
    id: 'tranh-chap', name: 'Tranh chấp Vong linh',
    check: (cards: Card[]) => cards.some((c) => c.rank === 'J' && c.suit === 'Bích') && cards.some((c) => c.rank === '7' && c.suit === 'Chuồn'),
    description: 'Có sự tranh giành chủ quyền tâm linh trên đất, âm dương hỗn loạn.',
    severity: 'Nguy hiểm trung bình',
  },
];

function detectCombos(cards: Card[]): ComboDetected[] {
  return COMBOS.filter((c) => c.check(cards)).map((c) => ({ name: c.name, description: c.description, severity: c.severity }));
}

// ===== REMEDY SUGGESTION =====
function generateRemedies(cards: Card[], combos: ComboDetected[]): string[] {
  const remedies: string[] = [];
  combos.forEach((combo) => {
    if (combo.name === 'Động Mộ') {
      remedies.push('Mở rộng huyệt mộ, rào chắn móng, di dời rễ cây gốc hoặc bồi đắp lại đất bị sụt lún.');
      remedies.push('Làm lễ tạ mộ và xin lỗi tiền nhân, mời thầy cạo rễ nếu đã xâm nhập sâu.');
    } else if (combo.name === 'Tranh chấp Vong linh') {
      remedies.push('Lập đàn cầu siêu cho những linh hồn còn lưu lạc trên đất, tạ lễ Thổ Địa để phân định ranh giới.');
    } else if (combo.name === 'Đất Kết (Long mạch)') {
      remedies.push('Giữ nguyên hiện trạng, không được đào xới bừa bãi hoặc xây dựng phá vỡ cảnh quan linh thiêng.');
    }
  });
  const counts: Record<string, number> = { Bích: 0, Chuồn: 0, Cơ: 0, Rô: 0 };
  cards.forEach((c) => counts[c.suit]++);
  if (counts['Bích'] >= 3) remedies.push('Âm khí đất này quá nặng. Nên đặt các linh vật bằng đồng (Kim khắc Thổ/Âm), hoặc thường xuyên thắp hương bái tạ.');
  if (counts['Chuồn'] >= 3) remedies.push('Cẩn thận các rễ cây lớn gần móng hoặc mồ mả, nên xử lý triệt để các góc sụt lún.');
  if (counts['Cơ'] >= 3) remedies.push('Cần xử lý thoát nước tốt, nếu là mạch đào sâu nên gia cố móng bằng bê tông cường độ cao.');
  if (remedies.length === 0) remedies.push('Đất rạng ngời sinh khí, chỉ cần tạ ơn Thổ Địa hàng quý là đủ.');
  return [...new Set(remedies)];
}

// ===== NGŨ HÀNH =====
function getNguHanh(year: number): string {
  const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
  const CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];
  const canW: Record<string, number> = { 'Giáp': 1, 'Ất': 1, 'Bính': 2, 'Đinh': 2, 'Mậu': 3, 'Kỷ': 3, 'Canh': 4, 'Tân': 4, 'Nhâm': 5, 'Quý': 5 };
  const chiW: Record<string, number> = { 'Tý': 0, 'Sửu': 0, 'Ngọ': 0, 'Mùi': 0, 'Dần': 1, 'Mão': 1, 'Thân': 1, 'Dậu': 1, 'Thìn': 2, 'Tỵ': 2, 'Tuất': 2, 'Hợi': 2 };
  const canIdx = (year + 6) % 10;
  const chiIdx = (year + 8) % 12;
  let sum = (canW[CAN[canIdx]] || 0) + (chiW[CHI[chiIdx]] || 0);
  if (sum > 5) sum -= 5;
  const map: Record<number, string> = { 1: 'Kim', 2: 'Thủy', 3: 'Hỏa', 4: 'Thổ', 5: 'Mộc' };
  return map[sum] || 'Thổ';
}

function checkCompatibility(personEl: string, landEl: string) {
  const stdMap: Record<string, string> = { 'Thổ / Âm': 'Thổ', 'Mộc': 'Mộc', 'Thủy': 'Thủy', 'Kim': 'Kim' };
  const target = stdMap[landEl] || landEl;
  const rels: Record<string, { sinh: string; khac: string; duocSinh: string; biKhac: string }> = {
    'Kim': { sinh: 'Thủy', khac: 'Mộc', duocSinh: 'Thổ', biKhac: 'Hỏa' },
    'Thủy': { sinh: 'Mộc', khac: 'Hỏa', duocSinh: 'Kim', biKhac: 'Thổ' },
    'Mộc': { sinh: 'Hỏa', khac: 'Thổ', duocSinh: 'Thủy', biKhac: 'Kim' },
    'Hỏa': { sinh: 'Thổ', khac: 'Kim', duocSinh: 'Mộc', biKhac: 'Thủy' },
    'Thổ': { sinh: 'Kim', khac: 'Thủy', duocSinh: 'Hỏa', biKhac: 'Mộc' },
  };
  const rel = rels[personEl];
  if (!rel) return { type: 'Trung tính', text: 'Năng lượng đất và người không xung đột.' };
  if (target === personEl) return { type: 'Bình hòa', text: 'Đất và người đồng nhất năng lượng, sự nghiệp ổn định.' };
  if (target === rel.sinh) return { type: 'Tiết khí', text: 'Người nuôi dưỡng đất, vất vả nhưng có hậu.' };
  if (target === rel.khac) return { type: 'Chế khắc', text: 'Người làm chủ được đất, mọi việc theo ý mình.' };
  if (target === rel.duocSinh) return { type: 'Tương sinh', text: 'Đất nuôi dưỡng người, cực kỳ hưng vượng, sức khỏe dồi dào.' };
  if (target === rel.biKhac) return { type: 'Tương khắc', text: 'Đất khắc người, dễ hao tổn sinh lực, cần hóa giải.' };
  return { type: 'Trung tính', text: 'Năng lượng đất và người không xung đột.' };
}

// ===== TIME LOCK =====
function getCurrentYearLock() {
  const y = new Date().getFullYear();
  return { name: `Năm ${y}`, period: `01/01/${y} - 31/12/${y}` };
}
function getCurrentMonthLock() {
  const d = new Date(); const m = d.getMonth() + 1; const y = d.getFullYear();
  const last = new Date(y, m, 0).getDate();
  return { name: `Tháng ${m}/${y}`, period: `01/${m}/${y} - ${last}/${m}/${y}` };
}
function getCurrentDayLock() {
  const d = new Date(); const day = d.getDate(); const m = d.getMonth() + 1; const y = d.getFullYear();
  return { name: `Ngày ${day}/${m}/${y}`, period: `00:00 - 23:59 (${day}/${m}/${y})` };
}

function getTopicHint(topic: string): string {
  if (topic === 'entity') return 'Năng lượng Vong Linh & Thực Thể thường lưu động theo Tháng. Quẻ này đã được khóa trong trọn 1 Tháng.';
  if (topic === 'opportunity') return 'Cơ hội Mua Bán hoặc Cát Hung biến ảo theo Ngày. Quẻ này đã được khóa cứng cho hôm nay.';
  return 'Năng lượng đất trạch/mồ mả có tính Tĩnh. Quẻ soi cát hung thường chỉ có giá trị biến chuyển trong vòng 1 năm. Máy chủ đã \'Khóa Quẻ\' theo định luật này.';
}

// ===== ORCHESTRATOR =====
export function performSoiBai(options: {
  count?: number;
  name?: string;
  year?: string;
  gender?: string;
  topic?: string;
}): SoiBaiResult {
  const { count: drawCount, name, year, gender, topic } = options;
  const count = drawCount || 9;

  // Time-Lock Seed
  let currentTimeLock;
  if (topic === 'entity') currentTimeLock = getCurrentMonthLock();
  else if (topic === 'opportunity') currentTimeLock = getCurrentDayLock();
  else currentTimeLock = getCurrentYearLock();

  const cleanName = (name || 'Anonymous').trim().toLowerCase();
  const cleanYear = year || 'Unknown';
  const cleanGender = gender || 'Unknown';
  const seedString = `${cleanName}-${cleanYear}-${cleanGender}-${currentTimeLock.name}`;

  const cards = drawCards(count, seedString);
  const cardsWithMeaning: CardWithMeaning[] = cards.map((c) => ({ ...c, interpretation: getCardMeaning(c) }));

  const analysis = {
    physicalSoil: scanPhysicalSoil(cards),
    ancestralGrave: scanAncestralGrave(cards),
    entityDetection: scanEntityDetection(cards),
    riskOpportunity: scanRiskOpportunity(cards),
  };
  const combos = detectCombos(cards);
  const remedies = generateRemedies(cards, combos);

  // Compatibility
  let compatibility = null;
  if (year) {
    const personEl = getNguHanh(parseInt(year));
    const elCounts: Record<string, number> = {};
    cards.forEach((c) => { elCounts[c.element] = (elCounts[c.element] || 0) + 1; });
    const dominant = Object.entries(elCounts).sort((a, b) => b[1] - a[1])[0][0];
    const comp = checkCompatibility(personEl, dominant);
    compatibility = {
      person_name: name || 'Ẩn danh',
      person_element: personEl,
      land_dominant_element: dominant,
      result_type: comp.type,
      description: comp.text,
    };
  }

  // Overall verdict
  let overallScore = 0;
  Object.values(analysis).forEach((m) => (overallScore += m.score));
  let verdict = 'Trung bình';
  if (overallScore > 30) verdict = 'Đại Cát (Đất cực lành)';
  else if (overallScore > 10) verdict = 'Cát (Đất tốt)';
  else if (overallScore < -20) verdict = 'Hung (Âm khí nặng)';
  else if (overallScore < 0) verdict = 'Bất lợi (Đất nghịch)';

  return {
    timestamp: new Date().toISOString(),
    user_info: { name: name || '', year: year || '', gender: gender || '' },
    authentication: { seed_hash: seedString, time_lock: `${currentTimeLock.name} (${currentTimeLock.period})`, is_time_locked: true, hint: getTopicHint(topic || '') },
    cards_drawn: cardsWithMeaning,
    scan_summary: { verdict, overall_score: overallScore, confidence: 85 },
    compatibility,
    detailed_analysis: analysis,
    combos_detected: combos,
    remedy_suggestion: remedies,
  };
}
