import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const METRICS = [
  { value: 120, prefix: '+', suffix: '', label: 'OPERAÇÕES BLINDADAS', animate: true },
  { value: 98, prefix: '', suffix: '%', label: 'TAXA DE RETENÇÃO', animate: true },
  { value: 10, prefix: '', suffix: '+', label: 'ANOS DE EXPERIÊNCIA', animate: true },
  { value: null, display: 'B2B', prefix: '', suffix: '', label: 'FOCO EXCLUSIVO', animate: false },
]

export default function CeoSection() {
  const sectionRef = useRef(null)
  const bgTextRef = useRef(null)
  const photoRef = useRef(null)
  const metricsRef = useRef(null)
  const counterRefs = useRef([])

  useGSAP(() => {
    // 1. BG text reveal
    gsap.from(bgTextRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 60%',
        once: true,
      },
    })

    // 2. BG text parallax
    gsap.to(bgTextRef.current, {
      yPercent: -20,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    // 3. Left column stagger
    const leftEls = sectionRef.current.querySelectorAll('.reveal-left')
    gsap.from(leftEls, {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
      },
    })

    // 4. Photo enter from right
    gsap.from(photoRef.current, {
      opacity: 0,
      x: 60,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 65%',
        once: true,
      },
    })

    // 5. Metric cards fade up
    const metricCards = metricsRef.current.querySelectorAll('.metric-card')
    gsap.from(metricCards, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: metricsRef.current,
        start: 'top 85%',
        once: true,
      },
    })

    // 6. Counter animation
    counterRefs.current.forEach((el, i) => {
      if (!el || !METRICS[i].animate) return

      const target = METRICS[i].value
      const obj = { val: 0 }

      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        snap: { val: 1 },
        scrollTrigger: {
          trigger: metricsRef.current,
          start: 'top 80%',
          once: true,
        },
        onUpdate: () => {
          el.textContent = Math.round(obj.val)
        },
      })
    })
  }, { scope: sectionRef })

  return (
    <section
      id="ceo"
      ref={sectionRef}
      className="ceo-section w-full px-[5%] py-20 md:py-32 relative overflow-hidden"
    >
      {/* BG text */}
      <div
        ref={bgTextRef}
        className="ceo-bg-text"
        aria-hidden="true"
      >
        ANILO
      </div>

      <div className="max-w-[1100px] mx-auto relative z-[2]">
        <div className="ceo-grid">

          {/* Left column */}
          <div className="ceo-left">
            <span className="reveal-left ceo-eyebrow">
              / A MENTE POR TRÁS DA MÁQUINA
            </span>

            <h2 className="reveal-left ceo-name">
              ANILO
              <br />
              <span className="ceo-name-accent">FOPPA</span>
            </h2>

            <span className="reveal-left ceo-role">CEO & FUNDADOR</span>

            <div className="reveal-left ceo-separator" />

            <p className="reveal-left ceo-text">
              Com mais de uma década construindo infraestruturas de e-commerce,
              a Truth Commerce nasceu de uma convicção: crescimento sustentável
              exige uma fundação cirúrgica.
            </p>

            <blockquote className="reveal-left ceo-quote">
              "Não vendemos tráfego. Construímos a máquina que aguenta
              o tráfego."
            </blockquote>

            <a href="#contato" className="reveal-left ceo-cta">
              Iniciar diagnóstico →
            </a>
          </div>

          {/* Right column */}
          <div className="ceo-right">
            {/* Photo */}
            <div ref={photoRef} className="ceo-photo-wrapper">
              <img
                src="/assets/images/anilo.png"
                alt="Anilo Foppa – CEO Truth Commerce"
                className="ceo-photo"
                loading="lazy"
              />
              <div className="ceo-photo-overlay" />

              {/* Badge */}
              <div className="ceo-photo-badge">
                <span className="ceo-badge-name">Anilo Foppa</span>
                <span className="ceo-badge-role">CEO & Fundador</span>
              </div>
            </div>

            {/* Metrics grid */}
            <div ref={metricsRef} className="ceo-metrics">
              {METRICS.map((m, i) => (
                <div key={m.label} className="metric-card">
                  <div className="metric-value">
                    {m.prefix && <span className="metric-accent">{m.prefix}</span>}
                    {m.animate ? (
                      <span ref={(el) => { counterRefs.current[i] = el }}>0</span>
                    ) : (
                      <span>{m.display}</span>
                    )}
                    {m.suffix && <span className="metric-accent">{m.suffix}</span>}
                  </div>
                  <div className="metric-label">{m.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .ceo-section {
          background: transparent;
        }

        /* ===== BG Text ===== */
        .ceo-bg-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: clamp(140px, 20vw, 220px);
          font-weight: 900;
          color: #07dd2b;
          opacity: 0.03;
          white-space: nowrap;
          pointer-events: none;
          z-index: 1;
          user-select: none;
          line-height: 1;
        }

        /* ===== Grid ===== */
        .ceo-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 48px;
        }

        /* ===== Left Column ===== */
        .ceo-eyebrow {
          display: block;
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 11px;
          color: #07dd2b;
          letter-spacing: 0.15em;
          margin-bottom: 20px;
        }

        .ceo-name {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: clamp(40px, 6vw, 72px);
          font-weight: 800;
          color: #fff;
          line-height: 1;
          margin: 0;
        }

        .ceo-name-accent {
          color: #07dd2b;
        }

        .ceo-role {
          display: block;
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 12px;
          color: #444;
          letter-spacing: 0.12em;
          margin-top: 8px;
        }

        .ceo-separator {
          height: 1px;
          background: #1a1a1a;
          margin: 24px 0;
        }

        .ceo-text {
          font-size: 14px;
          color: #666;
          line-height: 1.8;
          margin: 0 0 24px 0;
        }

        .ceo-quote {
          border-left: 2px solid #07dd2b;
          padding-left: 16px;
          margin: 0 0 32px 0;
          font-style: italic;
          font-size: 14px;
          color: #888;
          line-height: 1.7;
        }

        .ceo-cta {
          display: inline-block;
          border: 1px solid rgba(7, 221, 43, 0.3);
          color: #07dd2b;
          padding: 10px 20px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: background 0.3s ease, border-color 0.3s ease;
        }

        /* ===== Photo ===== */
        .ceo-photo-wrapper {
          position: relative;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          max-width: 340px;
          background: #0d0d10;
        }

        .ceo-photo {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top;
          transition: transform 0.5s ease;
        }

        .ceo-photo-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%);
          pointer-events: none;
        }

        .ceo-photo-badge {
          position: absolute;
          bottom: 20px;
          left: 20px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(7, 221, 43, 0.3);
          border-radius: 10px;
          padding: 12px 16px;
        }

        .ceo-badge-name {
          display: block;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
        }

        .ceo-badge-role {
          display: block;
          color: #07dd2b;
          font-size: 11px;
          margin-top: 2px;
        }

        /* ===== Metrics ===== */
        .ceo-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
          max-width: 340px;
        }

        .metric-card {
          background: #0d0d10;
          border: 1px solid #1a1a1a;
          border-radius: 10px;
          padding: 16px;
          transition: border-color 0.3s ease, transform 0.3s ease;
        }

        .metric-value {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }

        .metric-accent {
          color: #07dd2b;
        }

        .metric-label {
          font-size: 9px;
          color: #444;
          letter-spacing: 0.12em;
          margin-top: 4px;
          font-weight: 600;
        }

        /* ===== Hover (pointer only) ===== */
        @media (hover: hover) {
          .ceo-cta:hover {
            background: rgba(7, 221, 43, 0.08);
            border-color: #07dd2b;
          }

          .ceo-photo-wrapper:hover .ceo-photo {
            transform: scale(1.02);
          }

          .metric-card:hover {
            border-color: rgba(7, 221, 43, 0.25);
            transform: translateY(-2px);
          }
        }

        /* ===== Mobile (< 768px) ===== */
        @media (max-width: 767px) {
          .ceo-bg-text {
            font-size: 72px;
          }

          .ceo-name {
            font-size: 40px;
          }

          .ceo-photo-wrapper {
            aspect-ratio: 4 / 5;
            border-radius: 12px;
            max-width: 100%;
          }

          .ceo-metrics {
            max-width: 100%;
          }

          .metric-card {
            padding: 12px;
          }

          .ceo-cta {
            width: 100%;
            text-align: center;
          }
        }

        /* ===== Tablet (768px – 1024px) ===== */
        @media (min-width: 768px) and (max-width: 1024px) {
          .ceo-bg-text {
            font-size: 100px;
          }

          .ceo-photo-wrapper {
            max-width: 280px;
            margin: 0 auto;
          }

          .ceo-metrics {
            max-width: 280px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        /* ===== Desktop (> 1024px) ===== */
        @media (min-width: 1025px) {
          .ceo-grid {
            grid-template-columns: 55% 45%;
            gap: 64px;
            align-items: start;
          }

          .ceo-left {
            padding-top: 24px;
          }
        }
      `}</style>
    </section>
  )
}
