import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import Carousel3D from './Carousel3D'

export default function CarouselCanvas({ scrollProgressRef, onCardClick, interactive3DRef }) {
  return (
    <Canvas
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
  )
}
