import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(ScrollTrigger, Observer)

const CARDS = [
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

// Positions: [center, left1, right1, left2, right2]
const POSITIONS = {
  center: { x: 0, z: 0, rotateY: 0, scale: 1, opacity: 1 },
  left1:  { x: -320, z: -100, rotateY: 12, scale: 0.78, opacity: 0.6 },
  right1: { x: 320, z: -100, rotateY: -12, scale: 0.78, opacity: 0.6 },
  left2:  { x: -580, z: -260, rotateY: 18, scale: 0.62, opacity: 0.3 },
  right2: { x: 580, z: -260, rotateY: -18, scale: 0.62, opacity: 0.3 },
}

const SLOT_ORDER = ['left2', 'left1', 'center', 'right1', 'right2']

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
  const sectionRef = useRef(null)
  const sliderRef = useRef(null)
  const cardRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)
  const isAnimating = useRef(false)

  const wrap = useCallback((i) => ((i % TOTAL) + TOTAL) % TOTAL, [])

  const getSlotMap = useCallback((center) => {
    const map = {}
    map[wrap(center)] = 'center'
    map[wrap(center - 1)] = 'left1'
    map[wrap(center + 1)] = 'right1'
    map[wrap(center - 2)] = 'left2'
    map[wrap(center + 2)] = 'right2'
    return map
  }, [wrap])

  const animateCards = useCallback((center) => {
    const slotMap = getSlotMap(center)

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const slot = slotMap[i]
      if (!slot) {
        gsap.to(card, { opacity: 0, duration: 0.3 })
        return
      }
      const pos = POSITIONS[slot]
      const zIndex = slot === 'center' ? 5 : slot.includes('1') ? 3 : 1

      gsap.to(card, {
        x: pos.x,
        z: pos.z,
        rotateY: pos.rotateY,
        scale: pos.scale,
        opacity: pos.opacity,
        zIndex,
        duration: 0.6,
        ease: 'power3.inOut',
      })
    })
  }, [getSlotMap])

  const goTo = useCallback((direction) => {
    if (isAnimating.current) return
    isAnimating.current = true

    const next = wrap(activeRef.current + direction)
    activeRef.current = next
    setActiveIndex(next)
    animateCards(next)

    gsap.delayedCall(0.65, () => { isAnimating.current = false })
  }, [wrap, animateCards])

  const goNext = useCallback(() => goTo(1), [goTo])
  const goPrev = useCallback(() => goTo(-1), [goTo])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, goPrev])

  useGSAP(() => {
    // Set initial positions
    const slotMap = getSlotMap(0)
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const slot = slotMap[i]
      if (!slot) {
        gsap.set(card, { opacity: 0 })
        return
      }
      const pos = POSITIONS[slot]
      const zIndex = slot === 'center' ? 5 : slot.includes('1') ? 3 : 1
      gsap.set(card, { x: pos.x, z: pos.z, rotateY: pos.rotateY, scale: pos.scale, opacity: pos.opacity, zIndex })
    })

    // Entrance — header
    const headerEls = sectionRef.current.querySelectorAll('.dep-reveal')
    gsap.from(headerEls, {
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

    // Entrance — cards
    gsap.from(cardRefs.current.filter(Boolean), {
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

    // Mobile swipe
    const mm = gsap.matchMedia()
    mm.add('(max-width: 767px)', () => {
      const obs = Observer.create({
        target: sliderRef.current,
        type: 'touch',
        onLeft: () => goNext(),
        onRight: () => goPrev(),
        tolerance: 10,
      })
      return () => obs.kill()
    })
  }, { scope: sectionRef })

  return (
    <section
      id="depoimentos"
      ref={sectionRef}
      className="dep-section w-full py-20 md:py-32 overflow-hidden"
    >
      <div className="dep-container">

        {/* Header */}
        <div className="dep-header">
          <span className="dep-reveal dep-eyebrow">/ DEPOIMENTOS DE CLIENTES</span>
          <h2 className="dep-reveal dep-title">
            Quem viveu a <span className="dep-accent">transformação</span> conta como foi.
          </h2>
          <p className="dep-reveal dep-subtitle">
            Cada vídeo é um resultado real. Operações reconstruídas,
            times treinados, números que falam por si.
          </p>
        </div>

        {/* Slider */}
        <div ref={sliderRef} className="dep-slider">
          <div className="dep-track">
            {CARDS.map((card, i) => {
              const isActive = activeIndex === i
              return (
                <button
                  type="button"
                  key={card.name}
                  ref={(el) => { cardRefs.current[i] = el }}
                  className={`dep-card ${isActive ? 'is-active' : ''}`}
                  onClick={() => {
                    if (i === activeRef.current) return
                    const slotMap = getSlotMap(activeRef.current)
                    const slot = slotMap[i]
                    if (slot && slot.includes('left')) goTo(-1)
                    if (slot && slot.includes('right')) goTo(1)
                  }}
                >
                  {/* Video area */}
                  <div className="dep-video-area">
                    <div className="dep-video-placeholder" />


                    {/* Badge */}
                    {isActive && (
                      <div className="dep-badge">● DEPOIMENTO</div>
                    )}

                    {/* REC indicator */}
                    <div className="dep-rec" />

                    {/* Duration */}
                    <div className="dep-duration">{card.duration}</div>

                    {/* Play button */}
                    <span className="dep-play" aria-hidden="true">
                      <PlayIcon />
                    </span>
                  </div>

                  {/* Footer */}
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
                      {Array.from({ length: card.stars }).map((_, si) => (
                        <StarSvg key={si} />
                      ))}
                    </div>

                    <p className={`dep-quote ${isActive ? 'is-expanded' : ''}`}>
                      "{card.quote}"
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="dep-nav-row">
          <button className="dep-nav-btn" onClick={goPrev} aria-label="Anterior">←</button>

          <div className="dep-dots">
            {CARDS.map((_, i) => (
              <button
                key={i}
                className={`dep-dot ${activeIndex === i ? 'is-active' : ''}`}
                onClick={() => {
                  const diff = i - activeRef.current
                  if (diff !== 0) goTo(diff)
                }}
                aria-label={`Card ${i + 1}`}
              />
            ))}
          </div>

          <button className="dep-nav-btn" onClick={goNext} aria-label="Próximo">→</button>
        </div>

        <p className="dep-drag-hint">← ARRASTE PARA NAVEGAR →</p>

      </div>

    </section>
  )
}
