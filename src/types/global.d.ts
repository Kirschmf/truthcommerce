import type Lenis from 'lenis'

declare global {
  interface Window {
    __lenis: Lenis | null
  }

  interface ImportMetaEnv {
    readonly VITE_WHATSAPP_URL?: string
    readonly VITE_CONTACT_EMAIL?: string
    readonly VITE_INSTAGRAM_URL?: string
    readonly VITE_LINKEDIN_URL?: string
  }
}

export {}
