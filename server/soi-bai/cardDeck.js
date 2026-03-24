/**
 * ============================================
 * CARD DECK ENGINE - Module Soi Bài 52 Lá
 * ============================================
 */

const seedrandom = require('seedrandom');

const SUITS = [
    { name: 'Bích', symbol: '♠', color: 'black', element: 'Thổ / Âm', weight: 10 },
    { name: 'Chuồn', symbol: '♣', weight: 5, element: 'Mộc', color: 'black' },
    { name: 'Cơ', symbol: '♥', weight: 10, element: 'Thủy', color: 'red' },
    { name: 'Rô', symbol: '♦', weight: 10, element: 'Kim', color: 'red' }
];

const RANKS = [
    { name: 'A', value: 14, label: 'Ace' },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
    { name: '10', value: 10 },
    { name: 'J', value: 11, label: 'Jack' },
    { name: 'Q', value: 12, label: 'Queen' },
    { name: 'K', value: 13, label: 'King' }
];

function createDeck() {
    const deck = [];
    SUITS.forEach(suit => {
        RANKS.forEach(rank => {
            let depthLayer = '';
            if (rank.value === 14) depthLayer = 'Nguyên tố gốc (Năng lượng cực mạnh)';
            else if (rank.value >= 2 && rank.value <= 5) depthLayer = 'Bề mặt (0m - 1m)';
            else if (rank.value >= 6 && rank.value <= 9) depthLayer = 'Tầng sâu (1m - 3m)';
            else depthLayer = 'Tầng tâm linh (Năng lượng vô hình)';

            deck.push({
                id: `${rank.name}-${suit.name}`,
                rank: rank.name,
                rankValue: rank.value,
                rankLabel: rank.label || rank.name,
                suit: suit.name,
                suitSymbol: suit.symbol,
                suitWeight: suit.weight,
                element: suit.element,
                color: suit.color,
                depthLayer: depthLayer
            });
        });
    });
    return deck;
}

/**
 * Trộn bài bằng thuật toán Fisher-Yates kết hợp PRNG Seed
 */
function shuffle(deck, seedString) {
    const rng = seedString ? seedrandom(seedString) : Math.random;
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Tạo bộ bài, trộn và rút số lượng lá chỉ định
 */
function drawCards(count = 9, seedString = null) {
    const deck = createDeck();
    const shuffledDeck = shuffle(deck, seedString);
    return shuffledDeck.slice(0, count);
}

module.exports = {
    drawCards,
    SUITS,
    RANKS
};
