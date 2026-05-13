export interface NavLinkItem {
  label: string
  href: string
  external?: boolean
}

export interface ContactLink {
  href: string
  label: string
}

export interface CaseMetric {
  label: string
  value: number | string
  suffix: string
  prefix: string
}

export interface CaseStackEntry {
  name: string
  present: boolean
}

export interface CaseCallToAction {
  label: string
  href: string
  type: 'ecommerce' | 'marketplace' | 'custom'
}

export interface CaseStudy {
  id: string
  client: string
  segment: string
  headline: string
  intro: string
  description: string
  metrics: CaseMetric[]
  stack: {
    erp: CaseStackEntry
    ecommerce: CaseStackEntry
    marketplaces: string[]
  }
  cta?: CaseCallToAction
  img: string
}
