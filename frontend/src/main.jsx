import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
// Bootstrap CSS first — GlobalStyles overrides it
import 'bootstrap/dist/css/bootstrap.min.css';

import {ThemeProvider, Global} from '@emotion/react';
import {lfTheme} from './styles/theme';
import {getGlobalStyles} from './styles/GlobalStyles';
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';


createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={lfTheme}>
            <Global styles={getGlobalStyles(lfTheme)}/>
            <App/>
        </ThemeProvider>
    </StrictMode>,
)
