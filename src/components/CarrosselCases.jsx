import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CarouselCanvas from './three/CarouselCanvas'
import CaseDetailPanel from './CaseDetailPanel'
import CasesCarousel2D from './CasesCarousel2D'
import { CASES } from '../data/cases'

gsap.registerPlugin(ScrollTrigger)

/* ── Stack indicator chip ─────────────────────────────────────── */
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

/* ── Mobile case card ─────────────────────────────────────────── */
function MobileCaseCard({ caseData, onClick }) {
  const c = caseData
  return (
    <article
      onClick={() => onClick(c)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick(c)
        }
      }}
      className="relative cursor-pointer border border-white/[0.08] bg-[#08090b] overflow-hidden active:border-[var(--green)]/40 hover:border-white/15 transition-colors"
    >
      <span className="absolute top-0 left-0 w-3 h-3 border-l border-t border-[var(--green)]/40 z-[2]" aria-hidden="true" />
      <span className="absolute top-0 right-0 w-3 h-3 border-r border-t border-[var(--green)]/40 z-[2]" aria-hidden="true" />
      <span className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-[var(--green)]/40 z-[2]" aria-hidden="true" />
      <span className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-[var(--green)]/40 z-[2]" aria-hidden="true" />

      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0d0d0d]">
        <img
          src={c.img}
          alt={c.client}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#08090b]/30 to-transparent" />
      </div>

      <div className="p-5">
        <div className="flex items-baseline gap-2 font-mono text-[11px] uppercase tracking-[0.18em] mb-2">
          <span className="text-[var(--green)]">{c.id}</span>
          <span className="text-text-muted/40">/</span>
          <span className="text-text-main">{c.client}</span>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted mb-3">
          {c.segment}
        </p>
        <h3 className="font-heading text-[18px] font-semibold text-text-main mb-2 leading-[1.25]">
          {c.headline}
        </h3>
        <p className="text-[13px] text-text-muted leading-[1.6] mb-4">{c.intro}</p>

        <div className="flex flex-wrap gap-2 mb-5">
          <StackChip label="ERP" present={c.stack.erp.present} />
          <StackChip label="E-COMMERCE" present={c.stack.ecommerce.present} />
          <StackChip label="MKT" present={c.stack.marketplaces.length > 0} />
        </div>

        <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--green)]">
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
    </article>
  )
}

/* ── Mobile section ───────────────────────────────────────────── */
function MobileCases({ onCaseClick }) {
  return (
    <section className="block md:hidden py-16 px-[5%]">
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted/70 mb-3">
          [ Cases · Sistemas Ativos ]
        </p>
        <h2 className="font-heading text-[clamp(1.6rem,7vw,2.2rem)] font-semibold leading-[1.18] tracking-[-0.01em] text-text-main">
          Infraestrutura,
          <br />
          que virou resultado.
        </h2>
      </div>
      <div className="flex flex-col gap-7">
        {CASES.map((c) => (
          <MobileCaseCard key={c.id} caseData={c} onClick={onCaseClick} />
        ))}
      </div>
    </section>
  )
}

/* ── Main Component ──────────────────────────────────────────── */
export default function CarrosselCases() {
  const sectionRef = useRef(null)
  const hudRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const overlayOpacityRef = useRef(0)
  const overlayActiveRef = useRef(false)
  const interactive3DRef = useRef(true)
  const [activeCase, setActiveCase] = useState(null)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useGSAP(() => {
    if (isMobile) return

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=3500',
      pin: true,
      scrub: 1,
      onUpdate(self) {
        const p = self.progress
        scrollProgressRef.current = p

        // HUD: fade in during dive (0 → 0.45), hold at 1, soft fade only at very end
        let hud
        if (p < 0.45) {
          const t = p / 0.45
          hud = t * t * (3 - 2 * t)
        } else if (p < 0.95) {
          hud = 1
        } else {
          hud = Math.max(0, 1 - (p - 0.95) * 20)
        }
        if (hudRef.current) hudRef.current.style.opacity = hud

        // Overlay opacity: smoothstep 0.45 → 0.6 (after zoom max settles)
        const ot = Math.min(1, Math.max(0, (p - 0.45) / 0.15))
        const overlay = ot * ot * (3 - 2 * ot)
        // Fade overlay back out at the very end so the section can hand off cleanly
        const exitFade = p > 0.95 ? Math.max(0, 1 - (p - 0.95) * 20) : 1
        overlayOpacityRef.current = overlay * exitFade

        // Boolean flag for keyboard handler / 3D interaction gate
        const active = overlayOpacityRef.current > 0.6
        overlayActiveRef.current = active
        interactive3DRef.current = !active
      },
    })
  }, { scope: sectionRef, dependencies: [isMobile] })

  return (
    <>
      {isMobile ? (
        <MobileCases onCaseClick={setActiveCase} />
      ) : (
        <>
          <style>{`
            .carousel-section {
              position: relative;
              height: 100vh;
            }
            .carousel-hud {
              position: absolute;
              top: 48px;
              left: 48px;
              z-index: 10;
              pointer-events: none;
              opacity: 0;
              transition: none;
            }
            .carousel-hud h2 {
              font-size: clamp(22px, 2.5vw, 34px);
              font-weight: 700;
              color: #fff;
              line-height: 1.2;
              margin-bottom: 8px;
            }
            .carousel-hud p {
              font-family: 'Space Mono', monospace;
              font-size: 12px;
              color: #555;
              letter-spacing: 0.12em;
              text-transform: uppercase;
            }
          `}</style>

          <section ref={sectionRef} className="carousel-section hidden md:block">
            <CarouselCanvas
              scrollProgressRef={scrollProgressRef}
              onCardClick={setActiveCase}
              interactive3DRef={interactive3DRef}
            />

            <CasesCarousel2D
              activeOpacityRef={overlayOpacityRef}
              activeRef={overlayActiveRef}
              onCaseClick={setActiveCase}
            />

            <div ref={hudRef} className="carousel-hud">
              <h2>
                Infraestrutura,
                <br />
                que virou resultado.
              </h2>
              <p>[ Cases · Sistemas Ativos ]</p>
            </div>
          </section>
        </>
      )}

      {activeCase && (
        <CaseDetailPanel caseData={activeCase} onClose={() => setActiveCase(null)} />
      )}
    </>
  )
}
