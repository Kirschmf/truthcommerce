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

function waitForLeadBoosterInitialization() {
  if (typeof window === 'undefined') {
    return Promise.resolve()
  }

  if (window.LeadBooster?.initialized) {
    return Promise.resolve()
  }

  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = new Promise((resolve) => {
    let completed = false

    const completeInitialization = () => {
      if (completed) return
      completed = true
      initializationPromise = null
      resolve()
    }

    window.LeadBooster?.on('initialized', completeInitialization)

    window.setTimeout(() => {
      if (window.LeadBooster?.initialized) {
        completeInitialization()
      }
    }, 0)
  })

  return initializationPromise
}

function getLeadBoosterFrameElement() {
  return document.querySelector<HTMLIFrameElement>('iframe[title="Chatbot"]')
}

function isLeadBoosterLauncherVisible() {
  const frame = getLeadBoosterFrameElement()
  if (!frame) return false

  const rect = frame.getBoundingClientRect()
  return rect.width <= 104 && rect.height <= 104
}

function clickLeadBoosterLauncher() {
  const frame = getLeadBoosterFrameElement()
  if (!frame) return false

  const rect = frame.getBoundingClientRect()
  if (!rect.width || !rect.height) return false

  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2

  frame.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse' }))
  frame.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y }))
  frame.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: x, clientY: y, pointerId: 1, pointerType: 'mouse' }))
  frame.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, clientX: x, clientY: y }))
  frame.click()

  return true
}

async function waitForLeadBoosterOpen() {
  if (typeof window === 'undefined') return

  await new Promise((resolve) => window.setTimeout(resolve, 300))

  if (!isLeadBoosterLauncherVisible()) {
    return
  }

  clickLeadBoosterLauncher()
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
  window.LeadBooster?.trigger('open')
  await waitForLeadBoosterOpen()
}
