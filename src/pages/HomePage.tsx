import { lazy, Suspense } from 'react'
import useLenis from '../hooks/useLenis'
import HeroSection from '../components/HeroSection'
import AlertaCritico from '../components/AlertaCritico'
import Metodologia from '../components/Metodologia'

const LogoMarquee = lazy(() => import('../components/LogoMarquee'))
const CeoSection = lazy(() => import('../components/CeoSection'))
const Servicos = lazy(() => import('../components/Servicos'))
const FaqSection = lazy(() => import('../components/FaqSection'))
const Depoimentos = lazy(() => import('../components/Depoimentos'))
const CarrosselCases = lazy(() => import('../components/CarrosselCases'))

export default function HomePage() {
  useLenis()

  return (
    <main>
      <HeroSection />
      <AlertaCritico />
      <Metodologia />
      <Suspense fallback={<div className="min-h-[20vh]" />}>
        <LogoMarquee />
      </Suspense>
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <CeoSection />
      </Suspense>
      <Suspense fallback={<div className="min-h-[40vh]" />}>
        <Servicos />
      </Suspense>
      <Suspense fallback={<div className="h-screen" />}>
        <CarrosselCases />
      </Suspense>
      <Suspense fallback={<div className="min-h-[50vh]" />}>
        <Depoimentos />
      </Suspense>
      <Suspense fallback={<div className="min-h-[30vh]" />}>
        <FaqSection />
      </Suspense>
    </main>
  )
}
