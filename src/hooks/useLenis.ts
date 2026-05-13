import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import usePrefersReducedMotion from './usePrefersReducedMotion'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance: Lenis | null = null

export default function useLenis() {
  const prefersReducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReducedMotion) {
      window.__lenis = null
      return
    }

    if (lenisInstance) {
      window.__lenis = lenisInstance
      return
    }

    lenisInstance = new Lenis({
      duration: 1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.2,
      wheelMultiplier: 0.8,
      infinite: false,
    })

    lenisInstance.on('scroll', () => ScrollTrigger.update())

    const tickerCallback = (time: number) => {
      lenisInstance?.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)
    window.__lenis = lenisInstance

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenisInstance?.destroy()
      lenisInstance = null
      window.__lenis = null
    }
  }, [prefersReducedMotion])
}
