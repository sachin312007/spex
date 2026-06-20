import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  expandedDetails: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    expandedDetails: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null, expandedDetails: false };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[SPEX RUNTIME FAILURE]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      expandedDetails: false
    });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] w-full flex items-center justify-center p-6 bg-[#0d0d0d] text-white">
          <div className="max-w-md w-full rounded-3xl border border-neutral-800 bg-[#141414] p-8 shadow-2xl relative overflow-hidden text-center space-y-6">
            <div className="absolute top-0 right-0 h-32 w-32 bg-rose-500/5 rounded-full blur-[40px] pointer-events-none" />
            
            <div className="mx-auto h-16 w-16 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 border border-rose-500/20 shadow-lg">
              <AlertOctagon className="h-8 w-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-black tracking-widest text-rose-500 font-mono uppercase">
                System Safeguard Intercept
              </span>
              <h2 className="text-xl font-black text-white">
                Something didn't sit right...
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
                Spex's virtual sommelier encountered a parsing error while preparing your visual culinary view. The backend remains 100% active.
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={this.handleReset}
                className="w-full rounded-xl bg-gradient-to-r from-[#FF5A1F] to-[#FF8C42] py-3 text-xs font-bold text-white hover:brightness-110 shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <RotateCcw className="h-4 w-4" />
                Refreshen Dining Lounge
              </button>
            </div>

            {this.state.error && (
              <div className="border border-neutral-850 bg-neutral-950/40 rounded-2xl overflow-hidden mt-4 text-left">
                <button
                  onClick={() => this.setState(prev => ({ expandedDetails: !prev.expandedDetails }))}
                  className="w-full flex items-center justify-between px-4 py-3 text-[10px] font-bold text-neutral-500 hover:text-white transition font-mono uppercase cursor-pointer"
                >
                  <span>Culinary Log Diagnostic</span>
                  {this.state.expandedDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {this.state.expandedDetails && (
                  <div className="px-4 pb-4 font-mono text-[9px] text-[#FFD166]/90 overflow-x-auto max-h-48 whitespace-pre leading-relaxed select-text border-t border-neutral-850 pt-3">
                    <p className="font-bold text-red-400 mb-1">{this.state.error.toString()}</p>
                    {this.state.errorInfo?.componentStack}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
