import { useState, useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FAQS = [
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
      'Sim! Além da presença forte nos marketplaces, desenhamos e implementamos a arquitetura completa de lojas virtuais próprias (D2C ou B2B), deixando a operação centralizada em um só lugar.',
  },
  {
    question: 'Vocês fazem a gestão de tráfego (Ads)?',
    answer:
      'Não. Nós somos a etapa obrigatória antes do tráfego. Construímos a vitrine técnica perfeita e o sistema logístico impecável. Quando a máquina estiver sólida, você poderá investir em marketing com a certeza de que suportará o volume.',
  },
  {
    question: 'O que é entregue no final do projeto?',
    answer:
      'Uma operação digital blindada e conectada. Seu ecossistema 100% integrado, catálogo padronizado segundo as regras de cada canal, fluxos automatizados e sua equipe treinada para operar a estrutura.',
  },
]

function FaqItem({ index, question, answer, isOpen, onToggle }) {
  const bodyRef = useRef(null)
  const iconRef = useRef(null)

  const handleClick = useCallback(() => {
    onToggle(index)
  }, [index, onToggle])

  // Animate open/close with GSAP
  useGSAP(() => {
    const body = bodyRef.current
    const icon = iconRef.current
    if (!body || !icon) return

    if (isOpen) {
      gsap.to(body, { height: 'auto', duration: 0.5, ease: 'power3.inOut' })
      gsap.to(icon, { rotation: 45, duration: 0.3, ease: 'power2.out' })
    } else {
      gsap.to(body, { height: 0, duration: 0.4, ease: 'power3.inOut' })
      gsap.to(icon, { rotation: 0, duration: 0.3, ease: 'power2.out' })
    }
  }, [isOpen])

  return (
    <div className="faq-item">
      <button
        onClick={handleClick}
        className="faq-header"
      >
        <span className="faq-question">
          {index + 1}. {question}
        </span>
        <span
          ref={iconRef}
          className={`faq-icon ${isOpen ? 'faq-icon--active' : ''}`}
        >
          +
        </span>
      </button>
      <div
        ref={bodyRef}
        className="overflow-hidden"
        style={{ height: 0 }}
      >
        <p className="faq-answer">
          {answer}
        </p>
      </div>
    </div>
  )
}

export default function FaqSection() {
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const listRef = useRef(null)
  const itemRefs = useRef([])
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = useCallback((index) => {
    setOpenIndex((prev) => (prev === index ? null : index))
  }, [])

  useGSAP(() => {
    // Title entrance
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

    // Items stagger entrance
    const items = itemRefs.current.filter(Boolean)
    if (items.length) {
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
  }, { scope: sectionRef })

  return (
    <section id="faq" ref={sectionRef} className="faq-section">
      <div className="faq-container">

        {/* Title */}
        <h2 ref={titleRef} className="faq-title">
          Perguntas<br />Frequentes
        </h2>

        {/* Separator */}
        <div className="faq-separator" />

        {/* FAQ list */}
        <div ref={listRef}>
          {FAQS.map((faq, i) => (
            <div
              key={faq.question}
              ref={(el) => { itemRefs.current[i] = el }}
            >
              <FaqItem
                index={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
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

        /* ===== Title ===== */
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

        /* ===== Separator ===== */
        .faq-separator {
          height: 1px;
          background: #1a1a1a;
          margin-bottom: 8px;
        }

        /* ===== Item ===== */
        .faq-item {
          border-bottom: 1px solid #1a1a1a;
          cursor: pointer;
        }

        .faq-item:last-child {
          border-bottom: 1px solid #1a1a1a;
        }

        /* ===== Header (clickable row) ===== */
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

        /* ===== Question text ===== */
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

        /* ===== Icon ===== */
        .faq-icon {
          color: #555;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          font-weight: 300;
          flex-shrink: 0;
          transition: border-color 0.3s ease, color 0.3s ease;
        }

        .faq-icon--active {
          color: #07dd2b;
        }

        .faq-item:hover .faq-icon {
          color: #07dd2b;
        }

        /* ===== Answer ===== */
        .faq-answer {
          font-size: 14px;
          color: #666;
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
