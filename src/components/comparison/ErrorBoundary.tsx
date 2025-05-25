import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Comparison error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Something went wrong displaying the comparison
          </h3>
          <p className="text-gray-600 mb-4">
            We encountered an error while showing the tool comparison.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="text-blue-600 hover:text-blue-800"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}