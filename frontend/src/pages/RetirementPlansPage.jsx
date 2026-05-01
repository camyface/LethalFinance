import { useState, useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import {
    ComposedChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { useRetirement } from '../context/RetirementContext.jsx';
import {
    buildPensionProjection,
    buildPensionChartData,
    LUMP_SUM_RESTORATION_AGE,
    fmtDollars,
    fmtFull,
} from '../utils/retirementCalculations.js';
import { ALL_RANKS } from '../utils/basePay.js';

// ── Theme ─────────────────────────────────────────────────────
const T = {
    olive:    '#4a5240',
    oliveDim: '#3a4132',
    gold:     '#c8a84b',
    goldDim:  '#9a7e30',
    paper:    '#f5f2ea',
    paper2:   '#ede9de',
    paper3:   '#e0dbc8',
    muted:    '#6b6a60',
    border:   'rgba(74,82,64,0.22)',
    success:  '#2a5c3a',
    green:    '#4a9962',
    blue:     '#4a7ab5',
    red:      '#b04040',
    purple:   '#7a5ab5',
    ink:      '#1a1c18',
};

const inputStyle = {
    background: T.paper, border: `1px solid ${T.border}`,
    borderRadius: 3, padding: '6px 9px',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
    color: T.ink, width: '100%', outline: 'none',
};

// ── Sub-components ────────────────────────────────────────────

function FieldLabel({ children }) {
    return (
        <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
            letterSpacing: 1.5, color: T.muted,
            textTransform: 'uppercase', marginBottom: 3,
        }}>
            {children}
        </div>
    );
}

function SectionCard({ title, children, action }) {
    return (
        <div style={{
            background: '#fff', border: `1px solid ${T.border}`,
            borderRadius: 4, marginBottom: 14,
        }}>
            <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 14,
                letterSpacing: 1, color: T.oliveDim,
                padding: '10px 14px', borderBottom: `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
                {title}{action}
            </div>
            <div style={{ padding: 14 }}>{children}</div>
        </div>
    );
}

function MetricTile({ label, value, sub, color, highlight }) {
    return (
        <div style={{
            background: highlight ? T.oliveDim : T.paper2,
            border: `1px solid ${highlight ? T.gold : T.border}`,
            borderRadius: 4, padding: 10, textAlign: 'center',
        }}>
            <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 20,
                letterSpacing: 1, color: highlight ? T.gold : (color || T.oliveDim),
                lineHeight: 1,
            }}>
                {value}
            </div>
            {sub && (
                <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 13,
                    color: highlight ? T.goldDim : T.muted, letterSpacing: 1,
                }}>
                    {sub}
                </div>
            )}
            <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                letterSpacing: 1, color: highlight ? T.goldDim : T.muted,
                textTransform: 'uppercase', marginTop: 3,
            }}>
                {label}
            </div>
        </div>
    );
}

function InfoRow({ label, value, valueColor }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '5px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12,
        }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                {label}
            </span>
            <span style={{ fontWeight: 500, color: valueColor || T.ink }}>{value}</span>
        </div>
    );
}

function PensionTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: T.paper, border: `1px solid ${T.border}`,
            borderRadius: 4, padding: '10px 14px',
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
        }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: T.oliveDim, marginBottom: 6 }}>
                {label} · Age {payload[0]?.payload?.age}
            </div>
            {payload.map(p => (
                <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
                    {p.name}: {fmtFull(p.value)}/yr
                </div>
            ))}
        </div>
    );
}

// ── Promotion Timeline Modal ──────────────────────────────────
function PromotionTimelineModal({ timeline, onSave, onClose }) {
    const [entries, setEntries] = useState(timeline.map(e => ({ ...e })));

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(26,28,24,0.55)',
            zIndex: 500, display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', paddingTop: 60,
        }}>
            <div style={{
                background: T.paper, border: `2px solid ${T.olive}`,
                borderRadius: 4, padding: 20, width: 520,
                maxWidth: '95vw', maxHeight: '80vh', overflowY: 'auto',
            }}>
                <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 17,
                    letterSpacing: 2, color: T.oliveDim, marginBottom: 6,
                    paddingBottom: 10, borderBottom: `1px solid ${T.border}`,
                }}>
                    Promotion Timeline
                </div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 14 }}>
                    Define expected promotions by year. Base pay is recalculated automatically.
                    This timeline is shared with the TSP Projector when this plan is active.
                </div>

                {entries.length === 0 && (
                    <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: '16px 0' }}>
                        No promotions added. Click Add Entry to begin.
                    </div>
                )}

                {entries.map((entry, idx) => (
                    <div key={idx} style={{
                        display: 'grid', gridTemplateColumns: '1fr 1fr auto',
                        gap: 10, alignItems: 'end', marginBottom: 10,
                        padding: '10px 12px', background: '#fff',
                        border: `1px solid ${T.border}`, borderRadius: 4,
                    }}>
                        <div>
                            <FieldLabel>Effective Year</FieldLabel>
                            <input
                                type="number"
                                value={entry.effectiveYear}
                                onChange={e => setEntries(prev => prev.map((en, i) => i === idx ? { ...en, effectiveYear: parseInt(e.target.value) } : en))}
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <FieldLabel>Rank</FieldLabel>
                            <select
                                value={entry.rank}
                                onChange={e => setEntries(prev => prev.map((en, i) => i === idx ? { ...en, rank: e.target.value } : en))}
                                style={inputStyle}
                            >
                                {ALL_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <button
                            onClick={() => setEntries(prev => prev.filter((_, i) => i !== idx))}
                            style={{
                                background: 'transparent', border: `1px solid #d4a0a0`,
                                color: T.red, borderRadius: 3, padding: '5px 10px',
                                cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                                letterSpacing: 1, fontSize: 11,
                            }}
                        >
                            Remove
                        </button>
                    </div>
                ))}

                <button
                    onClick={() => setEntries(prev => [...prev, { effectiveYear: new Date().getFullYear() + 2, rank: 'E-6' }])}
                    style={{
                        background: 'transparent', border: `1px solid ${T.border}`,
                        color: T.olive, borderRadius: 3, padding: '6px 14px',
                        cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: 1, fontSize: 12, marginBottom: 14,
                    }}
                >
                    + Add Entry
                </button>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                    <button onClick={onClose} style={{
                        background: 'transparent', border: `1px solid ${T.border}`,
                        color: T.olive, borderRadius: 3, padding: '7px 16px',
                        cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: 1, fontSize: 13,
                    }}>Cancel</button>
                    <button onClick={() => { onSave(entries); onClose(); }} style={{
                        background: T.oliveDim, border: 'none',
                        color: T.gold, borderRadius: 3, padding: '7px 16px',
                        cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: 1.5, fontSize: 13,
                    }}>Save Timeline</button>
                </div>
            </div>
        </div>
    );
}

// ── Plan List Item ─────────────────────────────────────────────
function PlanListItem({ plan, isActive, onSelect, onDelete }) {
    return (
        <div
            onClick={onSelect}
            style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', cursor: 'pointer',
                background: isActive ? '#f0f5eb' : '#fff',
                borderLeft: `3px solid ${isActive ? T.green : 'transparent'}`,
                borderBottom: `1px solid ${T.border}`,
                transition: 'background 0.1s',
            }}
        >
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 13 }}>{plan.name}</div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginTop: 2 }}>
                    {plan.retirementSystem} · Sep: {plan.separationYear}
                </div>
            </div>
            {isActive && (
                <span style={{
                    background: '#d4eadb', color: T.success, fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                    padding: '2px 6px', borderRadius: 2,
                }}>
                    Active
                </span>
            )}
            <button
                onClick={e => { e.stopPropagation(); onDelete(plan.id); }}
                style={{
                    background: 'transparent', border: 'none', color: T.muted,
                    cursor: 'pointer', fontSize: 14, padding: '2px 6px',
                    lineHeight: 1, borderRadius: 2,
                }}
            >
                ×
            </button>
        </div>
    );
}

// ── Lump Sum Card ─────────────────────────────────────────────
function LumpSumCard({ label, lumpSumAmount, monthlyReduced, monthlyFull, color, showPV, pvFactor }) {
    const displayLumpSum = showPV ? Math.round(lumpSumAmount * pvFactor) : lumpSumAmount;
    const displayMonthly = showPV ? Math.round(monthlyReduced * pvFactor) : monthlyReduced;
    const displayFull    = showPV ? Math.round(monthlyFull    * pvFactor) : monthlyFull;

    return (
        <div style={{
            background: '#fff', border: `2px solid ${color}`,
            borderRadius: 4, padding: 14,
        }}>
            <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 14,
                letterSpacing: 1, color, marginBottom: 10,
                paddingBottom: 6, borderBottom: `1px solid ${T.border}`,
            }}>
                {label}
            </div>

            {lumpSumAmount > 0 && (
                <div style={{
                    background: `${color}11`, borderRadius: 3,
                    padding: '8px 10px', marginBottom: 10, textAlign: 'center',
                }}>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Lump Sum at Retirement
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color, letterSpacing: 1 }}>
                        {fmtFull(displayLumpSum)}
                    </div>
                </div>
            )}

            <InfoRow label="Monthly Pension"           value={`${fmtFull(displayMonthly)}/mo`} valueColor={color} />
            <InfoRow label="Annual Pension"            value={`${fmtFull(displayMonthly * 12)}/yr`} />
            {lumpSumAmount > 0 && (
                <InfoRow
                    label={`Full pension at age ${LUMP_SUM_RESTORATION_AGE}`}
                    value={`${fmtFull(displayFull)}/mo`}
                    valueColor={T.success}
                />
            )}
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
const RetirementPlansPage = () => {
    // ── Context — note: setActive not setActivePlan ───────────
    const {
        plans, activePlan, activePlanId,
        createPlan, updatePlan, deletePlan,
        setActive,       // ← correct name from context
        updateTimeline,
    } = useRetirement();

    const [showPV,        setShowPV]        = useState(false);
    const [showTimeline,  setShowTimeline]  = useState(false);
    const [showFullTable, setShowFullTable] = useState(false);

    // Service info — will come from profile once auth is wired
    const [currentRank, setCurrentRank] = useState('E-5');
    const [currentAge,  setCurrentAge]  = useState(26);
    const [currentYOS,  setCurrentYOS]  = useState(8);
    const currentYear = new Date().getFullYear();

    function updateField(field, value) {
        if (!activePlanId) return;
        updatePlan(activePlanId, { [field]: value });
    }

    // ── Projection ────────────────────────────────────────────
    const projection = useMemo(() => {
        if (!activePlan) return null;
        return buildPensionProjection({
            system:            activePlan.retirementSystem,
            currentRank,
            currentAge,
            currentYOS,
            currentYear,
            separationYear:    activePlan.separationYear,
            payRaisePct:       activePlan.payRaisePct      ?? activePlan.expectedRaisePct ?? 3.0,
            inflationPct:      activePlan.inflationPct     ?? 2.5,
            colaRatePct:       activePlan.colaRatePct      ?? 2.5,
            deathAge:          activePlan.deathAge         ?? 85,
            promotionTimeline: activePlan.promotionTimeline ?? [],
        });
    }, [activePlan, currentRank, currentAge, currentYOS, currentYear]);

    const chartData = useMemo(
        () => projection ? buildPensionChartData(projection.rows, showPV) : [],
        [projection, showPV]
    );

    const tableRows  = showFullTable ? (projection?.rows ?? []) : (projection?.rows ?? []).slice(0, 15);
    const isBRS      = activePlan?.retirementSystem === 'BRS';
    const restoreRow = projection?.rows?.find(r => r.isRestored);

    // PV factor at retirement year (for lump sum card)
    const retirementYear  = activePlan ? activePlan.separationYear : currentYear + 20;
    const lumpSumPVFactor = getPVFactorLocal(currentYear, retirementYear, activePlan?.inflationPct ?? 2.5);

    function getPVFactorLocal(base, target, inf) {
        const years = target - base;
        if (years <= 0) return 1.0;
        return 1 / Math.pow(1 + inf / 100, years);
    }

    // ── Empty state ───────────────────────────────────────────
    if (plans.length === 0) {
        return (
            <div style={{ padding: '18px 22px', background: T.paper, minHeight: '100vh' }}>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: T.oliveDim, marginBottom: 4 }}>
                    Retirement Plans
                </h1>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: 1, color: T.muted, textTransform: 'uppercase', marginBottom: 40 }}>
                    BRS · High-3 · Pension Projection
                </p>
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: T.oliveDim, marginBottom: 10 }}>
                        No Retirement Plans Yet
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.muted, marginBottom: 24 }}>
                        Create your first plan to start projecting your pension.
                    </div>
                    <button
                        onClick={() => createPlan()}
                        style={{
                            background: T.oliveDim, border: 'none', color: T.gold,
                            borderRadius: 3, padding: '10px 28px', cursor: 'pointer',
                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, fontSize: 14,
                        }}
                    >
                        + Create First Plan
                    </button>
                </div>
            </div>
        );
    }

    // ── Main render ───────────────────────────────────────────
    return (
        <div style={{ padding: '18px 22px', background: T.paper, minHeight: '100vh' }}>

            {showTimeline && activePlan && (
                <PromotionTimelineModal
                    timeline={activePlan.promotionTimeline}
                    onSave={tl => updateTimeline(activePlanId, tl)}
                    onClose={() => setShowTimeline(false)}
                />
            )}

            <div style={{ marginBottom: 18 }}>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 2, color: T.oliveDim, marginBottom: 2 }}>
                    Retirement Plans
                </h1>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, letterSpacing: 1, color: T.muted, textTransform: 'uppercase', margin: 0 }}>
                    BRS · High-3 · Pension Projection
                </p>
            </div>

            <Row>
                {/* ── LEFT: Plan list + settings ─────────────── */}
                <Col md={4}>

                    <SectionCard
                        title="My Plans"
                        action={
                            <button
                                onClick={() => createPlan()}
                                style={{
                                    background: T.gold, border: 'none', color: T.ink,
                                    borderRadius: 3, padding: '3px 10px', cursor: 'pointer',
                                    fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, fontSize: 11,
                                }}
                            >
                                + New Plan
                            </button>
                        }
                    >
                        <div style={{ margin: -14 }}>
                            {plans.map(p => (
                                <PlanListItem
                                    key={p.id}
                                    plan={p}
                                    isActive={p.id === activePlanId}
                                    onSelect={() => setActive(p.id)}   // ← setActive not setActivePlan
                                    onDelete={deletePlan}
                                />
                            ))}
                        </div>
                    </SectionCard>

                    {activePlan && (
                        <>
                            <SectionCard title="Plan Settings">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                                    <div>
                                        <FieldLabel>Plan Name</FieldLabel>
                                        <input type="text" value={activePlan.name}
                                               onChange={e => updateField('name', e.target.value)} style={inputStyle} />
                                    </div>

                                    <div>
                                        <FieldLabel>Retirement System</FieldLabel>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {['BRS', 'High-3'].map(sys => (
                                                <button key={sys} onClick={() => updateField('retirementSystem', sys)} style={{
                                                    flex: 1, padding: '7px 0', borderRadius: 3, cursor: 'pointer',
                                                    border: `1px solid ${activePlan.retirementSystem === sys ? T.olive : T.border}`,
                                                    background: activePlan.retirementSystem === sys ? T.oliveDim : 'transparent',
                                                    color: activePlan.retirementSystem === sys ? T.gold : T.muted,
                                                    fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5,
                                                    fontSize: 13, transition: 'all 0.12s',
                                                }}>
                                                    {sys}
                                                </button>
                                            ))}
                                        </div>
                                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, marginTop: 5 }}>
                                            {isBRS
                                                ? 'BRS: 2.0% × YOS · Gov TSP match · Continuation Bonus eligible'
                                                : 'High-3: 2.5% × YOS · No gov TSP match · No continuation bonus'}
                                        </div>
                                    </div>

                                    <div>
                                        <FieldLabel>Separation Year</FieldLabel>
                                        <input type="number" value={activePlan.separationYear}
                                               min={currentYear + 1} max={currentYear + 50}
                                               onChange={e => updateField('separationYear', parseInt(e.target.value) || currentYear + 20)}
                                               style={inputStyle} />
                                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, marginTop: 3 }}>
                                            YOS at retirement: {currentYOS + (activePlan.separationYear - currentYear)} · Age: {currentAge + (activePlan.separationYear - currentYear)}
                                        </div>
                                    </div>

                                    <div>
                                        <FieldLabel>Annual Pay Raise %</FieldLabel>
                                        <input type="number" value={activePlan.payRaisePct ?? activePlan.expectedRaisePct ?? 3.0}
                                               step={0.1} min={0} max={10}
                                               onChange={e => updateField('payRaisePct', parseFloat(e.target.value) || 3.0)}
                                               style={inputStyle} />
                                    </div>

                                    <div>
                                        <FieldLabel>Pension COLA %</FieldLabel>
                                        <input type="number" value={activePlan.colaRatePct ?? 2.5}
                                               step={0.1} min={0} max={10}
                                               onChange={e => updateField('colaRatePct', parseFloat(e.target.value) || 2.5)}
                                               style={inputStyle} />
                                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, marginTop: 3 }}>
                                            Annual cost-of-living adjustment applied to pension.
                                        </div>
                                    </div>

                                    <div>
                                        <FieldLabel>Inflation % (PV discounting)</FieldLabel>
                                        <input type="number" value={activePlan.inflationPct ?? 2.5}
                                               step={0.1} min={0} max={10}
                                               onChange={e => updateField('inflationPct', parseFloat(e.target.value) || 2.5)}
                                               style={inputStyle} />
                                    </div>

                                    <div>
                                        <FieldLabel>Life Expectancy</FieldLabel>
                                        <input type="number" value={activePlan.deathAge ?? 85}
                                               min={60} max={110}
                                               onChange={e => updateField('deathAge', parseInt(e.target.value) || 85)}
                                               style={inputStyle} />
                                    </div>

                                    <button onClick={() => setShowTimeline(true)} style={{
                                        background: 'transparent', border: `1px solid ${T.border}`,
                                        color: T.olive, borderRadius: 3, padding: '7px 14px',
                                        cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                                        letterSpacing: 1, fontSize: 12, textAlign: 'left',
                                    }}>
                                        Edit Promotion Timeline ({activePlan.promotionTimeline?.length ?? 0} entries) →
                                    </button>
                                </div>
                            </SectionCard>

                            <SectionCard title="Service Info">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                    <div>
                                        <FieldLabel>Current Rank</FieldLabel>
                                        <select value={currentRank} onChange={e => setCurrentRank(e.target.value)} style={inputStyle}>
                                            {ALL_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <FieldLabel>Current Age</FieldLabel>
                                        <input type="number" value={currentAge} min={17} max={70}
                                               onChange={e => setCurrentAge(parseInt(e.target.value) || 18)} style={inputStyle} />
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <FieldLabel>Years of Service</FieldLabel>
                                        <input type="number" value={currentYOS} min={0} max={40}
                                               onChange={e => setCurrentYOS(parseInt(e.target.value) || 0)} style={inputStyle} />
                                    </div>
                                </div>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, marginTop: 8 }}>
                                    Will auto-populate from your profile once authentication is complete.
                                </div>
                            </SectionCard>
                        </>
                    )}
                </Col>

                {/* ── RIGHT: Results ──────────────────────────── */}
                <Col md={8}>
                    {!activePlan ? (
                        <div style={{ textAlign: 'center', padding: 40, color: T.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                            Select a plan from the list to view projections.
                        </div>
                    ) : !projection ? (
                        <div style={{ textAlign: 'center', padding: 40, color: T.muted, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12 }}>
                            Configure plan settings to see projections.
                        </div>
                    ) : (
                        <>
                            {/* Metrics */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }}>
                                <MetricTile label="High-3 Monthly"    value={fmtFull(projection.high3Monthly)}       sub="/mo" />
                                <MetricTile label="Monthly Pension"   value={fmtFull(projection.fullMonthlyPension)} sub="/mo" highlight />
                                <MetricTile label="Annual Pension"    value={fmtDollars(projection.fullAnnualPension)} color={T.green} />
                                <MetricTile label="YOS at Retirement" value={projection.yosAtRetirement} sub={`Age ${projection.retirementAge}`} />
                            </div>

                            {/* Pension formula */}
                            <SectionCard title="Pension Calculation">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                                    <div>
                                        <InfoRow label="Retirement System"      value={activePlan.retirementSystem} />
                                        <InfoRow label="Pension Multiplier"     value={`${(projection.pensionMultiplier * 100).toFixed(1)}% per YOS`} />
                                        <InfoRow label="Years of Service"       value={projection.yosAtRetirement} />
                                        <InfoRow label="Rank at Retirement"     value={projection.rankAtRetirement} />
                                        <InfoRow label="High-3 Monthly Avg"     value={fmtFull(projection.high3Monthly)} />
                                        <InfoRow label="High-3 Annual Avg"      value={fmtFull(projection.high3Annual)} />
                                    </div>
                                    <div>
                                        <InfoRow label="Monthly Pension"    value={fmtFull(projection.fullMonthlyPension)} valueColor={T.oliveDim} />
                                        <InfoRow label="Annual Pension"     value={fmtFull(projection.fullAnnualPension)}  valueColor={T.oliveDim} />
                                        <InfoRow label="Gov TSP Match"      value={isBRS ? '✓ Included (up to 5%)'    : '✗ Not available'} valueColor={isBRS ? T.success : T.muted} />
                                        <InfoRow label="Continuation Bonus" value={isBRS ? '✓ Eligible (YOS 8–12)'    : '✗ Not available'} valueColor={isBRS ? T.success : T.muted} />
                                        <InfoRow label="Lump Sum Option"    value={isBRS ? '✓ 25% or 50% available'   : '✗ Not available'} valueColor={isBRS ? T.success : T.muted} />
                                    </div>
                                </div>
                                <div style={{
                                    background: T.paper2, borderRadius: 3, padding: '8px 12px',
                                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.oliveDim,
                                }}>
                                    Formula: {fmtFull(projection.high3Monthly)}/mo × {(projection.pensionMultiplier * 100).toFixed(1)}% × {projection.yosAtRetirement} YOS = <strong>{fmtFull(projection.fullMonthlyPension)}/mo</strong>
                                </div>
                            </SectionCard>

                            {/* BRS lump sum */}
                            {isBRS && (
                                <SectionCard title="Lump Sum Options">
                                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginBottom: 12 }}>
                                        BRS members may elect a lump sum at retirement in exchange for a reduced pension until age {LUMP_SUM_RESTORATION_AGE}, when the full pension restores.
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                                        <LumpSumCard
                                            label="No Lump Sum"
                                            lumpSumAmount={0}
                                            monthlyReduced={projection.fullMonthlyPension}
                                            monthlyFull={projection.fullMonthlyPension}
                                            color={T.olive}
                                            showPV={showPV}
                                            pvFactor={lumpSumPVFactor}
                                        />
                                        <LumpSumCard
                                            label="25% Lump Sum"
                                            lumpSumAmount={projection.lumpSum25Amount}
                                            monthlyReduced={projection.fullMonthlyPension * 0.75}
                                            monthlyFull={projection.fullMonthlyPension}
                                            color={T.blue}
                                            showPV={showPV}
                                            pvFactor={lumpSumPVFactor}
                                        />
                                        <LumpSumCard
                                            label="50% Lump Sum"
                                            lumpSumAmount={projection.lumpSum50Amount}
                                            monthlyReduced={projection.fullMonthlyPension * 0.50}
                                            monthlyFull={projection.fullMonthlyPension}
                                            color={T.purple}
                                            showPV={showPV}
                                            pvFactor={lumpSumPVFactor}
                                        />
                                    </div>
                                </SectionCard>
                            )}

                            {/* PV/FV toggle */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 6,
                                marginBottom: 12, padding: '8px 12px',
                                background: showPV ? '#eef4fb' : T.paper2,
                                border: `1px solid ${showPV ? T.blue : T.border}`,
                                borderRadius: 4,
                            }}>
                                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>
                                    Dollar Display:
                                </span>
                                {['Future Value', 'Present Value'].map(label => {
                                    const isPV   = label === 'Present Value';
                                    const active = showPV === isPV;
                                    return (
                                        <button key={label} onClick={() => setShowPV(isPV)} style={{
                                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, fontSize: 12,
                                            padding: '4px 14px', borderRadius: 3, cursor: 'pointer', border: 'none',
                                            background: active ? (isPV ? T.blue : T.oliveDim) : 'transparent',
                                            color: active ? (isPV ? '#fff' : T.gold) : T.muted,
                                            transition: 'all 0.15s',
                                        }}>
                                            {label}
                                        </button>
                                    );
                                })}
                                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginLeft: 4 }}>
                                    {showPV
                                        ? `Discounted at ${activePlan.inflationPct ?? 2.5}% · ${currentYear} dollars`
                                        : `Nominal future dollars with ${activePlan.colaRatePct ?? 2.5}% COLA`}
                                </span>
                            </div>

                            {/* Chart */}
                            <SectionCard title="Pension Over Time">
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke={T.paper3} />
                                        <XAxis dataKey="year" tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: T.muted }} tickLine={false} />
                                        <YAxis tickFormatter={v => fmtDollars(v)} tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: T.muted }} tickLine={false} axisLine={false} />
                                        <Tooltip content={<PensionTooltip />} />
                                        <Legend wrapperStyle={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }} />

                                        {isBRS && restoreRow && (
                                            <ReferenceLine
                                                x={restoreRow.year}
                                                stroke={T.gold}
                                                strokeDasharray="4 2"
                                                label={{ value: `Age ${LUMP_SUM_RESTORATION_AGE} — Pension Restores`, position: 'top', fontSize: 9, fill: T.goldDim, fontFamily: "'IBM Plex Mono', monospace" }}
                                            />
                                        )}

                                        <Line type="monotone" dataKey="noLumpSum" name="No Lump Sum"   stroke={T.olive}  strokeWidth={2.5} dot={false} />
                                        {isBRS && <Line type="monotone" dataKey="lumpSum25" name="25% Lump Sum" stroke={T.blue}   strokeWidth={2} dot={false} strokeDasharray="6 2" />}
                                        {isBRS && <Line type="monotone" dataKey="lumpSum50" name="50% Lump Sum" stroke={T.purple} strokeWidth={2} dot={false} strokeDasharray="3 3" />}
                                    </ComposedChart>
                                </ResponsiveContainer>
                                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, marginTop: 8 }}>
                                    {isBRS
                                        ? `Lump sum options reduce pension until age ${LUMP_SUM_RESTORATION_AGE}, then restore to full. COLA: ${activePlan.colaRatePct ?? 2.5}%/yr.`
                                        : `High-3 pension with ${activePlan.colaRatePct ?? 2.5}% annual COLA applied.`}
                                </div>
                            </SectionCard>

                            {/* Year-by-year table */}
                            <SectionCard title="Year-by-Year Pension Breakdown">
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                        <thead>
                                        <tr style={{ background: T.oliveDim }}>
                                            {[
                                                'Year', 'Age',
                                                'Annual (No LS)',
                                                ...(isBRS ? ['Annual (25% LS)', 'Annual (50% LS)'] : []),
                                                'Monthly',
                                                'Status',
                                            ].map(h => (
                                                <th key={h} style={{
                                                    color: '#e0c068', fontFamily: "'IBM Plex Mono', monospace",
                                                    fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                                                    padding: '7px 8px', textAlign: 'left', fontWeight: 400, whiteSpace: 'nowrap',
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {tableRows.map((row, i) => {
                                            const annual_none  = showPV ? row.pvAnnualPension_none  : row.annualPension_none;
                                            const annual_25    = showPV ? row.pvAnnualPension_25    : row.annualPension_25;
                                            const annual_50    = showPV ? row.pvAnnualPension_50    : row.annualPension_50;
                                            const monthly_none = showPV ? row.pvMonthlyPension_none : row.monthlyPension_none;

                                            return (
                                                <tr key={row.year} style={{ background: i % 2 === 0 ? '#fff' : T.paper2 }}>
                                                    <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace" }}>{row.year}</td>
                                                    <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace" }}>{row.age}</td>
                                                    <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", color: T.olive, fontWeight: 500 }}>{fmtFull(annual_none)}</td>
                                                    {isBRS && <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", color: T.blue }}>{fmtFull(annual_25)}</td>}
                                                    {isBRS && <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", color: T.purple }}>{fmtFull(annual_50)}</td>}
                                                    <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace" }}>{fmtFull(monthly_none)}/mo</td>
                                                    <td style={{ padding: '6px 8px' }}>
                                                            <span style={{
                                                                background: row.isRestored ? '#d4eadb' : T.paper3,
                                                                color: row.isRestored ? T.success : T.muted,
                                                                borderRadius: 2, fontFamily: "'IBM Plex Mono', monospace",
                                                                fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                                                                padding: '2px 5px',
                                                            }}>
                                                                {row.isRestored ? 'Full Pension' : isBRS ? 'Reduced' : 'Full Pension'}
                                                            </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                                {(projection?.rows?.length ?? 0) > 15 && (
                                    <div style={{ textAlign: 'center', marginTop: 12 }}>
                                        <button onClick={() => setShowFullTable(t => !t)} style={{
                                            background: 'transparent', border: `1px solid ${T.border}`,
                                            color: T.olive, borderRadius: 3, padding: '6px 16px',
                                            cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                                            letterSpacing: 1, fontSize: 12,
                                        }}>
                                            {showFullTable ? 'Show Less' : `Show All ${projection?.rows?.length} Years`}
                                        </button>
                                    </div>
                                )}
                            </SectionCard>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
};

export default RetirementPlansPage;