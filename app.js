// app.js

const { useState, useEffect } = React;
const ReactDOM = window.ReactDOM;
const tg = window.Telegram.WebApp;

// Import components and utilities
// Assuming all components are in the components/ directory
// and gameReducer is in utils/ directory

// For the purpose of this example, we'll use inline imports.
// In a real setup, you would use bundlers like Webpack or Parcel.

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
