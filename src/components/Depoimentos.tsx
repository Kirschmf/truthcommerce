import { useCallback, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(ScrollTrigger, Observer)

interface TestimonialCard {
  name: string
  role: string
  initials: string
  duration: string
  quote: string
  stars: number
}

type Slot = 'center' | 'left1' | 'right1' | 'left2' | 'right2'

interface SlotPosition {
  x: number
  z: number
  rotateY: number
  scale: number
  opacity: number
}

const CARDS: TestimonialCard[] = [
  {
    name: 'João C. Silva',
    role: 'CMO · Riachuelo Digital',
    initials: 'JC',
    duration: '03:42',
    quote: 'Não vendemos mais por achismo. A Truth montou uma operação que a gente entende e controla.',
    stars: 5,
  },
  {
    name: 'Ana Martins',
    role: 'CEO · Hering Store',
    initials: 'AM',
    duration: '02:07',
    quote: 'Saímos do caos para escala em 60 dias.',
    stars: 5,
  },
  {
    name: 'Pedro Santos',
    role: 'CTO · Marketplace B2B',
    initials: 'PS',
    duration: '01:55',
    quote: '120 SKUs integrados sem uma única falha.',
    stars: 5,
  },
  {
    name: 'Luisa Ferreira',
    role: 'Ops · Distribuidora XYZ',
    initials: 'LF',
    duration: '02:31',
    quote: 'ERP conectado em 30 dias. Time treinado, operação rodando.',
    stars: 5,
  },
  {
    name: 'Ricardo Fonseca',
    role: 'Diretor · Atacadão Digital',
    initials: 'RF',
    duration: '01:24',
    quote: 'A integração foi cirúrgica. Zero downtime na virada.',
    stars: 5,
  },
]

const TOTAL = CARDS.length

const POSITIONS: Record<Slot, SlotPosition> = {
  center: { x: 0, z: 0, rotateY: 0, scale: 1, opacity: 1 },
  left1: { x: -320, z: -100, rotateY: 12, scale: 0.78, opacity: 0.6 },
  right1: { x: 320, z: -100, rotateY: -12, scale: 0.78, opacity: 0.6 },
  left2: { x: -580, z: -260, rotateY: 18, scale: 0.62, opacity: 0.3 },
  right2: { x: 580, z: -260, rotateY: -18, scale: 0.62, opacity: 0.3 },
}

function StarSvg() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="#07dd2b">
      <path d="M6 0l1.76 3.57L12 4.14 8.88 7.1l.74 4.32L6 9.27 2.38 11.42l.74-4.32L0 4.14l4.24-.57z" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M4 2.5v13l11-6.5z" fill="#07dd2b" />
    </svg>
  )
}

export default function Depoimentos() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const sliderRef = useRef<HTMLDivElement | null>(null)
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)
  const isAnimating = useRef(false)

  const wrap = useCallback((index: number) => ((index % TOTAL) + TOTAL) % TOTAL, [])

  const getSlotMap = useCallback(
    (center: number): Partial<Record<number, Slot>> => ({
      [wrap(center)]: 'center',
      [wrap(center - 1)]: 'left1',
      [wrap(center + 1)]: 'right1',
      [wrap(center - 2)]: 'left2',
      [wrap(center + 2)]: 'right2',
    }),
    [wrap],
  )

  const animateCards = useCallback(
    (center: number) => {
      const slotMap = getSlotMap(center)

      cardRefs.current.forEach((card, index) => {
        if (!card) return
        const slot = slotMap[index]
        if (!slot) {
          gsap.to(card, { opacity: 0, duration: 0.3 })
          return
        }

        const position = POSITIONS[slot]
        const zIndex = slot === 'center' ? 5 : slot.includes('1') ? 3 : 1

        gsap.to(card, {
          x: position.x,
          z: position.z,
          rotateY: position.rotateY,
          scale: position.scale,
          opacity: position.opacity,
          zIndex,
          duration: 0.6,
          ease: 'power3.inOut',
        })
      })
    },
    [getSlotMap],
  )

  const goTo = useCallback(
    (direction: number) => {
      if (isAnimating.current) return
      isAnimating.current = true

      const next = wrap(activeRef.current + direction)
      activeRef.current = next
      setActiveIndex(next)
      animateCards(next)

      gsap.delayedCall(0.65, () => {
        isAnimating.current = false
      })
    },
    [animateCards, wrap],
  )

  const goNext = useCallback(() => goTo(1), [goTo])
  const goPrev = useCallback(() => goTo(-1), [goTo])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') goNext()
      if (event.key === 'ArrowLeft') goPrev()
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useGSAP(() => {
    const slotMap = getSlotMap(0)
    cardRefs.current.forEach((card, index) => {
      if (!card) return
      const slot = slotMap[index]
      if (!slot) {
        gsap.set(card, { opacity: 0 })
        return
      }

      const position = POSITIONS[slot]
      const zIndex = slot === 'center' ? 5 : slot.includes('1') ? 3 : 1
      gsap.set(card, {
        x: position.x,
        z: position.z,
        rotateY: position.rotateY,
        scale: position.scale,
        opacity: position.opacity,
        zIndex,
      })
    })

    const headerElements = sectionRef.current?.querySelectorAll('.dep-reveal')
    if (headerElements?.length) {
      gsap.from(headerElements, {
        opacity: 0,
        y: 24,
        stagger: 0.08,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          once: true,
        },
      })
    }

    const cards = cardRefs.current.filter(Boolean)
    if (cards.length > 0) {
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sliderRef.current,
          start: 'top 85%',
          once: true,
        },
      })
    }

    const mediaMatch = gsap.matchMedia()
    mediaMatch.add('(max-width: 767px)', () => {
      const observer = Observer.create({
        target: sliderRef.current,
        type: 'touch',
        onLeft: () => goNext(),
        onRight: () => goPrev(),
        tolerance: 10,
      })
      return () => observer.kill()
    })
  }, { scope: sectionRef })

  return (
    <section id="depoimentos" ref={sectionRef} className="dep-section w-full py-20 md:py-32 overflow-hidden">
      <div className="dep-container">
        <div className="dep-header">
          <span className="dep-reveal dep-eyebrow">/ DEPOIMENTOS DE CLIENTES</span>
          <h2 className="dep-reveal dep-title">
            Quem viveu a <span className="dep-accent">transformação</span> conta como foi.
          </h2>
          <p className="dep-reveal dep-subtitle">
            Cada vídeo é um resultado real. Operações reconstruídas, times treinados, números que falam por si.
          </p>
        </div>

        <div ref={sliderRef} className="dep-slider">
          <div className="dep-track">
            {CARDS.map((card, index) => {
              const isActive = activeIndex === index
              return (
                <button
                  type="button"
                  key={card.name}
                  ref={(element) => {
                    cardRefs.current[index] = element
                  }}
                  className={`dep-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    if (index === activeRef.current) return
                    const slotMap = getSlotMap(activeRef.current)
                    const slot = slotMap[index]
                    if (slot?.includes('left')) goTo(-1)
                    if (slot?.includes('right')) goTo(1)
                  }}
                >
                  <div className="dep-video-area">
                    <div className="dep-video-placeholder" />
                    {isActive && <div className="dep-badge">● DEPOIMENTO</div>}
                    <div className="dep-rec" />
                    <div className="dep-duration">{card.duration}</div>
                    <span className="dep-play" aria-hidden="true">
                      <PlayIcon />
                    </span>
                  </div>

                  <div className="dep-card-footer">
                    <div className="dep-footer-row">
                      <div className="dep-avatar">
                        <span>{card.initials}</span>
                      </div>
                      <div className="dep-info">
                        <div className="dep-name">{card.name}</div>
                        <div className="dep-role">{card.role}</div>
                      </div>
                    </div>

                    <div className="dep-stars">
                      {Array.from({ length: card.stars }).map((_, starIndex) => (
                        <StarSvg key={starIndex} />
                      ))}
                    </div>

                    <p className={`dep-quote ${isActive ? 'is-expanded' : ''}`}>
                      &quot;{card.quote}&quot;
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="dep-nav-row">
          <button type="button" className="dep-nav-btn" onClick={goPrev} aria-label="Anterior">
            ←
          </button>

          <div className="dep-dots">
            {CARDS.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`dep-dot ${activeIndex === index ? 'is-active' : ''}`}
                onClick={() => {
                  const diff = index - activeRef.current
                  if (diff !== 0) goTo(diff)
                }}
                aria-label={`Card ${index + 1}`}
              />
            ))}
          </div>

          <button type="button" className="dep-nav-btn" onClick={goNext} aria-label="Próximo">
            →
          </button>
        </div>

        <p className="dep-drag-hint">← ARRASTE PARA NAVEGAR →</p>
      </div>
    </section>
  )
}
