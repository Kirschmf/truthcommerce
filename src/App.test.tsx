import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from './App'

function renderAt(pathname = '/') {
  return render(
    <MemoryRouter initialEntries={[pathname]}>
      <App />
    </MemoryRouter>,
  )
}

describe('App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
    window.LeadBooster = {
      q: [],
      on: vi.fn(),
      trigger: vi.fn(),
    }
  })

  it('renders the hero section on home', () => {
    renderAt('/')
    expect(screen.getByText('Infraestrutura B2B')).toBeInTheDocument()
  })

  it('renders the CTA buttons on home', () => {
    renderAt('/')
    expect(screen.getByText('Conhecer a estrutura')).toBeInTheDocument()
    expect(screen.getAllByText('Falar com especialista').length).toBeGreaterThanOrEqual(1)
  })

  it('opens LeadBooster from the specialist CTA', () => {
    renderAt('/')
    fireEvent.click(screen.getAllByText('Falar com especialista')[0])
    expect(window.LeadBooster?.trigger).toHaveBeenCalledWith('open')
  })

  it('renders the shared navigation items', () => {
    renderAt('/')
    expect(screen.getAllByText('Início').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Nossos Serviços').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Perguntas Frequentes/i).length).toBeGreaterThanOrEqual(1)
  })

  it('renders the services page content', () => {
    renderAt('/nossos-servicos')
    expect(
      screen.getByText('Conheça as soluções premium que oferecemos para sua empresa'),
    ).toBeInTheDocument()
    expect(screen.getByText('Consultoria em E-commerce 360º')).toBeInTheDocument()
  })

  it('removes WhatsApp links from the footer', () => {
    renderAt('/')
    expect(screen.queryByText('Falar no WhatsApp')).not.toBeInTheDocument()
    expect(screen.queryByText('WhatsApp')).not.toBeInTheDocument()
  })
})
