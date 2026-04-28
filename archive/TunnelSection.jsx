import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function TunnelSection() {
  const containerRef = useRef(null)
  const videoWrapRef = useRef(null)
  const videoRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 768px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      })

      // 0% → 60%: clip-path circle(15%) → circle(80%)
      tl.fromTo(
        videoWrapRef.current,
        { clipPath: 'circle(15% at 50% 50%)' },
        { clipPath: 'circle(80% at 50% 50%)', duration: 0.6, ease: 'none' },
        0
      )

      // 0% → 60%: video scale 1 → 1.15
      tl.fromTo(
        videoRef.current,
        { scale: 1 },
        { scale: 1.15, duration: 0.6, ease: 'none' },
        0
      )

      // 50% → 100%: clip-path → circle(75%), video scale settles at 1
      tl.to(
        videoWrapRef.current,
        { clipPath: 'circle(75% at 50% 50%)', duration: 0.5, ease: 'none' },
        0.5
      )
      tl.to(
        videoRef.current,
        { scale: 1, duration: 0.5, ease: 'none' },
        0.5
      )
    })

    mm.add('(max-width: 767px)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
        },
      })

      tl.fromTo(
        videoWrapRef.current,
        { clipPath: 'circle(10% at 50% 50%)' },
        { clipPath: 'circle(75% at 50% 50%)', duration: 1, ease: 'none' },
        0
      )
    })
  }, { scope: containerRef })

  return (
    <section id="tunnel" ref={containerRef} className="relative w-full" style={{ height: '300vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          ref={videoWrapRef}
          className="absolute inset-0"
          style={{ clipPath: 'circle(15% at 50% 50%)' }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src="/assets/videos/Space_Warp_Tunnel_Astronaut_Video.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </section>
  )
}
