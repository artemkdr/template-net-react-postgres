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
