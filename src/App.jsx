import { useEffect, useMemo } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import StarfieldBg from './components/StarfieldBg'
import HomePage from './pages/HomePage'
import NossosServicosPage from './pages/NossosServicosPage'

function scrollToTop() {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const isServicesPage = location.pathname === '/nossos-servicos'

  useEffect(() => {
    scrollToTop()
  }, [location.pathname])

  const navLinks = useMemo(() => (
    isServicesPage
      ? [
          { label: 'Início', href: '/' },
          { label: 'Nossos Serviços', href: '/nossos-servicos' },
          { label: 'Falar com especialista', href: '#footer' },
        ]
      : [
          { label: 'Início', href: '/' },
          { label: 'Nossos Serviços', href: '/nossos-servicos' },
          { label: 'Metodologia', href: '#metodo' },
          { label: 'Infraestrutura Ativa', href: '#depoimentos' },
          { label: 'Perguntas Frequentes', href: '#faq' },
        ]
  ), [isServicesPage])

  const footerLinks = useMemo(() => (
    isServicesPage
      ? [
          { label: 'Início', href: '/' },
          { label: 'Nossos Serviços', href: '/nossos-servicos' },
          { label: 'Contato', href: '#footer' },
        ]
      : [
          { label: 'Início', href: '/' },
          { label: 'Metodologia', href: '#metodo' },
          { label: 'Infraestrutura Ativa', href: '#depoimentos' },
          { label: 'Perguntas Frequentes', href: '#faq' },
        ]
  ), [isServicesPage])

  return (
    <div className="relative min-h-screen text-text-main">
      <StarfieldBg />
      <Header navLinks={navLinks} onNavigate={navigate} currentPath={location.pathname} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/nossos-servicos" element={<NossosServicosPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer navLinks={footerLinks} onNavigate={navigate} currentPath={location.pathname} />
    </div>
  )
}
