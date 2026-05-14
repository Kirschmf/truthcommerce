import { useEffect, useRef, useState } from 'react'

interface LogoItem {
  src: string
  alt: string
  style: { height: number }
}

const LOGOS: LogoItem[] = [
  { src: '/assets/images/Amazon_logo.svg', alt: 'Amazon', style: { height: 36 } },
  { src: '/assets/images/Shopify_logo_2018.svg', alt: 'Shopify', style: { height: 44 } },
  { src: '/assets/images/mercadolivre_logo.svg', alt: 'Mercado Livre', style: { height: 40 } },
  { src: '/assets/images/Bling_logo.svg', alt: 'Bling', style: { height: 38 } },
  { src: '/assets/images/Nuvemshop-logo.png', alt: 'Nuvemshop', style: { height: 60 } },
  { src: '/assets/images/Shopee_logo.svg', alt: 'Shopee', style: { height: 70 } },
  { src: '/assets/images/magalu-logo.svg', alt: 'Magalu', style: { height: 130 } },
  { src: '/assets/images/tiktokshop_logo.svg', alt: 'TikTok Shop', style: { height: 36 } },
]

function LogoSet() {
  return LOGOS.map((logo) => (
    <div key={logo.alt} className="logo-marquee-item flex-shrink-0 flex items-center justify-center">
      <img src={logo.src} alt={logo.alt} style={logo.style} className="w-auto object-contain" />
    </div>
  ))
}

export default function LogoMarquee() {
  const setRef = useRef<HTMLDivElement | null>(null)
  const [setWidth, setSetWidth] = useState(0)

  useEffect(() => {
    if (!setRef.current) return

    const measure = () => {
      if (setRef.current) {
        setSetWidth(setRef.current.offsetWidth)
      }
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section className="w-full py-12 md:py-16 overflow-hidden">
      <p className="text-center text-text-muted text-[11px] md:text-xs font-medium uppercase tracking-[0.15em] mb-8 md:mb-10 px-[5%]">
        Arquitetura baseada em tecnologia de elite
      </p>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-bg-base to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-bg-base to-transparent z-10 pointer-events-none" />

        <div
          className="marquee-track flex items-center w-max"
          style={
            setWidth
              ? ({
                  animation: `marquee-scroll ${45}s linear infinite`,
                  '--set-width': `${setWidth}px`,
                } as React.CSSProperties)
              : undefined
          }
        >
          <div ref={setRef} className="flex items-center gap-16 flex-shrink-0 pr-16">
            <LogoSet />
          </div>
          <div className="flex items-center gap-16 flex-shrink-0 pr-16" aria-hidden="true">
            <LogoSet />
          </div>
          <div className="flex items-center gap-16 flex-shrink-0 pr-16" aria-hidden="true">
            <LogoSet />
          </div>
        </div>
      </div>

    </section>
  )
}
