import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import { css } from '@emotion/react';

// ─────────────────────────────────────────────────────────────
// Styled components
// ─────────────────────────────────────────────────────────────

const Nav = styled.nav`
    background: ${({ theme }) => theme.paper2};
    border-right: 1px solid ${({ theme }) => theme.border};
    display: flex;
    flex-direction: column;
    width: 210px;
    min-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
    transition: transform 0.22s ease;

    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => theme.paper3} transparent;
    &::-webkit-scrollbar       { width: 4px; }
    &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.paper3}; border-radius: 2px; }

    @media (max-width: 900px) {
        position: fixed;
        top: 52px;
        left: 0;
        bottom: 0;
        z-index: 300;
        box-shadow: 4px 0 16px rgba(26, 28, 24, 0.18);
        transform: ${({ $mobileOpen }) => $mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    }
`;

const MobileOverlay = styled.div`
    display: none;

    @media (max-width: 900px) {
        display: ${({ $mobileOpen }) => $mobileOpen ? 'block' : 'none'};
        position: fixed;
        inset: 0;
        background: rgba(26, 28, 24, 0.45);
        z-index: 299;
    }
`;

const Section = styled.div`
    padding: 5px 14px;
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 9px;
    letter-spacing: 2px;
    color: ${({ theme }) => theme.muted};
    text-transform: uppercase;
    margin-top: 14px;
    margin-bottom: 2px;
    user-select: none;
`;

const Item = styled.button`
    all: unset;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 8px 14px;
    cursor: pointer;
    font-family: ${({ theme }) => theme.fontBody};
    font-size: 12px;
    color: ${({ theme }) => theme.olive};
    border-left: 3px solid transparent;
    transition: background 0.12s, color 0.12s, border-color 0.12s;
    user-select: none;

    &:hover {
        background: ${({ theme }) => theme.paper3};
        color: ${({ theme }) => theme.ink};
    }

    &:focus-visible {
        outline: 2px solid ${({ theme }) => theme.gold};
        outline-offset: -2px;
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

const ItemIcon = styled.span`
    width: 16px;
    text-align: center;
    font-size: 13px;
    flex-shrink: 0;
    line-height: 1;
    color: ${({ $active, theme }) => $active ? theme.goldDim : theme.oliveLight};
    transition: color 0.12s;
`;

const ItemLabel = styled.span`
    flex: 1;
    line-height: 1;
`;

const Badge = styled.span`
    margin-left: auto;
    background: ${({ theme }) => theme.gold};
    color: ${({ theme }) => theme.ink};
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 9px;
    font-weight: 500;
    padding: 1px 6px;
    border-radius: ${({ theme }) => theme.radiusSm};
    line-height: 1.6;
    letter-spacing: 0.5px;
`;

const ActivePip = styled.span`
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.gold};
    margin-left: auto;
    flex-shrink: 0;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid ${({ theme }) => theme.border};
    margin: 10px 14px;
`;

const ActivePlanBox = styled.div`
    margin: 0 12px 12px;
    padding: 10px 12px;
    background: ${({ theme }) => theme.paper};
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: ${({ theme }) => theme.radius};
`;

const ActivePlanLabel = styled.div`
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 9px;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.muted};
    margin-bottom: 4px;
`;

const ActivePlanName = styled.div`
    font-family: ${({ theme }) => theme.fontDisplay};
    font-size: 13px;
    letter-spacing: 1px;
    color: ${({ theme }) => theme.oliveDim};
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ActivePlanStats = styled.div`
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 10px;
    color: ${({ theme }) => theme.muted};
    line-height: 1.6;
`;

const SummaryPanel = styled.div`
    margin: 10px 12px 0;
    padding: 11px 12px;
    background: ${({ theme }) => theme.oliveDim};
    border-radius: ${({ theme }) => theme.radius};
    flex-shrink: 0;
`;

const SummaryTitle = styled.div`
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 9px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.oliveLight};
    margin-bottom: 8px;
`;

const SummaryRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 5px;

    &:last-child { margin-bottom: 0; }
`;

const SummaryKey = styled.span`
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 9px;
    color: ${({ theme }) => theme.oliveLight};
    letter-spacing: 0.5px;
`;

const SummaryVal = styled.span`
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 11px;
    font-weight: 500;
    color: ${({ $variant }) => {
        if ($variant === 'positive') return '#e0c068';
        if ($variant === 'negative') return '#e08080';
        if ($variant === 'neutral')  return '#d3d1c7';
        return '#ffffff';
    }};
`;

const SummaryDivider = styled.div`
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin: 7px 0;
`;

const Spacer = styled.div`flex: 1;`;

const VersionTag = styled.div`
    font-family: ${({ theme }) => theme.fontMono};
    font-size: 9px;
    color: ${({ theme }) => theme.border};
    text-align: center;
    padding: 10px 0 8px;
    letter-spacing: 1px;
`;

// ─────────────────────────────────────────────────────────────
// Nav config — paths match BrowserRouter routes exactly
// ─────────────────────────────────────────────────────────────

const NAV_SECTIONS = [
    {
        label: 'Retirement',
        items: [
            { path: '/dashboard', label: 'Dashboard',        icon: '◈' },
            { path: '/plans',     label: 'My Plans',          icon: '◫', badgeKey: 'planCount' },
            { path: '/tsp',       label: 'TSP Projector',     icon: '◉' },
            { path: '/scenarios', label: 'What-If Scenarios', icon: '◧' },
        ],
    },
    {
        label: 'Financial Life',
        items: [
            { path: '/goals',   label: 'Financial Goals', icon: '◎', badgeKey: 'goalCount' },
            { path: '/budgets', label: 'Budget Planner',   icon: '▦' },
        ],
    },
    {
        label: 'Account',
        items: [
            { path: '/profile', label: 'Service Profile', icon: '○' },
        ],
    },
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * SideNav
 *
 * Active state is derived automatically from useLocation() —
 * no activeView prop needed. Just render it and React Router
 * handles highlighting the correct item based on the current URL.
 *
 * Props:
 *   mobileOpen     {boolean}  — controls the mobile slide-in drawer
 *   onMobileClose  {function} — called when the overlay is tapped
 *   planCount      {number}   — optional badge count on My Plans
 *   goalCount      {number}   — optional badge count on Financial Goals
 *   summary        {object}   — { income, budgeted, goals, remaining }
 *   activePlan     {object}   — { name, pension, tsp }
 */
export default function SideNav({
                                    mobileOpen    = false,
                                    onMobileClose = () => {},
                                    planCount,
                                    goalCount,
                                    summary    = { income: 3380, budgeted: 2530, goals: 575, remaining: 275 },
                                    activePlan = { name: 'Plan Alpha — 20yr', pension: 2847, tsp: 312000 },
                                }) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const badges = { planCount, goalCount };

    const fmt  = (n) => '$' + Math.round(n).toLocaleString();
    const fmtK = (n) =>
        n >= 1_000_000
            ? '$' + (n / 1_000_000).toFixed(1) + 'M'
            : '$' + Math.round(n / 1000) + 'K';

    const remainingVariant = summary.remaining >= 0 ? 'positive' : 'negative';

    function handleNavigate(path) {
        navigate(path);
        onMobileClose();
    }

    return (
        <>
            <MobileOverlay $mobileOpen={mobileOpen} onClick={onMobileClose} />

            <Nav $mobileOpen={mobileOpen} aria-label="Main navigation">

                {NAV_SECTIONS.map((section, si) => (
                    <React.Fragment key={section.label}>
                        <Section>{section.label}</Section>

                        {section.items.map((item) => {
                            const isActive = pathname === item.path;
                            const count    = item.badgeKey ? badges[item.badgeKey] : null;

                            return (
                                <Item
                                    key={item.path}
                                    $active={isActive}
                                    onClick={() => handleNavigate(item.path)}
                                    aria-current={isActive ? 'page' : undefined}
                                >
                                    <ItemIcon $active={isActive}>{item.icon}</ItemIcon>
                                    <ItemLabel>{item.label}</ItemLabel>
                                    {count != null && <Badge>{count}</Badge>}
                                    {isActive && count == null && <ActivePip />}
                                </Item>
                            );
                        })}

                        {si < NAV_SECTIONS.length - 1 && <Divider />}
                    </React.Fragment>
                ))}

                <Divider style={{ marginTop: 16 }} />

                {/* Active Retirement Plan */}
                {activePlan && (
                    <ActivePlanBox>
                        <ActivePlanLabel>Active Plan</ActivePlanLabel>
                        <ActivePlanName>{activePlan.name}</ActivePlanName>
                        <ActivePlanStats>
                            Pension: {fmt(activePlan.pension)}/mo
                            <br />
                            TSP Est: {fmtK(activePlan.tsp)}
                        </ActivePlanStats>
                    </ActivePlanBox>
                )}

                {/* Financial Summary */}
                <SummaryPanel>
                    <SummaryTitle>Financial Summary</SummaryTitle>

                    <SummaryRow>
                        <SummaryKey>Net income</SummaryKey>
                        <SummaryVal>{fmt(summary.income)}</SummaryVal>
                    </SummaryRow>
                    <SummaryRow>
                        <SummaryKey>Budgeted</SummaryKey>
                        <SummaryVal $variant="neutral">{fmt(summary.budgeted)}</SummaryVal>
                    </SummaryRow>
                    <SummaryRow>
                        <SummaryKey>Goals / mo</SummaryKey>
                        <SummaryVal $variant="neutral">{fmt(summary.goals)}</SummaryVal>
                    </SummaryRow>

                    <SummaryDivider />

                    <SummaryRow>
                        <SummaryKey>Remaining</SummaryKey>
                        <SummaryVal $variant={remainingVariant}>
                            {summary.remaining >= 0 ? '+' : ''}{fmt(summary.remaining)}
                        </SummaryVal>
                    </SummaryRow>
                </SummaryPanel>

                <Spacer />

                <VersionTag>LETHAL FINANCE · v1.0</VersionTag>

            </Nav>
        </>
    );
}