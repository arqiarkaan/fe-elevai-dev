import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary component to catch and handle runtime errors
 * Prevents the entire app from crashing
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-2">
                Oops! Terjadi Kesalahan
              </h2>
              <p className="text-muted-foreground mb-4">
                Maaf, aplikasi mengalami kesalahan yang tidak terduga.
              </p>
              {this.state.error && (
                <details className="text-left text-sm bg-muted p-4 rounded-lg">
                  <summary className="cursor-pointer font-semibold mb-2">
                    Detail Error
                  </summary>
                  <code className="text-xs text-muted-foreground break-all">
                    {this.state.error.toString()}
                  </code>
                </details>
              )}
            </div>

            <div className="space-y-2">
              <Button onClick={this.handleReset} className="w-full">
                Kembali ke Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Halaman
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
