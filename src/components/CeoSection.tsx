import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Metric {
  value: number | null
  display?: string
  prefix: string
  suffix: string
  label: string
  animate: boolean
}

const METRICS: Metric[] = [
  { value: 4000, prefix: '+', suffix: '', label: 'PROJETOS ENTREGUES', animate: true },
  { value: 98, prefix: '', suffix: '%', label: 'TAXA DE RETENÇÃO', animate: true },
  { value: 14, prefix: '', suffix: '+', label: 'ANOS DE EXPERIÊNCIA', animate: true },
  { value: null, display: 'B2B', prefix: '', suffix: '', label: 'FOCO EXCLUSIVO', animate: false },
]

export default function CeoSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLDivElement | null>(null)
  const metricsRef = useRef<HTMLDivElement | null>(null)
  const counterRefs = useRef<Array<HTMLSpanElement | null>>([])

  useGSAP(() => {
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 90%',
        end: 'bottom 15%',
        scrub: 1,
      },
    })

    timeline
      .fromTo(contentRef.current, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none', duration: 0.3 })
      .to(contentRef.current, { opacity: 1, y: 0, duration: 0.4 })
      .to(contentRef.current, { opacity: 0, y: -40, ease: 'none', duration: 0.3 })

    counterRefs.current.forEach((element, index) => {
      const metric = METRICS[index]
      if (!element || !metric?.animate || metric.value === null) return

      const state = { value: 0 }
      gsap.to(state, {
        value: metric.value,
        duration: 1.6,
        ease: 'power2.out',
        snap: { value: 1 },
        scrollTrigger: {
          trigger: metricsRef.current,
          start: 'top 80%',
          once: true,
        },
        onUpdate: () => {
          element.textContent = String(Math.round(state.value))
        },
      })
    })
  }, { scope: sectionRef })

  return (
    <section id="ceo" ref={sectionRef} className="ceo-section-block w-full px-[5%] py-20 md:py-28 relative">
      <div ref={contentRef} className="ceo-container" style={{ opacity: 0 }}>
        <span className="ceo-eyebrow">/ A mente por trás da máquina</span>

        <div className="ceo-grid">
          <div className="ceo-photo-col">
            <div className="ceo-photo-wrapper">
              <img src="/assets/images/anilo.png" alt="Anilo Foppa — CEO Truth Commerce" className="ceo-photo" loading="lazy" />
              <div className="ceo-photo-tag">
                <span className="ceo-tag-dot" aria-hidden="true" />
                <span className="ceo-tag-text">Anilo Foppa · CEO & Fundador</span>
              </div>
            </div>
          </div>

          <div className="ceo-content-col">
            <h2 className="ceo-name">
              ANILO <span className="ceo-name-accent">FOPPA</span>
            </h2>
            <p className="ceo-role">CEO &amp; Fundador · Truth Commerce</p>

            <p className="ceo-bio">
              Com mais de uma década construindo infraestruturas de e-commerce, a Truth Commerce nasceu de uma convicção: crescimento sustentável exige uma fundação cirúrgica.
            </p>

            <blockquote className="ceo-quote">
              <span aria-hidden="true" className="ceo-quote-bar" />
              <p>“Não vendemos tráfego. Construímos a máquina que aguenta o tráfego.”</p>
            </blockquote>

            <div ref={metricsRef} className="ceo-metrics">
              {METRICS.map((metric, index) => (
                <div key={metric.label} className="metric">
                  <div className="metric-value">
                    {metric.prefix && <span className="metric-accent">{metric.prefix}</span>}
                    {metric.animate ? (
                      <span
                        ref={(element) => {
                          counterRefs.current[index] = element
                        }}
                      >
                        0
                      </span>
                    ) : (
                      <span>{metric.display}</span>
                    )}
                    {metric.suffix && <span className="metric-accent">{metric.suffix}</span>}
                  </div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              ))}
            </div>

            <a href="#footer" className="ceo-cta">
              <span className="ceo-cta-dot" aria-hidden="true" />
              Iniciar diagnóstico
              <span className="ceo-cta-arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>

    </section>
  )
}
