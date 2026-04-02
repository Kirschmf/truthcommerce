import { useRef, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
const logo = '/assets/images/Logo Branca.png'

gsap.registerPlugin(ScrollTrigger)

const CTA_HREF = 'https://wa.me/SEUNUMEROAQUI'

const FOOTER_COLS = [
  {
    title: '/ Sistemas',
    links: [
      { label: 'Setup E-commerce', href: '#' },
      { label: 'Expansão Marketplaces', href: '#' },
      { label: 'Integração ERP/PDV', href: '#' },
      { label: 'PIM (Catálogo)', href: '#' },
    ],
  },
  {
    title: '/ A Empresa',
    links: [
      { label: 'Protocolo', href: '#metodo' },
      { label: 'Infraestrutura Ativa', href: '#projetos' },
      { label: 'Dados Técnicos', href: '#faq' },
    ],
  },
  {
    title: '/ Conexão',
    links: [
      { label: 'WhatsApp', href: CTA_HREF },
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
]

function MagneticButton({ href, children }) {
  const btnRef = useRef(null)
  const fillRef = useRef(null)
  const textRef = useRef(null)
  const tweenRef = useRef(null)

  const handleEnter = useCallback((e) => {
    const rect = btnRef.current.getBoundingClientRect()
    const fill = fillRef.current
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 2.5

    if (tweenRef.current) tweenRef.current.kill()

    gsap.set(fill, {
      width: size,
      height: size,
      left: x,
      top: y,
      xPercent: -50,
      yPercent: -50,
      scale: 0,
    })
    tweenRef.current = gsap.to(fill, {
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      overwrite: true,
    })
    gsap.to(textRef.current, {
      color: '#000000',
      duration: 0.5,
      ease: 'power2.out',
      overwrite: true,
    })
  }, [])

  const handleLeave = useCallback((e) => {
    const rect = btnRef.current.getBoundingClientRect()
    const fill = fillRef.current
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tweenRef.current) tweenRef.current.kill()

    gsap.set(fill, { left: x, top: y })
    tweenRef.current = gsap.to(fill, {
      scale: 0,
      duration: 0.6,
      ease: 'power3.in',
      overwrite: true,
    })
    gsap.to(textRef.current, {
      color: '#050505',
      duration: 0.4,
      ease: 'power2.in',
      overwrite: true,
    })
  }, [])

  return (
    <a
      ref={btnRef}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative inline-flex items-center justify-center px-10 py-4 md:px-12 md:py-[18px] bg-[#EBEBEB] text-[#050505] text-[13px] md:text-sm font-medium rounded-full border border-[#EBEBEB] tracking-[0.02em] overflow-hidden"
    >
      <span
        ref={fillRef}
        className="pointer-events-none absolute rounded-full"
        style={{ backgroundColor: 'var(--green)', transform: 'scale(0)' }}
      />
      <span ref={textRef} className="relative z-[1] text-[#050505]">
        {children}
      </span>
    </a>
  )
}

export default function Footer() {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const els = sectionRef.current.querySelectorAll('.reveal')

    gsap.from(els, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
      },
    })
  }, { scope: sectionRef })

  return (
    <footer id="footer" ref={sectionRef} className="w-full px-[5%] pt-20 md:pt-32 pb-8">
      <div className="max-w-[1100px] mx-auto">

        {/* CTA Block */}
        <div className="reveal text-center mb-20 md:mb-28">
          <h2 className="font-heading text-[clamp(1.5rem,5.5vw,2.4rem)] md:text-[clamp(1.8rem,3vw,2.8rem)] font-semibold leading-[1.2] tracking-[-0.02em] mb-4 md:mb-5">
            Sua empresa tem a base certa para{' '}
            <span className="accent">decolar?</span>
          </h2>
          <p className="text-text-muted text-[clamp(0.95rem,3.5vw,1.05rem)] md:text-[clamp(1.05rem,1.2vw,1.15rem)] leading-[1.65] max-w-[520px] mx-auto mb-8 md:mb-10">
            Seja para dar o primeiro passo na internet ou organizar uma operação que já roda.
            Pare de perder vendas por desorganização técnica.
          </p>
          <MagneticButton href={CTA_HREF}>
            Iniciar Diagnóstico
          </MagneticButton>
        </div>

        {/* Footer Grid */}
        <div className="reveal grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 md:gap-8 pb-12 md:pb-16 border-b border-white/[0.06]">

          {/* Brand */}
          <div>
            <img
              src={logo}
              alt="Truth Commerce"
              className="h-8 md:h-9 w-auto mb-4"
            />
            <p className="text-text-muted text-[13px] leading-[1.65] max-w-[280px]">
              A infraestrutura técnica por trás das marcas que escalam com segurança,
              sem quebrar a operação no meio do caminho.
            </p>
          </div>

          {/* Link Columns */}
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-[11px] text-text-muted uppercase tracking-[0.12em] mb-4">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-2.5 list-none m-0 p-0">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-text-muted text-[13px] no-underline hover:text-text-main transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Copyright */}
        <div className="reveal pt-6 md:pt-8">
          <p className="font-mono text-[11px] text-text-muted/60">
            © 2026 Truth Commerce.
          </p>
        </div>

      </div>
    </footer>
  )
}
