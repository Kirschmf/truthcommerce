import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Showreel() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLDivElement | null>(null)

  useGSAP(() => {
    const elements = sectionRef.current?.querySelectorAll('.reveal')

    if (elements?.length) {
      gsap.from(elements, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })
    }

    if (videoRef.current) {
      gsap.fromTo(
        videoRef.current,
        { scale: 0.85, borderRadius: '24px' },
        {
          scale: 1,
          borderRadius: '0px',
          ease: 'none',
          scrollTrigger: {
            trigger: videoRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        },
      )
    }
  }, { scope: sectionRef })

  return (
    <section id="showreel" ref={sectionRef} className="w-full py-20 md:py-32">
      <div className="px-[5%] mb-10 md:mb-14">
        <div className="max-w-[680px]">
          <span className="reveal block font-mono text-[9px] md:text-[10px] text-text-muted uppercase tracking-[0.14em] mb-4">
            / Showreel 2026
          </span>
          <h2 className="reveal font-heading text-[clamp(1.5rem,5.5vw,2.4rem)] md:text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.2] tracking-[-0.02em] mb-4 md:mb-5">
            Sistemas que suportam a <span className="accent">pressão da escala.</span>
          </h2>
          <p className="reveal text-text-muted text-[clamp(0.95rem,3.5vw,1.05rem)] md:text-[clamp(1.05rem,1.2vw,1.15rem)] leading-[1.65] max-w-[560px]">
            Veja como transformamos operações engessadas em máquinas de alta performance. De migrações complexas a arquiteturas headless, construímos para velocidade e estabilidade extrema.
          </p>
        </div>
      </div>

      <div ref={videoRef} className="reveal relative w-full aspect-video bg-bg-surface overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <button type="button" className="flex items-center gap-3 group">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-white/40 group-hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" className="text-white" />
              </svg>
            </div>
            <span className="text-text-muted text-xs font-mono uppercase tracking-[0.12em] group-hover:text-white transition-colors duration-200">
              Play
            </span>
          </button>
        </div>

        <div className="absolute bottom-4 left-5 md:bottom-6 md:left-8 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
          <span className="font-mono text-[10px] text-text-muted uppercase tracking-[0.1em]">Systems Online</span>
        </div>
      </div>
    </section>
  )
}
