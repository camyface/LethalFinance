// theme.js
// Wrap your app: <ThemeProvider theme={lfTheme}>...</ThemeProvider>
// No library imports needed — plain JS object.

export const lfTheme = {
    // ── Brand colors ──────────────────────────────────────────
    olive:       '#4a5240',
    oliveLight:  '#6b7560',
    oliveDim:    '#3a4132',
    gold:        '#c8a84b',
    goldLight:   '#e0c068',
    goldDim:     '#9a7e30',

    // ── Neutrals ──────────────────────────────────────────────
    ink:    '#1a1c18',
    paper:  '#f5f2ea',
    paper2: '#ede9de',
    paper3: '#e0dbc8',
    muted:  '#6b6a60',
    border: 'rgba(74, 82, 64, 0.22)',

    // ── Semantic ──────────────────────────────────────────────
    danger:  '#8b2222',
    success: '#2a5c3a',

    // ── Contextual backgrounds + text ─────────────────────────
    blueBg:    '#eef4fb',
    blueText:  '#0c3a6b',
    amberBg:   '#fdf5e0',
    amberText: '#5a3a00',
    greenBg:   '#eaf3de',
    greenText: '#2a5c1a',
    redBg:     '#fceaea',
    redText:   '#6b1a1a',

    // ── Goal icon accent colors ────────────────────────────────
    iconHouse:     '#4a7ab5',
    iconCar:       '#6b7560',
    iconVacation:  '#c8a84b',
    iconDebt:      '#b04040',
    iconEmergency: '#4a9962',
    iconEducation: '#7a5ab5',
    iconInvest:    '#2a7a6a',
    iconOther:     '#888780',

    // ── Chart palette ─────────────────────────────────────────
    chart: ['#4a5240', '#c8a84b', '#4a7ab5', '#4a9962', '#b04040', '#7a5ab5', '#c8704a', '#888780'],

    // ── Typography ────────────────────────────────────────────
    fontDisplay: "'Bebas Neue', sans-serif",
    fontMono:    "'IBM Plex Mono', monospace",
    fontBody:    "'IBM Plex Sans', sans-serif",

    // ── Spacing ───────────────────────────────────────────────
    radiusSm: '2px',
    radius:   '4px',
    gapSm:    '8px',
    gap:      '12px',
    gapLg:    '16px',
};