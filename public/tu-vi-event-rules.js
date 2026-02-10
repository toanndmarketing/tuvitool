/**
 * ============================================
 * TỬ VI EVENT RULES - Quy tắc nhận diện sự kiện
 * 26 rules × 4 categories
 * ============================================
 */

const TuViEventRules = (function () {
    'use strict';

    // =====================
    // CATEGORIES
    // =====================

    const CATEGORIES = {
        realty_spiritual: {
            id: 'realty_spiritual',
            name: 'Địa Ốc & Âm Phần',
            icon: '🏠',
            color: '#8B4513',
            priority: 1 // Hiển thị trước
        },
        health: {
            id: 'health',
            name: 'Sức Khỏe & Thân Thể',
            icon: '🏥',
            color: '#DC143C',
            priority: 2
        },
        relationship_conflict: {
            id: 'relationship_conflict',
            name: 'Quan Hệ & Thị Phi',
            icon: '⚖️',
            color: '#4169E1',
            priority: 3
        },
        celebration: {
            id: 'celebration',
            name: 'Hỷ Tín & Vận May',
            icon: '🎉',
            color: '#FFD700',
            priority: 4
        }
    };

    // =====================
    // NHÓM ĐỊA ỐC & ÂM PHẦN (RS01 - RS07)
    // =====================

    const REALTY_SPIRITUAL_RULES = [
        {
            id: 'RS01',
            category: 'realty_spiritual',
            name: 'Sửa nhà / Xây nhà',
            focusHouses: ['ĐIỀN TRẠCH'],
            fixedStars: {
                // Cần ít nhất 1 group match
                groups: [
                    { stars: ['Thiên Phủ', 'Thái Âm'], nature: 'cat', minMatch: 1 },
                    { stars: ['Liêm Trinh', 'Phá Quân'], nature: 'hung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Thiên Mã', 'Lưu Lộc Tồn'],
            dynamicMinMatch: 1,
            threshold: 4,
            intensity: 7,
            severity: 'important',
            templateKey: 'RS01'
        },
        {
            id: 'RS02',
            category: 'realty_spiritual',
            name: 'Mua đất / Bất động sản',
            focusHouses: ['ĐIỀN TRẠCH', 'TÀI BẠCH'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Phủ', 'Lộc Tồn'], nature: 'cat', minMatch: 2 },
                    { stars: ['Vũ Khúc', 'Tham Lang'], nature: 'cat', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Lộc Tồn'],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'ĐIỀN TRẠCH', hoa: 'Lộc', type: 'any' }, // Hoá Lộc hoặc Lưu Hoá Lộc chiếu Điền
            threshold: 5,
            intensity: 8,
            severity: 'important',
            templateKey: 'RS02'
        },
        {
            id: 'RS03',
            category: 'realty_spiritual',
            name: 'Động mồ mả / Phần mộ bất ổn',
            focusHouses: ['PHÚC ĐỨC'],
            fixedStars: {
                groups: [
                    { stars: ['Tang Môn', 'Điếu Khách'], nature: 'hung', minMatch: 2 },
                    { stars: ['Thiên Khốc', 'Thiên Hư'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Thái Tuế'],
            dynamicMinMatch: 0,
            checkXungChieu: true, // Check cả cung đối chiếu Phúc Đức
            threshold: 4,
            intensity: 9,
            severity: 'critical',
            templateKey: 'RS03'
        },
        {
            id: 'RS04',
            category: 'realty_spiritual',
            name: 'Thờ cúng / Lập bàn thờ',
            focusHouses: ['PHÚC ĐỨC', 'ĐIỀN TRẠCH'],
            fixedStars: {
                groups: [
                    { stars: ['Hỷ Thần', 'Thiên Phúc', 'Tấu Thư'], nature: 'cat', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'PHÚC ĐỨC', hoa: 'Khoa', type: 'any' },
            threshold: 4,
            intensity: 6,
            severity: 'info',
            templateKey: 'RS04'
        },
        {
            id: 'RS05',
            category: 'realty_spiritual',
            name: 'Di dời / Thay đổi bàn thờ',
            focusHouses: ['PHÚC ĐỨC', 'THIÊN DI'],
            fixedStars: {
                groups: [
                    { stars: ['Cô Thần', 'Quả Tú', 'Phá Quân'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Thái Tuế'],
            dynamicMinMatch: 0,
            threshold: 4,
            intensity: 8,
            severity: 'important',
            templateKey: 'RS05'
        },
        {
            id: 'RS06',
            category: 'realty_spiritual',
            name: 'Mộ phần không yên / Vận tâm linh',
            focusHouses: ['PHÚC ĐỨC'],
            fixedStars: {
                groups: [
                    { stars: ['Liêm Trinh', 'Thiên Hình', 'Bạch Hổ'], nature: 'hung', minMatch: 2 },
                    { stars: ['Tang Môn', 'Bạch Hổ', 'Thiên Khốc'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Kình Dương'],
            dynamicMinMatch: 0,
            checkXungChieu: true,
            threshold: 4,
            intensity: 9,
            severity: 'critical',
            templateKey: 'RS06'
        },
        {
            id: 'RS07',
            category: 'realty_spiritual',
            name: 'Gia sản / Thừa kế',
            focusHouses: ['ĐIỀN TRẠCH', 'PHÚC ĐỨC'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Phủ', 'Tử Vi'], nature: 'cat', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Thiên Mã', 'Lưu Lộc Tồn'],
            dynamicMinMatch: 1,
            hoaCheck: { house: 'ĐIỀN TRẠCH', hoa: 'Lộc', type: 'any' },
            threshold: 5,
            intensity: 7,
            severity: 'important',
            templateKey: 'RS07'
        }
    ];

    // =====================
    // NHÓM SỨC KHỎE (H01 - H07)
    // =====================

    const HEALTH_RULES = [
        {
            id: 'H01',
            category: 'health',
            name: 'Tai nạn chân tay / Gãy xương',
            focusHouses: ['TẬT ÁCH', 'MỆNH'],
            fixedStars: {
                groups: [
                    { stars: ['Kình Dương', 'Đà La'], nature: 'hung', minMatch: 1 },
                    { stars: ['Thất Sát', 'Phá Quân'], nature: 'hung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Kình Dương', 'Lưu Đà La'],
            dynamicMinMatch: 1,
            checkXungChieu: true,
            threshold: 4,
            intensity: 9,
            severity: 'critical',
            templateKey: 'H01'
        },
        {
            id: 'H02',
            category: 'health',
            name: 'Mổ xẻ / Phẫu thuật',
            focusHouses: ['TẬT ÁCH'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Hình', 'Bạch Hổ', 'Kình Dương'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Thiên Mã'],
            dynamicMinMatch: 0,
            threshold: 4,
            intensity: 8,
            severity: 'critical',
            templateKey: 'H02'
        },
        {
            id: 'H03',
            category: 'health',
            name: 'Bệnh máu huyết / Tim mạch',
            focusHouses: ['TẬT ÁCH'],
            fixedStars: {
                groups: [
                    { stars: ['Liêm Trinh', 'Thất Sát'], nature: 'hung', minMatch: 2 },
                    { stars: ['Tham Lang', 'Hoả Tinh'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'TẬT ÁCH', hoa: 'Kỵ', type: 'any' },
            threshold: 5,
            intensity: 8,
            severity: 'critical',
            templateKey: 'H03'
        },
        {
            id: 'H04',
            category: 'health',
            name: 'Thị lực / Mắt',
            focusHouses: ['TẬT ÁCH'],
            fixedStars: {
                groups: [
                    { stars: ['Thái Dương'], nature: 'cat', minMatch: 1, requireHam: true },
                    { stars: ['Thái Dương', 'Hoả Tinh'], nature: 'mixed', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { starName: 'Thái Dương', hoa: 'Kỵ', type: 'specific' }, // Thái Dương Hoá Kỵ
            threshold: 3,
            intensity: 7,
            severity: 'important',
            templateKey: 'H04'
        },
        {
            id: 'H05',
            category: 'health',
            name: 'Va chạm / Xây xước nhẹ',
            focusHouses: ['TẬT ÁCH'],
            fixedStars: {
                groups: [
                    { stars: ['Hoả Tinh', 'Linh Tinh'], nature: 'hung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Kình Dương'],
            dynamicMinMatch: 0,
            threshold: 2,
            intensity: 5,
            severity: 'info',
            templateKey: 'H05'
        },
        {
            id: 'H06',
            category: 'health',
            name: 'U bướu / Thận / Bệnh nặng',
            focusHouses: ['TẬT ÁCH'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Cơ'], nature: 'cat', minMatch: 1 },
                    { stars: ['Cự Môn'], nature: 'trung', minMatch: 1 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'TẬT ÁCH', hoa: 'Kỵ', type: 'any' }, // Cần Hoá Kỵ tại Tật
            requireHoaMatch: true, // BẮT BUỘC có Hoá Kỵ mới fire
            threshold: 5,
            intensity: 9,
            severity: 'critical',
            templateKey: 'H06'
        },
        {
            id: 'H07',
            category: 'health',
            name: 'Stress / Tinh thần bất ổn',
            focusHouses: ['TẬT ÁCH', 'MỆNH'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Đồng', 'Thiên Lương'], nature: 'cat', minMatch: 2, requireHam: true },
                    { stars: ['Cự Môn', 'Đà La'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            threshold: 4,
            intensity: 6,
            severity: 'important',
            templateKey: 'H07'
        }
    ];

    // =====================
    // NHÓM QUAN HỆ & THỊ PHI (RC01 - RC06)
    // =====================

    const RELATIONSHIP_RULES = [
        {
            id: 'RC01',
            category: 'relationship_conflict',
            name: 'Kiện tụng / Pháp lý',
            focusHouses: ['QUAN LỘC', 'NÔ BỘC'],
            fixedStars: {
                groups: [
                    { stars: ['Cự Môn'], nature: 'trung', minMatch: 1 },
                    { stars: ['Thiên Hình', 'Quan Phủ'], nature: 'hung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Đà La'],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'QUAN LỘC', hoa: 'Kỵ', type: 'any' },
            threshold: 4,
            intensity: 9,
            severity: 'critical',
            templateKey: 'RC01'
        },
        {
            id: 'RC02',
            category: 'relationship_conflict',
            name: 'Tranh chấp đất đai',
            focusHouses: ['ĐIỀN TRẠCH', 'QUAN LỘC'],
            fixedStars: {
                groups: [
                    { stars: ['Phá Quân'], nature: 'trung', minMatch: 1 },
                    { stars: ['Cự Môn'], nature: 'trung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Thái Tuế', 'Lưu Kình Dương'],
            dynamicMinMatch: 1,
            hoaCheck: { house: 'ĐIỀN TRẠCH', hoa: 'Kỵ', type: 'any' },
            checkXungChieu: true,
            threshold: 4,
            intensity: 9,
            severity: 'critical',
            templateKey: 'RC02'
        },
        {
            id: 'RC03',
            category: 'relationship_conflict',
            name: 'Thị phi công sở',
            focusHouses: ['QUAN LỘC', 'NÔ BỘC'],
            fixedStars: {
                groups: [
                    { stars: ['Cự Môn', 'Đà La'], nature: 'hung', minMatch: 2 },
                    { stars: ['Thiên Hình', 'Phá Quân'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'QUAN LỘC', hoa: 'Kỵ', type: 'luu' }, // Lưu Hoá Kỵ
            threshold: 4,
            intensity: 7,
            severity: 'important',
            templateKey: 'RC03'
        },
        {
            id: 'RC04',
            category: 'relationship_conflict',
            name: 'Thay đổi cộng sự / Đối tác',
            focusHouses: ['NÔ BỘC', 'QUAN LỘC'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Mã', 'Phá Quân'], nature: 'mixed', minMatch: 2 },
                    { stars: ['Liêm Trinh', 'Thiên Hình'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Thiên Mã'],
            dynamicMinMatch: 0,
            checkXungChieu: true,
            threshold: 4,
            intensity: 7,
            severity: 'important',
            templateKey: 'RC04'
        },
        {
            id: 'RC05',
            category: 'relationship_conflict',
            name: 'Bội phản / Lừa đảo',
            focusHouses: ['NÔ BỘC'],
            fixedStars: {
                groups: [
                    { stars: ['Liêm Trinh', 'Tham Lang'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'NÔ BỘC', hoa: 'Kỵ', type: 'any' },
            requireHoaMatch: true,
            threshold: 5,
            intensity: 8,
            severity: 'critical',
            templateKey: 'RC05'
        },
        {
            id: 'RC06',
            category: 'relationship_conflict',
            name: 'Tai tiếng / Scandal',
            focusHouses: ['MỆNH', 'QUAN LỘC'],
            fixedStars: {
                groups: [
                    { stars: ['Cự Môn', 'Đào Hoa'], nature: 'mixed', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { starName: 'Cự Môn', hoa: 'Kỵ', type: 'specific' },
            threshold: 4,
            intensity: 8,
            severity: 'critical',
            templateKey: 'RC06'
        }
    ];

    // =====================
    // NHÓM HỶ TÍN (C01 - C06)
    // =====================

    const CELEBRATION_RULES = [
        {
            id: 'C01',
            category: 'celebration',
            name: 'Cưới hỏi / Hỷ sự tình cảm',
            focusHouses: ['PHU THÊ', 'MỆNH'],
            fixedStars: {
                groups: [
                    { stars: ['Hồng Loan', 'Thiên Hỷ'], nature: 'cat', minMatch: 1 },
                    { stars: ['Đào Hoa', 'Tả Phụ', 'Hữu Bật'], nature: 'cat', minMatch: 2 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            checkXungChieu: true,
            threshold: 3,
            intensity: 8,
            severity: 'important',
            templateKey: 'C01',
            isPositive: true
        },
        {
            id: 'C02',
            category: 'celebration',
            name: 'Sinh con / Đường con cái',
            focusHouses: ['TỬ TỨC'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Đồng', 'Thái Âm'], nature: 'cat', minMatch: 1, requireMieu: true },
                    { stars: ['Thai Phụ', 'Tả Phụ'], nature: 'cat', minMatch: 1 }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'TỬ TỨC', hoa: 'Lộc', type: 'any' },
            threshold: 3,
            intensity: 8,
            severity: 'important',
            templateKey: 'C02',
            isPositive: true
        },
        {
            id: 'C03',
            category: 'celebration',
            name: 'Mua xe / Phương tiện',
            focusHouses: ['TÀI BẠCH', 'ĐIỀN TRẠCH'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Mã', 'Lộc Tồn'], nature: 'cat', minMatch: 2 },
                    { stars: ['Vũ Khúc'], nature: 'trung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Thiên Mã', 'Lưu Lộc Tồn'],
            dynamicMinMatch: 1,
            hoaCheck: { starName: 'Vũ Khúc', hoa: 'Lộc', type: 'specific' },
            threshold: 4,
            intensity: 6,
            severity: 'info',
            templateKey: 'C03',
            isPositive: true
        },
        {
            id: 'C04',
            category: 'celebration',
            name: 'Thăng tiến / Đề bạt',
            focusHouses: ['QUAN LỘC'],
            fixedStars: {
                groups: [
                    { stars: ['Tử Vi'], nature: 'cat', minMatch: 1 },
                    { stars: ['Thái Dương'], nature: 'cat', minMatch: 1, requireMieu: true }
                ]
            },
            dynamicStars: [],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'QUAN LỘC', hoa: 'Quyền', type: 'any' },
            checkXungChieu: true,
            threshold: 3,
            intensity: 8,
            severity: 'important',
            templateKey: 'C04',
            isPositive: true
        },
        {
            id: 'C05',
            category: 'celebration',
            name: 'Tài lộc bất ngờ',
            focusHouses: ['TÀI BẠCH'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Mã', 'Lộc Tồn'], nature: 'cat', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Lộc Tồn'],
            dynamicMinMatch: 0,
            hoaCheck: { house: 'TÀI BẠCH', hoa: 'Lộc', type: 'any' },
            songLocCheck: true, // Check Song Lộc
            threshold: 5,
            intensity: 7,
            severity: 'important',
            templateKey: 'C05',
            isPositive: true
        },
        {
            id: 'C06',
            category: 'celebration',
            name: 'Du lịch / Công tác xa',
            focusHouses: ['THIÊN DI'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Mã'], nature: 'cat', minMatch: 1 },
                    { stars: ['Tả Phụ', 'Hữu Bật'], nature: 'cat', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Thiên Mã'],
            dynamicMinMatch: 1,
            hoaCheck: { house: 'THIÊN DI', hoa: 'Lộc', type: 'any' },
            threshold: 3,
            intensity: 5,
            severity: 'info',
            templateKey: 'C06',
            isPositive: true
        }
    ];

    // =====================
    // NHÓM BỔ SUNG - RULES SỬ DỤNG SAO LƯU MỚI
    // =====================

    const EXTRA_RULES = [
        {
            id: 'H08',
            category: 'health',
            name: 'Tang chế / Buồn phiền lưu niên',
            focusHouses: ['PHỤ MẪU', 'PHÚC ĐỨC'],
            fixedStars: {
                groups: [
                    { stars: ['Tang Môn', 'Bạch Hổ'], nature: 'hung', minMatch: 1 },
                    { stars: ['Thiên Khốc', 'Thiên Hư'], nature: 'hung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Tang Môn', 'Lưu Bạch Hổ', 'Lưu Điếu Khách'],
            dynamicMinMatch: 1,
            threshold: 4,
            intensity: 9,
            severity: 'critical',
            templateKey: 'H08'
        },
        {
            id: 'H09',
            category: 'health',
            name: 'Tai nạn va chạm lưu niên',
            focusHouses: ['TẬT ÁCH', 'MỆNH'],
            fixedStars: {
                groups: [
                    { stars: ['Kình Dương', 'Đà La', 'Thất Sát'], nature: 'hung', minMatch: 1 },
                    { stars: ['Hoả Tinh', 'Linh Tinh'], nature: 'hung', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Hoả Tinh', 'Lưu Linh Tinh', 'Lưu Kình Dương', 'Lưu Bạch Hổ'],
            dynamicMinMatch: 1,
            checkXungChieu: true,
            threshold: 4,
            intensity: 8,
            severity: 'critical',
            templateKey: 'H09'
        },
        {
            id: 'C07',
            category: 'celebration',
            name: 'Duyên hôn nhân lưu niên',
            focusHouses: ['PHU THÊ', 'MỆNH'],
            fixedStars: {
                groups: [
                    { stars: ['Hồng Loan', 'Thiên Hỷ', 'Đào Hoa'], nature: 'cat', minMatch: 1 },
                    { stars: ['Tả Phụ', 'Hữu Bật'], nature: 'cat', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Hồng Loan', 'Lưu Thiên Hỷ', 'Lưu Đào Hoa'],
            dynamicMinMatch: 1,
            threshold: 3,
            intensity: 7,
            severity: 'important',
            templateKey: 'C07',
            isPositive: true
        },
        {
            id: 'C08',
            category: 'celebration',
            name: 'Tin vui / Hỉ sự bất ngờ',
            focusHouses: ['MỆNH', 'THIÊN DI'],
            fixedStars: {
                groups: [
                    { stars: ['Thiên Phúc', 'Long Trì', 'Phượng Các'], nature: 'cat', minMatch: 1 }
                ]
            },
            dynamicStars: ['Lưu Thiên Hỷ', 'Lưu Hồng Loan'],
            dynamicMinMatch: 1,
            hoaCheck: { house: 'MỆNH', hoa: 'Lộc', type: 'luu' },
            threshold: 3,
            intensity: 6,
            severity: 'info',
            templateKey: 'C08',
            isPositive: true
        },
        {
            id: 'RC07',
            category: 'health',
            name: 'Sức khỏe cha mẹ / Người thân',
            focusHouses: ['PHỤ MẪU'],
            fixedStars: {
                groups: [
                    { stars: ['Thái Dương', 'Thái Âm'], nature: 'cat', minMatch: 1, requireHam: true },
                    { stars: ['Tang Môn', 'Điếu Khách', 'Bạch Hổ'], nature: 'hung', minMatch: 2 }
                ]
            },
            dynamicStars: ['Lưu Tang Môn', 'Lưu Bạch Hổ'],
            dynamicMinMatch: 1,
            checkXungChieu: true,
            threshold: 4,
            intensity: 8,
            severity: 'critical',
            templateKey: 'RC07'
        }
    ];

    // =====================
    // TỔNG HỢP TẤT CẢ RULES
    // =====================

    const ALL_RULES = [
        ...REALTY_SPIRITUAL_RULES,
        ...HEALTH_RULES,
        ...RELATIONSHIP_RULES,
        ...CELEBRATION_RULES,
        ...EXTRA_RULES
    ];

    // =====================
    // THRESHOLD CONFIG
    // =====================

    const THRESHOLD_CONFIG = {
        // Score >= threshold → fire event
        // Score tính từ: fixedStars match + dynamicStars match + hoá match + xung chiếu bonus
        FIXED_STAR_WEIGHT: 2.0,      // Mỗi fixed star match = +2
        DYNAMIC_STAR_WEIGHT: 1.5,    // Mỗi dynamic star match = +1.5
        HOA_MATCH_WEIGHT: 3.0,       // Hoá đúng = +3
        XUNG_CHIEU_MULTIPLIER: 0.6,  // Score từ cung đối chiếu × 0.6
        TAM_HOP_MULTIPLIER: 0.4,     // Score từ tam hợp × 0.4
        DAI_VAN_BONUS: 1.5,          // Bonus nếu Đại Vận đi qua focus house
        TIEU_VAN_BONUS: 1.0,         // Bonus nếu Tiểu Vận đi qua focus house
        LUU_TU_HOA_BONUS: 2.0        // Bonus nếu Lưu Tứ Hoá rơi vào focus house
    };

    // =====================
    // EXPORTS
    // =====================

    return {
        CATEGORIES,
        ALL_RULES,
        REALTY_SPIRITUAL_RULES,
        HEALTH_RULES,
        RELATIONSHIP_RULES,
        CELEBRATION_RULES,
        EXTRA_RULES,
        THRESHOLD_CONFIG
    };
})();
