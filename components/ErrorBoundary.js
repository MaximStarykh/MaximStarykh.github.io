// components/ErrorBoundary.js

import React, { Component } from 'react';
import { COLORS } from './constants';

/**
 * ErrorBoundary component to catch rendering errors
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        this.logError(error, errorInfo);
    }

    logError(error, errorInfo) {
        // Log the error to a service like Sentry
        console.error("Caught an error:", error, errorInfo);
        // TODO: Implement proper error logging service
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="text-center p-4" style={{ color: COLORS.PRIMARY }}>
                    <h2 className="text-3xl font-bold mb-4">Oops! Something went wrong.</h2>
                    <p className="text-xl mb-4">Please try refreshing the page or contact support if the problem persists.</p>
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-4 text-left">
                            <summary>Error Details</summary>
                            <pre className="mt-2 p-2 bg-gray-100 rounded">
                                {this.state.error && this.state.error.toString()}
                                <br />
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;