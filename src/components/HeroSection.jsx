import { lazy, Suspense, useMemo, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useTypewriter from '../hooks/useTypewriter'

gsap.registerPlugin(ScrollTrigger)

const HeroCanvas = lazy(() => import('./three/HeroCanvas'))

const PHRASES = [
  'A base sólida que a sua loja física precisa para dominar o digital.',
  'TruthCommerce',
]

// Define how to render each phrase with accented portions
function renderPhrase(phraseIndex, text) {
  if (phraseIndex === 0) {
    // Accent on "digital." at the end
    const keyword = 'digital.'
    const idx = text.lastIndexOf(keyword)
    if (idx >= 0) {
      return (
        <>
          {text.slice(0, idx)}
          <span className="accent">{text.slice(idx)}</span>
        </>
      )
    }
    return text
  }

  if (phraseIndex === 1) {
    // "Truth" in green, "Commerce" in white
    if (text.length <= 5) {
      // Still typing "Truth" portion
      return <span className="accent">{text}</span>
    }
    return (
      <>
        <span className="accent">{text.slice(0, 5)}</span>
        {text.slice(5)}
      </>
    )
  }

  return text
}

const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768

export default function HeroSection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  const phrases = useMemo(() => PHRASES, [])
  const { displayed, phraseIndex, cursor } = useTypewriter(phrases, {
    typeSpeed: 40,
    eraseSpeed: 30,
    holdDelay: 2500,
    startDelay: 300,
  })

  // Fade out + lift text on scroll — desktop only, mobile title stays fixed
  useGSAP(() => {
    if (window.innerWidth <= 768) return
    gsap.to(contentRef.current, {
      opacity: 0,
      y: -60,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '60% top',
        scrub: 0.4,
      },
    })
  }, { scope: sectionRef })

  return (
    <section id="hero" ref={sectionRef} className="hero-wrapper relative overflow-visible">

      {/* 3D Particle Cloud */}
      <Suspense fallback={null}>
        <HeroCanvas />
      </Suspense>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 flex items-start md:items-center justify-center md:justify-start min-h-screen px-[5%] md:px-[8%] lg:px-[10%] pt-[88px] md:pt-[68px]">
        <div className="max-w-[680px] w-full">

          {/* Badge — hidden on mobile to save vertical space */}
          <div className="hidden md:inline-block font-mono text-[9px] md:text-[10px] text-green uppercase tracking-[0.14em] border border-green/20 px-3 py-1.5 md:px-3.5 rounded-full mb-5 md:mb-6 bg-green/[0.04] font-bold">
            Infraestrutura B2B
          </div>

          {/* Headline — static on mobile, typewriter cycle on desktop */}
          {isMobileView ? (
            <h1 className="font-heading text-[clamp(1.8rem,7vw,2.4rem)] font-semibold leading-[1.18] tracking-[-0.028em] mb-4 max-w-[600px]">
              A base sólida que a sua loja física precisa para dominar o{' '}
              <span className="accent">digital.</span>
            </h1>
          ) : (
            <h1 className="font-heading text-[clamp(1.8rem,7vw,2.4rem)] md:text-[clamp(2.1rem,3.8vw,3.9rem)] font-semibold leading-[1.18] md:leading-[1.22] tracking-[-0.028em] mb-4 md:mb-5 max-w-[600px] min-h-[2.4em]">
              {renderPhrase(phraseIndex, displayed)}
              {cursor && <span className="animate-pulse ml-[1px]">|</span>}
            </h1>
          )}

          {/* Subtitle */}
          <p className="text-text-muted text-[clamp(0.95rem,3.5vw,1.05rem)] md:text-[clamp(1.05rem,1.2vw,1.15rem)] leading-[1.65] md:leading-[1.7] max-w-[560px] mb-8 md:mb-12">
            Nós cuidamos de toda a parte difícil. Conectamos o seu estoque físico à sua nova loja
            virtual e aos maiores marketplaces do país, deixando tudo organizado e automático para
            você focar apenas em vender.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 md:gap-4">
            <a
              href="#metodo"
              className="flex-1 md:flex-none inline-flex items-center justify-center px-3 py-2.5 md:px-[30px] md:py-[15px] bg-[#EBEBEB] text-[#050505] text-[12px] md:text-[13px] font-medium rounded-full border border-[#EBEBEB] tracking-[0.02em] transition-all duration-300 ease-smooth hover:bg-white hover:-translate-y-px whitespace-nowrap"
            >
              Conhecer a estrutura
            </a>
            <a
              href="#footer"
              className="flex-1 md:flex-none inline-flex items-center justify-center px-3 py-2.5 md:px-[30px] md:py-[15px] bg-transparent text-text-main text-[12px] md:text-[13px] font-medium rounded-full border border-white/[0.14] tracking-[0.02em] transition-all duration-300 ease-smooth hover:bg-white/[0.06] hover:border-white/[0.28] hover:-translate-y-px whitespace-nowrap"
            >
              Falar com especialista
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
