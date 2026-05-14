import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import ParticleCloud from './ParticleCloud'

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(true)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(([entry]) => {
      if (entry) {
        setActive(entry.isIntersecting)
      }
    }, { threshold: 0.05 })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 w-full pointer-events-none z-0" style={{ height: '200vh' }}>
      <div className="sticky top-0 w-full h-screen">
        <Canvas
          frameloop={active ? 'always' : 'demand'}
          resize={{ scroll: false }}
          camera={{ fov: 42, position: [0, 0, 15], near: 0.1, far: 100 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
          style={{ pointerEvents: 'auto' }}
          performance={{ min: 0.5 }}
        >
          <Suspense fallback={null}>
            <ParticleCloud />
          </Suspense>
        </Canvas>
      </div>
    </div>
  )
}
