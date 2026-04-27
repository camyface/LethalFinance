import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from '@emotion/styled';
import SideNav from './SideNav';

// ─────────────────────────────────────────────────────────────
// Styled components
// ─────────────────────────────────────────────────────────────

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const Header = styled.header`
  background: ${({ theme }) => theme.oliveDim};
  padding: 10px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 3px solid ${({ theme }) => theme.gold};
  flex-shrink: 0;
  height: 52px;
  z-index: 200;
`;

const Logo = styled.div`
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 26px;
  color: ${({ theme }) => theme.gold};
  letter-spacing: 3px;
  line-height: 1;

  span { color: #ffffff; }
`;

const HeaderSub = styled.div`
  font-family: ${({ theme }) => theme.fontMono};
  font-size: 9px;
  color: ${({ theme }) => theme.oliveLight};
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 2px;
`;

const RankBadge = styled.div`
  background: ${({ theme }) => theme.gold};
  color: ${({ theme }) => theme.ink};
  font-family: ${({ theme }) => theme.fontDisplay};
  font-size: 12px;
  letter-spacing: 1px;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radiusSm};
`;

const HamburgerBtn = styled.button`
  all: unset;
  cursor: pointer;
  display: none;
  flex-direction: column;
  gap: 4px;
  padding: 4px;

  span {
    display: block;
    width: 20px;
    height: 2px;
    background: ${({ theme }) => theme.gold};
    border-radius: 1px;
    transition: opacity 0.12s;
  }

  @media (max-width: 900px) {
    display: flex;
  }
`;

// This row sits below the header and fills the remaining height
const Body = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// The scrollable main content area
const Main = styled.main`
  flex: 1;
  overflow-y: auto;
  background: ${({ theme }) => theme.paper};

  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.paper3} transparent;
  &::-webkit-scrollbar       { width: 6px; }
  &::-webkit-scrollbar-thumb { background: ${({ theme }) => theme.paper3}; border-radius: 3px; }
`;

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

/**
 * AppLayout
 *
 * Wrap your authenticated routes with this component.
 * It renders the header, side nav, and an <Outlet /> for the page.
 *
 * Props (all optional — wire up real data from your state/context):
 *   rank       {string}  — e.g. "E-5 · 8 YRS"
 *   planCount  {number}  — badge on My Plans nav item
 *   goalCount  {number}  — badge on Financial Goals nav item
 *   summary    {object}  — { income, budgeted, goals, remaining }
 *   activePlan {object}  — { name, pension, tsp }
 */
export default function AppLayout({
                                      rank       = 'E-5 · 8 YRS',
                                      planCount,
                                      goalCount,
                                      summary,
                                      activePlan,
                                  }) {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <Shell>
            <Header>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* Hamburger — only visible on mobile */}
                    <HamburgerBtn
                        onClick={() => setMobileNavOpen((o) => !o)}
                        aria-label="Toggle navigation"
                    >
                        <span /><span /><span />
                    </HamburgerBtn>

                    <div>
                        <Logo><span>LETHAL</span> FINANCE</Logo>
                        <HeaderSub>Military Retirement Planning System</HeaderSub>
                    </div>
                </div>

                <RankBadge>{rank}</RankBadge>
            </Header>

            <Body>
                <SideNav
                    mobileOpen={mobileNavOpen}
                    onMobileClose={() => setMobileNavOpen(false)}
                    planCount={planCount}
                    goalCount={goalCount}
                    summary={summary}
                    activePlan={activePlan}
                />

                {/* <Outlet /> renders whichever child route is currently active */}
                <Main>
                    <Outlet />
                </Main>
            </Body>
        </Shell>
    );
}