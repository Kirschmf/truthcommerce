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
    <section id="ceo" ref={sectionRef} className="ceo-section w-full px-[5%] py-20 md:py-28 relative">
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

      <style>{`
        .ceo-section {
          background: transparent;
        }

        .ceo-container {
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }

        .ceo-eyebrow {
          display: block;
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 11px;
          color: #07dd2b;
          letter-spacing: 0.18em;
          font-weight: 700;
          margin-bottom: 32px;
          text-transform: uppercase;
        }

        .ceo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
          align-items: start;
        }

        .ceo-photo-col {
          width: 100%;
          max-width: 320px;
        }

        .ceo-photo-wrapper {
          position: relative;
          aspect-ratio: 4 / 5;
          border-radius: 14px;
          overflow: hidden;
          background: #0d0d10;
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .ceo-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 0.6s ease;
        }

        .ceo-photo-tag {
          position: absolute;
          left: 12px;
          bottom: 12px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: 999px;
          background: rgba(8, 9, 11, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(7, 221, 43, 0.3);
        }

        .ceo-tag-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #07dd2b;
          box-shadow: 0 0 8px rgba(7, 221, 43, 0.7);
        }

        .ceo-tag-text {
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 11px;
          color: #fff;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .ceo-content-col {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .ceo-name {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: 38px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.02em;
          margin: 0 0 8px 0;
        }

        .ceo-name-accent {
          color: #07dd2b;
        }

        .ceo-role {
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 12px;
          color: #888;
          letter-spacing: 0.1em;
          margin: 0 0 24px 0;
          text-transform: uppercase;
        }

        .ceo-bio {
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 16px;
          line-height: 1.65;
          color: #cfd2d6;
          margin: 0 0 28px 0;
        }

        .ceo-quote {
          position: relative;
          margin: 0 0 32px 0;
          padding: 0 0 0 20px;
        }

        .ceo-quote-bar {
          position: absolute;
          left: 0;
          top: 4px;
          bottom: 4px;
          width: 2px;
          background: #07dd2b;
          border-radius: 2px;
        }

        .ceo-quote p {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          color: #ffffff;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .ceo-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px 24px;
          margin: 0 0 32px 0;
          padding: 24px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.08);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .metric {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .metric-value {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: 30px;
          font-weight: 800;
          color: #fff;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .metric-accent {
          color: #07dd2b;
        }

        .metric-label {
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 10px;
          color: #888;
          letter-spacing: 0.12em;
          font-weight: 600;
        }

        .ceo-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          align-self: flex-start;
          padding: 14px 22px;
          border-radius: 999px;
          border: 1px solid rgba(7, 221, 43, 0.4);
          background: rgba(7, 221, 43, 0.06);
          color: #fff;
          font-family: var(--font-body, 'Inter', sans-serif);
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.02em;
          text-decoration: none;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
        }

        .ceo-cta-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #07dd2b;
          box-shadow: 0 0 10px rgba(7, 221, 43, 0.7);
        }

        .ceo-cta-arrow {
          color: #07dd2b;
          transition: transform 0.3s ease;
        }

        @media (hover: hover) {
          .ceo-cta:hover {
            background: rgba(7, 221, 43, 0.12);
            border-color: #07dd2b;
          }

          .ceo-cta:hover .ceo-cta-arrow {
            transform: translateX(4px);
          }

          .ceo-photo-wrapper:hover .ceo-photo {
            transform: scale(1.03);
          }
        }

        @media (max-width: 480px) {
          .ceo-cta {
            justify-content: center;
            align-self: stretch;
            padding: 16px 22px;
          }
        }

        @media (min-width: 768px) {
          .ceo-name {
            font-size: 44px;
          }

          .ceo-bio {
            font-size: 17px;
          }

          .ceo-quote p {
            font-size: 20px;
          }

          .ceo-metrics {
            grid-template-columns: repeat(4, 1fr);
            gap: 24px;
          }

          .metric-value {
            font-size: 32px;
          }
        }

        @media (min-width: 1025px) {
          .ceo-grid {
            grid-template-columns: minmax(280px, 360px) 1fr;
            gap: 64px;
          }

          .ceo-photo-col {
            position: sticky;
            top: 96px;
            max-width: 360px;
          }

          .ceo-name {
            font-size: 48px;
          }
        }
      `}</style>
    </section>
  )
}
