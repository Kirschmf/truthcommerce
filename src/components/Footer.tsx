import { useCallback, useRef, type MouseEvent, type ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PRIMARY_CONTACT_HREF, SITE_CONTACT } from '../config/site'
import type { NavLinkItem } from '../types/site'

gsap.registerPlugin(ScrollTrigger)

const logo = '/assets/images/Logo Branca.png'

function scrollToTarget(href: string) {
  if (!href.startsWith('#')) return false

  if (window.__lenis) {
    window.__lenis.scrollTo(href, {
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    return true
  }

  const target = document.querySelector<HTMLElement>(href)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    return true
  }

  return false
}

function scrollToTop() {
  if (window.__lenis) {
    window.__lenis.scrollTo(0, { immediate: true })
  } else {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }
}

function MagneticButton({ href, children }: { href: string; children: ReactNode }) {
  const btnRef = useRef<HTMLAnchorElement | null>(null)
  const fillRef = useRef<HTMLSpanElement | null>(null)
  const textRef = useRef<HTMLSpanElement | null>(null)

  useGSAP(() => {
    gsap.set(fillRef.current, {
      xPercent: -50,
      yPercent: -50,
      scale: 0,
      width: 0,
      height: 0,
    })
  }, { scope: btnRef })

  const handleEnter = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current || !fillRef.current || !textRef.current) return

    const rect = btnRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const size = Math.max(rect.width, rect.height) * 2.6

    gsap.killTweensOf([fillRef.current, textRef.current, btnRef.current])
    gsap.set(fillRef.current, { width: size, height: size, left: x, top: y, scale: 0 })
    gsap.to(fillRef.current, { scale: 1, duration: 1.8, ease: 'power2.out' })
    gsap.to(textRef.current, { color: '#ffffff', duration: 1, ease: 'power2.out' })
    gsap.to(btnRef.current, { y: -3, duration: 0.6, ease: 'power3.out' })
  }, [])

  const handleLeave = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (!btnRef.current || !fillRef.current || !textRef.current) return

    const rect = btnRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    gsap.killTweensOf([fillRef.current, textRef.current, btnRef.current])
    gsap.set(fillRef.current, { left: x, top: y })
    gsap.to(fillRef.current, { scale: 0, duration: 0.85, ease: 'expo.in' })
    gsap.to(textRef.current, { color: '#050505', duration: 0.45, ease: 'power2.in' })
    gsap.to(btnRef.current, { y: 0, duration: 0.6, ease: 'power3.out' })
  }, [])

  return (
    <a
      ref={btnRef}
      href={href}
      target={href.startsWith('https://') ? '_blank' : undefined}
      rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group relative inline-flex items-center gap-3 px-12 py-5 md:px-16 md:py-[26px] bg-[#EBEBEB] text-[15px] md:text-base font-medium tracking-[0.01em] rounded-full overflow-hidden shadow-[0_10px_28px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.05)] hover:shadow-[0_20px_50px_rgba(7,221,43,0.45),0_0_0_1px_rgba(7,221,43,0.55)] transition-shadow duration-[900ms] ease-out"
    >
      <span ref={fillRef} className="pointer-events-none absolute rounded-full" style={{ backgroundColor: 'var(--green)' }} aria-hidden="true" />
      <span ref={textRef} className="relative z-[1] inline-flex items-center gap-3" style={{ color: '#050505' }}>
        {children}
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  )
}

function StatusDot() {
  return (
    <span className="relative inline-flex h-2 w-2 shrink-0">
      <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--green)] opacity-60 animate-ping" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--green)]" />
    </span>
  )
}

function CornerBrackets() {
  const base = 'absolute w-3 h-3 md:w-4 md:h-4 border-white/25'
  return (
    <>
      <span className={`${base} top-0 left-0 border-l border-t`} aria-hidden="true" />
      <span className={`${base} top-0 right-0 border-r border-t`} aria-hidden="true" />
      <span className={`${base} bottom-0 left-0 border-l border-b`} aria-hidden="true" />
      <span className={`${base} bottom-0 right-0 border-r border-b`} aria-hidden="true" />
    </>
  )
}

function SocialButton({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="group relative flex items-center justify-center w-11 h-11 rounded-full border border-white/15 text-text-muted hover:border-[var(--green)] hover:text-[var(--green)] transition-colors duration-300"
    >
      {children}
    </a>
  )
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8h4.56v14H.22V8zm7.5 0h4.37v1.92h.06c.61-1.15 2.1-2.36 4.32-2.36 4.62 0 5.47 3.04 5.47 7v7.44h-4.56v-6.6c0-1.57-.03-3.6-2.2-3.6-2.2 0-2.54 1.72-2.54 3.49V22H7.72V8z" />
    </svg>
  )
}

interface FooterProps {
  navLinks: NavLinkItem[]
  onNavigate: (href: string) => void
  currentPath: string
}

export default function Footer({ navLinks, onNavigate, currentPath }: FooterProps) {
  const sectionRef = useRef<HTMLElement | null>(null)

  const footerCols: Array<{ index: string; title: string; links: NavLinkItem[] }> = [
    {
      index: '01',
      title: 'SISTEMAS',
      links: [
        { label: 'Setup E-commerce', href: '/nossos-servicos' },
        { label: 'Expansão Marketplaces', href: '/nossos-servicos' },
        { label: 'Integração ERP/PDV', href: '/nossos-servicos' },
        { label: 'PIM (Catálogo)', href: '/nossos-servicos' },
      ],
    },
    { index: '02', title: 'EMPRESA', links: navLinks },
    {
      index: '03',
      title: 'CONEXÃO',
      links: [
        { label: 'WhatsApp', href: PRIMARY_CONTACT_HREF, external: PRIMARY_CONTACT_HREF.startsWith('https://') },
        { label: 'Instagram', href: SITE_CONTACT.instagramUrl, external: true },
        { label: 'LinkedIn', href: SITE_CONTACT.linkedinUrl, external: true },
      ],
    },
  ]

  const handleLinkClick = useCallback((link: NavLinkItem) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (link.external) return

    if (link.href.startsWith('#')) {
      event.preventDefault()
      scrollToTarget(link.href)
      return
    }

    if (link.href.startsWith('mailto:')) {
      return
    }

    event.preventDefault()
    if (link.href === currentPath) {
      scrollToTop()
      return
    }
    onNavigate(link.href)
  }, [currentPath, onNavigate])

  useGSAP(() => {
    const elements = sectionRef.current?.querySelectorAll('.reveal')
    if (!elements || elements.length === 0) return

    gsap.from(elements, {
      y: 30,
      opacity: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        once: true,
      },
    })
  }, { scope: sectionRef })

  return (
    <footer id="footer" ref={sectionRef} className="relative w-full px-[5%] pt-12 md:pt-20 pb-8 border-t border-white/[0.06]">
      <div className="max-w-[1280px] mx-auto">
        

        <div className="reveal relative text-center my-14 md:my-24 px-6 sm:px-10 md:px-12 py-12 md:py-20">
          <CornerBrackets />
          <div className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-[var(--green)] mb-5 md:mb-6">▸ Próximo Passo</div>
          <h2 className="font-heading text-[clamp(1.6rem,5.5vw,2.4rem)] md:text-[clamp(2rem,3.4vw,3.2rem)] font-semibold leading-[1.15] tracking-[-0.02em] mb-5 md:mb-6">
            Sua empresa tem a base certa para <span className="accent">decolar?</span>
          </h2>
          <p className="text-text-muted text-[clamp(1rem,3.6vw,1.1rem)] md:text-[clamp(1.1rem,1.3vw,1.2rem)] leading-[1.65] max-w-[560px] mx-auto mb-9 md:mb-11">
            Seja para dar o primeiro passo na internet ou organizar uma operação que já roda. Pare de perder vendas por desorganização técnica.
          </p>
          <MagneticButton href={PRIMARY_CONTACT_HREF}>Iniciar Diagnóstico</MagneticButton>
        </div>

        <div className="reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr] gap-12 lg:gap-10 pt-10 md:pt-14 pb-10 md:pb-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="flex items-baseline gap-2 font-mono text-[12px] uppercase tracking-[0.18em] mb-5">
              <span className="text-[var(--green)]">00</span>
              <span className="text-text-muted/50">/</span>
              <span className="text-text-main">Designação</span>
            </h4>
            <p className="text-text-muted text-[14px] md:text-[15px] leading-[1.7] max-w-[340px] mb-7">
              A infraestrutura técnica por trás das marcas que escalam com segurança, sem quebrar a operação no meio do caminho.
            </p>

            <ul className="flex flex-col gap-2.5 list-none m-0 p-0 mb-7">
              <li>
                <a href={`mailto:${SITE_CONTACT.email}`} className="inline-flex items-center gap-2 font-mono text-[13px] text-text-muted hover:text-text-main transition-colors">
                  <span className="text-[var(--green)]">▸</span>
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li>
                <a href={PRIMARY_CONTACT_HREF} target={PRIMARY_CONTACT_HREF.startsWith('https://') ? '_blank' : undefined} rel={PRIMARY_CONTACT_HREF.startsWith('https://') ? 'noopener noreferrer' : undefined} className="inline-flex items-center gap-2 font-mono text-[13px] text-text-muted hover:text-text-main transition-colors">
                  <span className="text-[var(--green)]">▸</span>
                  Falar no WhatsApp
                </a>
              </li>
            </ul>

            <div className="flex items-center gap-3">
              <SocialButton href={SITE_CONTACT.instagramUrl} label="Instagram"><InstagramIcon /></SocialButton>
              <SocialButton href={SITE_CONTACT.linkedinUrl} label="LinkedIn"><LinkedInIcon /></SocialButton>
            </div>
          </div>

          {footerCols.map((column) => (
            <div key={column.title}>
              <h4 className="flex items-baseline gap-2 font-mono text-[12px] uppercase tracking-[0.18em] mb-5">
                <span className="text-[var(--green)]">{column.index}</span>
                <span className="text-text-muted/50">/</span>
                <span className="text-text-main">{column.title}</span>
              </h4>
              <ul className="flex flex-col gap-3 list-none m-0 p-0">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      onClick={handleLinkClick(link)}
                      className="group inline-flex items-center text-text-muted text-[14px] md:text-[15px] hover:text-text-main transition-colors duration-200"
                    >
                      <span className="inline-block w-0 group-hover:w-4 overflow-hidden text-[var(--green)] transition-[width] duration-300 whitespace-nowrap">→&nbsp;</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="reveal flex justify-center px-2 py-10 md:py-16">
          <img src={logo} alt="Truth Commerce" className="w-full max-w-[200px] md:max-w-[230px] h-auto opacity-95" />
        </div>

        <div className="reveal flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 pt-6 md:pt-8 border-t border-white/[0.06] font-mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-text-muted/70">
          <p className="m-0 text-center">© 2026 Truth Commerce — todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  )
}
