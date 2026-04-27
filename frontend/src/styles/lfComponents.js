// lfComponents.js
// Emotion equivalents of all Lethal Finance custom UI components.
// Import what you need: import { AppHeader, LFCard, MetricCard } from './lfComponents';
//
// Key Emotion differences from styled-components:
//   - import styled from '@emotion/styled'          (not 'styled-components')
//   - import { css }  from '@emotion/react'         (not 'styled-components')
//   - Transient props ($active etc.) work the same way
//   - Theme access via useTheme() hook is also available as an alternative

import styled from '@emotion/styled';
import { css } from '@emotion/react';

// ─────────────────────────────────────────────────────────────
// Layout
// ─────────────────────────────────────────────────────────────

export const AppGrid = styled.div`
  display: grid;
  grid-template-columns: 210px 1fr;
  min-height: calc(100vh - 52px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const MainContent = styled.main`
  overflow-y: auto;
  background: ${({ theme }) => theme.paper};
`;

export const ViewPane = styled.section`
  padding: 18px 22px;
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.gapLg};

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const ThreeCol = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: ${({ theme }) => theme.gap};

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const FlexGap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ gap, theme }) => gap || theme.gapSm};
`;

// ─────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────

export const AppHeader = styled.header`
  background: ${({ theme }) => theme.oliveDim};
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid ${({ theme }) => theme.gold};
  position: sticky;
  top: 0;
  z-index: 100;
`;

export const Logo = styled.div`
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 26px;
  color: ${({ theme }) => theme.gold};
  letter-spacing: 3px;
  line-height: 1;

  span { color: #ffffff; }
`;

export const HeaderSub = styled.div`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  color: ${({ theme }) => theme.oliveLight};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 2px;
`;

export const RankBadge = styled.div`
  background: ${({ theme }) => theme.gold};
  color: ${({ theme }) => theme.ink};
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 12px;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radiusSm};
`;

// ─────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────

export const Sidebar = styled.nav`
  background: ${({ theme }) => theme.paper2};
  border-right: 1px solid ${({ theme }) => theme.border};
  padding: 14px 0;
  overflow-y: auto;

  @media (max-width: 900px) {
    border-right: none;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`;

export const SidebarSection = styled.div`
  padding: 5px 14px;
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.muted};
  text-transform: uppercase;
  margin-top: 10px;
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  cursor: pointer;
  font-size: 12px;
  color: ${({ theme }) => theme.olive};
  border-left: 3px solid transparent;
  transition: background 0.12s, color 0.12s, border-color 0.12s;
  user-select: none;

  &:hover {
    background: ${({ theme }) => theme.paper3};
    color: ${({ theme }) => theme.ink};
  }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: ${theme.paper3};
      border-left-color: ${theme.gold};
      color: ${theme.ink};
      font-weight: 500;
    `}
`;

export const NavIcon = styled.span`
  font-size: 13px;
  width: 16px;
  text-align: center;
`;

export const NavBadge = styled.span`
  margin-left: auto;
  background: ${({ theme }) => theme.gold};
  color: ${({ theme }) => theme.ink};
  font-size: 9px;
  padding: 1px 5px;
  border-radius: ${({ theme }) => theme.radiusSm};
  font-family: ${({ theme }) => theme.fontMono};
`;

export const SidebarSummary = styled.div`
  padding: 12px 14px;
  margin-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

export const SidebarStat = styled.div`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 10px;
  color: ${({ theme }) => theme.muted};
  margin-top: 4px;

  span             { color: ${({ theme }) => theme.ink}; font-weight: 500; }
  span.positive    { color: ${({ theme }) => theme.success}; }
  span.negative    { color: ${({ theme }) => theme.danger}; }
`;

// ─────────────────────────────────────────────────────────────
// Page headings
// ─────────────────────────────────────────────────────────────

export const PageTitle = styled.h1`
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 21px;
  letter-spacing: 2px;
  color: ${({ theme }) => theme.oliveDim};
  margin-bottom: 2px;
`;

export const PageSub = styled.p`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  color: ${({ theme }) => theme.muted};
  letter-spacing: 1px;
  margin-bottom: 18px;
`;

// ─────────────────────────────────────────────────────────────
// Cards
// ─────────────────────────────────────────────────────────────

export const LFCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 14px;
  margin-bottom: 14px;
`;

export const CardTitle = styled.div`
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 14px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.oliveDim};
  margin-bottom: 10px;
  padding-bottom: 7px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// ─────────────────────────────────────────────────────────────
// Metric cards
// ─────────────────────────────────────────────────────────────

export const MetricsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ cols }) => cols || 4}, 1fr);
  gap: 8px;
  margin-bottom: 14px;

  @media (max-width: 700px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const MetricCard = styled.div`
  background: ${({ theme }) => theme.paper2};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 10px;
  text-align: center;
`;

export const MetricValue = styled.div`
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 22px;
  letter-spacing: 1px;
  line-height: 1;
  color: ${({ color, theme }) => {
    if (color === 'gold')  return theme.goldDim;
    if (color === 'green') return theme.success;
    if (color === 'red')   return theme.danger;
    return theme.oliveDim;
}};
`;

export const MetricLabel = styled.div`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.muted};
  text-transform: uppercase;
  margin-top: 3px;
`;

// ─────────────────────────────────────────────────────────────
// Tags / Badges
// ─────────────────────────────────────────────────────────────

const tagVariants = {
    active:  { bg: '#d4eadb', color: '#2a5c3a' },
    draft:   { bg: '#e0dbc8', color: '#6b6a60' },
    warning: { bg: '#f4e8cc', color: '#7a5500' },
    debt:    { bg: '#fceaea', color: '#6b1a1a' },
    savings: { bg: '#eaf3de', color: '#2a5c1a' },
    invest:  { bg: '#eef4fb', color: '#0c3a6b' },
    high:    { bg: '#fceaea', color: '#b04040' },
    medium:  { bg: '#fdf5e0', color: '#8a5a00' },
    low:     { bg: '#eaf3de', color: '#4a9962' },
};

export const LFTag = styled.span`
  display: inline-block;
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radiusSm};
  letter-spacing: 1px;
  text-transform: uppercase;
  background: ${({ variant }) => tagVariants[variant]?.bg || '#e0dbc8'};
  color: ${({ variant }) => tagVariants[variant]?.color || '#6b6a60'};
`;

// ─────────────────────────────────────────────────────────────
// Info rows
// ─────────────────────────────────────────────────────────────

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-size: 12px;

  &:last-child { border-bottom: none; }
`;

export const InfoKey = styled.span`
  color: ${({ theme }) => theme.muted};
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const InfoVal = styled.span`
  font-weight: 500;
  color: ${({ color, theme }) => {
    if (color === 'success') return theme.success;
    if (color === 'danger')  return theme.danger;
    if (color === 'gold')    return theme.goldDim;
    if (color === 'muted')   return theme.muted;
    return theme.ink;
}};
`;

// ─────────────────────────────────────────────────────────────
// Progress bars
// ─────────────────────────────────────────────────────────────

export const ProgressWrap = styled.div`
  margin: 6px 0;
`;

export const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  margin-bottom: 3px;
  color: ${({ theme }) => theme.muted};
  font-family: ${({ theme }) => theme.fontMono};
`;

export const ProgressTrack = styled.div`
  height: 7px;
  background: ${({ theme }) => theme.paper3};
  border-radius: ${({ theme }) => theme.radiusSm};
  overflow: hidden;
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: ${({ theme }) => theme.radiusSm};
  transition: width 0.5s ease;
  width: ${({ pct }) => Math.min(pct || 0, 100)}%;
  background: ${({ color, theme }) => {
    if (color === 'gold')  return theme.gold;
    if (color === 'green') return '#4a9962';
    if (color === 'blue')  return '#4a7ab5';
    if (color === 'red')   return '#b04040';
    return theme.olive;
}};
`;

// ─────────────────────────────────────────────────────────────
// Goal cards
// ─────────────────────────────────────────────────────────────

export const GoalGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.gap};

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

export const GoalCard = styled.div`
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const GoalIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius};
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 12px;
  letter-spacing: 1px;
  flex-shrink: 0;
  background: ${({ iconColor }) => `${iconColor}22`};
  color: ${({ iconColor }) => iconColor};
`;

export const GoalStatGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 6px;
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 10px;
`;

export const GoalStatLabel = styled.div`
  color: ${({ theme }) => theme.muted};
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

export const GoalStatVal = styled.div`
  font-weight: 500;
  color: ${({ onTrack, theme }) =>
    onTrack === true  ? theme.success :
        onTrack === false ? theme.danger  :
            theme.ink};
`;

export const GoalNotes = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.muted};
  font-family: ${({ theme }) => theme.fontMono};
  border-top: 1px solid ${({ theme }) => theme.border};
  padding-top: 6px;
`;

// ─────────────────────────────────────────────────────────────
// Budget rows
// ─────────────────────────────────────────────────────────────

export const BudgetRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};

  &:last-child { border-bottom: none; }
`;

export const BudgetDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  background: ${({ color }) => color || '#888'};
`;

export const BudgetName = styled.div`
  flex: 1;
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const BudgetCol = styled.div`
  width: 80px;
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 11px;
  text-align: right;
`;

export const BudgetDiff = styled.div`
  width: 70px;
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 11px;
  text-align: right;
  font-weight: 500;
  color: ${({ over, theme }) => over ? theme.danger : theme.success};
`;

// ─────────────────────────────────────────────────────────────
// Timeline
// ─────────────────────────────────────────────────────────────

export const TimelineItem = styled.div`
  display: flex;
  gap: 12px;
`;

export const TimelineTrack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const TimelineDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid ${({ theme }) => theme.gold};
  background: ${({ empty, gold, theme }) =>
    empty ? 'transparent' :
        gold  ? theme.gold    :
            theme.olive};
`;

export const TimelineLine = styled.div`
  width: 2px;
  background: ${({ theme }) => theme.border};
  flex: 1;
  min-height: 20px;
`;

export const TimelineContent = styled.div`
  padding-bottom: 14px;
  flex: 1;
`;

export const TimelineTitle = styled.div`
  font-size: 12px;
  font-weight: 500;
`;

export const TimelineSub = styled.div`
  font-size: 11px;
  color: ${({ theme }) => theme.muted};
  margin-top: 2px;
`;

// ─────────────────────────────────────────────────────────────
// Scenario / Plan list rows
// ─────────────────────────────────────────────────────────────

export const ScenarioRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  gap: 12px;
  transition: background 0.1s;
  cursor: pointer;

  &:hover { background: ${({ theme }) => theme.paper2}; }

  ${({ $active, theme }) =>
    $active &&
    css`
      background: #f0f5eb;
      border-left: 3px solid ${theme.success};
    `}
`;

export const ScenarioInfo  = styled.div`flex: 1;`;

export const ScenarioName = styled.div`
  font-weight: 500;
  font-size: 13px;
  margin-bottom: 2px;
`;

export const ScenarioMeta = styled.div`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 10px;
  color: ${({ theme }) => theme.muted};
`;

export const ScenarioVal = styled.div`
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 18px;
  color: ${({ theme }) => theme.oliveDim};
`;

// ─────────────────────────────────────────────────────────────
// Divider
// ─────────────────────────────────────────────────────────────

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid ${({ theme }) => theme.border};
  margin: 12px 0;
`;

// ─────────────────────────────────────────────────────────────
// Donut chart container
// ─────────────────────────────────────────────────────────────

export const DonutWrap = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
`;

export const DonutLabel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  pointer-events: none;
`;

export const DonutPct = styled.div`
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 18px;
  color: ${({ theme }) => theme.oliveDim};
  line-height: 1;
`;

export const DonutSub = styled.div`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  color: ${({ theme }) => theme.muted};
`;

// ─────────────────────────────────────────────────────────────
// Misc utilities
// ─────────────────────────────────────────────────────────────

export const MonoText = styled.span`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: ${({ size }) => size || '12px'};
  color: ${({ color, theme }) => {
    if (color === 'muted')   return theme.muted;
    if (color === 'success') return theme.success;
    if (color === 'danger')  return theme.danger;
    if (color === 'gold')    return theme.goldDim;
    return 'inherit';
}};
`;

export const DisplayText = styled.span`
  font-family: ${({ theme }) => theme.fontDisplay};
  letter-spacing: ${({ spacing }) => spacing || '1px'};
  font-size: ${({ size }) => size || 'inherit'};
`;

export const ContribIndicator = styled.span`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 10px;
  padding: 3px 8px;
  border-radius: ${({ theme }) => theme.radiusSm};
  background: ${({ over, theme }) => over ? theme.redBg  : theme.greenBg};
  color:      ${({ over, theme }) => over ? theme.redText : theme.greenText};
`;

// ─────────────────────────────────────────────────────────────
// Extending a React Bootstrap component with Emotion
// ─────────────────────────────────────────────────────────────
//
// Same pattern as styled-components — pass the RB component to styled():
//
//   import { Card } from 'react-bootstrap';
//
//   export const PlanCard = styled(Card)`
//     border-left: 3px solid ${({ theme, $active }) =>
//       $active ? theme.success : theme.border} !important;
//     background: ${({ $active }) => $active ? '#f0f5eb' : '#ffffff'} !important;
//     cursor: pointer;
//     transition: background 0.12s;
//     &:hover { background: ${({ theme }) => theme.paper2} !important; }
//   `;
//
//   Usage: <PlanCard $active={plan.isActive} onClick={...}>