// src/components/ErrorBoundary.js

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error("Caught an error:", error, errorInfo);
    }

    handleReload = () => {
        // Reload the app or reset state
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            // Render custom fallback UI
            return (
                <div className="text-center text-[#D52941] p-4">
                    <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
                    <p className="text-xl mb-4">Please try refreshing the page or click the button below to restart the game.</p>
                    <button onClick={this.handleReload} className="px-6 py-3 bg-[#D52941] text-white rounded-full">
                        Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
