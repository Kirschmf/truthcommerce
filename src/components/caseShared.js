import { CASES } from '../data/cases'

export const CASE_STACK_LABELS = {
  erp: 'ERP',
  ecommerce: 'E-COMMERCE',
  marketplaces: 'MKT',
}

export function getCaseCount() {
  return CASES.length
}

export function getCaseByIndex(index) {
  const normalizedIndex = ((index % CASES.length) + CASES.length) % CASES.length
  return CASES[normalizedIndex]
}

export function getFullCases(multiplier = 3) {
  return Array.from({ length: multiplier }, () => CASES).flat()
}
