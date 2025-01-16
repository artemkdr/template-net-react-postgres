import '@fontsource/roboto-condensed/300.css';
import '@fontsource/roboto-condensed/400.css';
import '@fontsource/roboto-condensed/600.css';
import '@fontsource/roboto-condensed/700.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';

import '@/app/i18n';
import { AppRouter } from '@/app/router';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <AppRouter />
    </React.StrictMode>
);
