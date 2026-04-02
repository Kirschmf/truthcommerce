import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
const logo = '/assets/images/Logo Branca.png'

const NAV_LINKS = [
  { label: 'Metodologia', href: '#metodo' },
  { label: 'Infraestrutura Ativa', href: '#projetos' },
  { label: 'Perguntas Frequentes', href: '#faq' },
]

const CTA_HREF = 'https://wa.me/SEUNUMEROAQUI'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  const openMenu = useCallback(() => {
    setMenuOpen(true)
    document.body.style.overflow = 'hidden'
  }, [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }, [])

  return (
    <>
      <header className="absolute top-0 left-0 w-full z-[1000] pt-4">
        <div className="max-w-[1300px] mx-auto px-[5%] h-[68px] flex items-center justify-between gap-8">

          {/* Logo */}
          <a href="#" className="flex items-center shrink-0">
            <img
              src={logo}
              alt="Truth Commerce"
              className="h-12 md:h-[64px] w-auto transition-opacity duration-200 hover:opacity-80"
            />
          </a>

          {/* Nav — hidden on mobile, visible md+ */}
          <nav className="hidden md:block">
            <ul className="flex items-center gap-9 list-none m-0 p-0">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="text-white/65 text-[13.5px] font-medium no-underline whitespace-nowrap transition-colors duration-200 hover:text-white"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {/* CTA — hidden on mobile */}
            <a
              href={CTA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 text-white text-[13px] font-medium px-[22px] py-2.5 rounded-full border border-white/55 no-underline whitespace-nowrap transition-all duration-250 hover:bg-white hover:text-black hover:border-white group"
            >
              Avaliar Estrutura
              <span className="transition-transform duration-250 group-hover:translate-x-[3px]">→</span>
            </a>

            {/* Hamburger — visible on mobile only */}
            <button
              onClick={openMenu}
              className="flex md:hidden flex-col justify-center gap-[5px] w-9 h-9 bg-transparent border-none cursor-pointer p-1"
              aria-label="Abrir menu"
            >
              <span className="block h-[1.5px] w-full bg-white rounded-sm" />
              <span className="block h-[1.5px] w-full bg-white rounded-sm" />
              <span className="block h-[1.5px] w-full bg-white rounded-sm" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[1001] bg-black flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-[6%] h-[68px] shrink-0 border-b border-white/[0.07]">
              <img src={logo} alt="Truth Commerce" className="h-11 w-auto" />
              <button
                onClick={closeMenu}
                className="bg-transparent border-none text-white text-[28px] leading-none cursor-pointer px-2 py-1 opacity-80 transition-opacity duration-200 hover:opacity-100"
                aria-label="Fechar menu"
              >
                ×
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-center px-[8%]">
              {NAV_LINKS.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-white text-[clamp(1.6rem,6vw,2.4rem)] font-medium leading-none py-[18px] border-b border-white/[0.07] no-underline transition-colors duration-200 hover:text-green"
                >
                  {label}
                </motion.a>
              ))}
            </nav>

            {/* Footer CTA */}
            <div className="px-[8%] py-7 shrink-0">
              <motion.a
                href={CTA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                initial={{ opacity: 0, y: 20 }}
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
