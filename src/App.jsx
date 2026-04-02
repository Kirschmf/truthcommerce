import { lazy, Suspense } from 'react'
import useLenis from './hooks/useLenis'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import AlertaCritico from './components/AlertaCritico'
import Metodologia from './components/Metodologia'
import LogoMarquee from './components/LogoMarquee'
import CeoSection from './components/CeoSection'
import TunnelSection from './components/TunnelSection'
import Servicos from './components/Servicos'
import Depoimentos from './components/Depoimentos'
import FaqSection from './components/FaqSection'
import Footer from './components/Footer'
import StarfieldBg from './components/StarfieldBg'

const CarrosselCases = lazy(() => import('./components/CarrosselCases'))

export default function App() {
  useLenis()

  return (
    <div className="relative min-h-screen text-text-main">
      <StarfieldBg />
      <Header />
      <main>
        <HeroSection />
        <AlertaCritico />
        <Metodologia />
        <LogoMarquee />
        <CeoSection />
        <Servicos />
        <Suspense fallback={<div className="h-screen" />}>
          <CarrosselCases />
        </Suspense>
        <Depoimentos />
        <FaqSection />
        <TunnelSection />
      </main>
      <Footer />
    </div>
  )
}
