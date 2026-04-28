import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

function CornerBrackets({ color = 'rgba(7, 221, 43, 0.5)' }) {
  const base = 'absolute w-4 h-4 md:w-5 md:h-5 z-[2]'
  return (
    <>
      <span className={`${base} top-0 left-0 border-l border-t`} style={{ borderColor: color }} aria-hidden="true" />
      <span className={`${base} top-0 right-0 border-r border-t`} style={{ borderColor: color }} aria-hidden="true" />
      <span className={`${base} bottom-0 left-0 border-l border-b`} style={{ borderColor: color }} aria-hidden="true" />
      <span className={`${base} bottom-0 right-0 border-r border-b`} style={{ borderColor: color }} aria-hidden="true" />
    </>
  )
}

function StackRow({ label, value, present }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-t border-white/[0.06]">
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`inline-block w-2 h-2 rounded-full shrink-0 ${
            present ? 'bg-[var(--green)]' : 'bg-white/15'
          }`}
          aria-hidden="true"
        />
        <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-text-muted">
          ▸ {label}
        </span>
      </div>
      <span
        className={`text-right text-[13px] md:text-[15px] font-medium leading-[1.4] ${
          present ? 'text-text-main' : 'text-text-muted/55 italic'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

function MarketplacesRow({ list }) {
  const present = list.length > 0
  return (
    <div className="flex items-start justify-between gap-4 py-3.5 border-t border-white/[0.06]">
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={`inline-block w-2 h-2 rounded-full shrink-0 ${
            present ? 'bg-[var(--green)]' : 'bg-white/15'
          }`}
          aria-hidden="true"
        />
        <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-text-muted">
          ▸ MARKETPLACES
        </span>
      </div>
      {present ? (
        <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
          {list.map((m) => (
            <span
              key={m}
              className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 border border-[var(--green)]/40 text-[var(--green)] rounded-full"
            >
              {m}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-[13px] md:text-[15px] text-text-muted/55 italic text-right">
          — Sem marketplaces
        </span>
      )}
    </div>
  )
}

export default function CaseDetailPanel({ caseData, onClose }) {
  const overlayRef = useRef(null)
  const panelRef = useRef(null)
  const hintRef = useRef(null)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const html = document.documentElement
    const body = document.body
    const prevHtmlOverflow = html.style.overflow
    const prevBodyOverflow = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (typeof window !== 'undefined' && window.__lenis) window.__lenis.stop()

    // Block wheel/touch from reaching window-level listeners (Lenis + Carousel3D ring rotation)
    const overlay = overlayRef.current
    const stop = (e) => e.stopPropagation()
    overlay?.addEventListener('wheel', stop, { passive: true })
    overlay?.addEventListener('touchmove', stop, { passive: true })

    return () => {
      document.removeEventListener('keydown', onKey)
      overlay?.removeEventListener('wheel', stop)
      overlay?.removeEventListener('touchmove', stop)
      html.style.overflow = prevHtmlOverflow
      body.style.overflow = prevBodyOverflow
      if (typeof window !== 'undefined' && window.__lenis) window.__lenis.start()
    }
  }, [onClose])

  useGSAP(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, y: 28, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'expo.out' }
    )
  })

  // Show "scroll for more" hint when the panel overflows the viewport, hide it on first scroll
  useEffect(() => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) return

    const id = window.setTimeout(() => {
      if (panel.offsetHeight > window.innerHeight - 32) setShowHint(true)
    }, 150)

    const onScroll = () => {
      if (overlay.scrollTop > 80) setShowHint(false)
    }
    overlay.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(id)
      overlay.removeEventListener('scroll', onScroll)
    }
  }, [])

  if (!caseData) return null

  const { id, client, segment, headline, intro, description, metrics, stack, cta, img } = caseData

  return (
    <div
      ref={overlayRef}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="case-headline"
      data-lenis-prevent
      className="fixed inset-0 z-[200] flex items-start md:items-center justify-center p-3 md:p-8 bg-[rgba(4,5,7,0.92)] backdrop-blur-md overflow-y-auto overscroll-contain"
    >
      {/* Close — fixed to viewport, stays visible while panel scrolls */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        aria-label="Fechar"
        className="fixed top-4 right-4 md:top-6 md:right-6 z-[210] flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-full border border-[var(--green)]/45 bg-[#08090b]/90 backdrop-blur-sm text-text-main hover:bg-[var(--green)] hover:text-[#040507] hover:border-[var(--green)] transition-colors duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)]"
      >
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      <div
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[940px] my-auto bg-[#08090b] border border-white/[0.08]"
      >
        <CornerBrackets />

        {/* Hero image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-white/[0.06] bg-[#0d0d0d]">
          <img
            src={img}
            alt={client}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-transparent to-transparent" />
        </div>

        <div className="p-6 md:p-10">
          {/* Header line */}
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] mb-4 md:mb-5">
            <span className="text-[var(--green)]">{id}</span>
            <span className="text-text-muted/40">/</span>
            <span className="text-text-main">{client}</span>
            <span className="text-text-muted/40">·</span>
            <span className="text-text-muted">{segment}</span>
          </div>

          <h2
            id="case-headline"
            className="font-heading text-[clamp(1.4rem,5vw,2rem)] md:text-[clamp(1.7rem,2.6vw,2.4rem)] font-semibold leading-[1.15] tracking-[-0.01em] mb-4"
          >
            {headline}
          </h2>

          <p className="text-text-main/85 text-[14px] md:text-[16px] leading-[1.6] mb-7 md:mb-9">
            {intro}
          </p>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 py-5 md:py-7 border-y border-white/[0.06] mb-7 md:mb-9">
            {metrics.map((m) => (
              <div key={m.label}>
                <div className="font-mono text-[18px] md:text-[26px] font-semibold text-[var(--green)] leading-none mb-2">
                  {m.prefix}
                  {m.value.toLocaleString()}
                  {m.suffix}
                </div>
                <div className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.12em] text-text-muted leading-[1.3]">
                  {m.label}
                </div>
              </div>
            ))}
          </div>

          {/* Stack técnica */}
          <div className="mb-7 md:mb-9">
            <h3 className="flex items-baseline gap-2 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] mb-4">
              <span className="text-[var(--green)]">▸</span>
              <span className="text-text-main">STACK TÉCNICA</span>
            </h3>
            <div className="border-b border-white/[0.06]">
              <StackRow label="ERP" value={stack.erp.name} present={stack.erp.present} />
              <StackRow
                label="E-COMMERCE"
                value={stack.ecommerce.name}
                present={stack.ecommerce.present}
              />
              <MarketplacesRow list={stack.marketplaces} />
            </div>
          </div>

          {description && (
            <p className="text-text-muted text-[13px] md:text-[15px] leading-[1.7] mb-8 md:mb-10">
              {description}
            </p>
          )}

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
            {cta ? (
              <a
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-[18px] bg-[var(--green)] text-[#040507] text-[14px] md:text-[15px] font-medium rounded-full shadow-[0_8px_24px_rgba(7,221,43,0.25)] hover:shadow-[0_14px_40px_rgba(7,221,43,0.5)] transition-shadow duration-500 ease-out"
              >
                {cta.label}
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M3 11L11 3M11 3H5M11 3V9"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.12em] text-text-muted/60 italic">
                ▸ Loja não pública
              </div>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 md:px-9 md:py-[18px] border border-white/15 text-text-muted text-[13px] md:text-sm font-mono uppercase tracking-[0.12em] rounded-full hover:border-white/30 hover:text-text-main transition-colors duration-300"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Scroll hint — appears when panel exceeds viewport, fades on first scroll */}
      {showHint && (
        <div
          ref={hintRef}
          aria-hidden="true"
          className="fixed bottom-5 md:bottom-7 left-1/2 -translate-x-1/2 z-[210] flex flex-col items-center gap-1.5 pointer-events-none"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--green)]/80">
            Role para ver mais
          </span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-[var(--green)] animate-bounce">
            <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  )
}
