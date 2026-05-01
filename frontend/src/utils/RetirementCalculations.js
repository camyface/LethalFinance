// retirementCalculations.js
// Pure calculation functions for BRS and High-3 retirement systems.

import { getMonthlyBasePay } from './basePay.js';

// ── Constants ──────────────────────────────────────────────────────────────

export const LUMP_SUM_RESTORATION_AGE = 67;

export const LUMP_SUM_OPTIONS = [
    { key: 'none', label: 'No Lump Sum',  pensionPct: 1.00, lumpSumPct: 0.00 },
    { key: 'half', label: '25% Lump Sum', pensionPct: 0.75, lumpSumPct: 0.25 },
    { key: 'full', label: '50% Lump Sum', pensionPct: 0.50, lumpSumPct: 0.50 },
];

// ── Rank resolution ────────────────────────────────────────────────────────

export function resolveRank(year, baseRank, promotionTimeline = []) {
    const sorted = [...promotionTimeline].sort((a, b) => a.effectiveYear - b.effectiveYear);
    let rank = baseRank;
    for (const entry of sorted) {
        if (year >= entry.effectiveYear) rank = entry.rank;
        else break;
    }
    return rank;
}

// ── Pay helpers ────────────────────────────────────────────────────────────

export function getAdjustedMonthlyPay(rank, yos, year, baseYear = 2026, raisePct = 3.0) {
    const tablePay     = getMonthlyBasePay(rank, yos);
    const yearsElapsed = year - baseYear;
    if (yearsElapsed <= 0) return tablePay;
    return tablePay * Math.pow(1 + raisePct / 100, yearsElapsed);
}

// ── PV helper ──────────────────────────────────────────────────────────────

export function getPVFactor(baseYear, targetYear, inflationPct = 2.5) {
    const years = targetYear - baseYear;
    if (years <= 0) return 1.0;
    return 1 / Math.pow(1 + inflationPct / 100, years);
}

// ── Lump sum dollar amount ─────────────────────────────────────────────────

export function calcLumpSumAmount(
    annualFullPension, lumpSumPct, retirementAge, deathAge, discountRatePct = 2.5
) {
    if (lumpSumPct === 0) return 0;
    const years = deathAge - retirementAge;
    const r     = discountRatePct / 100;
    const pvAnnuity = r > 0
        ? annualFullPension * ((1 - Math.pow(1 + r, -years)) / r)
        : annualFullPension * years;
    return pvAnnuity * lumpSumPct;
}

// ── Continuation bonus ─────────────────────────────────────────────────────

export function calcContinuationBonus(monthlyBasePay, multiplier = 2.5) {
    return monthlyBasePay * 2.5 * multiplier;
}

// ── Main projection builder ────────────────────────────────────────────────
//
// Accepts the params the component actually passes:
//   system, currentRank, currentAge, currentYOS, currentYear,
//   separationYear, payRaisePct, inflationPct, deathAge,
//   promotionTimeline, colaRatePct
//
// Returns an object with:
//   high3Monthly, high3Annual, fullMonthlyPension, fullAnnualPension,
//   pensionMultiplier, yosAtRetirement, retirementAge, rankAtRetirement,
//   lumpSum25Amount, lumpSum50Amount, rows[]
//
// Each row has:
//   year, age, isRestored,
//   annualPension_none, annualPension_25, annualPension_50,
//   monthlyPension_none, monthlyPension_25, monthlyPension_50,
//   pvAnnualPension_none, pvAnnualPension_25, pvAnnualPension_50,
//   pvMonthlyPension_none

export function buildPensionProjection({
                                           system           = 'BRS',
                                           currentRank      = 'E-5',
                                           currentAge       = 26,
                                           currentYOS       = 8,
                                           currentYear      = new Date().getFullYear(),
                                           separationYear,
                                           payRaisePct      = 3.0,
                                           inflationPct     = 2.5,
                                           colaRatePct      = 2.5,
                                           deathAge         = 85,
                                           promotionTimeline = [],
                                       }) {
    const retirementYear = separationYear ?? currentYear + 20;
    const yosAtRetirement = currentYOS + (retirementYear - currentYear);
    const retirementAge   = currentAge + (retirementYear - currentYear);
    const multiplier      = system === 'BRS' ? 0.02 : 0.025;
    const BASE_YEAR       = 2026;

    // ── Rank at retirement
    const rankAtRetirement = resolveRank(retirementYear, currentRank, promotionTimeline);

    // ── High-3 average (avg of final 3 years of pay before retirement)
    const high3Samples = [];
    for (let y = retirementYear - 2; y <= retirementYear; y++) {
        const yos  = yosAtRetirement - (retirementYear - y);
        const rank = resolveRank(y, currentRank, promotionTimeline);
        high3Samples.push(getAdjustedMonthlyPay(rank, Math.max(yos, 0), y, BASE_YEAR, payRaisePct));
    }
    const high3Monthly = high3Samples.reduce((a, b) => a + b, 0) / high3Samples.length;
    const high3Annual  = high3Monthly * 12;

    // ── Full pension
    const fullAnnualPension  = high3Annual * multiplier * yosAtRetirement;
    const fullMonthlyPension = fullAnnualPension / 12;

    // ── BRS lump sum amounts
    const lumpSum25Amount = system === 'BRS'
        ? calcLumpSumAmount(fullAnnualPension, 0.25, retirementAge, deathAge, inflationPct)
        : 0;
    const lumpSum50Amount = system === 'BRS'
        ? calcLumpSumAmount(fullAnnualPension, 0.50, retirementAge, deathAge, inflationPct)
        : 0;

    // ── Year-by-year rows (retirement year → death)
    const rows = [];
    const endYear = retirementYear + (deathAge - retirementAge);

    for (let year = retirementYear; year <= endYear; year++) {
        const age          = retirementAge + (year - retirementYear);
        const yearsRetired = year - retirementYear;
        const isRestored   = age >= LUMP_SUM_RESTORATION_AGE;
        const pvFactor     = getPVFactor(retirementYear, year, inflationPct);

        // COLA applied cumulatively each year
        const colaMultiplier = Math.pow(1 + colaRatePct / 100, yearsRetired);

        // Annual pension for each lump sum case
        const none_annual = fullAnnualPension * colaMultiplier;
        const ls25_pct    = (system === 'BRS' && !isRestored) ? 0.75 : 1.0;
        const ls50_pct    = (system === 'BRS' && !isRestored) ? 0.50 : 1.0;
        const ls25_annual = fullAnnualPension * ls25_pct * colaMultiplier;
        const ls50_annual = fullAnnualPension * ls50_pct * colaMultiplier;

        rows.push({
            year,
            age,
            isRestored,

            // Future value
            annualPension_none:  Math.round(none_annual),
            annualPension_25:    Math.round(ls25_annual),
            annualPension_50:    Math.round(ls50_annual),
            monthlyPension_none: Math.round(none_annual / 12),
            monthlyPension_25:   Math.round(ls25_annual / 12),
            monthlyPension_50:   Math.round(ls50_annual / 12),

            // Present value
            pvAnnualPension_none:  Math.round(none_annual  * pvFactor),
            pvAnnualPension_25:    Math.round(ls25_annual  * pvFactor),
            pvAnnualPension_50:    Math.round(ls50_annual  * pvFactor),
            pvMonthlyPension_none: Math.round((none_annual / 12) * pvFactor),
            pvMonthlyPension_25:   Math.round((ls25_annual / 12) * pvFactor),
            pvMonthlyPension_50:   Math.round((ls50_annual / 12) * pvFactor),
        });
    }

    return {
        high3Monthly:       Math.round(high3Monthly),
        high3Annual:        Math.round(high3Annual),
        fullMonthlyPension: Math.round(fullMonthlyPension),
        fullAnnualPension:  Math.round(fullAnnualPension),
        pensionMultiplier:  multiplier,
        yosAtRetirement,
        retirementAge,
        rankAtRetirement,
        lumpSum25Amount:    Math.round(lumpSum25Amount),
        lumpSum50Amount:    Math.round(lumpSum50Amount),
        rows,
    };
}

// ── Chart data builder ─────────────────────────────────────────────────────
// Keys match what the component's <Line dataKey="..."> uses:
//   noLumpSum, lumpSum25, lumpSum50

export function buildPensionChartData(rows, showPV = false) {
    return rows.map(row => ({
        year:         row.year,
        age:          row.age,
        isRestored:   row.isRestored,
        noLumpSum:    showPV ? row.pvAnnualPension_none : row.annualPension_none,
        lumpSum25:    showPV ? row.pvAnnualPension_25   : row.annualPension_25,
        lumpSum50:    showPV ? row.pvAnnualPension_50   : row.annualPension_50,
    }));
}

// ── Formatters ─────────────────────────────────────────────────────────────

export function fmtDollars(n) {
    if (n == null || isNaN(n)) return '$0';
    if (n >= 1_000_000) return '$' + (n / 1_000_000).toFixed(2) + 'M';
    if (n >= 1_000)     return '$' + Math.round(n / 1_000) + 'K';
    return '$' + Math.round(n).toLocaleString();
}

export function fmtFull(n) {
    if (n == null || isNaN(n)) return '$0';
    return '$' + Math.round(n).toLocaleString();
}