// app.js

const { useState, useEffect } = React;
const ReactDOM = window.ReactDOM;
const tg = window.Telegram.WebApp;

// Assign components from window
const Tutorial = window.Tutorial;
const Game = window.Game;
const ErrorBoundary = window.ErrorBoundary;

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
