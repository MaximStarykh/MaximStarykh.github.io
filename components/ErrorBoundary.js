// components/ErrorBoundary.js

const { Component } = React;

/**
 * ErrorBoundary component to catch rendering errors
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error("Caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Render any custom fallback UI
            return (
                <div className="text-center text-[#D52941] p-4">
                    <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
                    <p className="text-xl">Please try refreshing the page or contact support if the problem persists.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
