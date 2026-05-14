import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AlertaCritico() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    const content = contentRef.current
    if (!content) return

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        end: 'bottom 15%',
        scrub: 1,
      },
    })

    timeline
      .fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none', duration: 0.3 })
      .to(content, { opacity: 1, y: 0, duration: 0.4 })
      .to(content, { opacity: 0, y: -40, ease: 'none', duration: 0.3 })
  }, { scope: sectionRef })

  return (
    <section id="alerta" ref={sectionRef} className="relative w-full px-[5%] min-h-screen flex items-center">
      <div
        ref={contentRef}
        className="relative z-10 max-w-[680px] w-full md:ml-auto md:mr-[8%] pt-20 pb-[220px] md:pb-20"
        style={{ opacity: 0 }}
      >
        <span className="inline-block font-mono text-[9px] md:text-[10px] text-green uppercase tracking-[0.14em] border border-green/20 px-3 py-1.5 md:px-3.5 rounded-full mb-5 md:mb-6 bg-green/[0.04] font-bold">
          [ Alerta Crítico ]
        </span>

        <h2 className="font-heading text-[clamp(1.5rem,5.5vw,2.4rem)] md:text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.2] tracking-[-0.02em] mb-5 md:mb-6">
          Escalar sem estrutura é o caminho mais rápido <span className="accent">para o colapso.</span>
        </h2>

        <p className="text-text-muted text-[clamp(0.95rem,3.5vw,1.05rem)] md:text-[clamp(1.05rem,1.2vw,1.15rem)] leading-[1.65] md:leading-[1.7] max-w-[560px]">
          Rutura de estoque, devoluções em massa e margens destruídas. Este é o preço de vender na internet sem uma base sólida. Antes de gastar dinheiro com anúncios, precisa garantir que a sua operação aguenta o volume. Nós blindamos a sua estrutura.
        </p>
      </div>
    </section>
  )
}
