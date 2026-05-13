import { lazy, Suspense } from 'react'
import useLenis from '../hooks/useLenis'
import HeroSection from '../components/HeroSection'
import AlertaCritico from '../components/AlertaCritico'
import Metodologia from '../components/Metodologia'
import LogoMarquee from '../components/LogoMarquee'
import CeoSection from '../components/CeoSection'
import Servicos from '../components/Servicos'
import Depoimentos from '../components/Depoimentos'
import FaqSection from '../components/FaqSection'

const CarrosselCases = lazy(() => import('../components/CarrosselCases'))

export default function HomePage() {
  useLenis()

  return (
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
    </main>
  )
}
