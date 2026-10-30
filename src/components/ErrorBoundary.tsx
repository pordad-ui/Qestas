import React, { Component, ErrorInfo, ReactNode } from 'react';
import { LegalScalesLogo } from './LegalScalesLogo';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in component tree:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6 dir-rtl text-right font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-6">
            <div className="flex justify-center">
              <LegalScalesLogo variant="gold" size="lg" className="shadow-lg shadow-amber-500/10 rounded-xl" />
            </div>
            
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-amber-400 font-semibold text-lg">
                <AlertTriangle className="w-5 h-5" />
                <span>بازیابی سامانه حقوقی دادگستر</span>
              </div>
              <p className="text-sm text-slate-400">
                یک خطای موقت در بارگذاری رخ داده است. جای نگرانی نیست، داده‌های شما در امنیت کامل محفوظ است.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-sm transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>تلاش مجدد</span>
              </button>
              <button
                onClick={this.handleReload}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-colors border border-slate-700"
              >
                بارگذاری مجدد صفحه
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
