import { Component, type ErrorInfo, type ReactNode } from 'react'
import * as Sentry from '@sentry/react'

interface AppErrorBoundaryProps {
  children: ReactNode
}

interface AppErrorBoundaryState {
  hasError: boolean
}

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#040507] text-white px-[5%] py-24 flex items-center justify-center">
          <div className="max-w-[640px] text-center">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--green)] mb-4">
              Falha inesperada
            </p>
            <h1 className="font-heading text-[clamp(2rem,6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] mb-4">
              Algo saiu do previsto.
            </h1>
            <p className="text-text-muted text-[1rem] leading-[1.8] mb-8">
              O erro já foi registrado. Recarregue a página ou tente novamente em instantes.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#EBEBEB] text-[#050505] text-[13px] font-medium transition-all duration-300 hover:bg-white hover:-translate-y-px"
            >
              Recarregar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
