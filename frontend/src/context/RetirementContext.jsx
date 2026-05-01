// RetirementContext.jsx
// Global context for retirement plan state shared between
// RetirementPlansPage and TspPage.
//
// Usage — wrap your authenticated routes in AppLayout.jsx:
//
//   import { RetirementProvider } from '../context/RetirementContext';
//
//   export default function AppLayout() {
//     return (
//       <RetirementProvider>
//         <Shell>
//           ...header, sidebar...
//           <Main><Outlet /></Main>
//         </Shell>
//       </RetirementProvider>
//     );
//   }

import { createContext, useContext, useState, useCallback } from 'react';

// ── Default plan shape ─────────────────────────────────────────────────────
export const DEFAULT_PLAN = {
    id:                null,
    name:              'New Plan',
    retirementSystem:  'BRS',       // 'BRS' | 'High-3'
    currentRank:       'E-5',
    currentYOS:        8,
    currentAge:        26,
    separationYear:    new Date().getFullYear() + 12,
    expectedRaisePct:  3.0,
    inflationPct:      2.5,
    deathAge:          85,
    promotionTimeline: [],          // [{ effectiveYear, rank }]
    cbMultiplier:      2.5,         // BRS continuation bonus multiplier (0.5–4×)
    cbTaken:           true,
    notes:             '',
};

// ── Context ────────────────────────────────────────────────────────────────
const RetirementContext = createContext(null);

export function RetirementProvider({ children }) {
    const [plans,        setPlans]        = useState([]);
    const [activePlanId, setActivePlanId] = useState(null);
    const [nextId,       setNextId]       = useState(1);

    // Active plan object (null if no plans)
    const activePlan = plans.find(p => p.id === activePlanId) ?? null;

    // Promotion timeline from the active plan — consumed by TspPage
    const activeTimeline = activePlan?.promotionTimeline ?? [];

    // ── Plan CRUD ──────────────────────────────────────────────

    const createPlan = useCallback((overrides = {}) => {
        let newId;
        setNextId(n => { newId = n; return n + 1; });

        const newPlan = {
            ...DEFAULT_PLAN,
            ...overrides,
            id:   nextId,
            name: overrides.name ?? `Plan ${nextId}`,
        };

        setPlans(prev => [...prev, newPlan]);
        // Auto-activate if it's the first plan
        setActivePlanId(prev => prev ?? newPlan.id);
        return newPlan;
    }, [nextId]);

    const updatePlan = useCallback((id, changes) => {
        setPlans(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
    }, []);

    const deletePlan = useCallback((id) => {
        setPlans(prev => {
            const remaining = prev.filter(p => p.id !== id);
            setActivePlanId(cur => {
                if (cur !== id) return cur;
                return remaining[0]?.id ?? null;
            });
            return remaining;
        });
    }, []);

    const setActive = useCallback((id) => {
        setActivePlanId(id);
    }, []);

    const updateTimeline = useCallback((planId, timeline) => {
        setPlans(prev =>
            prev.map(p => p.id === planId ? { ...p, promotionTimeline: timeline } : p)
        );
    }, []);

    return (
        <RetirementContext.Provider value={{
            plans,
            activePlan,
            activePlanId,
            activeTimeline,
            createPlan,
            updatePlan,
            deletePlan,
            setActive,
            updateTimeline,
        }}>
            {children}
        </RetirementContext.Provider>
    );
}

export function useRetirement() {
    const ctx = useContext(RetirementContext);
    if (!ctx) throw new Error('useRetirement must be used inside <RetirementProvider>');
    return ctx;
}