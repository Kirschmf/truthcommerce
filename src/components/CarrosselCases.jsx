import { useRef, useState, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import CarouselCanvas from './three/CarouselCanvas'

gsap.registerPlugin(ScrollTrigger)

/* ── Case data (used for mobile list) ────────────────────────── */
const CASES = [
  {
    id: '01',
    client: 'SOPY',
    segment: 'Moda & Vestuário',
    headline: '+340% de GMV em 6 meses',
    description: 'Migração completa de PDV físico para ecossistema digital. Integração ERP + 4 marketplaces simultâneos com catálogo unificado.',
    metrics: [
      { label: 'Crescimento GMV', value: 340, suffix: '%', prefix: '+' },
      { label: 'Marketplaces integrados', value: 4, suffix: '', prefix: '' },
      { label: 'Dias de implementação', value: 21, suffix: 'd', prefix: '' },
    ],
    tags: ['Shopify', 'Mercado Livre', 'ERP', 'Bling'],
    img: '/assets/images/sopy-print.png',
  },
  {
    id: '02',
    client: 'MP DISTRIBUIDORA',
    segment: 'Distribuição & Atacado',
    headline: '6 canais simultâneos ativos',
    description: 'Operação multi-canal unificada em hub central com automação total de pedidos e estoque.',
    metrics: [
      { label: 'Canais simultâneos', value: 6, suffix: '', prefix: '' },
      { label: 'Automação total', value: 100, suffix: '%', prefix: '' },
      { label: 'Setup em', value: 48, suffix: 'h', prefix: '' },
    ],
    tags: ['Hub', 'Magalu', 'TikTok Shop', 'Amazon'],
    img: '/assets/images/mp-print.png',
  },
  {
    id: '03',
    client: 'NEXT EVENTOS',
    segment: 'Eventos & Entretenimento',
    headline: 'Ruptura de estoque zerada',
    description: 'Integração sistêmica entre ERP legado e 3 plataformas com sincronização bidirecional em tempo real.',
    metrics: [
      { label: 'Ruptura de estoque', value: 0, suffix: '%', prefix: '' },
      { label: 'Sync em tempo real', value: 100, suffix: '%', prefix: '' },
      { label: 'Pedidos por mês', value: 1800, suffix: '+', prefix: '' },
    ],
    tags: ['ERP', 'B2B', 'Bling', 'Magalu'],
    img: '/assets/images/next-print.png',
  },
  {
    id: '04',
    client: 'JOHNNY COOKER',
    segment: 'Alimentação & Gastronomia',
    headline: '+218% de conversão',
    description: 'Reestruturação de catálogo, UX de checkout e integração com sistema de gestão próprio.',
    metrics: [
      { label: 'Aumento de conversão', value: 218, suffix: '%', prefix: '+' },
      { label: 'Ticket médio', value: 2, suffix: 'x', prefix: '' },
      { label: 'Prazo do projeto', value: 90, suffix: 'd', prefix: '' },
    ],
    tags: ['Nuvemshop', 'Analytics', 'CRO'],
    img: '/assets/images/johny-print.png',
  },
  {
    id: '05',
    client: 'HYPE KBEAUTY',
    segment: 'Beleza & Cosméticos',
    headline: '3.200 SKUs catalogados do zero',
    description: 'Arquitetura de catálogo com taxonomia técnica, tratamento de ativos visuais e integração multi-canal.',
    metrics: [
      { label: 'SKUs estruturados', value: 3200, suffix: '', prefix: '' },
      { label: 'Redução de erros', value: 94, suffix: '%', prefix: '-' },
      { label: 'Canais ativos', value: 6, suffix: '', prefix: '' },
    ],
    tags: ['Amazon', 'Shopee', 'PIM', 'Nuvemshop'],
    img: '/assets/images/kbeauty-print.png',
  },
  {
    id: '06',
    client: 'CAFE CARANDAI',
    segment: 'Alimentação & Café',
    headline: '+180% de receita online',
    description: 'Entrada no digital com estrutura completa: loja, logística, marketplaces e automação de pedidos.',
    metrics: [
      { label: 'Crescimento de receita', value: 180, suffix: '%', prefix: '+' },
      { label: 'Canais ativos', value: 3, suffix: '', prefix: '' },
      { label: 'Tempo de setup', value: 30, suffix: 'd', prefix: '' },
    ],
    tags: ['Shopify', 'iFood', 'Logística'],
    img: '/assets/images/cafe-print.png',
  },
]

/* ── Mobile fallback ─────────────────────────────────────────── */
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
              <div className="flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] font-mono px-2 py-1"
                    style={{ border: '1px solid #2a2a2a', color: '#666' }}
                  >
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
  const sectionRef        = useRef(null)
  const hudRef            = useRef(null)
  const scrollProgressRef = useRef(0)
  const [modal, setModal] = useState(null)
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
      start:   'top top',
      end:     '+=6000',
      pin:     true,
      scrub:   1,
      onUpdate(self) {
        scrollProgressRef.current = self.progress

        // Update HUD opacity: fade in on dive, stay visible, fade out on exit
        const p = self.progress
        let hud = 0
        if (p < 0.5) {
          const t = p * 2
          hud = t * t * (3 - 2 * t)       // smoothstep in
        } else if (p < 0.75) {
          hud = 1
        } else {
          const t = (p - 0.75) * 4
          hud = Math.max(0, 1 - t)         // linear out
        }
        if (hudRef.current) hudRef.current.style.opacity = hud
      },
    })
  }, { scope: sectionRef, dependencies: [isMobile] })

  if (isMobile) return <MobileCases />

  return (
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

        /* ── Modal ── */
        .carousel-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: rgba(4, 5, 7, 0.92);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
        }
        .carousel-modal-box {
          position: relative;
          max-width: 800px;
          width: 90vw;
          border: 1px solid #07dd2b44;
          background: #0a0a0a;
          padding: 32px;
        }
        .carousel-modal-close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          color: #555;
          font-size: 28px;
          cursor: pointer;
          line-height: 1;
          transition: color 0.2s;
        }
        .carousel-modal-close:hover { color: #fff; }
        .carousel-modal-img {
          width: 100%;
          aspect-ratio: 16 / 9;
          object-fit: cover;
          display: block;
          background: #0d0d0d;
          border: 1px solid #1e1e1e;
          margin-bottom: 20px;
        }
        .carousel-modal-title {
          font-family: 'Space Mono', monospace;
          font-size: 18px;
          color: #07dd2b;
          letter-spacing: 0.1em;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="carousel-section hidden md:block"
      >
        {/* Three.js canvas fills the section */}
        <CarouselCanvas
          scrollProgressRef={scrollProgressRef}
          onCardClick={setModal}
        />

        {/* HUD — title + label, fades in when camera dives into ring */}
        <div ref={hudRef} className="carousel-hud">
          <h2>Infraestrutura,<br />que virou resultado.</h2>
          <p>[ Cases · Sistemas Ativos ]</p>
        </div>
      </section>

      {/* Modal — rendered outside section so it overlays everything */}
      {modal && (
        <div
          className="carousel-modal-overlay"
          onClick={() => setModal(null)}
        >
          <div
            className="carousel-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="carousel-modal-close"
              onClick={() => setModal(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <img
              className="carousel-modal-img"
              src={modal.img}
              alt={modal.t}
              onError={(e) => { e.target.style.display = 'none' }}
            />
            <h2 className="carousel-modal-title">{modal.t}</h2>
          </div>
        </div>
      )}
    </>
  )
}
