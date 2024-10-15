// app.js

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Tutorial } from './components/Tutorial';
import { Game } from './components/Game';
import { ErrorBoundary } from './components/ErrorBoundary';

const tg = window.Telegram.WebApp;

function App() {
    const [showTutorial, setShowTutorial] = useState(true);

    useEffect(() => {
        tg.ready();
        tg.expand();
    }, []);

    const startGame = () => {
        setShowTutorial(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {showTutorial ? (
                <Tutorial onComplete={startGame} />
            ) : (
                <Game />
            )}
        </div>
    );
}

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('root')
);