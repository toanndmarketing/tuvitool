/**
 * ============================================
 * TỬ VI EVENT SCANNER - Logic Engine
 * Quét lá số → Nhận diện sự kiện → Score → Sort
 * Dependencies: TuViStarPatterns, TuViEventRules, TuViTemplates
 * ============================================
 */

const TuViEventScanner = (function () {
    'use strict';

    // =====================
    // POSITION HELPERS
    // =====================

    /**
     * Tìm vị trí cung theo tên
     * @param {string} houseName - Tên cung (VD: 'MỆNH', 'PHÚC ĐỨC')
     * @param {Object} cungMap - Map từ lasoData.cungMap { pos: name }
     * @returns {number} vị trí cung (0-11) hoặc -1 nếu không tìm thấy
     */
    function findHousePos(houseName, cungMap) {
        for (let i = 0; i < 12; i++) {
            if (cungMap[i] === houseName) return i;
        }
        return -1;
    }

    /**
     * Thu thập tất cả sao liên quan đến 1 cung (bao gồm xung chiếu, tam hợp, giáp)
     * @param {number} pos - Vị trí cung
     * @param {Object} saoMap - Map sao
     * @param {Object} options - { xungChieu, tamHop, giapCung }
     * @returns {Object} { direct: [], xungChieu: [], tamHop: [], giapCung: [] }
     */
    function collectStars(pos, saoMap, options) {
        var result = {
            direct: saoMap[pos] || [],
            xungChieu: [],
            tamHop: [],
            giapCung: []
        };

        if (options && options.xungChieu) {
            var doiPos = TuViStarPatterns.getDoiCung(pos);
            result.xungChieu = saoMap[doiPos] || [];
        }

        if (options && options.tamHop) {
            var tamHopPositions = TuViStarPatterns.getTamHop(pos);
            for (var t = 0; t < tamHopPositions.length; t++) {
                var thStars = saoMap[tamHopPositions[t]] || [];
                for (var s = 0; s < thStars.length; s++) {
                    result.tamHop.push(thStars[s]);
                }
            }
        }

        if (options && options.giapCung) {
            var giapPositions = TuViStarPatterns.getGiapCung(pos);
            for (var g = 0; g < giapPositions.length; g++) {
                var gStars = saoMap[giapPositions[g]] || [];
                for (var s2 = 0; s2 < gStars.length; s2++) {
                    result.giapCung.push(gStars[s2]);
                }
            }
        }

        return result;
    }

    /**
     * Tìm sao theo tên trong danh sách
     */
    function findStar(starName, starList) {
        for (var i = 0; i < starList.length; i++) {
            if (starList[i].name === starName) return starList[i];
        }
        return null;
    }

    /**
     * Đếm số sao khớp trong danh sách
     */
    function countMatchingStars(requiredNames, starList) {
        var count = 0;
        var matched = [];
        for (var i = 0; i < requiredNames.length; i++) {
            for (var j = 0; j < starList.length; j++) {
                if (starList[j].name === requiredNames[i]) {
                    count++;
                    matched.push(starList[j]);
                    break;
                }
            }
        }
        return { count: count, matched: matched };
    }

    // =====================
    // RULE EVALUATION
    // =====================

    /**
     * Đánh giá 1 star group (bên trong fixedStars.groups)
     * @returns {Object} { score, matchedStars }
     */
    function evaluateStarGroup(group, allStars, cungPos) {
        var directResult = countMatchingStars(group.stars, allStars.direct);
        var xungResult = countMatchingStars(group.stars, allStars.xungChieu);
        var tamHopResult = countMatchingStars(group.stars, allStars.tamHop);

        var totalMatches = directResult.count;
        var score = directResult.count * TuViEventRules.THRESHOLD_CONFIG.FIXED_STAR_WEIGHT;

        // Xung chiếu matches (trọng số thấp hơn)
        score += xungResult.count * TuViEventRules.THRESHOLD_CONFIG.FIXED_STAR_WEIGHT *
            TuViEventRules.THRESHOLD_CONFIG.XUNG_CHIEU_MULTIPLIER;
        totalMatches += xungResult.count;

        // Tam hợp matches
        score += tamHopResult.count * TuViEventRules.THRESHOLD_CONFIG.FIXED_STAR_WEIGHT *
            TuViEventRules.THRESHOLD_CONFIG.TAM_HOP_MULTIPLIER;
        totalMatches += tamHopResult.count;

        // Collect matched star names
        var matchedNames = [];
        var allMatched = directResult.matched.concat(xungResult.matched).concat(tamHopResult.matched);
        for (var i = 0; i < allMatched.length; i++) {
            if (matchedNames.indexOf(allMatched[i].name) === -1) {
                matchedNames.push(allMatched[i].name);
            }
        }

        // Check requireHam (nếu group yêu cầu sao phải hãm)
        if (group.requireHam && directResult.matched.length > 0) {
            var hasHam = false;
            for (var h = 0; h < directResult.matched.length; h++) {
                var status = TuViStarPatterns.getStarStatus(directResult.matched[h].name, cungPos);
                if (status === 'ham') { hasHam = true; break; }
            }
            if (!hasHam) {
                score *= 0.3; // Giảm mạnh nếu không hãm
            }
        }

        // Check requireMieu (nếu group yêu cầu sao phải miếu)
        if (group.requireMieu && directResult.matched.length > 0) {
            var hasMieu = false;
            for (var m = 0; m < directResult.matched.length; m++) {
                var mStatus = TuViStarPatterns.getStarStatus(directResult.matched[m].name, cungPos);
                if (mStatus === 'mieu' || mStatus === 'vuong') { hasMieu = true; break; }
            }
            if (!hasMieu) {
                score *= 0.4; // Giảm nếu không miếu/vượng
            }
        }

        return {
            score: score,
            totalMatches: totalMatches,
            matchedNames: matchedNames,
            meetsMin: totalMatches >= (group.minMatch || 1)
        };
    }

    /**
     * Kiểm tra Hoá match (Hoá Lộc/Quyền/Khoa/Kỵ tại cung hoặc trên sao cụ thể)
     * @returns {Object} { matched, score, detail }
     */
    function checkHoaMatch(hoaCheck, allStars, lasoData, housePos) {
        if (!hoaCheck) return { matched: false, score: 0, detail: '' };

        var hoa = hoaCheck.hoa; // 'Lộc', 'Quyền', 'Khoa', 'Kỵ'
        var matched = false;
        var detail = '';

        if (hoaCheck.type === 'specific' && hoaCheck.starName) {
            // Kiểm tra specific sao có Hoá đúng loại không
            var allStarsList = allStars.direct.concat(allStars.xungChieu);
            for (var i = 0; i < allStarsList.length; i++) {
                if (allStarsList[i].name === hoaCheck.starName) {
                    if (allStarsList[i].hoa === hoa || allStarsList[i].luuHoa === hoa) {
                        matched = true;
                        detail = hoaCheck.starName + ' Hoá ' + hoa;
                        break;
                    }
                }
            }
        } else {
            // Kiểm tra bất kỳ sao nào trong cung có Hoá đúng loại
            var targetPos = hoaCheck.house ? findHousePos(hoaCheck.house, lasoData.cungMap) : housePos;
            if (targetPos >= 0) {
                var starsInHouse = lasoData.saoMap[targetPos] || [];
                for (var j = 0; j < starsInHouse.length; j++) {
                    var s = starsInHouse[j];
                    if (hoaCheck.type === 'luu') {
                        // Chỉ check Lưu Hoá
                        if (s.luuHoa === hoa) {
                            matched = true;
                            detail = s.name + ' Lưu Hoá ' + hoa;
                            break;
                        }
                    } else {
                        // Check cả Hoá gốc và Lưu Hoá
                        if (s.hoa === hoa || s.luuHoa === hoa) {
                            matched = true;
                            detail = s.name + ' Hoá ' + hoa;
                            break;
                        }
                    }
                }
            }
        }

        var score = matched ? TuViEventRules.THRESHOLD_CONFIG.HOA_MATCH_WEIGHT : 0;
        return { matched: matched, score: score, detail: detail };
    }

    /**
     * Kiểm tra Song Lộc (Lộc Tồn + Hoá Lộc cùng cung hoặc tam hợp)
     */
    function checkSongLoc(lasoData, housePos) {
        var allStars = collectStars(housePos, lasoData.saoMap, { xungChieu: false, tamHop: true, giapCung: false });
        var allList = allStars.direct.concat(allStars.tamHop);

        var hasLocTon = false;
        var hasHoaLoc = false;
        var hasLuuLocTon = false;
        var hasLuuHoaLoc = false;

        for (var i = 0; i < allList.length; i++) {
            if (allList[i].name === 'Lộc Tồn') hasLocTon = true;
            if (allList[i].name === 'Lưu Lộc Tồn') hasLuuLocTon = true;
            if (allList[i].hoa === 'Lộc') hasHoaLoc = true;
            if (allList[i].luuHoa === 'Lộc') hasLuuHoaLoc = true;
        }

        return (hasLocTon && hasHoaLoc) || (hasLocTon && hasLuuHoaLoc) ||
            (hasLuuLocTon && hasHoaLoc) || (hasLuuLocTon && hasLuuHoaLoc);
    }

    /**
     * Kiểm tra Song Kỵ (Hoá Kỵ gốc + Lưu Hoá Kỵ cùng cung)
     */
    function checkSongKy(lasoData, housePos) {
        var stars = lasoData.saoMap[housePos] || [];
        var hasGocKy = false;
        var hasLuuKy = false;

        for (var i = 0; i < stars.length; i++) {
            if (stars[i].hoa === 'Kỵ') hasGocKy = true;
            if (stars[i].luuHoa === 'Kỵ') hasLuuKy = true;
        }

        return hasGocKy && hasLuuKy;
    }

    /**
     * Đánh giá 1 rule hoàn chỉnh
     * @param {Object} rule - 1 rule từ TuViEventRules
     * @param {Object} lasoData - Data lá số đầy đủ
     * @returns {Object|null} Event object nếu fire, null nếu không
     */
    function evaluateRule(rule, lasoData) {
        var totalScore = 0;
        var allMatchedStars = [];
        var allDetails = [];
        var primaryHousePos = -1;
        var anyGroupMet = false;

        // 1. Quét từng focus house
        for (var h = 0; h < rule.focusHouses.length; h++) {
            var houseName = rule.focusHouses[h];
            var housePos = findHousePos(houseName, lasoData.cungMap);
            if (housePos < 0) continue;

            if (primaryHousePos < 0) primaryHousePos = housePos;

            // Xác định scope thu thập sao
            var collectOptions = {
                xungChieu: rule.checkXungChieu || false,
                tamHop: false,
                giapCung: false
            };

            var allStars = collectStars(housePos, lasoData.saoMap, collectOptions);

            // 2. Evaluate fixed star groups
            if (rule.fixedStars && rule.fixedStars.groups) {
                for (var g = 0; g < rule.fixedStars.groups.length; g++) {
                    var groupResult = evaluateStarGroup(rule.fixedStars.groups[g], allStars, housePos);
                    if (groupResult.meetsMin) {
                        anyGroupMet = true;
                        totalScore += groupResult.score;
                        for (var mn = 0; mn < groupResult.matchedNames.length; mn++) {
                            if (allMatchedStars.indexOf(groupResult.matchedNames[mn]) === -1) {
                                allMatchedStars.push(groupResult.matchedNames[mn]);
                            }
                        }
                    }
                }
            }

            // 3. Check dynamic stars (lưu niên)
            if (rule.dynamicStars && rule.dynamicStars.length > 0) {
                var dynResult = countMatchingStars(rule.dynamicStars, allStars.direct);
                if (dynResult.count >= (rule.dynamicMinMatch || 0)) {
                    totalScore += dynResult.count * TuViEventRules.THRESHOLD_CONFIG.DYNAMIC_STAR_WEIGHT;
                    for (var dn = 0; dn < dynResult.matched.length; dn++) {
                        if (allMatchedStars.indexOf(dynResult.matched[dn].name) === -1) {
                            allMatchedStars.push(dynResult.matched[dn].name);
                        }
                    }
                }
            }

            // 4. Check Hoá
            if (rule.hoaCheck) {
                var hoaResult = checkHoaMatch(rule.hoaCheck, allStars, lasoData, housePos);
                if (hoaResult.matched) {
                    totalScore += hoaResult.score;
                    if (hoaResult.detail) allDetails.push(hoaResult.detail);
                } else if (rule.requireHoaMatch) {
                    // Rule BẮT BUỘC có Hoá match → không fire nếu thiếu
                    return null;
                }
            }
        }

        // 5. Nếu không có star group nào match → không fire
        if (!anyGroupMet && rule.fixedStars && rule.fixedStars.groups && rule.fixedStars.groups.length > 0) {
            return null;
        }

        // 6. Check Song Lộc bonus
        if (rule.songLocCheck && primaryHousePos >= 0) {
            if (checkSongLoc(lasoData, primaryHousePos)) {
                totalScore += TuViEventRules.THRESHOLD_CONFIG.LUU_TU_HOA_BONUS;
                allDetails.push('Song Lộc hội');
            }
        }

        // 7. Bonus Đại Vận trùng focus house
        if (lasoData.daiVanHienTai) {
            var dvPos = lasoData.daiVanHienTai.cungPos;
            var dvCungName = lasoData.cungMap[dvPos] || '';
            for (var fh = 0; fh < rule.focusHouses.length; fh++) {
                if (dvCungName === rule.focusHouses[fh]) {
                    totalScore += TuViEventRules.THRESHOLD_CONFIG.DAI_VAN_BONUS;
                    allDetails.push('Đại Vận = ' + dvCungName);
                    break;
                }
            }
        }

        // 8. Bonus Tiểu Vận trùng focus house
        if (lasoData.tieuVan) {
            var tvPos = lasoData.tieuVan.cungPos;
            var tvCungName = lasoData.cungMap[tvPos] || '';
            for (var fh2 = 0; fh2 < rule.focusHouses.length; fh2++) {
                if (tvCungName === rule.focusHouses[fh2]) {
                    totalScore += TuViEventRules.THRESHOLD_CONFIG.TIEU_VAN_BONUS;
                    allDetails.push('Tiểu Vận = ' + tvCungName);
                    break;
                }
            }
        }

        // 9. Tuần/Triệt adjustment
        if (primaryHousePos >= 0 && lasoData.tuanTriet) {
            if (TuViStarPatterns.isTuan(primaryHousePos, lasoData.tuanTriet)) {
                if (rule.isPositive) {
                    totalScore *= TuViStarPatterns.WEIGHTS.TUAN_PENALTY; // Cát bị Tuần → giảm tốt
                } else {
                    totalScore *= TuViStarPatterns.WEIGHTS.TUAN_PENALTY; // Hung bị Tuần → cũng giảm (bớt xấu)
                }
                allDetails.push('Bị Tuần');
            }
            if (TuViStarPatterns.isTriet(primaryHousePos, lasoData.tuanTriet)) {
                totalScore *= TuViStarPatterns.WEIGHTS.TRIET_PENALTY;
                allDetails.push('Bị Triệt');
            }
        }

        // 10. Song Kỵ penalty cho hung events
        if (primaryHousePos >= 0 && !rule.isPositive) {
            if (checkSongKy(lasoData, primaryHousePos)) {
                totalScore *= TuViStarPatterns.WEIGHTS.SONG_KY_MULTIPLIER;
                allDetails.push('⚠ Song Kỵ');
            }
        }

        // 11. Check threshold
        if (totalScore < rule.threshold) return null;

        // 12. Determine severity dựa trên score
        var severity = rule.severity;
        if (totalScore >= rule.threshold * 2) {
            severity = 'critical';
        } else if (totalScore >= rule.threshold * 1.3) {
            severity = severity === 'info' ? 'important' : severity;
        }

        // 13. Build description text
        var saoListText = allMatchedStars.join(', ');
        var primaryCungName = primaryHousePos >= 0 ? (lasoData.cungMap[primaryHousePos] || '') : '';
        var templateData = {
            sao_list: saoListText || 'các sao',
            cung: primaryCungName,
            nam_xem: lasoData.input ? lasoData.input.namXem : '',
            dai_van_cung: lasoData.daiVanHienTai ? (lasoData.cungMap[lasoData.daiVanHienTai.cungPos] || '') : '',
            tieu_van_cung: lasoData.tieuVan ? (lasoData.cungMap[lasoData.tieuVan.cungPos] || '') : ''
        };

        return {
            id: rule.id,
            category: rule.category,
            categoryInfo: TuViEventRules.CATEGORIES[rule.category],
            name: rule.name,
            score: Math.round(totalScore * 10) / 10,
            severity: severity,
            severityInfo: TuViTemplates.SEVERITY[severity],
            isPositive: rule.isPositive || false,
            focusHouses: rule.focusHouses,
            primaryHousePos: primaryHousePos,
            primaryCungName: primaryCungName,
            matchedStars: allMatchedStars,
            details: allDetails,
            longText: TuViTemplates.getEventText(rule.id, 'long', templateData),
            shortText: TuViTemplates.getEventText(rule.id, 'short', templateData),
            advice: TuViTemplates.getEventText(rule.id, 'advice', templateData)
        };
    }

    // =====================
    // PATTERN DETECTION (Bộ sao đặc biệt)
    // =====================

    /**
     * Quét các bộ sao đặc biệt (Đại Hung, Đại Cát, Tâm Linh)
     * Khác event rules: patterns quét TOÀN BỘ lá số, không giới hạn 1 cung
     */
    function scanPatterns(lasoData) {
        var detected = [];

        var allPatterns = [].concat(
            TuViStarPatterns.HUNG_PATTERNS,
            TuViStarPatterns.CAT_PATTERNS,
            TuViStarPatterns.SPIRITUAL_PATTERNS
        );

        for (var p = 0; p < allPatterns.length; p++) {
            var pattern = allPatterns[p];
            var patternResults = scanSinglePattern(pattern, lasoData);
            for (var r = 0; r < patternResults.length; r++) {
                detected.push(patternResults[r]);
            }
        }

        return detected;
    }

    /**
     * Quét 1 pattern trên toàn bộ 12 cung
     */
    function scanSinglePattern(pattern, lasoData) {
        var results = [];

        for (var cungPos = 0; cungPos < 12; cungPos++) {
            // Nếu pattern có targetHouse, chỉ quét cung đó
            if (pattern.targetHouse) {
                var targets = Array.isArray(pattern.targetHouse) ? pattern.targetHouse : [pattern.targetHouse];
                var cungName = lasoData.cungMap[cungPos] || '';
                var isTarget = false;
                for (var t = 0; t < targets.length; t++) {
                    if (cungName === targets[t]) { isTarget = true; break; }
                }
                if (!isTarget) continue;
            }

            // Determine scope
            var collectOptions = { xungChieu: false, tamHop: false, giapCung: false };
            if (pattern.scope === 'cung_tam_hop') collectOptions.tamHop = true;
            if (pattern.scope === 'cung_doi') collectOptions.xungChieu = true;
            if (pattern.scope === 'cung_giap') collectOptions.giapCung = true;

            var allStars = collectStars(cungPos, lasoData.saoMap, collectOptions);
            var allList = allStars.direct;
            if (collectOptions.tamHop) allList = allList.concat(allStars.tamHop);
            if (collectOptions.xungChieu) allList = allList.concat(allStars.xungChieu);
            if (collectOptions.giapCung) allList = allList.concat(allStars.giapCung);

            var matchResult = countMatchingStars(pattern.stars, allList);

            if (matchResult.count >= pattern.minMatch) {
                // Extra checks
                var valid = true;

                // Check requireHoa
                if (pattern.requireHoa) {
                    var hasHoa = false;
                    for (var i = 0; i < allStars.direct.length; i++) {
                        if (allStars.direct[i].hoa === pattern.requireHoa ||
                            allStars.direct[i].luuHoa === pattern.requireHoa) {
                            hasHoa = true;
                            break;
                        }
                    }
                    if (!hasHoa) valid = false;
                }

                // Check requireHam
                if (pattern.requireHam && valid) {
                    var mainStar = pattern.stars[0];
                    var starStatus = TuViStarPatterns.getStarStatus(mainStar, cungPos);
                    if (starStatus !== 'ham') valid = false;
                }

                // Check extraHung
                if (pattern.extraHung && valid) {
                    var extraResult = countMatchingStars(pattern.extraHung, allList);
                    if (extraResult.count === 0) valid = false;
                }

                if (valid) {
                    var cName = lasoData.cungMap[cungPos] || AmLich.DIA_CHI[cungPos];
                    var patternType = 'hung';
                    for (var ci = 0; ci < TuViStarPatterns.CAT_PATTERNS.length; ci++) {
                        if (TuViStarPatterns.CAT_PATTERNS[ci].id === pattern.id) { patternType = 'cat'; break; }
                    }
                    for (var si = 0; si < TuViStarPatterns.SPIRITUAL_PATTERNS.length; si++) {
                        if (TuViStarPatterns.SPIRITUAL_PATTERNS[si].id === pattern.id) { patternType = 'spiritual'; break; }
                    }

                    // Lấy effect/advice theo ngữ cảnh cung
                    var contextual = { effect: pattern.effect, advice: pattern.advice };
                    if (typeof TuViStarPatterns !== 'undefined' && TuViStarPatterns.getContextualEffect) {
                        contextual = TuViStarPatterns.getContextualEffect(pattern, cName);
                    }

                    results.push({
                        patternId: pattern.id,
                        patternName: pattern.name,
                        patternType: patternType,
                        cungPos: cungPos,
                        cungName: cName,
                        intensity: pattern.intensity,
                        matchedStars: matchResult.matched.map(function (s) { return s.name; }),
                        effect: contextual.effect,
                        advice: contextual.advice
                    });
                }
            }
        }

        return results;
    }

    // =====================
    // MAIN SCANNER
    // =====================

    /**
     * Quét toàn bộ lá số → trả về events + patterns
     * @param {Object} lasoData - Data đầy đủ sau khi calculate() + anSao()
     * @returns {Object} { events, patterns, summary }
     */
    function scan(lasoData) {
        if (!lasoData || !lasoData.saoMap || !lasoData.cungMap) {
            return { events: [], patterns: [], summary: null };
        }

        // 1. Quét event rules
        var events = [];
        var rules = TuViEventRules.ALL_RULES;
        for (var i = 0; i < rules.length; i++) {
            var result = evaluateRule(rules[i], lasoData);
            if (result) events.push(result);
        }

        // Sort: critical first, then by score desc
        events.sort(function (a, b) {
            var sevOrder = { critical: 0, important: 1, info: 2 };
            var sevDiff = (sevOrder[a.severity] || 2) - (sevOrder[b.severity] || 2);
            if (sevDiff !== 0) return sevDiff;
            return b.score - a.score;
        });

        // 2. Quét star patterns
        var patterns = scanPatterns(lasoData);

        // Sort patterns by intensity desc
        patterns.sort(function (a, b) { return b.intensity - a.intensity; });

        // 3. Build summary
        var summary = buildSummary(events, patterns, lasoData);

        return {
            events: events,
            patterns: patterns,
            summary: summary
        };
    }

    /**
     * Xây dựng tóm tắt tổng thể
     */
    function buildSummary(events, patterns, lasoData) {
        var criticalCount = 0;
        var importantCount = 0;
        var positiveCount = 0;
        var negativeCount = 0;
        var categoryCounts = {};

        for (var i = 0; i < events.length; i++) {
            var e = events[i];
            if (e.severity === 'critical') criticalCount++;
            if (e.severity === 'important') importantCount++;
            if (e.isPositive) positiveCount++;
            else negativeCount++;

            if (!categoryCounts[e.category]) categoryCounts[e.category] = 0;
            categoryCounts[e.category]++;
        }

        // Tính overall rating (1-5)
        var avgRating = 3; // Default bình thường
        if (positiveCount > negativeCount * 2) avgRating = 5;
        else if (positiveCount > negativeCount) avgRating = 4;
        else if (criticalCount > 2 && negativeCount > positiveCount * 2) avgRating = 1;
        else if (negativeCount > positiveCount) avgRating = 2;

        // Adjust by hung patterns
        var hungPatternCount = 0;
        var catPatternCount = 0;
        for (var p = 0; p < patterns.length; p++) {
            if (patterns[p].patternType === 'hung') hungPatternCount++;
            if (patterns[p].patternType === 'cat') catPatternCount++;
        }
        if (hungPatternCount > 0) avgRating = Math.max(1, avgRating - 1);
        if (catPatternCount > 0) avgRating = Math.min(5, avgRating + 1);

        // Get overall text
        var templateData = {
            nam_xem: lasoData.input ? lasoData.input.namXem : '',
            dai_van_cung: lasoData.daiVanHienTai ? (lasoData.cungMap[lasoData.daiVanHienTai.cungPos] || '') : '',
            tieu_van_cung: lasoData.tieuVan ? (lasoData.cungMap[lasoData.tieuVan.cungPos] || '') : ''
        };
        var overallInfo = TuViTemplates.getOverallText(avgRating, templateData);

        return {
            totalEvents: events.length,
            criticalCount: criticalCount,
            importantCount: importantCount,
            positiveCount: positiveCount,
            negativeCount: negativeCount,
            categoryCounts: categoryCounts,
            hungPatterns: hungPatternCount,
            catPatterns: catPatternCount,
            rating: avgRating,
            ratingIcon: overallInfo.icon,
            overallText: overallInfo.text
        };
    }

    // =====================
    // EXPORTS
    // =====================

    return {
        scan: scan,
        evaluateRule: evaluateRule,
        scanPatterns: scanPatterns,
        findHousePos: findHousePos,
        collectStars: collectStars,
        checkSongLoc: checkSongLoc,
        checkSongKy: checkSongKy
    };
})();
