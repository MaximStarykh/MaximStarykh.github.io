// main.js

import React from 'react';
import ReactDOM from 'react-dom';
import DiceProphet from './src/components/DiceProphet.js';
import ErrorBoundary from './src/components/ErrorBoundary.js';

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <DiceProphet />
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);
