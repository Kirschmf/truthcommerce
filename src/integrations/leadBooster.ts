const LEAD_BOOSTER_SCRIPT_ID = 'pipedrive-leadbooster-loader'
const LEAD_BOOSTER_SCRIPT_SRC = 'https://leadbooster-chat.pipedrive.com/assets/loader.js'

export const LEAD_BOOSTER_HREF = '#leadbooster'

const LEAD_BOOSTER_CONFIG = {
  base: 'leadbooster-chat.pipedrive.com',
  companyId: 14722738,
  playbookUuid: 'dd2fab09-098d-439d-ba99-a63f8836f2c4',
  version: 2,
} as const

let loadPromise: Promise<void> | null = null
let initializationPromise: Promise<void> | null = null

const LEAD_BOOSTER_INITIALIZATION_TIMEOUT_MS = 5000
const LEAD_BOOSTER_OPEN_RETRY_DELAY_MS = 400
const LEAD_BOOSTER_OPEN_RETRIES = 2
const LEAD_BOOSTER_LAUNCHER_MAX_SIZE = 104

function createLeadBoosterStub(): NonNullable<Window['LeadBooster']> {
  return {
    q: [],
    on(name, handler) {
      this.q.push({ t: 'o', n: name, h: handler })
    },
    trigger(name) {
      this.q.push({ t: 't', n: name })
    },
  }
}

function configureLeadBooster() {
  window.pipedriveLeadboosterConfig ??= { ...LEAD_BOOSTER_CONFIG }
  window.LeadBooster ??= createLeadBoosterStub()
}

export function isLeadBoosterHref(href: string) {
  return href === LEAD_BOOSTER_HREF
}

export function ensureLeadBoosterLoaded() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  configureLeadBooster()

  if (loadPromise) {
    return loadPromise
  }

  const existingScript = document.getElementById(LEAD_BOOSTER_SCRIPT_ID) as HTMLScriptElement | null

  if (existingScript) {
    if (existingScript.dataset.loaded === 'true') {
      loadPromise = Promise.resolve()
      return loadPromise
    }

    loadPromise = new Promise((resolve, reject) => {
      existingScript.addEventListener(
        'load',
        () => {
          existingScript.dataset.loaded = 'true'
          resolve()
        },
        { once: true },
      )
      existingScript.addEventListener(
        'error',
        () => {
          loadPromise = null
          reject(new Error('Failed to load LeadBooster script'))
        },
        { once: true },
      )
    })

    return loadPromise
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = LEAD_BOOSTER_SCRIPT_ID
    script.src = LEAD_BOOSTER_SCRIPT_SRC
    script.async = true
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true'
        resolve()
      },
      { once: true },
    )
    script.addEventListener(
      'error',
      () => {
        loadPromise = null
        reject(new Error('Failed to load LeadBooster script'))
      },
      { once: true },
    )
    document.head.append(script)
  })

  return loadPromise
}

function waitForLeadBoosterInitialization(timeoutMs = LEAD_BOOSTER_INITIALIZATION_TIMEOUT_MS) {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.LeadBooster?.initialized) {
    return Promise.resolve()
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = new Promise((resolve, reject) => {
    let completed = false

    const completeInitialization = () => {
      if (completed) return
      completed = true
      initializationPromise = null
      resolve()
    }

    const failInitialization = () => {
      if (completed) return
      completed = true
      initializationPromise = null
      reject(new Error('LeadBooster initialization timed out'))
    }

    window.LeadBooster?.on('initialized', completeInitialization)

    window.setTimeout(() => {
      if (window.LeadBooster?.initialized) {
        completeInitialization()
        return
      }

      failInitialization()
    }, timeoutMs)
  })

  return initializationPromise
}

function getLeadBoosterFrameElement() {
  return document.querySelector<HTMLIFrameElement>('iframe[title="Chatbot"]')
}

function getLeadBoosterFrameRect() {
  const frame = getLeadBoosterFrameElement()
  if (!frame) return null

  const rect = frame.getBoundingClientRect()
  if (!rect.width || !rect.height) return null

  return rect
}

function isLeadBoosterLauncherVisible() {
  const rect = getLeadBoosterFrameRect()
  if (!rect) return false

  return rect.width <= LEAD_BOOSTER_LAUNCHER_MAX_SIZE && rect.height <= LEAD_BOOSTER_LAUNCHER_MAX_SIZE
}

function isLeadBoosterExpanded() {
  const rect = getLeadBoosterFrameRect()
  if (!rect) return false

  return rect.width > LEAD_BOOSTER_LAUNCHER_MAX_SIZE || rect.height > LEAD_BOOSTER_LAUNCHER_MAX_SIZE
}

async function waitForLeadBoosterExpanded(timeoutMs = LEAD_BOOSTER_OPEN_RETRY_DELAY_MS) {
  if (typeof window === 'undefined') return false

  const start = window.performance.now()

  while (window.performance.now() - start < timeoutMs) {
    if (isLeadBoosterExpanded()) {
      return true
    }

    await new Promise((resolve) => window.setTimeout(resolve, 50))
  }

  return isLeadBoosterExpanded()
}

export function initializeLeadBooster() {
  if (typeof window === 'undefined') return

  configureLeadBooster()
  void ensureLeadBoosterLoaded().then(() => waitForLeadBoosterInitialization()).catch(() => {})
}

export async function openLeadBooster() {
  if (typeof window === 'undefined') return

  configureLeadBooster()
  await ensureLeadBoosterLoaded()
  await waitForLeadBoosterInitialization()

  for (let attempt = 0; attempt < LEAD_BOOSTER_OPEN_RETRIES; attempt += 1) {
    window.LeadBooster?.trigger('open')

    if (await waitForLeadBoosterExpanded()) {
      return
    }

    if (!isLeadBoosterLauncherVisible()) {
      return
    }
  }
}
