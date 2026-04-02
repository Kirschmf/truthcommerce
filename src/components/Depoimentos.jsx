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
                <div
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
                    <button className="dep-play" aria-label="Play">
                      <PlayIcon />
                    </button>
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
                </div>
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

      <style>{`
        .dep-section {
          background: #09090b;
        }

        .dep-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ===== Header ===== */
        .dep-header {
          text-align: center;
          margin-bottom: 56px;
        }

        .dep-eyebrow {
          display: block;
          font-family: var(--font-mono, 'Space Mono', monospace);
          font-size: 11px;
          color: #07dd2b;
          letter-spacing: 0.18em;
          margin-bottom: 16px;
          font-weight: 700;
        }

        .dep-title {
          font-family: var(--font-heading, 'Sora', sans-serif);
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          margin: 0;
        }

        .dep-accent {
          color: #07dd2b;
        }

        .dep-subtitle {
          font-size: 14px;
          color: #444;
          margin: 12px auto 0;
          max-width: 520px;
          line-height: 1.6;
        }

        /* ===== Slider ===== */
        .dep-slider {
          position: relative;
          height: 480px;
          perspective: 1000px;
        }

        .dep-track {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        /* ===== Card ===== */
        .dep-card {
          position: absolute;
          left: 50%;
          top: 0;
          margin-left: -150px;
          width: 300px;
          border-radius: 20px;
          overflow: hidden;
          background: #0d0d10;
          border: 1px solid #1a1a1a;
          transform-style: preserve-3d;
          cursor: pointer;
          transition: border-color 0.3s ease;
          will-change: transform, opacity;
        }

        .dep-card.is-active {
          border-color: rgba(7, 221, 43, 0.2);
        }

        /* ===== Video area ===== */
        .dep-video-area {
          position: relative;
          aspect-ratio: 9 / 16;
          overflow: hidden;
        }

        .dep-video-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(170deg, #111 0%, #0a0a0d 100%);
        }

/* Badge */
        .dep-badge {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(7, 221, 43, 0.1);
          border: 1px solid rgba(7, 221, 43, 0.3);
          border-radius: 20px;
          padding: 3px 14px;
          font-size: 9px;
          color: #07dd2b;
          letter-spacing: 0.1em;
          font-weight: 700;
          white-space: nowrap;
          z-index: 3;
        }

        /* REC */
        .dep-rec {
          position: absolute;
          top: 14px;
          right: 14px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ff4444;
          animation: depBlink 1.5s infinite;
          z-index: 3;
        }

        @keyframes depBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Duration */
        .dep-duration {
          position: absolute;
          bottom: 10px;
          right: 10px;
          font-size: 9px;
          color: #555;
          background: rgba(0, 0, 0, 0.6);
          padding: 2px 8px;
          border-radius: 4px;
          font-family: var(--font-mono, 'Space Mono', monospace);
          z-index: 3;
        }

        /* Play button */
        .dep-play {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(7, 221, 43, 0.12);
          border: 1.5px solid rgba(7, 221, 43, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: transform 0.3s ease, background 0.3s ease;
        }

        /* ===== Footer ===== */
        .dep-card-footer {
          padding: 14px 12px;
          background: #0a0a0d;
          border-top: 1px solid #1a1a1a;
        }

        .dep-footer-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }

        .dep-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #1a1a1a;
          border: 1.5px solid rgba(7, 221, 43, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dep-avatar span {
          font-size: 10px;
          font-weight: 700;
          color: #07dd2b;
        }

        .dep-name {
          font-size: 12px;
          font-weight: 700;
          color: #e8e8e8;
        }

        .dep-role {
          font-size: 9px;
          color: #555;
        }

        .dep-stars {
          display: flex;
          gap: 3px;
          margin-bottom: 8px;
        }

        .dep-quote {
          font-size: 10px;
          color: #555;
          line-height: 1.5;
          margin: 0;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .dep-quote.is-expanded {
          -webkit-line-clamp: 3;
        }

        /* ===== Navigation ===== */
        .dep-nav-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }

        .dep-nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid #2a2a2a;
          background: transparent;
          color: #555;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: border-color 0.3s ease, color 0.3s ease;
        }

        .dep-dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .dep-dot {
          width: 16px;
          height: 2px;
          background: #1e1e1e;
          border: none;
          border-radius: 1px;
          cursor: pointer;
          padding: 0;
          transition: width 0.35s ease, background 0.35s ease;
        }

        .dep-dot.is-active {
          width: 32px;
          background: #07dd2b;
        }

        .dep-drag-hint {
          text-align: center;
          font-size: 10px;
          color: #2a2a2a;
          letter-spacing: 0.08em;
          margin-top: 16px;
        }

        /* ===== Hover (pointer) ===== */
        @media (hover: hover) {
          .dep-nav-btn:hover {
            border-color: #07dd2b;
            color: #07dd2b;
          }

          .dep-play:hover {
            transform: translate(-50%, -50%) scale(1.12);
            background: rgba(7, 221, 43, 0.22);
          }
        }

        /* ===== Desktop ===== */
        @media (min-width: 1025px) {
          .dep-container {
            padding: 0 80px;
          }

          .dep-slider {
            height: 640px;
          }
        }

        /* ===== Tablet ===== */
        @media (min-width: 768px) and (max-width: 1024px) {
          .dep-slider {
            height: 480px;
          }

          .dep-card {
            width: 200px;
            margin-left: -100px;
          }
        }

        /* ===== Mobile ===== */
        @media (max-width: 767px) {
          .dep-slider {
            height: 460px;
            perspective: none;
          }

          .dep-card {
            width: 80vw;
            max-width: 280px;
            margin-left: calc(-40vw);
          }

          .dep-drag-hint {
            display: block;
          }
        }
      `}</style>
    </section>
  )
}
