import { useRef, useState, useCallback, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Data ─────────────────────────────────────────────────────── */
const CASES = [
  {
    id: '01',
    client: 'Cliente Alpha',
    segment: 'Moda & Vestuário',
    headline: '+340% de GMV em 6 meses',
    description:
      'Migração completa de PDV físico para ecossistema digital. Integração ERP + 4 marketplaces simultâneos com catálogo unificado.',
    metrics: [
      { label: 'Crescimento GMV', value: 340, suffix: '%', prefix: '+' },
      { label: 'Marketplaces integrados', value: 4, suffix: '', prefix: '' },
      { label: 'Dias de implementação', value: 21, suffix: 'd', prefix: '' },
    ],
    tags: ['Shopify', 'Mercado Livre', 'ERP', 'Bling'],
    image: '/cases/alpha.jpg',
  },
  {
    id: '02',
    client: 'Cliente Beta',
    segment: 'Casa & Decoração',
    headline: '3.200 SKUs catalogados do zero',
    description:
      'Arquitetura de catálogo com taxonomia técnica, tratamento de ativos visuais e integração multi-canal.',
    metrics: [
      { label: 'SKUs estruturados', value: 3200, suffix: '', prefix: '' },
      { label: 'Redução de erros', value: 94, suffix: '%', prefix: '-' },
      { label: 'Canais ativos', value: 6, suffix: '', prefix: '' },
    ],
    tags: ['Amazon', 'Shopee', 'PIM', 'Nuvemshop'],
    image: '/cases/beta.jpg',
  },
  {
    id: '03',
    client: 'Cliente Gamma',
    segment: 'Ferramentas B2B',
    headline: 'Ruptura de estoque zerada',
    description:
      'Integração sistêmica entre ERP legado e 3 plataformas com sincronização bidirecional em tempo real.',
    metrics: [
      { label: 'Ruptura de estoque', value: 0, suffix: '%', prefix: '' },
      { label: 'Sync em tempo real', value: 100, suffix: '%', prefix: '' },
      { label: 'Pedidos por mês', value: 1800, suffix: '+', prefix: '' },
    ],
    tags: ['ERP', 'B2B', 'Bling', 'Magalu'],
    image: '/cases/gamma.jpg',
  },
  {
    id: '04',
    client: 'Cliente Delta',
    segment: 'Tecnologia & Eletrônicos',
    headline: '+218% de conversão',
    description:
      'Reestruturação de catálogo, UX de checkout e integração com sistema de gestão próprio.',
    metrics: [
      { label: 'Aumento de conversão', value: 218, suffix: '%', prefix: '+' },
      { label: 'Ticket médio', value: 2, suffix: 'x', prefix: '' },
      { label: 'Prazo do projeto', value: 90, suffix: 'd', prefix: '' },
    ],
    tags: ['Nuvemshop', 'Analytics', 'CRO'],
    image: '/cases/delta.jpg',
  },
  {
    id: '05',
    client: 'Cliente Epsilon',
    segment: 'Distribuição & Atacado',
    headline: '6 canais simultâneos ativos',
    description:
      'Operação multi-canal unificada em hub central com automação total de pedidos e estoque.',
    metrics: [
      { label: 'Canais simultâneos', value: 6, suffix: '', prefix: '' },
      { label: 'Automação total', value: 100, suffix: '%', prefix: '' },
      { label: 'Setup em', value: 48, suffix: 'h', prefix: '' },
    ],
    tags: ['Hub', 'Magalu', 'TikTok Shop', 'Amazon'],
    image: '/cases/epsilon.jpg',
  },
]

const N = CASES.length
const STEP = (2 * Math.PI) / N

/* ── Helpers ──────────────────────────────────────────────────── */
function lerp(a, b, t) {
  return a + (b - a) * t
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}


/* ── Mobile Cases List ───────────────────────────────────────── */
function MobileCases() {
  return (
    <section className="block md:hidden py-16 px-4" style={{ background: 'transparent' }}>
      <div className="mb-10">
        <p className="font-mono text-xs tracking-widest mb-2" style={{ color: '#555' }}>
          [ CASES · SISTEMAS ATIVOS ]
        </p>
        <h2 className="text-2xl font-bold leading-tight" style={{ color: '#fff' }}>
          Infraestrutura,<br />que virou resultado.
        </h2>
      </div>
      <div className="flex flex-col gap-12">
        {CASES.map((c) => (
          <div key={c.id}>
            <div
              className="relative w-full overflow-hidden"
              style={{
                aspectRatio: '16 / 9',
                border: '1px solid #07dd2b',
                borderRadius: 8,
                boxShadow: '0 0 24px #07dd2b20',
                background:
                  'repeating-linear-gradient(0deg, transparent, transparent 8px, #161616 8px, #161616 9px),' +
                  'repeating-linear-gradient(90deg, transparent, transparent 8px, #161616 8px, #161616 9px)',
                backgroundColor: '#0d0d0d',
              }}
            />
            <p className="text-xs mt-2 font-mono" style={{ color: '#07dd2b' }}>
              {c.client} · {c.headline}
            </p>
            <div className="mt-4">
              <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#555' }}>
                {c.segment}
              </p>
              <h3 className="text-lg font-bold mb-2" style={{ color: '#fff' }}>{c.headline}</h3>
              <p className="text-sm mb-4" style={{ color: '#555' }}>{c.description}</p>
              <div className="flex gap-6 mb-4">
                {c.metrics.map((m) => (
                  <div key={m.label}>
                    <span className="text-xl font-bold font-mono" style={{ color: '#07dd2b' }}>
                      {m.prefix}{m.value.toLocaleString()}{m.suffix}
                    </span>
                    <p className="text-[10px] font-mono uppercase mt-1" style={{ color: '#555' }}>{m.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {c.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-1" style={{ border: '1px solid #2a2a2a', color: '#666' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ── Main Component ──────────────────────────────────────────── */
export default function CarrosselCases() {
  const sectionRef = useRef(null)
  const wrapperRef = useRef(null)
  const cardRefs = useRef([])
  const labelRefs = useRef([])
  const panelRef = useRef(null)
  const counterRef = useRef(null)
  const pipsRef = useRef([])
  const hintRef = useRef(null)
  const metricEls = useRef([])
  const navRef = useRef(null)

  const progressRef = useRef(0)
  const spinAngleRef = useRef(0)
  const activeRef = useRef(0)
  const lastTimeRef = useRef(0)
  const rafRef = useRef(null)
  const prevActiveRef = useRef(-1)

  // Carousel mode state — managed imperatively for rAF perf
  const carouselIndexRef = useRef(0)
  const carouselAngleRef = useRef(0) // smooth animated angle for carousel
  const carouselTargetRef = useRef(0)
  const isCarouselRef = useRef(false)

  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    function check() { setIsMobile(window.innerWidth < 768) }
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])


  // Navigate carousel
  const goTo = useCallback((dir) => {
    carouselIndexRef.current = (carouselIndexRef.current + dir + N) % N
    carouselTargetRef.current -= dir * STEP
    // Update panel
    updatePanel(carouselIndexRef.current)
  }, [])

  // Metric counter animation
  const animateMetrics = useCallback((caseIndex) => {
    const els = metricEls.current
    if (!els || !els.length) return
    CASES[caseIndex].metrics.forEach((m, i) => {
      const el = els[i]
      if (!el) return
      const obj = { val: 0 }
      gsap.killTweensOf(obj)
      gsap.to(obj, {
        val: m.value, duration: 1.2, ease: 'power2.out',
        onUpdate() {
          const v = m.value >= 100
            ? Math.round(obj.val).toLocaleString()
            : Number(obj.val.toFixed(m.value % 1 === 0 ? 0 : 1)).toLocaleString()
          el.textContent = `${m.prefix}${v}${m.suffix}`
        },
      })
    })
  }, [])

  // Panel transition
  const updatePanel = useCallback((caseIndex) => {
    const panel = panelRef.current
    if (!panel) return
    const c = CASES[caseIndex]

    gsap.to(panel, {
      opacity: 0, y: 10, duration: 0.25,
      onComplete() {
        const segmentEl = panel.querySelector('[data-segment]')
        const headlineEl = panel.querySelector('[data-headline]')
        const descEl = panel.querySelector('[data-desc]')
        const tagsContainer = panel.querySelector('[data-tags]')
        const metricsContainer = panel.querySelector('[data-metrics]')

        if (segmentEl) segmentEl.textContent = c.segment
        if (headlineEl) headlineEl.textContent = c.headline
        if (descEl) descEl.textContent = c.description

        if (tagsContainer) {
          tagsContainer.innerHTML = ''
          c.tags.forEach((t) => {
            const span = document.createElement('span')
            span.textContent = t
            span.className = 'cases-tag'
            tagsContainer.appendChild(span)
          })
        }

        if (metricsContainer) {
          metricsContainer.innerHTML = ''
          metricEls.current = []
          c.metrics.forEach((m) => {
            const wrapper = document.createElement('div')
            wrapper.className = 'cases-metric'
            const val = document.createElement('span')
            val.className = 'cases-metric-value'
            val.textContent = `${m.prefix}0${m.suffix}`
            metricEls.current.push(val)
            const lab = document.createElement('p')
            lab.className = 'cases-metric-label'
            lab.textContent = m.label
            wrapper.appendChild(val)
            wrapper.appendChild(lab)
            metricsContainer.appendChild(wrapper)
          })
        }

        // Update counter & pips
        if (counterRef.current) {
          counterRef.current.textContent = `CASE ${c.id} / 0${N}`
        }
        pipsRef.current.forEach((pip, i) => {
          if (!pip) return
          pip.style.width = i === caseIndex ? '32px' : '20px'
          pip.style.background = i === caseIndex ? '#07dd2b' : '#333'
        })

        gsap.to(panel, {
          opacity: 1, y: 0, duration: 0.4, ease: 'power2.out',
          onComplete() { animateMetrics(caseIndex) },
        })
      },
    })
  }, [animateMetrics])

  useGSAP(() => {
    if (isMobile) return

    const section = sectionRef.current
    const wrapper = wrapperRef.current
    if (!section || !wrapper) return

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: wrapper,
      scrub: 1,
      onUpdate(self) { progressRef.current = self.progress },
    })

    lastTimeRef.current = performance.now()

    // The card base size is set in CSS (80vw × 45vw).
    // During orbit phase we scale them down; at carousel phase they're ~scale(1).
    // We define two phases:
    //   Phase A (scroll 0→0.40): orbit with tiny cards spinning
    //   Phase B (scroll 0.40→1.0): transition to single centered card carousel

    function tick(now) {
      rafRef.current = requestAnimationFrame(tick)

      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1)
      lastTimeRef.current = now

      const scrollP = progressRef.current

      // Phase blend: 0 = full orbit, 1 = full carousel
      const carouselBlend = clamp((scrollP - 0.35) / 0.45, 0, 1)
      const cb = easeInOut(carouselBlend)

      // Mark carousel mode for button visibility
      const wasCarousel = isCarouselRef.current
      isCarouselRef.current = cb > 0.85
      if (isCarouselRef.current !== wasCarousel && navRef.current) {
        navRef.current.style.opacity = isCarouselRef.current ? '1' : '0'
        navRef.current.style.pointerEvents = isCarouselRef.current ? 'auto' : 'none'
      }

      // --- Orbit phase params ---
      const orbitP = easeInOut(clamp(scrollP / 0.40, 0, 1))

      // Spin (slows down and stops as we approach carousel)
      if (scrollP <= 0.35) {
        spinAngleRef.current += lerp(0.5, 0.06, orbitP) * dt
      }

      // Smooth carousel angle
      carouselAngleRef.current += (carouselTargetRef.current - carouselAngleRef.current) * 0.12

      // The angle used: blend between orbit spin and carousel controlled angle
      const orbitAngle = spinAngleRef.current
      const carAngle = carouselAngleRef.current
      const angle = lerp(orbitAngle, carAngle, cb)

      // Orbit radii shrink to 0 in carousel mode (cards stack centered)
      const RX = lerp(lerp(120, 380, orbitP), 0, cb)
      const RZ = lerp(lerp(20, 100, orbitP), 0, cb)

      // Global scale: tiny → full
      // In orbit: 0.04 → 0.25; in carousel: 1.0
      const orbitScale = lerp(0.04, 0.25, orbitP)
      const globalScale = lerp(orbitScale, 1.0, cb)

      let bestDepth = -1
      let bestIdx = 0

      for (let i = 0; i < N; i++) {
        const card = cardRefs.current[i]
        const label = labelRefs.current[i]
        if (!card) continue

        const theta = angle + (i / N) * 2 * Math.PI
        const cosT = Math.cos(theta)
        const sinT = Math.sin(theta)
        const depthT = (cosT + 1) / 2 // 0=back, 1=front

        // Position
        const x = sinT * RX
        const z = cosT * RZ - RZ

        // Per-card scale: in orbit smaller cards in back; in carousel only front card is full
        let cardScale
        if (cb < 0.99) {
          const depthScale = lerp(0.5, 1.0, depthT)
          cardScale = depthScale * globalScale
        } else {
          // Pure carousel: front card = 1, others = 0
          cardScale = depthT > 0.95 ? 1.0 : 0
        }

        // Opacity
        let opacity
        if (cb < 0.5) {
          opacity = lerp(0.7, lerp(0.15, 1.0, depthT), orbitP)
        } else {
          // In carousel: only front card visible
          opacity = depthT > 0.5 ? lerp(0.5, 1.0, (depthT - 0.5) * 2) : 0
          opacity = lerp(lerp(0.15, 1.0, depthT), opacity, clamp((cb - 0.5) / 0.5, 0, 1))
        }

        card.style.transform = `translate(-50%, -50%) translateX(${x}px) translateZ(${z}px) scale(${cardScale})`
        card.style.opacity = opacity
        card.style.zIndex = Math.round(depthT * 100)

        // Labels fade out as we enter carousel mode
        if (label) {
          label.style.opacity = cb < 0.3 ? opacity : lerp(opacity, 0, clamp((cb - 0.3) / 0.3, 0, 1))
          label.style.zIndex = Math.round(depthT * 100)
          label.style.transform = `translate(-50%, 0) translateX(${x}px) scale(${Math.min(cardScale, 1)})`
        }

        if (depthT > bestDepth) {
          bestDepth = depthT
          bestIdx = i
        }
      }

      // Active card styling
      if (bestIdx !== activeRef.current || prevActiveRef.current === -1) {
        activeRef.current = bestIdx

        for (let i = 0; i < N; i++) {
          const card = cardRefs.current[i]
          if (!card) continue
          if (i === bestIdx) {
            card.style.borderColor = '#07dd2b'
            card.style.boxShadow = '0 0 40px #07dd2b25'
          } else {
            card.style.borderColor = '#1e1e1e'
            card.style.boxShadow = 'none'
          }
        }

        if (counterRef.current) {
          counterRef.current.textContent = `CASE ${CASES[bestIdx].id} / 0${N}`
        }
        pipsRef.current.forEach((pip, i) => {
          if (!pip) return
          pip.style.width = i === bestIdx ? '32px' : '20px'
          pip.style.background = i === bestIdx ? '#07dd2b' : '#333'
        })

        if (prevActiveRef.current !== -1) {
          updatePanel(bestIdx)
        }
        prevActiveRef.current = bestIdx
      }

      // HUD visibility
      if (counterRef.current) {
        counterRef.current.style.opacity = scrollP > 0.3 ? 1 : 0
      }
      if (hintRef.current) {
        hintRef.current.style.opacity = scrollP > 0.12 ? 0 : 1
      }

      // Panel position: at bottom-left during orbit, slide to right of card in carousel
      if (panelRef.current) {
        const panelShift = cb > 0.5 ? 1 : 0
        panelRef.current.setAttribute('data-mode', panelShift ? 'carousel' : 'orbit')
      }
    }

    rafRef.current = requestAnimationFrame(tick)
    updatePanel(0)

    return () => {
      cancelAnimationFrame(rafRef.current)
      st.kill()
    }
  }, { scope: sectionRef, dependencies: [isMobile, updatePanel] })

  if (isMobile) return <MobileCases />

  return (
    <>
      <style>{`
        .cases-section {
          position: relative;
          height: 200vh;
          background: transparent;
        }
        .cases-wrapper {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        /* ── Orbit / Card Container ── */
        .cases-orbit-container {
          position: absolute;
          top: 48%;
          left: 50%;
          transform: translate(-50%, -50%);
          transform-style: preserve-3d;
          perspective: 1400px;
          z-index: 1;
          width: 0;
          height: 0;
        }
        .cases-card {
          position: absolute;
          width: 78vw;
          max-width: 920px;
          aspect-ratio: 16 / 9;
          border: 1px solid #1e1e1e;
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
          will-change: transform, opacity;
          background:
            repeating-linear-gradient(0deg, transparent, transparent 8px, #161616 8px, #161616 9px),
            repeating-linear-gradient(90deg, transparent, transparent 8px, #161616 8px, #161616 9px);
          background-color: #0d0d0d;
          transform-origin: center center;
          pointer-events: none;
          /* centered via translate(-50%,-50%) in JS */
        }
        .cases-card-label {
          position: absolute;
          top: calc(50% + 26vw);
          left: 50%;
          width: 300px;
          text-align: center;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #333;
          transition: color 0.3s;
          will-change: transform, opacity;
          pointer-events: none;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ── Navigation Buttons ── */
        .cases-nav {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          z-index: 20;
          display: flex;
          justify-content: space-between;
          padding: 0 28px;
          transform: translateY(-50%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .cases-nav-btn {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid #07dd2b44;
          background: rgba(4, 5, 7, 0.7);
          color: #07dd2b;
          font-size: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          pointer-events: auto;
          transition: border-color 0.3s, background 0.3s, transform 0.2s;
          backdrop-filter: blur(6px);
        }
        .cases-nav-btn:hover {
          border-color: #07dd2b;
          background: rgba(7, 221, 43, 0.08);
          transform: scale(1.1);
        }

        /* ── HUD ── */
        .cases-hud {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
          padding: 48px;
        }
        .cases-hud-title {
          font-size: 28px;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
        }
        .cases-hud-tag {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          color: #555;
          margin-top: 8px;
          letter-spacing: 0.12em;
        }
        .cases-counter {
          position: absolute;
          top: 48px;
          right: 48px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #555;
          opacity: 0;
          transition: opacity 0.4s;
        }
        .cases-pips {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          align-items: center;
          z-index: 15;
        }
        .cases-pip {
          height: 2px;
          width: 20px;
          background: #333;
          transition: width 0.35s ease, background 0.35s ease;
        }
        .cases-hint {
          position: absolute;
          bottom: 48px;
          right: 48px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          transition: opacity 0.4s;
          z-index: 15;
        }
        .cases-hint-text {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #555;
          letter-spacing: 0.15em;
        }
        .cases-hint-line {
          width: 1px;
          height: 32px;
          background: #07dd2b;
          animation: cases-hint-pulse 1.6s ease-in-out infinite;
        }
        @keyframes cases-hint-pulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.6); }
          50% { opacity: 1; transform: scaleY(1); }
        }

        /* ── Detail Panel ── */
        .cases-panel {
          position: absolute;
          left: 48px;
          bottom: 100px;
          max-width: 380px;
          z-index: 10;
          pointer-events: none;
        }
        .cases-panel-segment {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: #555;
          margin-bottom: 6px;
        }
        .cases-panel-headline {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          line-height: 1.3;
          margin-bottom: 10px;
        }
        .cases-panel-desc {
          font-size: 13px;
          color: #555;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .cases-metrics-row {
          display: flex;
          gap: 28px;
          margin-bottom: 18px;
        }
        .cases-metric {
          display: flex;
          flex-direction: column;
        }
        .cases-metric-value {
          font-family: 'Space Mono', monospace;
          font-size: 22px;
          font-weight: 700;
          color: #07dd2b;
        }
        .cases-metric-label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          text-transform: uppercase;
          color: #555;
          margin-top: 2px;
          letter-spacing: 0.08em;
        }
        .cases-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 20px;
        }
        .cases-tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          color: #666;
          border: 1px solid #2a2a2a;
          padding: 3px 8px;
          display: inline-block;
        }
        .cases-cta {
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          color: #07dd2b;
          border: 1px solid #07dd2b44;
          background: transparent;
          padding: 10px 22px;
          cursor: pointer;
          transition: border-color 0.3s, background 0.3s;
          pointer-events: auto;
        }
        .cases-cta:hover {
          border-color: #07dd2b;
          background: #07dd2b10;
        }
      `}</style>

      <section ref={sectionRef} className="cases-section hidden md:block">
        <div ref={wrapperRef} className="cases-wrapper">
          {/* Orbit / Carousel cards */}
          <div className="cases-orbit-container">
            {CASES.map((c, i) => (
              <div key={c.id}>
                <div
                  ref={(el) => (cardRefs.current[i] = el)}
                  className="cases-card"
                />
                <div
                  ref={(el) => (labelRefs.current[i] = el)}
                  className="cases-card-label"
                >
                  {c.client} · {c.headline}
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next buttons */}
          <div ref={navRef} className="cases-nav">
            <button className="cases-nav-btn" onClick={() => goTo(-1)} aria-label="Case anterior">
              ←
            </button>
            <button className="cases-nav-btn" onClick={() => goTo(1)} aria-label="Próximo case">
              →
            </button>
          </div>

          {/* HUD */}
          <div className="cases-hud">
            <div>
              <div className="cases-hud-title">
                Infraestrutura,<br />que virou resultado.
              </div>
              <div className="cases-hud-tag">[ CASES · SISTEMAS ATIVOS ]</div>
            </div>
          </div>

          <div ref={counterRef} className="cases-counter">CASE 01 / 0{N}</div>

          <div className="cases-pips">
            {CASES.map((_, i) => (
              <div key={i} ref={(el) => (pipsRef.current[i] = el)} className="cases-pip" />
            ))}
          </div>

          <div ref={hintRef} className="cases-hint">
            <span className="cases-hint-text">SCROLL ↓</span>
            <div className="cases-hint-line" />
          </div>

          {/* Detail panel */}
          <div ref={panelRef} className="cases-panel">
            <p className="cases-panel-segment" data-segment>{CASES[0].segment}</p>
            <h3 className="cases-panel-headline" data-headline>{CASES[0].headline}</h3>
            <p className="cases-panel-desc" data-desc>{CASES[0].description}</p>
            <div className="cases-metrics-row" data-metrics>
              {CASES[0].metrics.map((m) => (
                <div className="cases-metric" key={m.label}>
                  <span className="cases-metric-value">{m.prefix}{m.value.toLocaleString()}{m.suffix}</span>
                  <p className="cases-metric-label">{m.label}</p>
                </div>
              ))}
            </div>
            <div className="cases-tags-row" data-tags>
              {CASES[0].tags.map((t) => (
                <span className="cases-tag" key={t}>{t}</span>
              ))}
            </div>
            <button className="cases-cta">Ver case completo →</button>
          </div>
        </div>
      </section>
    </>
  )
}
