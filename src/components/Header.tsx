import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LEAD_BOOSTER_HREF, isLeadBoosterHref, openLeadBooster } from '../integrations/leadBooster'
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion'
import type { NavLinkItem } from '../types/site'

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

interface HeaderProps {
  navLinks: NavLinkItem[]
  onNavigate: (href: string) => void
  currentPath: string
}

export default function Header({ navLinks, onNavigate, currentPath }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
    triggerRef.current?.focus()
  }, [])

  const openMenu = useCallback(() => {
    setMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const dialog = overlayRef.current
    const focusableElements = dialog?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    const first = focusableElements?.[0]
    const last = focusableElements?.[focusableElements.length - 1]
    first?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
      }

      if (event.key === 'Tab' && first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [closeMenu, menuOpen])

  const handleNavigate = useCallback(
    (href: string, { close = false }: { close?: boolean } = {}) =>
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (close) {
          setMenuOpen(false)
          document.body.style.overflow = ''
        }

        if (isLeadBoosterHref(href)) {
          event.preventDefault()
          openLeadBooster()
          return
        }

        if (href.startsWith('#')) {
          event.preventDefault()
          scrollToTarget(href)
          return
        }

        if (href.startsWith('mailto:') || href.startsWith('https://')) {
          return
        }

        event.preventDefault()
        if (href === currentPath) {
          scrollToTop()
          return
        }
        onNavigate(href)
      },
    [currentPath, onNavigate],
  )

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-[1000] pt-4">
        <div className="max-w-[1300px] mx-auto px-[5%] h-[68px] flex items-center justify-between gap-8">
          <a href="/" onClick={handleNavigate('/')} className="flex items-center shrink-0">
            <img
              src={logo}
              alt="Truth Commerce"
              className="h-12 md:h-[64px] w-auto transition-opacity duration-200 hover:opacity-80"
            />
          </a>

          <nav aria-label="Principal" className="hidden md:block">
            <ul className="flex items-center gap-9 list-none m-0 p-0">
              {navLinks.map(({ label, href }) => (
                <li key={`${label}-${href}`}>
                  <a
                    href={href}
                    onClick={handleNavigate(href)}
                    className="text-white/65 text-[13.5px] font-medium no-underline whitespace-nowrap transition-colors duration-200 hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href={LEAD_BOOSTER_HREF}
              onClick={handleNavigate(LEAD_BOOSTER_HREF)}
              className="hidden md:inline-flex items-center gap-2 text-white text-[13px] font-medium px-[22px] py-2.5 rounded-full border border-white/55 no-underline whitespace-nowrap transition-all duration-250 hover:bg-white hover:text-black hover:border-white group"
            >
              Avaliar Estrutura
              <span className="transition-transform duration-250 group-hover:translate-x-[3px]">→</span>
            </a>

            <button
              ref={triggerRef}
              type="button"
              onClick={openMenu}
              className="flex md:hidden flex-col justify-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer p-1"
              aria-label="Abrir menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              <span className="block h-[1.5px] w-full bg-white rounded-sm" />
              <span className="block h-[1.5px] w-full bg-white rounded-sm" />
              <span className="block h-[1.5px] w-full bg-white rounded-sm" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            id="mobile-navigation"
            initial={prefersReducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            {...(!prefersReducedMotion ? { exit: { opacity: 0 } } : {})}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1001] bg-black flex flex-col"
          >
            <div className="flex items-center justify-between px-[6%] h-[68px] shrink-0 border-b border-white/[0.07]">
              <a href="/" onClick={handleNavigate('/', { close: true })}>
                <img src={logo} alt="Truth Commerce" className="h-11 w-auto" />
              </a>
              <button
                type="button"
                onClick={closeMenu}
                className="bg-transparent border-none text-white text-[28px] leading-none cursor-pointer px-2 py-1 opacity-80 transition-opacity duration-200 hover:opacity-100"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>

            <nav className="flex-1 flex flex-col justify-center px-[8%]" aria-label="Principal mobile">
              {navLinks.map(({ label, href }, index) => (
                <motion.a
                  key={`${label}-${href}`}
                  href={href}
                  onClick={handleNavigate(href, { close: true })}
                  initial={prefersReducedMotion ? false : { opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-white text-[clamp(1.6rem,6vw,2.4rem)] font-medium leading-none py-[18px] border-b border-white/[0.07] no-underline transition-colors duration-200 hover:text-green"
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            <div className="px-[8%] py-7 shrink-0">
              <motion.a
                href={LEAD_BOOSTER_HREF}
                onClick={handleNavigate(LEAD_BOOSTER_HREF, { close: true })}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 text-white text-sm font-medium px-7 py-3.5 rounded-full border border-white/50 no-underline transition-all duration-250 hover:bg-white hover:text-black"
              >
                Avaliar Estrutura <span>→</span>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
