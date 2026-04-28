import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    number: '01',
    title: 'Diagnóstico Estrutural',
    description:
      'Mapeamos o seu cenário. Seja uma empresa tradicional dando o primeiro passo online ou um e-commerce precisando de ordem. Entendemos seus sistemas internos e processos para desenhar a arquitetura ideal.',
  },
  {
    number: '02',
    title: 'Arquitetura de Catálogo',
    description:
      'A base de uma conversão previsível. Criamos do zero ou reestruturamos seus produtos: padronizamos descrições, tratamos ativos visuais e organizamos a taxonomia técnica para alta performance.',
  },
  {
    number: '03',
    title: 'Integração Sistêmica',
    description:
      'Verificamos sua estrutura e, juntamente com um ERP parceiro, conectamos sua operação de ponta a ponta: integrando às plataformas e canais de venda, fazendo com que estoque, preços e logística conversem em tempo real, sem falhas.',
  },
  {
    number: '04',
    title: 'Handover e Autonomia',
    description:
      'Entregamos a máquina pronta e a tripulação treinada. Fornecemos documentação e suporte ativo para que sua empresa assuma o controle da nova operação com total segurança.',
  },
]

export default function Metodologia() {
  const sectionRef = useRef(null)
  const lineRef = useRef(null)
  const stepsRef = useRef([])
  const dotsRef = useRef([])

  useGSAP(() => {
    const header = sectionRef.current.querySelectorAll('.reveal-header')

    // Header fade in
    gsap.from(header, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        once: true,
      },
    })

    // Vertical line reveal — scaleY 0→1 with scrub
    gsap.fromTo(
      lineRef.current,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current.querySelector('.timeline-track'),
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1,
        },
      }
    )

    // Each step fade up
    stepsRef.current.forEach((step, i) => {
      if (!step) return

      gsap.from(step, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 85%',
          once: true,
        },
        delay: i * 0.15,
      })
    })

    // Dots scale in with bounce
    dotsRef.current.forEach((dot) => {
      if (!dot) return

      gsap.from(dot, {
        scale: 0,
        duration: 0.5,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: dot,
          start: 'top 85%',
          once: true,
        },
      })
    })

    // Hover GSAP — desktop only (pointer devices)
    const mm = gsap.matchMedia()
    mm.add('(hover: hover) and (min-width: 1025px)', () => {
      stepsRef.current.forEach((step) => {
        if (!step) return

        const onEnter = () => {
          gsap.to(step, { x: 8, duration: 0.3, ease: 'power2.out' })
        }
        const onLeave = () => {
          gsap.to(step, { x: 0, duration: 0.3, ease: 'power2.out' })
        }

        step.addEventListener('mouseenter', onEnter)
        step.addEventListener('mouseleave', onLeave)

        // Cleanup
        return () => {
          step.removeEventListener('mouseenter', onEnter)
          step.removeEventListener('mouseleave', onLeave)
        }
      })
    })
  }, { scope: sectionRef })

  return (
    <section
      id="metodo"
      ref={sectionRef}
      className="w-full px-[5%] py-20 md:py-32"
    >
      <div className="max-w-[1100px] mx-auto bg-[#070a08] rounded-2xl px-6 md:px-12 py-14 md:py-20 border border-white/[0.04]">

        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <span className="reveal-header inline-block font-mono text-[9px] md:text-[10px] text-green uppercase tracking-[0.14em] border border-green/20 px-3 py-1.5 md:px-3.5 rounded-full mb-5 md:mb-6 bg-green/[0.04] font-bold">
            Engenharia Operacional
          </span>

          <h2 className="reveal-header font-heading text-[clamp(1.5rem,5.5vw,2.4rem)] md:text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.2] tracking-[-0.02em]">
            O processo não é improviso.
            <br />
            É arquitetura de negócios.
          </h2>
        </div>

        {/* Timeline */}
        <div className="timeline-track relative max-w-[720px] mx-auto">

          {STEPS.map((step, i) => (
            <div
              key={step.number}
              ref={(el) => { stepsRef.current[i] = el }}
              className="timeline-step"
              style={{ marginBottom: i < STEPS.length - 1 ? '3.5rem' : 0 }}
            >
              <div className="timeline-step-grid">

                {/* Number — hidden on mobile, shown on desktop */}
                <div className="timeline-number-col">
                  <span className="timeline-number">{step.number}</span>
                </div>

                {/* Line column with dot */}
                <div className="timeline-line-col">
                  <div
                    ref={(el) => { dotsRef.current[i] = el }}
                    className="timeline-dot"
                  />
                </div>

                {/* Content */}
                <div className="timeline-content">
                  {/* Mobile number badge */}
                  <span className="timeline-number-badge">{step.number}</span>

                  <h3 className="timeline-title">{step.title}</h3>
                  <p className="timeline-desc">{step.description}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Vertical line */}
          <div
            ref={lineRef}
            className="timeline-line"
            aria-hidden="true"
          />
        </div>

      </div>

      <style>{`
        /* ===== Timeline Grid ===== */
        .timeline-step-grid {
          display: grid;
          grid-template-columns: 1fr;
          position: relative;
          padding-left: 28px;
        }

        .timeline-number-col {
          display: none;
        }

        .timeline-line-col {
          position: absolute;
          left: 0;
          top: 0;
          width: 12px;
          display: flex;
          justify-content: center;
          padding-top: 6px;
        }

        .timeline-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #07dd2b;
          z-index: 2;
          flex-shrink: 0;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .timeline-line {
          position: absolute;
          left: 13px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #07dd2b;
          transform-origin: top center;
          z-index: 1;
          pointer-events: none;
        }

        .timeline-number-badge {
          display: inline-block;
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 0.7rem;
          font-weight: 700;
          color: #07dd2b;
          background: rgba(7, 221, 43, 0.08);
          border: 1px solid rgba(7, 221, 43, 0.2);
          border-radius: 999px;
          padding: 2px 10px;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }

        .timeline-number {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: 3.5rem;
          font-weight: 700;
          color: #07dd2b;
          opacity: 0.9;
          line-height: 1;
          text-align: right;
          transition: opacity 0.3s ease, text-shadow 0.3s ease;
        }

        .timeline-title {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: 1.15rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 6px;
          transition: color 0.3s ease;
        }

        .timeline-desc {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #888;
        }

        .timeline-content {
          padding: 12px 0 12px 0;
          border-radius: 8px;
          transition: background 0.3s ease, padding-left 0.3s ease;
        }

        /* ===== Tablet (768px+) ===== */
        @media (min-width: 768px) {
          .timeline-step-grid {
            grid-template-columns: 60px 2px 1fr;
            padding-left: 0;
            gap: 0;
            align-items: start;
          }

          .timeline-number-col {
            display: flex;
            align-items: flex-start;
            justify-content: flex-end;
            padding-right: 20px;
            padding-top: 8px;
          }

          .timeline-number-badge {
            display: none;
          }

          .timeline-line-col {
            position: relative;
            left: auto;
            width: 14px;
            display: flex;
            justify-content: center;
            padding-top: 14px;
          }

          .timeline-dot {
            width: 12px;
            height: 12px;
          }

          .timeline-line {
            left: 55px;
          }

          .timeline-content {
            padding: 8px 0 8px 20px;
          }
        }

        /* ===== Tablet number size ===== */
        @media (min-width: 768px) and (max-width: 1024px) {
          .timeline-number {
            font-size: 2.5rem;
          }
        }

        /* ===== Desktop (1025px+) ===== */
        @media (min-width: 1025px) {
          .timeline-content {
            padding: 8px 0 8px 20px;
          }

          .timeline-title {
            font-size: 1.25rem;
          }
        }

        /* ===== Hover — pointer devices only, desktop ===== */
        @media (hover: hover) and (min-width: 1025px) {
          .timeline-step:hover .timeline-content {
            background: rgba(7, 221, 43, 0.04);
            padding-left: 20px;
          }

          .timeline-step:hover .timeline-number {
            opacity: 1;
            text-shadow: 0 0 40px rgba(7, 221, 43, 0.3);
          }

          .timeline-step:hover .timeline-dot {
            transform: scale(1.4);
            box-shadow: 0 0 12px rgba(7, 221, 43, 0.6);
          }

          .timeline-step:hover .timeline-title {
            color: #07dd2b;
          }
        }
      `}</style>
    </section>
  )
}
