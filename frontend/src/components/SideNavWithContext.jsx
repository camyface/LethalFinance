import { useMemo } from 'react';
import { useRetirement } from '../context/RetirementContext';
import SideNav from './SideNav.jsx';
import { buildPensionProjection } from '../utils/retirementCalculations.js';
import { buildProjection } from '../utils/tspCalculations.js';
import { getMonthlyBasePay } from '../utils/basePay.js';

function SideNavWithContext({ mobileOpen, onMobileClose }) {
    const { activePlan, plans } = useRetirement();

    const currentYear = new Date().getFullYear();

    // ── Live pension estimate ─────────────────────────────────
    const pensionEstimate = useMemo(() => {
        if (!activePlan) return 0;
        try {
            const result = buildPensionProjection({
                system:            activePlan.retirementSystem  ?? 'BRS',
                currentRank:       activePlan.currentRank       ?? 'E-5',
                currentAge:        activePlan.currentAge        ?? 26,
                currentYOS:        activePlan.currentYOS        ?? 8,
                currentYear,
                separationYear:    activePlan.separationYear    ?? currentYear + 12,
                payRaisePct:       activePlan.payRaisePct       ?? activePlan.expectedRaisePct ?? 3.0,
                inflationPct:      activePlan.inflationPct      ?? 2.5,
                colaRatePct:       activePlan.colaRatePct       ?? 2.5,
                deathAge:          activePlan.deathAge          ?? 85,
                promotionTimeline: activePlan.promotionTimeline ?? [],
            });
            return result.fullMonthlyPension ?? 0;
        } catch {
            return 0;
        }
    }, [activePlan, currentYear]);

    // ── Live TSP estimate at separation ───────────────────────
    const tspEstimate = useMemo(() => {
        if (!activePlan) return 0;
        try {
            const rows = buildProjection({
                currentYear,
                currentAge:         activePlan.currentAge        ?? 26,
                currentYOS:         activePlan.currentYOS        ?? 8,
                currentRank:        activePlan.currentRank       ?? 'E-5',
                currentTspBalance:  0,
                memberContribPct:   5,     // default 5% — gets full gov match
                expectedReturnPct:  7,     // C Fund historical average
                separationYear:     activePlan.separationYear    ?? currentYear + 12,
                withdrawalStartAge: 59.5,
                withdrawalRatePct:  4,
                deathAge:           activePlan.deathAge          ?? 85,
                inflationPct:       activePlan.inflationPct      ?? 2.5,
                promotionTimeline:  activePlan.promotionTimeline ?? [],
            });
            const sepRow = rows.find(r => r.year === (activePlan.separationYear ?? currentYear + 12));
            return sepRow?.tspBalance ?? rows[rows.length - 1]?.tspBalance ?? 0;
        } catch {
            return 0;
        }
    }, [activePlan, currentYear]);

    return (
        <SideNav
            mobileOpen={mobileOpen}
            onMobileClose={onMobileClose}
            planCount={plans.length}
            activePlan={activePlan ? {
                name:    activePlan.name,
                pension: pensionEstimate,
                tsp:     tspEstimate,
            } : null}
        />
    );
}

export default SideNavWithContext;