import type Lenis from 'lenis'

declare global {
  interface LeadBoosterEventQueueItem {
    t: 'o' | 't'
    n: string
    h?: (...args: unknown[]) => void
  }

  interface Window {
    __lenis: Lenis | null
    pipedriveLeadboosterConfig?: {
      base: string
      companyId: number
      playbookUuid: string
      version: number
    }
    LeadBooster?: {
      q: LeadBoosterEventQueueItem[]
      on: (name: string, handler: (...args: unknown[]) => void) => void
      trigger: (name: 'open' | 'close') => void
    }
  }

  interface ImportMetaEnv {
    readonly VITE_WHATSAPP_URL?: string
    readonly VITE_CONTACT_EMAIL?: string
    readonly VITE_INSTAGRAM_URL?: string
    readonly VITE_LINKEDIN_URL?: string
    readonly VITE_SENTRY_DSN?: string
  }
}

export {}
