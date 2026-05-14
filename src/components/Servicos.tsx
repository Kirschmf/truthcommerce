import { useCallback, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Pilar {
  title: string
  desc: string
  image: string
}

const PILARES: Pilar[] = [
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
  const sectionRef = useRef<HTMLElement | null>(null)
  const imageContainerRef = useRef<HTMLDivElement | null>(null)
  const imageRefs = useRef<Array<HTMLImageElement | null>>([])
  const itemRefs = useRef<Array<HTMLHeadingElement | null>>([])
  const lineRefs = useRef<Array<HTMLDivElement | null>>([])
  const descRefs = useRef<Array<HTMLDivElement | null>>([])
  const badgeRef = useRef<HTMLSpanElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const activeRef = useRef(0)

  const handlePilarEnter = useCallback((index: number) => {
    if (index === activeRef.current) return
    const previous = activeRef.current
    activeRef.current = index
    setActiveIndex(index)

    imageRefs.current.forEach((image, currentIndex) => {
      if (!image) return
      if (currentIndex === index) {
        gsap.set(image, { zIndex: 2 })
        gsap.fromTo(
          image,
          { opacity: 0, scale: 1.05 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' },
        )
      } else if (currentIndex === previous) {
        gsap.to(image, { opacity: 0, duration: 0.4, zIndex: 1, overwrite: 'auto' })
      } else {
        gsap.set(image, { opacity: 0, zIndex: 0 })
      }
    })

    const activeItem = itemRefs.current[index]
    if (activeItem) {
      gsap.to(activeItem, {
        color: '#ffffff',
        x: 8,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    const activeDesc = descRefs.current[index]
    if (activeDesc) {
      gsap.to(activeDesc, {
        opacity: 1,
        y: 0,
        height: 'auto',
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    }

    itemRefs.current.forEach((item, currentIndex) => {
      if (!item || currentIndex === index) return
      gsap.to(item, {
        color: '#2a2a2a',
        x: 0,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    descRefs.current.forEach((desc, currentIndex) => {
      if (!desc || currentIndex === index) return
      gsap.to(desc, {
        opacity: 0,
        y: 8,
        height: 0,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    lineRefs.current.forEach((line, currentIndex) => {
      if (!line) return
      if (currentIndex === index) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.5, ease: 'power3.out', transformOrigin: 'left', overwrite: 'auto' },
        )
      } else {
        gsap.to(line, { scaleX: 0, duration: 0.3, overwrite: 'auto' })
      }
    })

    if (badgeRef.current) {
      badgeRef.current.textContent = `${String(index + 1).padStart(2, '0')} / ${TOTAL}`
    }
  }, [])

  useGSAP(() => {
    imageRefs.current.forEach((image, index) => {
      if (!image) return
      if (index === 0) {
        gsap.set(image, { opacity: 1, scale: 1, zIndex: 2 })
      } else {
        gsap.set(image, { opacity: 0, scale: 1.05, zIndex: 0 })
      }
    })

    itemRefs.current.forEach((item, index) => {
      if (!item) return
      gsap.set(item, { color: index === 0 ? '#ffffff' : '#2a2a2a', x: index === 0 ? 8 : 0 })
    })

    descRefs.current.forEach((desc, index) => {
      if (!desc) return
      if (index === 0) {
        gsap.set(desc, { opacity: 1, y: 0, height: 'auto' })
      } else {
        gsap.set(desc, { opacity: 0, y: 8, height: 0 })
      }
    })

    lineRefs.current.forEach((line, index) => {
      if (!line) return
      gsap.set(line, { scaleX: index === 0 ? 1 : 0, transformOrigin: 'left' })
    })

    const eyebrow = sectionRef.current?.querySelector('.pilares-eyebrow')
    if (eyebrow) {
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
    }

    const listItems = sectionRef.current?.querySelectorAll('.pilar-item')
    if (listItems?.length) {
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
    }

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
        <span className="pilares-eyebrow">NOSSOS PILARES</span>

        <div className="pilares-grid">
          <div className="pilares-image-col">
            <div ref={imageContainerRef} className="pilares-image-container">
              {PILARES.map((pilar, index) => (
                <img
                  key={pilar.title}
                  ref={(element) => {
                    imageRefs.current[index] = element
                  }}
                  src={pilar.image}
                  alt={pilar.title}
                  className="pilares-image"
                  loading="lazy"
                />
              ))}

              <div className="pilares-badge">
                <span ref={badgeRef}>01 / {TOTAL}</span>
              </div>
            </div>
          </div>

          <div className="pilares-list">
            {PILARES.map((pilar, index) => (
              <div
                key={pilar.title}
                className={`pilar-item ${activeIndex === index ? 'is-active' : ''}`}
                onMouseEnter={() => handlePilarEnter(index)}
              >
                <div className="pilar-number">{String(index + 1).padStart(2, '0')}</div>

                <div className="pilar-content">
                  <div className="pilar-title-row">
                    <h3
                      ref={(element) => {
                        itemRefs.current[index] = element
                      }}
                      className="pilar-title"
                    >
                      {pilar.title}
                    </h3>
                    <span className="pilar-arrow">→</span>
                  </div>

                  <div
                    ref={(element) => {
                      descRefs.current[index] = element
                    }}
                    className="pilar-desc"
                  >
                    <p>{pilar.desc}</p>
                  </div>
                </div>

                <div className="pilar-border" />
                <div
                  ref={(element) => {
                    lineRefs.current[index] = element
                  }}
                  className="pilar-line-green"
                />

                <div className={`pilar-mobile-image ${activeIndex === index ? 'is-open' : ''}`}>
                  <img src={pilar.image} alt={pilar.title} className="pilar-mobile-img" loading="lazy" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
