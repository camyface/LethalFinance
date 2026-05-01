import { useState, useMemo, useEffect } from 'react';
import {
    ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { Row, Col } from 'react-bootstrap';
import { buildProjection, buildChartData, getDisplayRows, fmtDollars, fmtFull, DEFAULT_INFLATION_PCT } from '../utils/tspCalculations.js';
import { getMonthlyBasePay, ALL_RANKS } from '../utils/basePay.js';
import { useRetirement } from '../context/RetirementContext.jsx';

// ── Theme tokens ──────────────────────────────────────────────
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
    ink:      '#1a1c18',
};

// ── Sub-components ────────────────────────────────────────────

function SectionCard({ title, children, action }) {
    return (
        <div style={{
            background: '#fff',
            border: `1px solid ${T.border}`,
            borderRadius: 4,
            marginBottom: 16,
        }}>
            <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 14,
                letterSpacing: 1,
                color: T.oliveDim,
                padding: '10px 14px',
                borderBottom: `1px solid ${T.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                {title}
                {action}
            </div>
            <div style={{ padding: 14 }}>{children}</div>
        </div>
    );
}

function FieldLabel({ children }) {
    return (
        <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            letterSpacing: 1.5,
            color: T.muted,
            textTransform: 'uppercase',
            marginBottom: 3,
        }}>
            {children}
        </div>
    );
}

function MetricTile({ label, value, color }) {
    return (
        <div style={{
            background: T.paper2,
            border: `1px solid ${T.border}`,
            borderRadius: 4,
            padding: 10,
            textAlign: 'center',
        }}>
            <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22,
                letterSpacing: 1,
                color: color || T.oliveDim,
                lineHeight: 1,
            }}>
                {value}
            </div>
            <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9,
                letterSpacing: 1,
                color: T.muted,
                textTransform: 'uppercase',
                marginTop: 3,
            }}>
                {label}
            </div>
        </div>
    );
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: T.paper,
            border: `1px solid ${T.border}`,
            borderRadius: 4,
            padding: '10px 14px',
            fontSize: 11,
            fontFamily: "'IBM Plex Mono', monospace",
        }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: T.oliveDim, marginBottom: 6 }}>
                {label} · Age {payload[0]?.payload?.age}
            </div>
            {payload.map(p => (
                <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
                    {p.name}: {fmtFull(p.value)}
                </div>
            ))}
        </div>
    );
}

const PHASE_BADGE = {
    accumulation: { bg: '#d4eadb', color: T.success, label: 'Contributing' },
    deferred:     { bg: T.paper3,  color: T.muted,   label: 'Deferred Growth' },
    withdrawal:   { bg: '#fceaea', color: T.red,      label: 'Withdrawing' },
};

// ── Promotion Timeline Modal ──────────────────────────────────

function PromotionTimelineModal({ timeline, onSave, onClose }) {
    const [entries, setEntries] = useState(timeline.map(e => ({ ...e })));

    const add    = () => setEntries(p => [...p, { effectiveYear: new Date().getFullYear() + 2, rank: 'E-5' }]);
    const remove = i => setEntries(p => p.filter((_, j) => j !== i));
    const update = (i, f, v) => setEntries(p => p.map((e, j) => j === i ? { ...e, [f]: v } : e));

    const inputS = {
        background: T.paper, border: `1px solid ${T.border}`,
        borderRadius: 3, padding: '5px 8px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, width: '100%',
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(26,28,24,0.55)',
            zIndex: 500,
            display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', paddingTop: 60,
        }}>
            <div style={{
                background: T.paper,
                border: `2px solid ${T.olive}`,
                borderRadius: 4,
                padding: 20,
                width: 520,
                maxWidth: '95vw',
                maxHeight: '80vh',
                overflowY: 'auto',
            }}>
                <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: 17, letterSpacing: 2, color: T.oliveDim,
                    marginBottom: 6, paddingBottom: 10, borderBottom: `1px solid ${T.border}`,
                }}>
                    Promotion Timeline
                </div>
                <div style={{ fontSize: 11, color: T.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 14 }}>
                    Define expected promotions by year. Base pay will be recalculated automatically.
                    {' '}Changes here are local to TSP — edit the active plan to persist.
                </div>

                {entries.length === 0 && (
                    <div style={{ fontSize: 12, color: T.muted, textAlign: 'center', padding: '16px 0' }}>
                        No promotions added yet. Click Add Entry to begin.
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
                            <input type="number" value={entry.effectiveYear}
                                   onChange={e => update(idx, 'effectiveYear', parseInt(e.target.value))}
                                   style={inputS} />
                        </div>
                        <div>
                            <FieldLabel>Rank</FieldLabel>
                            <select value={entry.rank} onChange={e => update(idx, 'rank', e.target.value)} style={inputS}>
                                {ALL_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <button onClick={() => remove(idx)} style={{
                            background: 'transparent', border: '1px solid #d4a0a0',
                            color: T.red, borderRadius: 3, padding: '5px 10px',
                            cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                            letterSpacing: 1, fontSize: 11,
                        }}>
                            Remove
                        </button>
                    </div>
                ))}

                <button onClick={add} style={{
                    background: 'transparent', border: `1px solid ${T.border}`,
                    color: T.olive, borderRadius: 3, padding: '6px 14px',
                    cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                    letterSpacing: 1, fontSize: 12, marginBottom: 14,
                }}>
                    + Add Entry
                </button>

                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                    <button onClick={onClose} style={{
                        background: 'transparent', border: `1px solid ${T.border}`,
                        color: T.olive, borderRadius: 3, padding: '7px 16px',
                        cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: 1, fontSize: 13,
                    }}>
                        Cancel
                    </button>
                    <button onClick={() => { onSave(entries); onClose(); }} style={{
                        background: T.oliveDim, border: 'none',
                        color: T.gold, borderRadius: 3, padding: '7px 16px',
                        cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                        letterSpacing: 1.5, fontSize: 13,
                    }}>
                        Save Timeline
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── TSP Fund presets ──────────────────────────────────────────
const FUND_PRESETS = [
    { label: 'C Fund (S&P 500)',    value: 7.0 },
    { label: 'S Fund (Small Cap)',  value: 6.5 },
    { label: 'I Fund (Intl)',       value: 5.5 },
    { label: 'G Fund (Gov Bonds)',  value: 3.5 },
    { label: 'F Fund (Bond Index)', value: 4.0 },
    { label: 'L 2045',             value: 6.8 },
    { label: 'L 2050',             value: 7.0 },
    { label: 'Custom',             value: null },
];

// ── Main TspPage ──────────────────────────────────────────────

export const TspPage = () => {

    const currentYear = new Date().getFullYear();

    // ── Pull defaults from active retirement plan ─────────────
    const { activePlan, activeTimeline } = useRetirement();

    // ── Input state — seeded from active plan on mount ────────
    const [rank,               setRank]               = useState(activePlan?.currentRank    ?? 'E-5');
    const [currentYOS,         setCurrentYOS]         = useState(activePlan?.currentYOS     ?? 8);
    const [currentAge,         setCurrentAge]         = useState(activePlan?.currentAge     ?? 26);
    const [currentBalance,     setCurrentBalance]     = useState(48000);
    const [memberContribPct,   setMemberContribPct]   = useState(5);
    const [fundPreset,         setFundPreset]         = useState('C Fund (S&P 500)');
    const [expectedReturn,     setExpectedReturn]     = useState(7.0);
    const [separationYear,     setSeparationYear]     = useState(activePlan?.separationYear ?? currentYear + 12);
    const [withdrawalStartAge, setWithdrawalStartAge] = useState(59.5);
    const [useRule55,          setUseRule55]           = useState(false);
    const [withdrawalRate,     setWithdrawalRate]     = useState(4.0);
    const [deathAge,           setDeathAge]           = useState(activePlan?.deathAge       ?? 85);
    const [inflationPct,       setInflationPct]       = useState(activePlan?.inflationPct   ?? DEFAULT_INFLATION_PCT);
    const [promotionTimeline,  setPromotionTimeline]  = useState(activeTimeline);
    const [showTimelineModal,  setShowTimelineModal]  = useState(false);
    const [showFullTable,      setShowFullTable]      = useState(false);
    const [showPV,             setShowPV]             = useState(false);

    // ── Sync inputs when active plan changes ──────────────────
    // Dependency on activePlan?.id means this only fires when the
    // user switches to a different plan, not on every field edit.
    useEffect(() => {
        if (!activePlan) return;
        setRank(activePlan.currentRank);
        setCurrentYOS(activePlan.currentYOS);
        setCurrentAge(activePlan.currentAge);
        setSeparationYear(activePlan.separationYear);
        setInflationPct(activePlan.inflationPct);
        setDeathAge(activePlan.deathAge);
    }, [activePlan?.id]);

    // ── Keep local promotion timeline in sync with active plan ─
    // When the user edits the timeline on the retirement plans page,
    // the TSP page picks it up automatically.
    useEffect(() => {
        setPromotionTimeline(activeTimeline);
    }, [activeTimeline]);

    // ── Active plan banner ────────────────────────────────────
    const planBanner = activePlan
        ? `Seeded from active plan: ${activePlan.name} · ${activePlan.retirementSystem}`
        : null;

    // ── Derived values ────────────────────────────────────────
    const monthlyBasePay = getMonthlyBasePay(rank, currentYOS);
    const memberMonthly  = monthlyBasePay * (memberContribPct / 100);
    const govMonthly     = (() => {
        const auto = monthlyBasePay * 0.01;
        const pct  = memberContribPct / 100;
        let match  = 0;
        if (pct >= 0.03) {
            match = monthlyBasePay * 0.03 + Math.min(pct - 0.03, 0.02) * monthlyBasePay * 0.5;
        } else {
            match = monthlyBasePay * pct;
        }
        return auto + match;
    })();

    const separationAge          = currentAge + (separationYear - currentYear);
    const rule55Eligible         = separationAge >= 55;
    const effectiveWithdrawalAge = useRule55 && rule55Eligible ? 55 : withdrawalStartAge;

    // ── Projection ────────────────────────────────────────────
    const projectionRows = useMemo(() => buildProjection({
        currentYear,
        currentAge,
        currentYOS,
        currentRank:        rank,
        currentTspBalance:  currentBalance,
        memberContribPct,
        expectedReturnPct:  expectedReturn,
        separationYear,
        withdrawalStartAge: effectiveWithdrawalAge,
        withdrawalRatePct:  withdrawalRate,
        deathAge,
        promotionTimeline,
        inflationPct,
    }), [
        currentYear, currentAge, currentYOS, rank, currentBalance,
        memberContribPct, expectedReturn, separationYear,
        effectiveWithdrawalAge, withdrawalRate, deathAge, promotionTimeline, inflationPct,
    ]);

    const chartData   = useMemo(() => buildChartData(projectionRows, showPV),    [projectionRows, showPV]);
    const displayRows = useMemo(() => getDisplayRows(projectionRows, showPV),     [projectionRows, showPV]);

    const separationRow = displayRows.find(r => r.year === separationYear);
    const withdrawalRow = displayRows.find(r => r.age >= effectiveWithdrawalAge);
    const peakRow       = displayRows.reduce((a, b) => b.tspBalance > a.tspBalance ? b : a, displayRows[0] || {});
    const tableRows     = showFullTable ? displayRows : displayRows.slice(0, 15);

    // ── Handlers ──────────────────────────────────────────────
    function handleFundPreset(label) {
        setFundPreset(label);
        const preset = FUND_PRESETS.find(f => f.label === label);
        if (preset?.value !== null) setExpectedReturn(preset.value);
    }

    const inputStyle = {
        background: T.paper, border: `1px solid ${T.border}`,
        borderRadius: 3, padding: '6px 9px',
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
        color: T.ink, width: '100%', outline: 'none',
    };

    // ── Render ────────────────────────────────────────────────
    return (
        <div style={{ padding: '18px 22px', background: T.paper, minHeight: '100vh' }}>

            {showTimelineModal && (
                <PromotionTimelineModal
                    timeline={promotionTimeline}
                    onSave={setPromotionTimeline}
                    onClose={() => setShowTimelineModal(false)}
                />
            )}

            {/* Page header */}
            <div style={{ marginBottom: planBanner ? 8 : 20 }}>
                <h1 style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                    letterSpacing: 2, color: T.oliveDim, marginBottom: 2,
                }}>
                    TSP Projector
                </h1>
                <p style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                    letterSpacing: 1, color: T.muted, textTransform: 'uppercase', margin: 0,
                }}>
                    Thrift Savings Plan · BRS Blended Retirement System
                </p>
            </div>

            {/* Active plan banner */}
            {planBanner && (
                <div style={{
                    fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                    color: T.success, background: '#eaf3de',
                    border: `1px solid #b2d6a0`, borderRadius: 3,
                    padding: '6px 12px', marginBottom: 16,
                    display: 'flex', alignItems: 'center', gap: 8,
                }}>
                    <span>◈</span>
                    <span>{planBanner} · Inputs seeded automatically. Override any field below.</span>
                </div>
            )}

            <Row>
                {/* ── LEFT COLUMN: Inputs ───────────────────────────── */}
                <Col md={4}>

                    <SectionCard title="Service Info">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                            <div>
                                <FieldLabel>Rank</FieldLabel>
                                <select value={rank} onChange={e => setRank(e.target.value)} style={inputStyle}>
                                    {ALL_RANKS.map(r => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <FieldLabel>Years of Service</FieldLabel>
                                <input type="number" value={currentYOS} min={0} max={40}
                                       onChange={e => setCurrentYOS(parseInt(e.target.value) || 0)} style={inputStyle} />
                            </div>
                            <div>
                                <FieldLabel>Current Age</FieldLabel>
                                <input type="number" value={currentAge} min={17} max={70}
                                       onChange={e => setCurrentAge(parseInt(e.target.value) || 18)} style={inputStyle} />
                            </div>
                            <div>
                                <FieldLabel>Current TSP Balance ($)</FieldLabel>
                                <input type="number" value={currentBalance} min={0}
                                       onChange={e => setCurrentBalance(parseFloat(e.target.value) || 0)} style={inputStyle} />
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard title="TSP Contributions">
                        <div style={{ marginBottom: 10 }}>
                            <FieldLabel>Member Contribution %</FieldLabel>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <input type="range" min={0} max={100} value={memberContribPct}
                                       onChange={e => setMemberContribPct(parseFloat(e.target.value))}
                                       style={{ flex: 1, accentColor: T.gold }} />
                                <input type="number" value={memberContribPct} min={0} max={100} step={0.5}
                                       onChange={e => setMemberContribPct(parseFloat(e.target.value) || 0)}
                                       style={{ ...inputStyle, width: 60 }} />
                            </div>
                        </div>

                        {/* Live calculation panel */}
                        <div style={{
                            background: T.paper2, borderRadius: 3, padding: '10px 12px',
                            border: `1px solid ${T.border}`, marginTop: 8,
                        }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                                {[
                                    { label: 'Base Pay',         val: fmtFull(monthlyBasePay) + '/mo' },
                                    { label: 'Your Contribution', val: fmtFull(memberMonthly)  + '/mo' },
                                    { label: 'Gov Match',         val: fmtFull(govMonthly)     + '/mo' },
                                    { label: 'Total Monthly',     val: fmtFull(memberMonthly + govMonthly) + '/mo' },
                                ].map(({ label, val }) => (
                                    <div key={label}>
                                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>{label}</div>
                                        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500 }}>{val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginTop: 10, fontSize: 10, color: T.muted, fontFamily: "'IBM Plex Mono', monospace" }}>
                            Gov match: 1% auto + up to 4% matched (max 5%). Contribute at least 5% to get full match.
                        </div>
                    </SectionCard>

                    <SectionCard title="Growth & Withdrawal">

                        <div style={{ marginBottom: 10 }}>
                            <FieldLabel>Fund / Expected Return</FieldLabel>
                            <select value={fundPreset} onChange={e => handleFundPreset(e.target.value)} style={inputStyle}>
                                {FUND_PRESETS.map(f => <option key={f.label} value={f.label}>{f.label}</option>)}
                            </select>
                            {fundPreset === 'Custom' && (
                                <input type="number" value={expectedReturn} step={0.1} min={0} max={20}
                                       onChange={e => setExpectedReturn(parseFloat(e.target.value) || 0)}
                                       style={{ ...inputStyle, marginTop: 6 }} placeholder="Return %" />
                            )}
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.goldDim, marginTop: 4 }}>
                                Assumed return: {expectedReturn}% annually
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <FieldLabel>Separation Year</FieldLabel>
                            <input type="number" value={separationYear} min={currentYear} max={currentYear + 50}
                                   onChange={e => setSeparationYear(parseInt(e.target.value) || currentYear + 12)} style={inputStyle} />
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginTop: 3 }}>
                                Age at separation: {separationAge} · YOS at separation: {currentYOS + (separationYear - currentYear)}
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <FieldLabel>TSP Withdrawal Start Age</FieldLabel>
                            <input type="number" value={withdrawalStartAge} min={55} max={75} step={0.5}
                                   onChange={e => setWithdrawalStartAge(parseFloat(e.target.value) || 59.5)} style={inputStyle} />

                            {/* Rule of 55 */}
                            <div style={{
                                marginTop: 8, padding: '8px 10px',
                                background: rule55Eligible ? T.paper2 : '#f8f8f6',
                                border: `1px solid ${rule55Eligible ? T.border : '#ddd'}`,
                                borderRadius: 3,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <input
                                        type="checkbox"
                                        id="rule55"
                                        checked={useRule55}
                                        disabled={!rule55Eligible}
                                        onChange={e => setUseRule55(e.target.checked)}
                                        style={{ accentColor: T.gold }}
                                    />
                                    <label htmlFor="rule55" style={{
                                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
                                        color: rule55Eligible ? T.ink : T.muted,
                                        cursor: rule55Eligible ? 'pointer' : 'default',
                                    }}>
                                        Apply Rule of 55 (penalty-free at separation)
                                    </label>
                                </div>
                                {!rule55Eligible && (
                                    <div style={{ fontSize: 10, color: T.muted, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>
                                        Requires separation at age ≥ 55. Your separation age: {separationAge}.
                                    </div>
                                )}
                                {rule55Eligible && useRule55 && (
                                    <div style={{ fontSize: 10, color: T.success, fontFamily: "'IBM Plex Mono', monospace", marginTop: 4 }}>
                                        ✓ Withdrawals begin at separation (age {separationAge})
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <FieldLabel>Annual Withdrawal Rate %</FieldLabel>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <input type="range" min={1} max={10} step={0.5} value={withdrawalRate}
                                       onChange={e => setWithdrawalRate(parseFloat(e.target.value))}
                                       style={{ flex: 1, accentColor: T.gold }} />
                                <input type="number" value={withdrawalRate} step={0.5} min={1} max={10}
                                       onChange={e => setWithdrawalRate(parseFloat(e.target.value) || 4)}
                                       style={{ ...inputStyle, width: 60 }} />
                            </div>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginTop: 3 }}>
                                4% is the standard safe withdrawal rate guideline.
                            </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                            <FieldLabel>Life Expectancy (Death Age)</FieldLabel>
                            <input type="number" value={deathAge} min={60} max={110}
                                   onChange={e => setDeathAge(parseInt(e.target.value) || 85)} style={inputStyle} />
                        </div>

                        <div style={{ paddingTop: 12, borderTop: `1px solid ${T.border}` }}>
                            <FieldLabel>Assumed Inflation Rate %</FieldLabel>
                            <input type="number" value={inflationPct} step={0.1} min={0} max={10}
                                   onChange={e => setInflationPct(parseFloat(e.target.value) || 2.5)} style={inputStyle} />
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginTop: 3 }}>
                                Used only for present value discounting.
                            </div>
                        </div>

                    </SectionCard>

                </Col>

                {/* ── RIGHT COLUMN: Results ─────────────────────────── */}
                <Col md={8}>

                    {/* Key metric tiles */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 16 }}>
                        <MetricTile label="Balance at Separation" value={fmtDollars(separationRow?.tspBalance ?? 0)} />
                        <MetricTile label="Peak Balance"          value={fmtDollars(peakRow?.tspBalance ?? 0)} color={T.goldDim} />
                        <MetricTile label="Annual Withdrawal"     value={fmtDollars(withdrawalRow?.annualWithdrawal ?? 0)} color={T.green} />
                        <MetricTile label="Balance at Death Age"  value={fmtDollars(displayRows[displayRows.length - 1]?.tspBalance ?? 0)} />
                    </div>

                    {/* PV / FV toggle */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        marginBottom: 12, padding: '8px 12px',
                        background: showPV ? '#eef4fb' : T.paper2,
                        border: `1px solid ${showPV ? '#4a7ab5' : T.border}`,
                        borderRadius: 4,
                    }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>
              Dollar Display:
            </span>
                        <button onClick={() => setShowPV(false)} style={{
                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, fontSize: 12,
                            padding: '4px 14px', borderRadius: 3, cursor: 'pointer', border: 'none',
                            background: !showPV ? T.oliveDim : 'transparent',
                            color: !showPV ? T.gold : T.muted,
                            transition: 'all 0.15s',
                        }}>
                            Future Value
                        </button>
                        <button onClick={() => setShowPV(true)} style={{
                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, fontSize: 12,
                            padding: '4px 14px', borderRadius: 3, cursor: 'pointer', border: 'none',
                            background: showPV ? '#4a7ab5' : 'transparent',
                            color: showPV ? '#ffffff' : T.muted,
                            transition: 'all 0.15s',
                        }}>
                            Present Value
                        </button>
                        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginLeft: 4 }}>
              {showPV
                  ? `Discounted at ${inflationPct}% inflation · ${new Date().getFullYear()} dollars`
                  : 'Nominal future dollars'}
            </span>
                    </div>

                    {/* Chart */}
                    <SectionCard
                        title="TSP Balance Projection"
                        action={
                            <button onClick={() => setShowTimelineModal(true)} style={{
                                background: 'transparent', border: `1px solid ${T.border}`,
                                color: T.olive, borderRadius: 3, padding: '3px 10px',
                                cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                                letterSpacing: 1, fontSize: 11,
                            }}>
                                Edit Promotion Timeline ({promotionTimeline.length})
                            </button>
                        }
                    >
                        <ResponsiveContainer width="100%" height={320}>
                            <ComposedChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={T.paper3} />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: T.muted }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tickFormatter={v => fmtDollars(v)}
                                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fill: T.muted }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10 }} />

                                <ReferenceLine
                                    x={separationYear}
                                    stroke={T.gold}
                                    strokeDasharray="4 2"
                                    label={{ value: 'Separation', position: 'top', fontSize: 10, fill: T.goldDim, fontFamily: "'IBM Plex Mono', monospace" }}
                                />
                                {withdrawalRow && (
                                    <ReferenceLine
                                        x={withdrawalRow.year}
                                        stroke={T.red}
                                        strokeDasharray="4 2"
                                        label={{ value: 'Withdrawals Begin', position: 'top', fontSize: 10, fill: T.red, fontFamily: "'IBM Plex Mono', monospace" }}
                                    />
                                )}

                                <Bar dataKey="memberContrib" name="Member Contribution" stackId="contrib" fill={T.olive} opacity={0.8} />
                                <Bar dataKey="govContrib"    name="Gov Match"           stackId="contrib" fill={T.gold}  opacity={0.8} />

                                <Line type="monotone" dataKey="balance"    name="TSP Balance"       stroke={T.blue} strokeWidth={2.5} dot={false} />
                                <Line type="monotone" dataKey="withdrawal" name="Annual Withdrawal"  stroke={T.red}  strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
                            </ComposedChart>
                        </ResponsiveContainer>

                        {/* Phase legend */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                            {Object.entries(PHASE_BADGE).map(([key, { bg, color, label }]) => (
                                <div key={key} style={{
                                    background: bg, color, borderRadius: 2,
                                    fontFamily: "'IBM Plex Mono', monospace",
                                    fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                                    padding: '2px 7px',
                                }}>
                                    {label}
                                </div>
                            ))}
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, marginLeft: 'auto' }}>
                                Bars = annual contributions · Line = TSP balance · Dashed = withdrawals
                            </div>
                        </div>
                    </SectionCard>

                    {/* Year-by-year table */}
                    <SectionCard title="Year-by-Year Breakdown">
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                                <thead>
                                <tr style={{ background: T.oliveDim }}>
                                    {['Year','Age','YOS','Rank','Base Pay','Member Contrib','Gov Match','TSP Balance','Withdrawal','Phase'].map(h => (
                                        <th key={h} style={{
                                            color: '#e0c068', fontFamily: "'IBM Plex Mono', monospace",
                                            fontSize: 9, letterSpacing: 1, textTransform: 'uppercase',
                                            padding: '7px 8px', textAlign: 'left', fontWeight: 400,
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {tableRows.map((row, i) => (
                                    <tr key={row.year} style={{ background: i % 2 === 0 ? '#fff' : T.paper2 }}>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace" }}>{row.year}</td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace" }}>{row.age}</td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace" }}>{row.yos}</td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500 }}>{row.rank}</td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace" }}>{fmtFull(row.annualBasePay)}</td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", color: T.olive }}>
                                            {fmtFull(row.annualMemberContrib)}
                                            {row.memberCapped && <span title="IRS limit applied" style={{ color: T.gold, marginLeft: 4 }}>⚠</span>}
                                        </td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", color: T.goldDim }}>{fmtFull(row.annualGovContrib)}</td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600 }}>{fmtDollars(row.tspBalance)}</td>
                                        <td style={{ padding: '6px 8px', fontFamily: "'IBM Plex Mono', monospace", color: row.annualWithdrawal > 0 ? T.red : T.muted }}>
                                            {row.annualWithdrawal > 0 ? fmtFull(row.annualWithdrawal) : '—'}
                                        </td>
                                        <td style={{ padding: '6px 8px' }}>
                        <span style={{
                            background: PHASE_BADGE[row.phase]?.bg,
                            color: PHASE_BADGE[row.phase]?.color,
                            borderRadius: 2, fontSize: 9,
                            fontFamily: "'IBM Plex Mono', monospace",
                            letterSpacing: 1, textTransform: 'uppercase',
                            padding: '2px 5px',
                        }}>
                          {PHASE_BADGE[row.phase]?.label}
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {projectionRows.length > 15 && (
                            <div style={{ textAlign: 'center', marginTop: 12 }}>
                                <button onClick={() => setShowFullTable(t => !t)} style={{
                                    background: 'transparent', border: `1px solid ${T.border}`,
                                    color: T.olive, borderRadius: 3, padding: '6px 16px',
                                    cursor: 'pointer', fontFamily: "'Bebas Neue', sans-serif",
                                    letterSpacing: 1, fontSize: 12,
                                }}>
                                    {showFullTable ? 'Show Less' : `Show All ${projectionRows.length} Years`}
                                </button>
                            </div>
                        )}
                    </SectionCard>

                </Col>
            </Row>
        </div>
    );
};

export default TspPage;