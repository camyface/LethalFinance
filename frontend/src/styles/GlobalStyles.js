// GlobalStyles.js
// Emotion equivalent of styled-components' createGlobalStyle.
// Import once inside ThemeProvider at your app root.
//
// Usage in main.jsx:
//   import { Global } from '@emotion/react';
//   import { getGlobalStyles } from './styles/GlobalStyles';
//   <ThemeProvider theme={lfTheme}>
//     <Global styles={getGlobalStyles(lfTheme)} />
//     <App />
//   </ThemeProvider>
//
// NOTE: Emotion's <Global> does not receive the theme prop directly,
// so we export a function that accepts the theme and returns the styles object.

import { css } from '@emotion/react';

export const getGlobalStyles = (theme) => css`
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap');

  /* ── CSS custom properties ── */
  :root {
    --lf-olive:       ${theme.olive};
    --lf-olive-light: ${theme.oliveLight};
    --lf-olive-dim:   ${theme.oliveDim};
    --lf-gold:        ${theme.gold};
    --lf-gold-light:  ${theme.goldLight};
    --lf-gold-dim:    ${theme.goldDim};
    --lf-ink:         ${theme.ink};
    --lf-paper:       ${theme.paper};
    --lf-paper2:      ${theme.paper2};
    --lf-paper3:      ${theme.paper3};
    --lf-muted:       ${theme.muted};
    --lf-border:      ${theme.border};
    --lf-danger:      ${theme.danger};
    --lf-success:     ${theme.success};
  }

  /* ── Base reset ── */
  *, *::before, *::after { box-sizing: border-box; }

  body {
    font-family: ${theme.fontBody};
    background: ${theme.paper};
    color: ${theme.ink};
    font-size: 14px;
    margin: 0;
  }

  /* ══════════════════════════════════════════════════════════
     BOOTSTRAP OVERRIDES
     React Bootstrap renders standard .btn, .card etc. classes —
     these rules restyle them to the Lethal Finance aesthetic.
     ══════════════════════════════════════════════════════════ */

  /* ── Buttons ── */
  .btn {
    font-family: ${theme.fontDisplay};
    letter-spacing: 1.5px;
    font-size: 13px;
    border-radius: ${theme.radius};
    transition: background 0.12s, opacity 0.12s, border-color 0.12s;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    box-shadow: none !important;
  }

  .btn-primary {
    background-color: ${theme.oliveDim} !important;
    border-color:     ${theme.oliveDim} !important;
    color: ${theme.gold} !important;
  }
  .btn-primary:hover,
  .btn-primary:focus,
  .btn-primary:active {
    background-color: ${theme.olive} !important;
    border-color:     ${theme.olive} !important;
    color: ${theme.gold} !important;
  }

  .btn-secondary {
    background-color: ${theme.gold} !important;
    border-color:     ${theme.gold} !important;
    color: ${theme.ink} !important;
  }
  .btn-secondary:hover,
  .btn-secondary:focus,
  .btn-secondary:active {
    background-color: ${theme.goldLight} !important;
    border-color:     ${theme.goldLight} !important;
    color: ${theme.ink} !important;
  }

  .btn-outline-primary {
    border-color: ${theme.border} !important;
    color: ${theme.olive} !important;
    background: transparent !important;
    border-width: 1px;
    font-size: 12px;
    letter-spacing: 1px;
    padding: 5px 12px;
  }
  .btn-outline-primary:hover,
  .btn-outline-primary:focus {
    border-color: ${theme.olive} !important;
    color: ${theme.ink} !important;
    background: transparent !important;
  }

  .btn-outline-danger {
    border-color: #d4a0a0 !important;
    color: ${theme.danger} !important;
    background: transparent !important;
    font-size: 11px;
    letter-spacing: 1px;
    padding: 4px 10px;
  }
  .btn-outline-danger:hover {
    background: ${theme.redBg} !important;
    color: ${theme.danger} !important;
  }

  .btn-sm {
    font-size: 11px !important;
    padding: 4px 10px !important;
    letter-spacing: 1px !important;
  }

  /* ── Cards ── */
  .card {
    background: #ffffff;
    border: 1px solid ${theme.border} !important;
    border-radius: ${theme.radius} !important;
    box-shadow: none !important;
  }

  .card-header {
    background: transparent !important;
    border-bottom: 1px solid ${theme.border} !important;
    font-family: ${theme.fontDisplay};
    font-size: 14px;
    letter-spacing: 1px;
    color: ${theme.oliveDim};
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .card-body { padding: 14px; }

  /* ── Modals ── */
  .modal-content {
    background: ${theme.paper} !important;
    border: 2px solid ${theme.olive} !important;
    border-radius: ${theme.radius} !important;
    box-shadow: none !important;
  }

  .modal-header {
    border-bottom: 1px solid ${theme.border} !important;
    padding: 14px 18px 10px;
  }

  .modal-title {
    font-family: ${theme.fontDisplay} !important;
    font-size: 17px !important;
    letter-spacing: 2px !important;
    color: ${theme.oliveDim} !important;
  }

  .modal-body { padding: 18px; }

  .modal-footer {
    border-top: 1px solid ${theme.border} !important;
    padding: 10px 18px;
  }

  .modal-backdrop.show { opacity: 0.55; }

  /* ── Form controls ── */
  .form-control,
  .form-select {
    background: ${theme.paper} !important;
    border: 1px solid ${theme.border} !important;
    border-radius: ${theme.radius} !important;
    color: ${theme.ink} !important;
    font-family: ${theme.fontMono};
    font-size: 12px !important;
    padding: 6px 9px !important;
    box-shadow: none !important;
    transition: border-color 0.12s;
  }

  .form-control:focus,
  .form-select:focus {
    border-color: ${theme.olive} !important;
    box-shadow: none !important;
    background: ${theme.paper} !important;
  }

  .form-label {
    font-family: ${theme.fontMono};
    font-size: 9px;
    letter-spacing: 1.5px;
    color: ${theme.muted};
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .form-text {
    font-family: ${theme.fontMono};
    font-size: 10px;
    color: ${theme.muted};
  }

  .form-check-input:checked {
    background-color: ${theme.olive} !important;
    border-color:     ${theme.olive} !important;
  }

  .form-range::-webkit-slider-thumb { background: ${theme.gold}; }
  .form-range::-moz-range-thumb     { background: ${theme.gold}; }
  .form-range:focus::-webkit-slider-thumb {
    box-shadow: 0 0 0 3px ${theme.gold}44;
  }

  /* ── Nav / Tabs ── */
  .nav-tabs {
    border-bottom: 2px solid ${theme.border};
    margin-bottom: 14px;
  }

  .nav-tabs .nav-link {
    font-family: ${theme.fontDisplay};
    font-size: 13px;
    letter-spacing: 1px;
    color: ${theme.muted};
    border: none;
    border-bottom: 2px solid transparent;
    margin-bottom: -2px;
    border-radius: 0;
    padding: 7px 16px;
    background: none;
    transition: color 0.12s, border-color 0.12s;
  }

  .nav-tabs .nav-link:hover { color: ${theme.oliveDim}; }

  .nav-tabs .nav-link.active {
    color: ${theme.oliveDim} !important;
    border-bottom-color: ${theme.gold} !important;
    background: none !important;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .nav-pills .nav-link {
    font-family: ${theme.fontDisplay};
    font-size: 12px;
    letter-spacing: 1px;
    color: ${theme.olive};
    border-radius: ${theme.radius};
    padding: 5px 12px;
  }

  .nav-pills .nav-link.active {
    background-color: ${theme.oliveDim} !important;
    color: ${theme.gold} !important;
  }

  /* ── Alerts ── */
  .alert {
    border-radius: ${theme.radius};
    font-size: 11px;
    border-left-width: 3px;
    border-top: none;
    border-right: none;
    border-bottom: none;
    line-height: 1.5;
    padding: 8px 12px;
  }

  .alert-info    { background: ${theme.blueBg}  !important; color: ${theme.blueText}  !important; border-color: #4a7ab5 !important; }
  .alert-warning { background: ${theme.amberBg} !important; color: ${theme.amberText} !important; border-color: ${theme.goldDim} !important; }
  .alert-success { background: ${theme.greenBg} !important; color: ${theme.greenText} !important; border-color: #4a9962 !important; }
  .alert-danger  { background: ${theme.redBg}   !important; color: ${theme.redText}   !important; border-color: #c05050 !important; }

  /* ── Badges ── */
  .badge {
    font-family: ${theme.fontMono};
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border-radius: ${theme.radiusSm};
    font-weight: 400;
    padding: 2px 6px;
  }

  .badge.bg-primary   { background-color: ${theme.oliveDim} !important; color: ${theme.gold}; }
  .badge.bg-secondary { background-color: ${theme.gold}     !important; color: ${theme.ink}; }
  .badge.bg-success   { background-color: #d4eadb           !important; color: ${theme.success}; }
  .badge.bg-danger    { background-color: ${theme.redBg}    !important; color: ${theme.redText}; }
  .badge.bg-warning   { background-color: #f4e8cc           !important; color: #7a5500; }
  .badge.bg-info      { background-color: ${theme.blueBg}   !important; color: ${theme.blueText}; }

  /* ── Tables ── */
  .table {
    font-size: 11px;
    font-family: ${theme.fontMono};
    color: ${theme.ink};
  }

  .table thead th {
    background: ${theme.oliveDim} !important;
    color: ${theme.goldLight} !important;
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    border: none !important;
    padding: 7px 8px;
    font-weight: 400;
  }

  .table tbody td {
    border-bottom: 1px solid ${theme.border};
    padding: 7px 8px;
    vertical-align: middle;
  }

  .table-striped tbody tr:nth-of-type(even) td { background: ${theme.paper2}; }
  .table-hover tbody tr:hover td               { background: ${theme.paper3}; }

  /* ── Progress ── */
  .progress {
    height: 7px;
    background: ${theme.paper3};
    border-radius: ${theme.radiusSm};
    overflow: hidden;
  }

  .progress-bar                  { background-color: ${theme.olive}; transition: width 0.5s ease; }
  .progress-bar.bg-gold          { background-color: ${theme.gold}   !important; }
  .progress-bar.bg-success       { background-color: #4a9962         !important; }
  .progress-bar.bg-danger        { background-color: #b04040         !important; }
  .progress-bar.bg-info          { background-color: #4a7ab5         !important; }

  /* ── List group ── */
  .list-group-item {
    border-color: ${theme.border} !important;
    font-size: 12px;
    padding: 10px 14px;
    background: transparent;
    color: ${theme.ink};
    transition: background 0.1s;
  }

  .list-group-item:hover { background: ${theme.paper2}; }

  .list-group-item.active {
    background: ${theme.paper3} !important;
    border-left: 3px solid ${theme.gold} !important;
    color: ${theme.ink} !important;
    font-weight: 500;
  }

  /* ── Dropdown ── */
  .dropdown-menu {
    background: ${theme.paper};
    border: 1px solid ${theme.border};
    border-radius: ${theme.radius};
    box-shadow: 0 4px 12px rgba(26,28,24,0.12);
    padding: 4px 0;
  }

  .dropdown-item {
    font-family: ${theme.fontBody};
    color: ${theme.ink};
    padding: 7px 14px;
    font-size: 12px;
    transition: background 0.1s;
  }

  .dropdown-item:hover,
  .dropdown-item:focus  { background: ${theme.paper3}; color: ${theme.ink}; }
  .dropdown-item.active,
  .dropdown-item:active { background: ${theme.oliveDim}; color: ${theme.gold}; }
  .dropdown-divider     { border-color: ${theme.border}; }

  /* ── Tooltips ── */
  .tooltip-inner {
    background: ${theme.oliveDim};
    font-family: ${theme.fontMono};
    font-size: 10px;
    letter-spacing: 0.5px;
    border-radius: ${theme.radius};
  }

  .bs-tooltip-auto[data-popper-placement^=top] .tooltip-arrow::before,
  .bs-tooltip-top .tooltip-arrow::before {
    border-top-color: ${theme.oliveDim};
  }

  /* ── Accordion ── */
  .accordion-item {
    border: 1px solid ${theme.border} !important;
    border-radius: ${theme.radius} !important;
    margin-bottom: 6px;
    background: #fff;
  }

  .accordion-button {
    font-family: ${theme.fontDisplay};
    font-size: 14px;
    letter-spacing: 1px;
    color: ${theme.oliveDim} !important;
    background: #fff !important;
    box-shadow: none !important;
    border-radius: ${theme.radius} !important;
    padding: 12px 14px;
  }

  .accordion-button:not(.collapsed) {
    color: ${theme.oliveDim} !important;
    background: ${theme.paper2} !important;
    border-bottom: 1px solid ${theme.border};
  }

  .accordion-button::after { filter: brightness(0.4); }
  .accordion-body { padding: 14px; font-size: 13px; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar          { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track    { background: ${theme.paper2}; }
  ::-webkit-scrollbar-thumb    { background: ${theme.paper3}; border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: ${theme.olive}44; }
`;