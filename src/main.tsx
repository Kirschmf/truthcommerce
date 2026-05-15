import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import * as Sentry from '@sentry/react'
import App from './App'
import AppErrorBoundary from './components/AppErrorBoundary'
import { OBSERVABILITY } from './config/observability'
import { initializeLeadBooster } from './integrations/leadBooster'
import './styles/global.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element #root was not found')
}

if (OBSERVABILITY.sentryDsn) {
  Sentry.init({
    dsn: OBSERVABILITY.sentryDsn,
    environment: OBSERVABILITY.environment,
    tracesSampleRate: OBSERVABILITY.tracesSampleRate,
  })
}

initializeLeadBooster()

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <BrowserRouter>
        <App />
        <Analytics />
        <SpeedInsights />
      </BrowserRouter>
    </AppErrorBoundary>
  </StrictMode>,
)
