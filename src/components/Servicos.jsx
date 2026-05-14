import { useRef, useState, useCallback } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PILARES = [
  {
    title: 'Infraestrutura Marketplaces',
    desc: 'Configuração completa e integração com os maiores marketplaces do país, do cadastro à operação logística',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Arquitetura de E-commerce',
    desc: 'Estrutura técnica para lojas virtuais próprias de alta performance, do ERP à vitrine digital',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Identidade & Posicionamento',
    desc: 'Catálogo padronizado, identidade visual coesa e posicionamento estratégico em cada canal de venda',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
  },
  {
    title: 'Capacitação Operacional',
    desc: 'Treinamento e documentação para que sua equipe opere a estrutura com total autonomia e segurança',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop',
  },
]

const TOTAL = String(PILARES.length).padStart(2, '0')

export default function Servicos() {
  const sectionRef = useRef(null)
  const imageContainerRef = useRef(null)
  const imageRefs = useRef([])
  const itemRefs = useRef([])
  const lineRefs = useRef([])
  const descRefs = useRef([])
  const badgeRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)

  const handlePilarEnter = useCallback((index) => {
    if (index === activeRef.current) return
    const prev = activeRef.current
    activeRef.current = index
    setActiveIndex(index)

    // 1. Image crossfade with subtle scale
    imageRefs.current.forEach((img, i) => {
      if (i === index) {
        gsap.set(img, { zIndex: 2 })
        gsap.fromTo(img,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
        )
      } else if (i === prev) {
        gsap.to(img, { opacity: 0, duration: 0.4, zIndex: 1, overwrite: 'auto' })
      } else {
        gsap.set(img, { opacity: 0, zIndex: 0 })
      }
    })

    // 2. Active item text
    gsap.to(itemRefs.current[index], {
      color: '#ffffff',
      x: 8,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    // 3. Active description
    gsap.to(descRefs.current[index], {
      opacity: 1,
      y: 0,
      height: 'auto',
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    // 4. Inactive items
    itemRefs.current.forEach((item, i) => {
      if (i === index || !item) return
      gsap.to(item, {
        color: '#2a2a2a',
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    // 5. Inactive descriptions
    descRefs.current.forEach((desc, i) => {
      if (i === index || !desc) return
      gsap.to(desc, {
        opacity: 0,
        y: 8,
        height: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    // 6. Green line on active
    lineRefs.current.forEach((line, i) => {
      if (!line) return
      if (i === index) {
        gsap.fromTo(line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'left', overwrite: 'auto' }
        )
      } else {
        gsap.to(line, { scaleX: 0, duration: 0.3, overwrite: 'auto' })
      }
    })

    // 7. Badge text
    if (badgeRef.current) {
      badgeRef.current.textContent = `${String(index + 1).padStart(2, '0')} / ${TOTAL}`
    }
  }, [])

  // Section entrance + set initial state
  useGSAP(() => {
    // Set initial states for images
    imageRefs.current.forEach((img, i) => {
      if (!img) return
      if (i === 0) {
        gsap.set(img, { opacity: 1, scale: 1, zIndex: 2 })
      } else {
        gsap.set(img, { opacity: 0, scale: 1.05, zIndex: 0 })
      }
    })

    // Set initial states for items
    itemRefs.current.forEach((item, i) => {
      if (!item) return
      gsap.set(item, { color: i === 0 ? '#ffffff' : '#2a2a2a', x: i === 0 ? 8 : 0 })
    })

    // Set initial states for descriptions
    descRefs.current.forEach((desc, i) => {
      if (!desc) return
      if (i === 0) {
        gsap.set(desc, { opacity: 1, y: 0, height: 'auto' })
      } else {
        gsap.set(desc, { opacity: 0, y: 8, height: 0 })
      }
    })

    // Set initial green line
    lineRefs.current.forEach((line, i) => {
      if (!line) return
      gsap.set(line, { scaleX: i === 0 ? 1 : 0, transformOrigin: 'left' })
    })

    // Eyebrow entrance
    const eyebrow = sectionRef.current.querySelector('.pilares-eyebrow')
    gsap.from(eyebrow, {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
      },
    })

    // List items stagger entrance
    const listItems = sectionRef.current.querySelectorAll('.pilar-item')
    gsap.from(listItems, {
      opacity: 0,
      y: 60,
      stagger: 0.08,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
      },
    })

    // Image container entrance
    if (imageContainerRef.current) {
      gsap.from(imageContainerRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          once: true,
        },
      })
    }
  }, { scope: sectionRef })

  return (
    <section id="servicos" ref={sectionRef} className="pilares-section w-full px-[5%] py-20 md:py-32">
      <div className="max-w-[1100px] mx-auto">

        <span className="pilares-eyebrow">
          NOSSOS PILARES
        </span>

        <div className="pilares-grid">

          {/* Left — Image */}
          <div className="pilares-image-col">
            <div ref={imageContainerRef} className="pilares-image-container">
              {PILARES.map((pilar, i) => (
                <img
                  key={pilar.title}
                  ref={(el) => { imageRefs.current[i] = el }}
                  src={pilar.image}
                  alt={pilar.title}
                  className="pilares-image"
                  loading="lazy"
                />
              ))}

              {/* Badge */}
              <div className="pilares-badge">
                <span ref={badgeRef}>01 / {TOTAL}</span>
              </div>
            </div>
          </div>

          {/* Right — List */}
          <div className="pilares-list">
            {PILARES.map((pilar, i) => (
              <div
                key={pilar.title}
                className={`pilar-item ${activeIndex === i ? 'is-active' : ''}`}
                onMouseEnter={() => handlePilarEnter(i)}
              >
                <div className="pilar-number">
                  {String(i + 1).padStart(2, '0')}
                </div>

                <div className="pilar-content">
                  <div className="pilar-title-row">
                    <h3
                      ref={(el) => { itemRefs.current[i] = el }}
                      className="pilar-title"
                    >
                      {pilar.title}
                    </h3>
                    <span className="pilar-arrow">→</span>
                  </div>

                  <div
                    ref={(el) => { descRefs.current[i] = el }}
                    className="pilar-desc"
                  >
                    <p>{pilar.desc}</p>
                  </div>
                </div>

                {/* Bottom line */}
                <div className="pilar-border" />
                <div
                  ref={(el) => { lineRefs.current[i] = el }}
                  className="pilar-line-green"
                />

                {/* Mobile image (accordion) */}
                <div className={`pilar-mobile-image ${activeIndex === i ? 'is-open' : ''}`}>
                  <img
                    src={pilar.image}
                    alt={pilar.title}
                    className="pilar-mobile-img"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}
