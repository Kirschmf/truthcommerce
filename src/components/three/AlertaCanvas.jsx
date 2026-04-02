import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import AstronautCloud from './AstronautCloud'

export default function AlertaCanvas() {
  return (
    <div className="absolute left-0 top-0 w-[50%] h-full pointer-events-none hidden md:block">
      <Canvas
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
