import { useState, useEffect, useMemo } from 'react';
import { getAllGoals, createGoal, updateGoal, deleteGoal } from '../services/GoalService.js';

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
    ink:      '#1a1c18',
};

// ── Goal type config ──────────────────────────────────────────
const GOAL_TYPES = [
    { value: 'savings',        label: 'Savings',        icon: '◈', color: T.green,   bg: '#eaf3de', text: '#2a5c1a' },
    { value: 'debt_payoff',    label: 'Debt Payoff',    icon: '◉', color: T.red,     bg: '#fceaea', text: '#6b1a1a' },
    { value: 'investment',     label: 'Investment',     icon: '▲', color: T.blue,    bg: '#eef4fb', text: '#0c3a6b' },
    { value: 'emergency_fund', label: 'Emergency Fund', icon: '◎', color: T.gold,    bg: '#fdf5e0', text: '#5a3a00' },
    { value: 'education',      label: 'Education',      icon: '◫', color: '#7a5ab5', bg: '#f3eefb', text: '#3a1a6b' },
    { value: 'vehicle',        label: 'Vehicle',        icon: '▦', color: T.muted,   bg: T.paper2,  text: '#3a3830' },
    { value: 'home',           label: 'Home',           icon: '⊞', color: '#c8704a', bg: '#fdf0e8', text: '#5a2a00' },
    { value: 'vacation',       label: 'Vacation',       icon: '◧', color: T.goldDim, bg: '#fef9ec', text: '#5a3a00' },
];

const GOAL_STATUS = [
    { value: 'active',    label: 'Active' },
    { value: 'paused',    label: 'Paused' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const FILTER_OPTIONS = ['All', 'Active', 'Paused', 'Completed'];

function getTypeConfig(value) {
    return GOAL_TYPES.find(t => t.value === value) ?? GOAL_TYPES[0];
}

// ── Formatters ────────────────────────────────────────────────
function fmtDollars(n) {
    if (n == null || isNaN(n)) return '$0';
    const num = parseFloat(n);
    if (num >= 1_000_000) return '$' + (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000)     return '$' + Math.round(num / 1_000) + 'K';
    return '$' + Math.round(num).toLocaleString();
}

function fmtFull(n) {
    if (n == null || isNaN(n)) return '$0';
    return '$' + parseFloat(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function calcProgress(current, target) {
    if (!target || parseFloat(target) === 0) return 0;
    return Math.min(Math.round((parseFloat(current) / parseFloat(target)) * 100), 100);
}

function monthsUntil(dateStr) {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now    = new Date();
    const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    return months;
}

function calcMonthlyNeeded(remaining, targetDate) {
    const months = monthsUntil(targetDate);
    if (!months || months <= 0) return null;
    return parseFloat(remaining) / months;
}

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

const inputStyle = {
    background: T.paper, border: `1px solid ${T.border}`,
    borderRadius: 3, padding: '6px 9px',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: 12,
    color: T.ink, width: '100%', outline: 'none',
};

function MetricTile({ label, value, color, sub }) {
    return (
        <div style={{
            background: '#fff', border: `1px solid ${T.border}`,
            borderRadius: 4, padding: '12px 14px', textAlign: 'center',
        }}>
            <div style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                letterSpacing: 1, color: color || T.oliveDim, lineHeight: 1,
            }}>
                {value}
            </div>
            {sub && (
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginTop: 2 }}>
                    {sub}
                </div>
            )}
            <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                letterSpacing: 1, color: T.muted, textTransform: 'uppercase', marginTop: 3,
            }}>
                {label}
            </div>
        </div>
    );
}

// ── Progress bar ──────────────────────────────────────────────
function ProgressBar({ pct, color }) {
    return (
        <div style={{ height: 6, background: T.paper3, borderRadius: 3, overflow: 'hidden', margin: '6px 0' }}>
            <div style={{
                height: '100%', borderRadius: 3,
                width: `${Math.min(pct, 100)}%`,
                background: color,
                transition: 'width 0.5s ease',
            }} />
        </div>
    );
}

// ── Goal Card ─────────────────────────────────────────────────
function GoalCard({ goal, onEdit, onDelete }) {
    const cfg      = getTypeConfig(goal.goalType);
    const pct      = calcProgress(goal.currentAmount, goal.targetAmount);
    const remaining = parseFloat(goal.targetAmount ?? 0) - parseFloat(goal.currentAmount ?? 0);
    const monthly  = calcMonthlyNeeded(remaining, goal.targetDate);
    const months   = monthsUntil(goal.targetDate);
    const isDebt   = goal.goalType === 'debt_payoff';

    const statusColors = {
        active:    { bg: '#d4eadb', color: T.success },
        paused:    { bg: T.paper3,  color: T.muted },
        completed: { bg: '#eef4fb', color: T.blue },
        cancelled: { bg: '#fceaea', color: T.red },
    };
    const sc = statusColors[goal.status] ?? statusColors.active;

    return (
        <div style={{
            background: '#fff', border: `1px solid ${T.border}`,
            borderRadius: 4, padding: 14, display: 'flex',
            flexDirection: 'column', gap: 10,
        }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <div style={{
                        width: 34, height: 34, borderRadius: 4, flexShrink: 0,
                        background: cfg.bg, color: cfg.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1,
                    }}>
                        {cfg.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {goal.title}
                        </div>
                        <div style={{ display: 'flex', gap: 5, marginTop: 3, flexWrap: 'wrap' }}>
                            <span style={{
                                fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                                padding: '1px 6px', borderRadius: 2, letterSpacing: 1,
                                textTransform: 'uppercase', background: cfg.bg, color: cfg.text,
                            }}>
                                {cfg.label}
                            </span>
                            <span style={{
                                fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                                padding: '1px 6px', borderRadius: 2, letterSpacing: 1,
                                textTransform: 'uppercase', background: sc.bg, color: sc.color,
                            }}>
                                {goal.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => onEdit(goal)} style={{
                        background: 'transparent', border: `1px solid ${T.border}`,
                        color: T.olive, borderRadius: 3, padding: '3px 9px', cursor: 'pointer',
                        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, fontSize: 11,
                    }}>Edit</button>
                    <button onClick={() => onDelete(goal.id)} style={{
                        background: 'transparent', border: '1px solid #d4a0a0',
                        color: T.red, borderRadius: 3, padding: '3px 9px', cursor: 'pointer',
                        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, fontSize: 11,
                    }}>×</button>
                </div>
            </div>

            {/* Description */}
            {goal.description && (
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, lineHeight: 1.5 }}>
                    {goal.description}
                </div>
            )}

            {/* Progress */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, marginBottom: 2 }}>
                    <span style={{ color: T.muted }}>{isDebt ? 'Paid off' : 'Saved'}: {fmtFull(goal.currentAmount)}</span>
                    <span style={{ fontWeight: 600 }}>{pct}%</span>
                </div>
                <ProgressBar pct={pct} color={cfg.color} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted }}>
                    <span>{isDebt ? 'Remaining debt' : 'Target'}: {fmtFull(goal.targetAmount)}</span>
                    <span style={{ color: remaining > 0 ? cfg.color : T.success }}>
                        {remaining > 0 ? `${fmtFull(remaining)} to go` : '✓ Complete'}
                    </span>
                </div>
            </div>

            {/* Stats row */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
                gap: 6, paddingTop: 8, borderTop: `1px solid ${T.border}`,
            }}>
                <div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Monthly needed
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                        {monthly != null ? fmtFull(monthly) : '—'}
                    </div>
                </div>
                <div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Target date
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, marginTop: 2 }}>
                        {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                    </div>
                </div>
                <div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: 1 }}>
                        Time left
                    </div>
                    <div style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600, marginTop: 2,
                        color: months != null && months < 3 ? T.red : T.ink,
                    }}>
                        {months != null ? (months <= 0 ? 'Overdue' : `${months} mo`) : '—'}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Goal Modal ────────────────────────────────────────────────
function GoalModal({ goal, onSave, onClose, userId }) {
    const isEdit = !!goal?.id;
    const [form, setForm] = useState({
        title:         goal?.title         ?? '',
        description:   goal?.description   ?? '',
        goalType:      goal?.goalType      ?? 'savings',
        currentAmount: goal?.currentAmount ?? '',
        targetAmount:  goal?.targetAmount  ?? '',
        targetDate:    goal?.targetDate    ?? '',
        status:        goal?.status        ?? 'active',
    });
    const [saving, setSaving]   = useState(false);
    const [error,  setError]    = useState(null);

    function handleChange(field, value) {
        setForm(f => ({ ...f, [field]: value }));
    }

    async function handleSubmit() {
        if (!form.title.trim())        return setError('Title is required.');
        if (!form.targetAmount)        return setError('Target amount is required.');
        if (parseFloat(form.targetAmount) <= 0) return setError('Target amount must be greater than zero.');

        setSaving(true);
        setError(null);
        try {
            const payload = {
                userId,
                title:         form.title,
                description:   form.description,
                goalType:      form.goalType,
                currentAmount: parseFloat(form.currentAmount) || 0,
                targetAmount:  parseFloat(form.targetAmount),
                targetDate:    form.targetDate || null,
                status:        form.status,
            };
            if (isEdit) {
                await onSave(goal.id, payload);
            } else {
                await onSave(null, payload);
            }
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to save goal.');
        } finally {
            setSaving(false);
        }
    }

    const cfg = getTypeConfig(form.goalType);

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(26,28,24,0.55)',
            zIndex: 500, display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', paddingTop: 50, paddingBottom: 20,
            overflowY: 'auto',
        }}>
            <div style={{
                background: T.paper, border: `2px solid ${T.olive}`,
                borderRadius: 4, padding: 22, width: 520,
                maxWidth: '95vw',
            }}>
                {/* Modal header */}
                <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 17,
                    letterSpacing: 2, color: T.oliveDim, marginBottom: 16,
                    paddingBottom: 10, borderBottom: `1px solid ${T.border}`,
                    display: 'flex', alignItems: 'center', gap: 10,
                }}>
                    <span style={{
                        width: 28, height: 28, borderRadius: 3,
                        background: cfg.bg, color: cfg.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                    }}>
                        {cfg.icon}
                    </span>
                    {isEdit ? 'Edit Goal' : 'New Financial Goal'}
                </div>

                {error && (
                    <div style={{
                        background: '#fceaea', border: '1px solid #d4a0a0',
                        borderRadius: 3, padding: '8px 12px', marginBottom: 12,
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.red,
                    }}>
                        {error}
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

                    {/* Title */}
                    <div>
                        <FieldLabel>Goal Title *</FieldLabel>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => handleChange('title', e.target.value)}
                            placeholder="e.g. House Down Payment"
                            style={inputStyle}
                        />
                    </div>

                    {/* Type + Status */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                            <FieldLabel>Goal Type</FieldLabel>
                            <select value={form.goalType} onChange={e => handleChange('goalType', e.target.value)} style={inputStyle}>
                                {GOAL_TYPES.map(t => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <FieldLabel>Status</FieldLabel>
                            <select value={form.status} onChange={e => handleChange('status', e.target.value)} style={inputStyle}>
                                {GOAL_STATUS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Amounts */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div>
                            <FieldLabel>
                                {form.goalType === 'debt_payoff' ? 'Amount Paid Off ($)' : 'Current Amount ($)'}
                            </FieldLabel>
                            <input
                                type="number"
                                value={form.currentAmount}
                                min={0}
                                step={0.01}
                                onChange={e => handleChange('currentAmount', e.target.value)}
                                placeholder="0"
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <FieldLabel>
                                {form.goalType === 'debt_payoff' ? 'Total Debt Amount ($) *' : 'Target Amount ($) *'}
                            </FieldLabel>
                            <input
                                type="number"
                                value={form.targetAmount}
                                min={0}
                                step={0.01}
                                onChange={e => handleChange('targetAmount', e.target.value)}
                                placeholder="10000"
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    {/* Target date */}
                    <div>
                        <FieldLabel>Target Date</FieldLabel>
                        <input
                            type="date"
                            value={form.targetDate}
                            onChange={e => handleChange('targetDate', e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <FieldLabel>Description / Notes</FieldLabel>
                        <textarea
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                            rows={3}
                            placeholder="Optional notes about this goal..."
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                        />
                    </div>

                    {/* Live preview */}
                    {form.targetAmount > 0 && (
                        <div style={{
                            background: cfg.bg, borderRadius: 3, padding: '10px 12px',
                            border: `1px solid ${cfg.color}33`,
                        }}>
                            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                                Preview
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                                <div>
                                    <div style={{ color: T.muted, fontSize: 9, textTransform: 'uppercase' }}>Progress</div>
                                    <div style={{ fontWeight: 600, color: cfg.color }}>{calcProgress(form.currentAmount || 0, form.targetAmount)}%</div>
                                </div>
                                <div>
                                    <div style={{ color: T.muted, fontSize: 9, textTransform: 'uppercase' }}>Remaining</div>
                                    <div style={{ fontWeight: 600 }}>{fmtFull(Math.max(0, parseFloat(form.targetAmount) - parseFloat(form.currentAmount || 0)))}</div>
                                </div>
                                <div>
                                    <div style={{ color: T.muted, fontSize: 9, textTransform: 'uppercase' }}>Monthly needed</div>
                                    <div style={{ fontWeight: 600 }}>
                                        {form.targetDate
                                            ? fmtFull(calcMonthlyNeeded(Math.max(0, parseFloat(form.targetAmount) - parseFloat(form.currentAmount || 0)), form.targetDate) ?? 0)
                                            : '—'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', paddingTop: 8, borderTop: `1px solid ${T.border}` }}>
                        <button onClick={onClose} style={{
                            background: 'transparent', border: `1px solid ${T.border}`,
                            color: T.olive, borderRadius: 3, padding: '7px 16px', cursor: 'pointer',
                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, fontSize: 13,
                        }}>
                            Cancel
                        </button>
                        <button onClick={handleSubmit} disabled={saving} style={{
                            background: T.oliveDim, border: 'none',
                            color: T.gold, borderRadius: 3, padding: '7px 20px', cursor: 'pointer',
                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, fontSize: 13,
                            opacity: saving ? 0.7 : 1,
                        }}>
                            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Goal'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────
const GoalsPage = () => {

    // TODO: replace with real userId from session/auth context
    const userId = parseInt(sessionStorage.getItem('userId') ?? '1');

    const [goals,       setGoals]       = useState([]);
    const [loading,     setLoading]     = useState(true);
    const [error,       setError]       = useState(null);
    const [showModal,   setShowModal]   = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [filter,      setFilter]      = useState('All');
    const [typeFilter,  setTypeFilter]  = useState('All');

    // ── Load goals ────────────────────────────────────────────
    useEffect(() => {
        loadGoals();
    }, [userId]);

    async function loadGoals() {
        setLoading(true);
        setError(null);
        try {
            const data = await getAllGoals(userId);
            setGoals(data);
        } catch (err) {
            setError('Failed to load goals. Check your connection.');
        } finally {
            setLoading(false);
        }
    }

    // ── CRUD handlers ─────────────────────────────────────────
    async function handleSave(id, payload) {
        if (id) {
            const updated = await updateGoal(id, payload);
            setGoals(prev => prev.map(g => g.id === id ? updated : g));
        } else {
            const created = await createGoal(payload);
            setGoals(prev => [...prev, created]);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Delete this goal?')) return;
        await deleteGoal(id);
        setGoals(prev => prev.filter(g => g.id !== id));
    }

    function openCreate() {
        setEditingGoal(null);
        setShowModal(true);
    }

    function openEdit(goal) {
        setEditingGoal(goal);
        setShowModal(true);
    }

    // ── Filtered goals ────────────────────────────────────────
    const filtered = useMemo(() => {
        return goals.filter(g => {
            const statusMatch = filter   === 'All' || g.status?.toLowerCase()  === filter.toLowerCase();
            const typeMatch   = typeFilter === 'All' || g.goalType === typeFilter;
            return statusMatch && typeMatch;
        });
    }, [goals, filter, typeFilter]);

    // ── Summary metrics ───────────────────────────────────────
    const metrics = useMemo(() => {
        const active    = goals.filter(g => g.status === 'active');
        const savings   = goals.filter(g => g.goalType !== 'debt_payoff');
        const debt      = goals.filter(g => g.goalType === 'debt_payoff');
        const completed = goals.filter(g => g.status === 'completed');

        const totalSaved      = savings.reduce((a, g) => a + parseFloat(g.currentAmount ?? 0), 0);
        const totalTarget     = savings.reduce((a, g) => a + parseFloat(g.targetAmount  ?? 0), 0);
        const totalDebt       = debt.reduce((a, g) => a + Math.max(0, parseFloat(g.targetAmount ?? 0) - parseFloat(g.currentAmount ?? 0)), 0);
        const monthlyAlloc    = active.reduce((a, g) => {
            const m = calcMonthlyNeeded(Math.max(0, parseFloat(g.targetAmount ?? 0) - parseFloat(g.currentAmount ?? 0)), g.targetDate);
            return a + (m ?? 0);
        }, 0);

        return { active: active.length, totalSaved, totalTarget, totalDebt, monthlyAlloc, completed: completed.length };
    }, [goals]);

    // ── Render ────────────────────────────────────────────────
    return (
        <div style={{ padding: '18px 22px', background: T.paper, minHeight: '100vh' }}>

            {showModal && (
                <GoalModal
                    goal={editingGoal}
                    userId={userId}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                    <h1 style={{
                        fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                        letterSpacing: 2, color: T.oliveDim, marginBottom: 2,
                    }}>
                        Financial Goals
                    </h1>
                    <p style={{
                        fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                        letterSpacing: 1, color: T.muted, textTransform: 'uppercase', margin: 0,
                    }}>
                        Savings · Debt · Investment · Emergency Fund
                    </p>
                </div>
                <button onClick={openCreate} style={{
                    background: T.oliveDim, border: 'none', color: T.gold,
                    borderRadius: 3, padding: '8px 18px', cursor: 'pointer',
                    fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1.5, fontSize: 13,
                }}>
                    + New Goal
                </button>
            </div>

            {/* Summary metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 20 }}>
                <MetricTile label="Active Goals"      value={metrics.active}               />
                <MetricTile label="Total Saved"       value={fmtDollars(metrics.totalSaved)}  color={T.green}   />
                <MetricTile label="Total Debt Left"   value={fmtDollars(metrics.totalDebt)}   color={T.red}     />
                <MetricTile label="Monthly Allocated" value={fmtDollars(metrics.monthlyAlloc)} color={T.goldDim} sub="across active goals" />
                <MetricTile label="Goals Completed"   value={metrics.completed}            color={T.blue}    />
            </div>

            {/* Filters */}
            <div style={{
                display: 'flex', gap: 10, marginBottom: 16,
                alignItems: 'center', flexWrap: 'wrap',
            }}>
                {/* Status filter */}
                <div style={{ display: 'flex', gap: 0, border: `1px solid ${T.border}`, borderRadius: 3, overflow: 'hidden' }}>
                    {FILTER_OPTIONS.map(opt => (
                        <button key={opt} onClick={() => setFilter(opt)} style={{
                            padding: '5px 12px', border: 'none', cursor: 'pointer',
                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, fontSize: 12,
                            background: filter === opt ? T.oliveDim : T.paper,
                            color: filter === opt ? T.gold : T.muted,
                            transition: 'all 0.12s',
                        }}>
                            {opt}
                        </button>
                    ))}
                </div>

                {/* Type filter */}
                <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    style={{ ...inputStyle, width: 'auto', padding: '5px 10px', fontSize: 11 }}
                >
                    <option value="All">All Types</option>
                    {GOAL_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                </select>

                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: T.muted, marginLeft: 'auto' }}>
                    {filtered.length} of {goals.length} goals
                </span>
            </div>

            {/* Content */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: T.muted }}>
                    Loading goals...
                </div>
            ) : error ? (
                <div style={{
                    background: '#fceaea', border: '1px solid #d4a0a0', borderRadius: 4,
                    padding: '14px 16px', fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: T.red,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    {error}
                    <button onClick={loadGoals} style={{
                        background: 'transparent', border: `1px solid ${T.red}`,
                        color: T.red, borderRadius: 3, padding: '4px 10px', cursor: 'pointer',
                        fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 1, fontSize: 11,
                    }}>Retry</button>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: T.oliveDim, marginBottom: 8 }}>
                        {goals.length === 0 ? 'No Goals Yet' : 'No Goals Match This Filter'}
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: T.muted, marginBottom: 20 }}>
                        {goals.length === 0
                            ? 'Create your first financial goal to start tracking your progress.'
                            : 'Try changing the status or type filter.'}
                    </div>
                    {goals.length === 0 && (
                        <button onClick={openCreate} style={{
                            background: T.oliveDim, border: 'none', color: T.gold,
                            borderRadius: 3, padding: '10px 24px', cursor: 'pointer',
                            fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, fontSize: 14,
                        }}>
                            + Create First Goal
                        </button>
                    )}
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 14,
                }}>
                    {filtered.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default GoalsPage;