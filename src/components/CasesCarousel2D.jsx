import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import gsap from 'gsap'
import { CASES } from '../data/cases'
import { CASE_STACK_LABELS } from './caseShared'

function CornerBrackets() {
  const base = 'absolute w-4 h-4 md:w-5 md:h-5 z-[2] pointer-events-none'
  const c = 'rgba(7, 221, 43, 0.5)'
  return (
    <>
      <span className={`${base} top-0 left-0 border-l border-t`} style={{ borderColor: c }} aria-hidden="true" />
      <span className={`${base} top-0 right-0 border-r border-t`} style={{ borderColor: c }} aria-hidden="true" />
      <span className={`${base} bottom-0 left-0 border-l border-b`} style={{ borderColor: c }} aria-hidden="true" />
      <span className={`${base} bottom-0 right-0 border-r border-b`} style={{ borderColor: c }} aria-hidden="true" />
    </>
  )
}

function StackChip({ label, present }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border rounded-full font-mono text-[10px] uppercase tracking-[0.12em] ${
        present
          ? 'border-[var(--green)]/40 text-[var(--green)]'
          : 'border-white/10 text-text-muted/40'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${present ? 'bg-[var(--green)]' : 'bg-white/15'}`}
        aria-hidden="true"
      />
      {label}
    </span>
  )
}

function ChevronButton({ direction, onClick, ariaLabel }) {
  const isPrev = direction === 'prev'
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="pointer-events-auto absolute top-1/2 -translate-y-1/2 z-[3] flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full border border-white/15 bg-[#08090b]/60 backdrop-blur text-text-muted hover:border-[var(--green)] hover:text-[var(--green)] hover:bg-[#08090b]/80 transition-colors duration-300"
      style={isPrev ? { left: '2vw' } : { right: '2vw' }}
    >
      <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        {isPrev ? (
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        ) : (
          <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  )
}

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
}

export default function CasesCarousel2D({ activeOpacityRef, activeRef, onCaseClick }) {
  const containerRef = useRef(null)
  const [index, setIndex] = useState(0)
  const directionRef = useRef(1)

  const goNext = useCallback(() => {
    directionRef.current = 1
    setIndex((i) => (i + 1) % CASES.length)
  }, [])

  const goPrev = useCallback(() => {
    directionRef.current = -1
    setIndex((i) => (i - 1 + CASES.length) % CASES.length)
  }, [])

  // Drive opacity + visibility via gsap.ticker (already running for ScrollTrigger)
  // — avoids spinning up a separate requestAnimationFrame loop.
  useEffect(() => {
    const tick = () => {
      const op = activeOpacityRef?.current ?? 0
      const el = containerRef.current
      if (el) {
        el.style.opacity = String(op)
        // Block interactions until the overlay is mostly visible
        el.style.pointerEvents = op > 0.5 ? 'auto' : 'none'
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [activeOpacityRef])

  // Keyboard navigation only while overlay is active
  useEffect(() => {
    const onKey = (e) => {
      const active = activeRef?.current === true
      if (!active) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeRef, goNext, goPrev])

  const c = CASES[index]
  const total = CASES.length

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-[20] flex items-center justify-center bg-[rgba(4,5,7,0.92)] backdrop-blur-md"
      style={{ opacity: 0, pointerEvents: 'none', transition: 'opacity 0.2s linear' }}
      aria-hidden={false}
    >
      <ChevronButton direction="prev" onClick={goPrev} ariaLabel="Caso anterior" />
      <ChevronButton direction="next" onClick={goNext} ariaLabel="Próximo caso" />

      <div className="pointer-events-auto relative w-[90vw] max-w-[1180px] h-[68vh] max-h-[640px]">
        <AnimatePresence mode="wait" custom={directionRef.current}>
          <motion.article
            key={c.id}
            custom={directionRef.current}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onCaseClick(c)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                onCaseClick(c)
              }
            }}
            className="absolute inset-0 grid grid-cols-[60%_40%] bg-[#08090b]/95 border border-white/[0.08] cursor-pointer overflow-hidden hover:border-white/15 transition-colors"
          >
            <CornerBrackets />

            {/* Image side */}
            <div className="relative h-full overflow-hidden bg-[#0d0d0d]">
              <img
                src={c.img}
                alt={c.client}
                className="w-full h-full object-cover"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#08090b]/60" />
            </div>

            {/* Content side */}
            <div className="relative flex flex-col justify-center p-8 lg:p-12 gap-5 overflow-y-auto">
              <div className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.18em]">
                <span className="text-[var(--green)]">{c.id}</span>
                <span className="text-text-muted/40">/</span>
                <span className="text-text-main">{c.client}</span>
              </div>

              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
                {c.segment}
              </p>

              <h3 className="font-heading text-[clamp(1.3rem,2.2vw,1.9rem)] font-semibold text-text-main leading-[1.18] tracking-[-0.01em]">
                {c.headline}
              </h3>

              <p className="text-[14px] lg:text-[15px] text-text-muted leading-[1.65]">
                {c.intro}
              </p>

              <div className="flex flex-wrap gap-2">
                <StackChip label={CASE_STACK_LABELS.erp} present={c.stack.erp.present} />
                <StackChip label={CASE_STACK_LABELS.ecommerce} present={c.stack.ecommerce.present} />
                <StackChip label={CASE_STACK_LABELS.marketplaces} present={c.stack.marketplaces.length > 0} />
              </div>

              <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--green)] mt-2">
                Ver detalhes
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M5 2l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </motion.article>
        </AnimatePresence>
      </div>

      {/* Indicator */}
      <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[2]">
        <div className="flex items-center gap-2">
          {CASES.map((_, i) => (
            <span
              key={i}
              className={`h-[2px] transition-all duration-300 ${
                i === index ? 'w-8 bg-[var(--green)]' : 'w-4 bg-white/20'
              }`}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
          {String(index + 1).padStart(2, '0')} <span className="text-text-muted/40">/</span>{' '}
          {String(total).padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}
