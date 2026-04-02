import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenisInstance = null

export default function useLenis() {
  useEffect(() => {
    if (lenisInstance) return

    lenisInstance = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8,
      smoothTouch: false,
      touchMultiplier: 1.5,
      infinite: false,
      lerp: 0.1,
    })

    lenisInstance.on('scroll', ScrollTrigger.update)

    const tickerCallback = (time) => {
      if (lenisInstance) lenisInstance.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    window.__lenis = lenisInstance

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenisInstance.destroy()
      lenisInstance = null
      window.__lenis = null
    }
  }, [])
}
