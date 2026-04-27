# Lethal Finance — Emotion Integration Guide

## 1. Install dependencies

```bash
npm install @emotion/react @emotion/styled
```

That's it. No Babel plugin needed for basic usage.
If you want the `css` prop on regular HTML elements, add the Babel plugin:
```bash
npm install --save-dev @emotion/babel-plugin
```

---

## 2. File structure

```
src/
  styles/
    theme.js          <- design tokens (plain JS, no library dependency)
    GlobalStyles.js   <- Bootstrap overrides via Emotion's Global + css
    lfComponents.js   <- reusable Emotion styled-components
```

---

## 3. Wire up in main.jsx / index.jsx

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// Bootstrap CSS first — GlobalStyles overrides it
import 'bootstrap/dist/css/bootstrap.min.css';

import { ThemeProvider, Global } from '@emotion/react';
import { lfTheme } from './styles/theme';
import { getGlobalStyles } from './styles/GlobalStyles';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={lfTheme}>
      <Global styles={getGlobalStyles(lfTheme)} />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### Key difference from styled-components
Emotion's `<Global>` does not receive the theme prop automatically,
so GlobalStyles.js exports a function `getGlobalStyles(theme)` instead of
a component. You call it once at the root, passing `lfTheme` directly.

---

## 4. Add the Google Font to index.html

```html
<head>
  <link
    href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
</head>
```

---

## 5. Imports cheat sheet

| What | styled-components | Emotion |
|---|---|---|
| `styled` | `import styled from 'styled-components'` | `import styled from '@emotion/styled'` |
| `css` helper | `import { css } from 'styled-components'` | `import { css } from '@emotion/react'` |
| Global styles | `import { createGlobalStyle } from 'styled-components'` | `import { Global, css } from '@emotion/react'` |
| ThemeProvider | `import { ThemeProvider } from 'styled-components'` | `import { ThemeProvider } from '@emotion/react'` |
| useTheme hook | `import { useTheme } from 'styled-components'` | `import { useTheme } from '@emotion/react'` |

Everything else — template literals, `${({ theme }) => ...}`, transient props,
`styled(BootstrapComponent)` — is identical.

---

## 6. Component usage examples

### App shell

```jsx
import { ThemeProvider } from '@emotion/react';
import {
  AppHeader, Logo, HeaderSub, RankBadge,
  AppGrid, Sidebar, SidebarSection, NavItem, NavIcon, NavBadge,
  MainContent, ViewPane, PageTitle, PageSub,
} from './styles/lfComponents';

function App() {
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <>
      <AppHeader>
        <div>
          <Logo><span>LETHAL</span> FINANCE</Logo>
          <HeaderSub>Military Retirement Planning System</HeaderSub>
        </div>
        <RankBadge>E-5 · 8 YRS</RankBadge>
      </AppHeader>

      <AppGrid>
        <Sidebar>
          <SidebarSection>Retirement</SidebarSection>
          <NavItem $active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')}>
            <NavIcon>◈</NavIcon> Dashboard
          </NavItem>
          <SidebarSection>Financial Life</SidebarSection>
          <NavItem $active={activeView === 'goals'} onClick={() => setActiveView('goals')}>
            <NavIcon>◎</NavIcon> Goals <NavBadge>3</NavBadge>
          </NavItem>
          <NavItem $active={activeView === 'budget'} onClick={() => setActiveView('budget')}>
            <NavIcon>▦</NavIcon> Budget
          </NavItem>
        </Sidebar>

        <MainContent>
          <ViewPane>
            <PageTitle>Mission Overview</PageTitle>
            <PageSub>BRS · Goals · Budget</PageSub>
          </ViewPane>
        </MainContent>
      </AppGrid>
    </>
  );
}
```

### Metric cards

```jsx
import { MetricsRow, MetricCard, MetricValue, MetricLabel } from './styles/lfComponents';

<MetricsRow cols={4}>
  <MetricCard>
    <MetricValue>$2,847</MetricValue>
    <MetricLabel>Monthly Pension</MetricLabel>
  </MetricCard>
  <MetricCard>
    <MetricValue color="gold">$312K</MetricValue>
    <MetricLabel>TSP at Retire</MetricLabel>
  </MetricCard>
  <MetricCard>
    <MetricValue color="green">$14.2K</MetricValue>
    <MetricLabel>Goals Saved</MetricLabel>
  </MetricCard>
  <MetricCard>
    <MetricValue color="red">$18.5K</MetricValue>
    <MetricLabel>Total Debt</MetricLabel>
  </MetricCard>
</MetricsRow>
```

### Progress bar

```jsx
import { ProgressWrap, ProgressLabel, ProgressTrack, ProgressFill } from './styles/lfComponents';

<ProgressWrap>
  <ProgressLabel>
    <span>House Down Payment</span>
    <span>28%</span>
  </ProgressLabel>
  <ProgressTrack>
    <ProgressFill pct={28} color="blue" />
  </ProgressTrack>
</ProgressWrap>
```

### Info rows

```jsx
import { InfoRow, InfoKey, InfoVal } from './styles/lfComponents';

<InfoRow>
  <InfoKey>Pension Formula</InfoKey>
  <InfoVal>2.0% x 20 x $3,380</InfoVal>
</InfoRow>
<InfoRow>
  <InfoKey>Net Remaining</InfoKey>
  <InfoVal color="success">$275/mo</InfoVal>
</InfoRow>
```

### Tags

```jsx
import { LFTag } from './styles/lfComponents';

// variant: active | draft | warning | debt | savings | invest | high | medium | low
<LFTag variant="savings">savings</LFTag>
<LFTag variant="high">high priority</LFTag>
```

### React Bootstrap (auto-styled, no extra classes needed)

```jsx
import { Button, Alert, Badge, Tabs, Tab, Table } from 'react-bootstrap';

<Button variant="primary">Save Plan</Button>
<Button variant="secondary">New Goal</Button>
<Button variant="outline-primary" size="sm">Edit</Button>
<Button variant="outline-danger" size="sm">Delete</Button>

<Alert variant="info">CB is offered between YOS 8-12.</Alert>
<Alert variant="success">Budget is on track.</Alert>

<Badge bg="success">Active</Badge>
<Badge bg="warning">Draft</Badge>

<Tabs defaultActiveKey="monthly">
  <Tab eventKey="monthly" title="Monthly Budget">...</Tab>
  <Tab eventKey="annual"  title="Annual View">...</Tab>
  <Tab eventKey="analysis" title="Analysis">...</Tab>
</Tabs>
```

### Extending a React Bootstrap component with Emotion

```jsx
import styled from '@emotion/styled';
import { Card } from 'react-bootstrap';

const PlanCard = styled(Card)`
  border-left: 3px solid ${({ theme, $active }) =>
    $active ? theme.success : theme.border} !important;
  background: ${({ $active }) => $active ? '#f0f5eb' : '#ffffff'} !important;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: ${({ theme }) => theme.paper2} !important;
  }
`;

<PlanCard $active={plan.isActive} onClick={() => setActivePlan(plan.id)}>
  <Card.Body>...</Card.Body>
</PlanCard>
```

### useTheme hook (alternative to theme props)

```jsx
import { useTheme } from '@emotion/react';

function RetirementBadge({ value }) {
  const theme = useTheme();
  return (
    <span style={{ color: theme.gold, fontFamily: theme.fontDisplay }}>
      {value}
    </span>
  );
}
```

---

## 7. TypeScript — theme type declaration (optional)

If you're using TypeScript, add this to a `emotion.d.ts` file in your `src/`:

```ts
import '@emotion/react';
import { lfTheme } from './styles/theme';

type LFTheme = typeof lfTheme;

declare module '@emotion/react' {
  export interface Theme extends LFTheme {}
}
```

This gives you full autocomplete on `theme.` inside every styled component.

---

## 8. Spring Boot API — Axios setup

```js
// src/api/lfApi.js
import axios from 'axios';

const lfApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

lfApi.interceptors.request.use(config => {
  const token = localStorage.getItem('lf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default lfApi;

// Suggested endpoint mapping:
// GET  /api/plans        -> retirement plans
// POST /api/plans        -> create plan
// PUT  /api/plans/{id}   -> update plan
// GET  /api/goals        -> financial goals
// POST /api/goals        -> create goal
// PUT  /api/goals/{id}   -> update goal progress
// GET  /api/budget       -> budget categories + items
// POST /api/budget/items -> add budget item
// GET  /api/profile      -> service profile (rank, YOS, pay)
```