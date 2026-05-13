import { useCallback, useId, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

interface FaqEntry {
  question: string
  answer: string
}

const FAQS: FaqEntry[] = [
  {
    question: 'A Truth atende quem está começando agora?',
    answer:
      'Sim. Inclusive, começar com a infraestrutura correta evita refações caríssimas no futuro. Nós estruturamos sua entrada no digital, desde a escolha do sistema e parametrização do ERP até a taxonomia do primeiro produto.',
  },
  {
    question: 'E quem já vende online, mas está desorganizado?',
    answer:
      'Esse é o nosso core business. Se o seu estoque fura, o ERP não conversa com a loja, ou seus anúncios estão bagunçados, nós entramos com governança para integrar e arrumar todo o seu ecossistema.',
  },
  {
    question: 'Vocês também criam o e-commerce próprio?',
    answer:
      'Sim. Além da presença forte nos marketplaces, desenhamos e implementamos a arquitetura completa de lojas virtuais próprias, deixando a operação centralizada em um só lugar.',
  },
  {
    question: 'Vocês fazem a gestão de tráfego (Ads)?',
    answer:
      'Não. Nós somos a etapa obrigatória antes do tráfego. Construímos a vitrine técnica perfeita e o sistema logístico impecável para que o investimento em mídia venha sobre uma base sólida.',
  },
  {
    question: 'O que é entregue no final do projeto?',
    answer:
      'Uma operação digital blindada e conectada: ecossistema integrado, catálogo padronizado, fluxos automatizados e sua equipe treinada para operar a estrutura.',
  },
]

interface FaqItemProps extends FaqEntry {
  index: number
  isOpen: boolean
  onToggle: (index: number) => void
}

function FaqItem({ index, question, answer, isOpen, onToggle }: FaqItemProps) {
  const bodyRef = useRef<HTMLDivElement | null>(null)
  const iconRef = useRef<HTMLSpanElement | null>(null)
  const contentId = useId()
  const buttonId = useId()
  const prefersReducedMotion = usePrefersReducedMotion()

  const handleClick = useCallback(() => {
    onToggle(index)
  }, [index, onToggle])

  useGSAP(
    () => {
      const body = bodyRef.current
      const icon = iconRef.current
      if (!body || !icon || prefersReducedMotion) return

      if (isOpen) {
        gsap.to(body, { height: 'auto', duration: 0.5, ease: 'power3.inOut' })
        gsap.to(icon, { rotation: 45, duration: 0.3, ease: 'power2.out' })
      } else {
        gsap.to(body, { height: 0, duration: 0.4, ease: 'power3.inOut' })
        gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.out' })
      }
    },
    { dependencies: [isOpen, prefersReducedMotion] },
  )

  return (
    <div className="faq-item">
      <button
        id={buttonId}
        type="button"
        onClick={handleClick}
        className="faq-header"
        aria-expanded={isOpen}
        aria-controls={contentId}
      >
        <span className="faq-question">
          {index + 1}. {question}
        </span>
        <span ref={iconRef} className={`faq-icon ${isOpen ? 'faq-icon--active' : ''}`} aria-hidden="true">
          +
        </span>
      </button>
      <div
        ref={bodyRef}
        id={contentId}
        role="region"
        aria-labelledby={buttonId}
        className="overflow-hidden"
        style={{ height: prefersReducedMotion ? 'auto' : 0 }}
        hidden={!isOpen && prefersReducedMotion}
      >
        <p className="faq-answer">{answer}</p>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<Array<HTMLDivElement | null>>([])
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const handleToggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  useGSAP(
    () => {
      if (prefersReducedMotion) return

      gsap.from(titleRef.current, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      })

      const items = itemRefs.current.filter(Boolean)
      if (items.length > 0) {
        gsap.from(items, {
          opacity: 0,
          y: 30,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] },
  )

  return (
    <section id="faq" ref={sectionRef} className="faq-section">
      <div className="faq-container">
        <h2 ref={titleRef} className="faq-title">
          Perguntas
          <br />
          Frequentes
        </h2>

        <div className="faq-separator" />

        <div ref={listRef}>
          {FAQS.map((faq, index) => (
            <div
              key={faq.question}
              ref={(element) => {
                itemRefs.current[index] = element
              }}
            >
              <FaqItem
                index={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={handleToggle}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .faq-section {
          width: 100%;
          padding: 80px 24px;
        }

        @media (min-width: 768px) {
          .faq-section {
            padding: 120px 24px;
          }
        }

        .faq-container {
          max-width: 760px;
          margin: 0 auto;
        }

        .faq-title {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: clamp(40px, 7vw, 80px);
          font-weight: 900;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          line-height: 1;
          text-align: center;
          margin: 0 0 40px 0;
        }

        .faq-separator {
          height: 1px;
          background: #1a1a1a;
          margin-bottom: 8px;
        }

        .faq-item {
          border-bottom: 1px solid #1a1a1a;
        }

        .faq-header {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 0;
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
        }

        @media (min-width: 768px) {
          .faq-header {
            padding: 28px 0;
          }
        }

        .faq-header:focus-visible {
          outline: 2px solid var(--green);
          outline-offset: 4px;
        }

        .faq-question {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: clamp(15px, 1.6vw, 18px);
          font-weight: 500;
          color: #fff;
          line-height: 1.4;
          padding-right: 16px;
          transition: color 0.3s ease;
        }

        .faq-item:hover .faq-question {
          color: #06c927;
        }

        .faq-icon {
          color: #555;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 300;
          flex-shrink: 0;
          transition: color 0.3s ease;
        }

        .faq-icon--active,
        .faq-item:hover .faq-icon {
          color: #07dd2b;
        }

        .faq-answer {
          font-size: 14px;
          color: #8f8f97;
          line-height: 1.8;
          max-width: 620px;
          padding: 0 0 28px 0;
          margin: 0;
        }

        @media (min-width: 768px) {
          .faq-answer {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  )
}
