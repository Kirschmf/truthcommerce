import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Step {
  number: string
  title: string
  description: string
}

const STEPS: Step[] = [
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
  const sectionRef = useRef<HTMLElement | null>(null)
  const lineRef = useRef<HTMLDivElement | null>(null)
  const stepsRef = useRef<Array<HTMLDivElement | null>>([])
  const dotsRef = useRef<Array<HTMLDivElement | null>>([])

  useGSAP(() => {
    const header = sectionRef.current?.querySelectorAll('.reveal-header')

    if (header?.length) {
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
    }

    const timelineTrack = sectionRef.current?.querySelector('.timeline-track')
    if (lineRef.current && timelineTrack) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: timelineTrack,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1,
          },
        },
      )
    }

    stepsRef.current.forEach((step, index) => {
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
        delay: index * 0.15,
      })
    })

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

    const mediaMatch = gsap.matchMedia()
    mediaMatch.add('(hover: hover) and (min-width: 1025px)', () => {
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
      })
    })
  }, { scope: sectionRef })

  return (
    <section id="metodo" ref={sectionRef} className="w-full px-[5%] py-20 md:py-32">
      <div className="max-w-[1100px] mx-auto bg-[#070a08] rounded-2xl px-6 md:px-12 py-14 md:py-20 border border-white/[0.04]">
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

        <div className="timeline-track relative max-w-[720px] mx-auto">
          {STEPS.map((step, index) => (
            <div
              key={step.number}
              ref={(element) => {
                stepsRef.current[index] = element
              }}
              className="timeline-step"
              style={{ marginBottom: index < STEPS.length - 1 ? '3.5rem' : 0 }}
            >
              <div className="timeline-step-grid">
                <div className="timeline-number-col">
                  <span className="timeline-number">{step.number}</span>
                </div>

                <div className="timeline-line-col">
                  <div
                    ref={(element) => {
                      dotsRef.current[index] = element
                    }}
                    className="timeline-dot"
                  />
                </div>

                <div className="timeline-content">
                  <span className="timeline-number-badge">{step.number}</span>
                  <h3 className="timeline-title">{step.title}</h3>
                  <p className="timeline-desc">{step.description}</p>
                </div>
              </div>
            </div>
          ))}

          <div ref={lineRef} className="timeline-line" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
