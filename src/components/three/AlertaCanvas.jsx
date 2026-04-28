import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import AstronautCloud from './AstronautCloud'

export default function AlertaCanvas() {
  const containerRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute left-0 top-0 w-[50%] h-full pointer-events-none hidden md:block"
    >
      <Canvas
        frameloop={active ? 'always' : 'demand'}
        camera={{ fov: 42, position: [0, 0, 15], near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'auto' }}
        performance={{ min: 0.5 }}
      >
        <Suspense fallback={null}>
          <AstronautCloud />
        </Suspense>
      </Canvas>
    </div>
  )
}
