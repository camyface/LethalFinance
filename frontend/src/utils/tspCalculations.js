// tspCalculations.js
// Core TSP projection engine — pure functions, no React dependencies.

import { getMonthlyBasePay } from './basePay.js';

// ── Default assumptions ───────────────────────────────────────────────────────
export const DEFAULT_PAY_RAISE_PCT    = 3.0;
export const DEFAULT_INFLATION_PCT    = 2.5;  // used for present value discounting

// ── Pay raise helpers ─────────────────────────────────────────────────────────

export function getPayRaiseMultiplier(baseYear, targetYear, raiseRatePct = DEFAULT_PAY_RAISE_PCT) {
    const yearsElapsed = targetYear - baseYear;
    if (yearsElapsed <= 0) return 1.0;
    return Math.pow(1 + raiseRatePct / 100, yearsElapsed);
}

export function getAdjustedMonthlyBasePay(rank, yos, year, raiseRatePct = DEFAULT_PAY_RAISE_PCT, baseYear = 2026) {
    const tableBasePay    = getMonthlyBasePay(rank, yos);
    const raiseMultiplier = getPayRaiseMultiplier(baseYear, year, raiseRatePct);
    return tableBasePay * raiseMultiplier;
}

// ── Present Value helpers ─────────────────────────────────────────────────────

/**
 * Calculate the present value discount factor for a given year.
 * Discounts future dollars back to today's purchasing power.
 *
 * PV factor = 1 / (1 + inflationRate)^yearsElapsed
 *
 * Example: $100 in 10 years at 2.5% inflation → $78.12 in today's dollars
 *
 * @param {number} baseYear      — the reference year (today)
 * @param {number} targetYear    — the future year being discounted
 * @param {number} inflationPct  — annual inflation rate % (default 2.5)
 * @returns {number} discount factor (0 < factor <= 1.0)
 */
export function getPVFactor(baseYear, targetYear, inflationPct = DEFAULT_INFLATION_PCT) {
    const yearsElapsed = targetYear - baseYear;
    if (yearsElapsed <= 0) return 1.0;
    return 1 / Math.pow(1 + inflationPct / 100, yearsElapsed);
}

/**
 * Convert a future value dollar amount to present value.
 *
 * @param {number} futureValue
 * @param {number} pvFactor     — from getPVFactor()
 * @returns {number} present value
 */
export function toPresentValue(futureValue, pvFactor) {
    return futureValue * pvFactor;
}

/**
 * Apply a PV factor to an entire projection row, returning a new row
 * where all dollar fields are discounted to present value.
 * Non-dollar fields (year, age, yos, rank, phase, flags) are unchanged.
 *
 * @param {object} row      — a row from buildProjection()
 * @returns {object}        — row with dollar fields in present value
 */
export function applyPVToRow(row) {
    const f = row.pvFactor;
    return {
        ...row,
        annualBasePay:          Math.round(row.annualBasePay          * f),
        annualBasePayTable:     Math.round(row.annualBasePayTable      * f),
        annualMemberContrib:    Math.round(row.annualMemberContrib     * f),
        annualMemberContribRaw: Math.round(row.annualMemberContribRaw  * f),
        annualGovContrib:       Math.round(row.annualGovContrib        * f),
        annualGovContribRaw:    Math.round(row.annualGovContribRaw     * f),
        annualWithdrawal:       Math.round(row.annualWithdrawal        * f),
        tspBalance:             Math.round(row.tspBalance              * f),
        contribLimit:           Math.round(row.contribLimit            * f),
    };
}

/**
 * Apply PV conversion to an entire projection array.
 * Returns a new array — the original rows are not mutated.
 *
 * @param {array}   rows         — from buildProjection()
 * @returns {array} PV-adjusted rows
 */
export function applyPVToProjection(rows) {
    return rows.map(applyPVToRow);
}

/**
 * Get display rows based on the current toggle state.
 * Use this in the component to avoid repeating the ternary everywhere.
 *
 * @param {array}   rows       — raw FV rows from buildProjection()
 * @param {boolean} showPV     — true = present value, false = future value
 * @returns {array}
 */
export function getDisplayRows(rows, showPV) {
    return showPV ? applyPVToProjection(rows) : rows;
}

// ── 2026 IRS TSP Contribution Limits ─────────────────────────────────────────
export const TSP_LIMITS = {
    ELECTIVE_DEFERRAL: 23500,
    CATCHUP_50_59_64:  31000,
    CATCHUP_60_63:     34750,
    TOTAL_ADDITIONS:   69000,
    BASE_YEAR:         2026,
};

export function getMemberContribLimit(age, year = 2026, raiseRatePct = DEFAULT_PAY_RAISE_PCT) {
    const flooredAge = Math.floor(age);
    const multiplier = getPayRaiseMultiplier(TSP_LIMITS.BASE_YEAR, year, raiseRatePct);
    let baseLimit;
    if (flooredAge >= 60 && flooredAge <= 63) baseLimit = TSP_LIMITS.CATCHUP_60_63;
    else if (flooredAge >= 50)                baseLimit = TSP_LIMITS.CATCHUP_50_59_64;
    else                                       baseLimit = TSP_LIMITS.ELECTIVE_DEFERRAL;
    return baseLimit * multiplier;
}

export function getTotalAdditionsLimit(year = 2026, raiseRatePct = DEFAULT_PAY_RAISE_PCT) {
    return TSP_LIMITS.TOTAL_ADDITIONS * getPayRaiseMultiplier(TSP_LIMITS.BASE_YEAR, year, raiseRatePct);
}

// ── BRS government match ──────────────────────────────────────────────────────

export function calcGovMatch(monthlyBasePay, memberContribPct) {
    const auto      = monthlyBasePay * 0.01;
    const matchable = Math.min(memberContribPct / 100, 0.05);
    let match = 0;
    if (matchable >= 0.03) {
        match = monthlyBasePay * 0.03;
        const extra = Math.min(matchable - 0.03, 0.02);
        match += monthlyBasePay * extra * 0.5;
    } else {
        match = monthlyBasePay * matchable;
    }
    return auto + match;
}

// ── IRS limit enforcement ─────────────────────────────────────────────────────

export function applyContribLimits(
    annualMemberRaw, annualGovRaw, annualBasePay,
    memberContribPct, age, year, raiseRatePct
) {
    const memberLimit = getMemberContribLimit(age, year, raiseRatePct);
    const totalLimit  = getTotalAdditionsLimit(year, raiseRatePct);

    const memberCapped = annualMemberRaw > memberLimit;
    const annualMember = Math.min(annualMemberRaw, memberLimit);

    let annualGov = annualGovRaw;
    if (memberCapped) {
        const autoAnnual      = annualBasePay * 0.01;
        const contribFraction = annualMemberRaw > 0
            ? Math.min(memberLimit / annualMemberRaw, 1) : 0;
        const matchOnlyAnnual = annualGovRaw - autoAnnual;
        annualGov = autoAnnual + matchOnlyAnnual * contribFraction;
    }

    const totalRaw    = annualMember + annualGov;
    const totalCapped = totalRaw > totalLimit;
    let finalMember   = annualMember;
    let finalGov      = annualGov;
    if (totalCapped) {
        const scale = totalLimit / totalRaw;
        finalMember = annualMember * scale;
        finalGov    = annualGov    * scale;
    }

    return {
        annualMember:  finalMember,
        annualGov:     finalGov,
        memberCapped:  memberCapped || totalCapped,
        totalCapped,
    };
}

// ── Rank resolution ───────────────────────────────────────────────────────────

export function resolveRank(year, baseRank, promotionTimeline = []) {
    const sorted = [...promotionTimeline].sort((a, b) => a.effectiveYear - b.effectiveYear);
    let rank = baseRank;
    for (const entry of sorted) {
        if (year >= entry.effectiveYear) rank = entry.rank;
        else break;
    }
    return rank;
}

// ── Main projection builder ───────────────────────────────────────────────────

/**
 * Build the full year-by-year TSP projection.
 * All dollar values are stored as FUTURE VALUE (nominal dollars).
 * Each row also contains a pvFactor so callers can convert to present value
 * without rerunning the projection — use applyPVToProjection(rows) or
 * getDisplayRows(rows, showPV) in your component.
 *
 * @param {object} params
 * @param {number}   params.currentYear
 * @param {number}   params.currentAge
 * @param {number}   params.currentYOS
 * @param {string}   params.currentRank
 * @param {number}   params.currentTspBalance
 * @param {number}   params.memberContribPct
 * @param {number}   params.expectedReturnPct
 * @param {number}   params.payRaisePct         — annual pay raise % (default 3.0)
 * @param {number}   params.inflationPct         — for PV discounting (default 2.5)
 * @param {number}   params.separationYear
 * @param {number}   params.withdrawalStartAge
 * @param {number}   params.withdrawalRatePct
 * @param {number}   params.deathAge
 * @param {array}    params.promotionTimeline
 *
 * @returns {array} rows — all dollar fields in future value; pvFactor included on each row
 */
export function buildProjection({
                                    currentYear,
                                    currentAge,
                                    currentYOS,
                                    currentRank,
                                    currentTspBalance,
                                    memberContribPct,
                                    expectedReturnPct,
                                    payRaisePct  = DEFAULT_PAY_RAISE_PCT,
                                    inflationPct = DEFAULT_INFLATION_PCT,
                                    separationYear,
                                    withdrawalStartAge,
                                    withdrawalRatePct,
                                    deathAge,
                                    promotionTimeline = [],
                                }) {
    const rows              = [];
    const monthlyReturnRate = expectedReturnPct / 100 / 12;
    let balance             = currentTspBalance;
    const endYear           = currentYear + (deathAge - currentAge);
    const PAY_BASE_YEAR     = 2026;

    for (let year = currentYear; year <= endYear; year++) {
        const age = currentAge + (year - currentYear);
        const yos = currentYOS + (year - currentYear);

        const rank           = resolveRank(year, currentRank, promotionTimeline);
        const monthlyBasePay = getAdjustedMonthlyBasePay(rank, yos, year, payRaisePct, PAY_BASE_YEAR);
        const annualBasePay  = monthlyBasePay * 12;

        const isAccumulating   = year <= separationYear;
        const memberMonthlyRaw = isAccumulating ? monthlyBasePay * (memberContribPct / 100) : 0;
        const govMonthlyRaw    = isAccumulating ? calcGovMatch(monthlyBasePay, memberContribPct) : 0;
        const annualMemberRaw  = memberMonthlyRaw * 12;
        const annualGovRaw     = govMonthlyRaw    * 12;

        const { annualMember, annualGov, memberCapped, totalCapped } = isAccumulating
            ? applyContribLimits(
                annualMemberRaw, annualGovRaw, annualBasePay,
                memberContribPct, age, year, payRaisePct
            )
            : { annualMember: 0, annualGov: 0, memberCapped: false, totalCapped: false };

        const memberMonthly = annualMember / 12;
        const govMonthly    = annualGov    / 12;

        const isWithdrawing    = age >= withdrawalStartAge;
        const annualWithdrawal = isWithdrawing ? balance * (withdrawalRatePct / 100) : 0;

        let newBalance = balance;
        for (let m = 0; m < 12; m++) {
            newBalance = newBalance * (1 + monthlyReturnRate) + memberMonthly + govMonthly;
        }
        newBalance = Math.max(0, newBalance - annualWithdrawal);

        // PV discount factor for this year — stored on each row so the toggle
        // can convert values instantly without rerunning the loop.
        const pvFactor = getPVFactor(currentYear, year, inflationPct);

        rows.push({
            year,
            age,
            yos,
            rank,
            pvFactor,                                                    // ← key for PV toggle
            annualBasePay:          Math.round(annualBasePay),
            annualBasePayTable:     Math.round(getMonthlyBasePay(rank, yos) * 12),
            payRaiseMultiplier:     parseFloat(getPayRaiseMultiplier(PAY_BASE_YEAR, year, payRaisePct).toFixed(4)),
            annualMemberContrib:    Math.round(annualMember),
            annualMemberContribRaw: Math.round(annualMemberRaw),
            annualGovContrib:       Math.round(annualGov),
            annualGovContribRaw:    Math.round(annualGovRaw),
            annualWithdrawal:       Math.round(annualWithdrawal),
            tspBalance:             Math.round(newBalance),
            memberCapped,
            totalCapped,
            contribLimit:           Math.round(getMemberContribLimit(age, year, payRaisePct)),
            phase: isWithdrawing
                ? 'withdrawal'
                : isAccumulating
                    ? 'accumulation'
                    : 'deferred',
        });

        balance = newBalance;
    }

    return rows;
}

// ── Chart data builder ────────────────────────────────────────────────────────

/**
 * Build chart data from projection rows.
 * Pass showPV=true to get present-value-adjusted chart data.
 *
 * @param {array}   rows
 * @param {boolean} showPV — if true, applies PV discount to all dollar values
 * @returns {array}
 */
export function buildChartData(rows, showPV = false) {
    const source = showPV ? applyPVToProjection(rows) : rows;
    return source.map(row => ({
        year:          row.year,
        age:           row.age,
        balance:       row.tspBalance,
        memberContrib: row.annualMemberContrib,
        govContrib:    row.annualGovContrib,
        withdrawal:    row.annualWithdrawal,
        phase:         row.phase,
        memberCapped:  row.memberCapped,
    }));
}

// ── Formatters ────────────────────────────────────────────────────────────────

/** Compact format — $1.24M, $312K, $8,500 */
export function fmtDollars(n) {
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)     return '$' + Math.round(n / 1_000) + 'K';
    return '$' + Math.round(n).toLocaleString();
}

/** Full format — $23,500 */
export function fmtFull(n) {
    return '$' + Math.round(n).toLocaleString();
}