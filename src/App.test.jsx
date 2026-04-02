import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the hero section', () => {
    render(<App />)
    expect(screen.getByText('Infraestrutura B2B')).toBeInTheDocument()
  })

  it('renders the CTA buttons', () => {
    render(<App />)
    expect(screen.getByText('Conhecer a estrutura')).toBeInTheDocument()
    expect(screen.getByText('Falar com especialista')).toBeInTheDocument()
  })

  it('renders the header navigation', () => {
    render(<App />)
    expect(screen.getByText('Metodologia')).toBeInTheDocument()
    expect(screen.getAllByText('Infraestrutura Ativa').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Perguntas Frequentes/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the header CTA button', () => {
    render(<App />)
    expect(screen.getByText('Avaliar Estrutura')).toBeInTheDocument()
  })
})
