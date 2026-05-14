import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Carousel3D from './Carousel3D'

interface CarouselCanvasProps {
  scrollProgressRef: React.MutableRefObject<number>
  onCardClick: (value: unknown) => void
  interactive3DRef: React.MutableRefObject<boolean>
}

export default function CarouselCanvas({
  scrollProgressRef,
  onCardClick,
  interactive3DRef,
}: CarouselCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [active, setActive] = useState(false)

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
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        frameloop={active ? 'always' : 'demand'}
        resize={{ scroll: false }}
        camera={{ fov: 60, near: 1, far: 20000, position: [0, 4000, 8000] }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ position: 'absolute', inset: 0 }}
        performance={{ min: 0.5 }}
      >
        <fog attach="fog" args={['#040507', 0, 100000]} />
        <Suspense fallback={null}>
          <Carousel3D
            scrollProgressRef={scrollProgressRef}
            onCardClick={onCardClick}
            interactive3DRef={interactive3DRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}
