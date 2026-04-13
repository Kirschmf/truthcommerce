import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createGlowTexture from './GlowTexture'
import sampleGLB from './sampleGLB'

gsap.registerPlugin(ScrollTrigger)

const N = 40000
const GREEN = new THREE.Color('#07dd2b')
const HOVER_RADIUS = 0.9
const PUSH_STRENGTH = 0.4
const TILT_Z = -Math.PI / 5.2

function isMobile() {
  return window.innerWidth <= 768
}

export default function ParticleCloud() {
  const pointsRef = useRef()
  const groupRef = useRef()
  const progressRef = useRef({
    entrance: 0,
    morph: 0,
  })
  const timeRef = useRef(0)
  const localMouseRef = useRef(new THREE.Vector3(-999, -999, 0))
  const hoveringRef = useRef(false)
  const { camera } = useThree()

  const rocketGltf = useGLTF('/assets/models/foguete.glb')
  const astronautGltf = useGLTF('/assets/models/astronaut.glb')

  const mobile = useMemo(() => isMobile(), [])

  // Rocket: right side with tilt
  const rocketPos3 = useMemo(() => (mobile ? [1.8, -2.8, 0] : [4.5, -0.6, 0]), [mobile])
  const rocketScale = useMemo(() => (mobile ? 1.0 : 1.6), [mobile])

  // Astronaut: left-center (same as the old AlertaCanvas placement)
  const astroPos3 = useMemo(() => (mobile ? [0, 0, 0] : [-3.5, 0, 0]), [mobile])
  const astroScale = useMemo(() => (mobile ? 0.9 : 1.4), [mobile])

  // Sample both models — sampleGLB normalizes both to height 5.5, centered at origin
  const { rocketShape, astronautShape, offsets, idlePhase, currentPos } = useMemo(() => {
    const rocketShape = sampleGLB(rocketGltf, N)
    const astronautShape = sampleGLB(astronautGltf, N)
    const offsets = new Float32Array(N * 3)
    const idlePhase = new Float32Array(N)
    const currentPos = new Float32Array(N * 3)

    for (let i = 0; i < N; i++) {
      const ix = i * 3
      idlePhase[i] = Math.random() * Math.PI * 2
      offsets[ix] = (Math.random() - 0.5) * 1.5
      offsets[ix + 1] = (Math.random() - 0.5) * 1.5
      offsets[ix + 2] = (Math.random() - 0.5) * 0.8

      currentPos[ix] = rocketShape[ix] + offsets[ix]
      currentPos[ix + 1] = rocketShape[ix + 1] + offsets[ix + 1]
      currentPos[ix + 2] = rocketShape[ix + 2] + offsets[ix + 2]
    }

    return { rocketShape, astronautShape, offsets, idlePhase, currentPos }
  }, [rocketGltf, astronautGltf])

  const initPositions = useMemo(() => Float32Array.from(currentPos), [currentPos])

  // Pre-baked colors for each shape
  const rocketColors = useMemo(() => {
    const c = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const ix = i * 3
      const ny = (rocketShape[ix + 1] + 2.75) / 5.5
      if (ny < 0.3) {
        const v = 1.0 + Math.random() * 0.5
        c[ix] = GREEN.r * v; c[ix + 1] = GREEN.g * v; c[ix + 2] = GREEN.b * v
      } else if (Math.random() < 0.15) {
        const v = 0.8 + Math.random() * 0.6
        c[ix] = GREEN.r * v; c[ix + 1] = GREEN.g * v; c[ix + 2] = GREEN.b * v
      } else {
        const w = 1.0 + Math.random() * 0.4
        c[ix] = w; c[ix + 1] = w; c[ix + 2] = w
      }
    }
    return c
  }, [rocketShape])

  const astronautColors = useMemo(() => {
    const c = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const ix = i * 3
      const ny = (astronautShape[ix + 1] + 2.75) / 5.5
      const rand = Math.random()
      if (ny > 0.65 && ny < 0.85 && rand > 0.3) {
        const v = 0.6 + Math.random() * 0.4
        c[ix] = GREEN.r * v; c[ix + 1] = GREEN.g * v; c[ix + 2] = GREEN.b * v
      } else if (rand < 0.08) {
        c[ix] = GREEN.r * 0.8; c[ix + 1] = GREEN.g * 0.8; c[ix + 2] = GREEN.b * 0.8
      } else {
        const w = 0.85 + Math.random() * 0.15
        c[ix] = w; c[ix + 1] = w; c[ix + 2] = w
      }
    }
    return c
  }, [astronautShape])

  const glowTexture = useMemo(() => createGlowTexture(), [])

  // Entrance animation
  useEffect(() => {
    gsap.to(progressRef.current, {
      entrance: 1,
      duration: 3.0,
      ease: 'power2.out',
      delay: 0.4,
    })
  }, [])

  // Scroll morph trigger
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '.hero-wrapper',
      start: 'top top',
      endTrigger: '#alerta',
      end: 'center center',
      scrub: 1.0,
      onUpdate: (self) => {
        progressRef.current.morph = self.progress
      },
    })
    return () => st.kill()
  }, [])

  // Mouse tracking
  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    const inv = new THREE.Matrix4()

    const onMove = (e) => {
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1
      ndc.y = -(e.clientY / window.innerHeight) * 2 + 1
      hoveringRef.current = true
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.ray.intersectPlane(plane, hit) && groupRef.current) {
        groupRef.current.updateMatrixWorld()
        inv.copy(groupRef.current.matrixWorld).invert()
        localMouseRef.current.copy(hit).applyMatrix4(inv)
      }
    }
    const onLeave = () => { hoveringRef.current = false }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [camera])

  // Render loop
  useFrame((_, delta) => {
    const pts = pointsRef.current
    const grp = groupRef.current
    if (!pts || !grp) return

    const ent = progressRef.current.entrance
    const morph = progressRef.current.morph

    const dt = Math.min(delta, 0.05)
    timeRef.current += dt
    const t = timeRef.current

    // Smoothstep for organic transition
    const sm = morph * morph * (3 - 2 * morph)
    const sim = 1.0 - sm

    // ── Group transform: lerp position, scale, rotation ──
    grp.position.set(
      rocketPos3[0] * sim + astroPos3[0] * sm,
      rocketPos3[1] * sim + astroPos3[1] * sm,
      rocketPos3[2] * sim + astroPos3[2] * sm,
    )

    const sc = rocketScale * sim + astroScale * sm
    grp.scale.set(sc, sc, sc)

    // Tilt fades out as we morph to astronaut
    grp.rotation.z = TILT_Z * sim
    grp.rotation.y = 0

    // ── Particle positions: lerp shapes + scatter at mid-morph ──
    const posAttr = pts.geometry.getAttribute('position')
    const posArr = posAttr.array
    const colAttr = pts.geometry.getAttribute('color')
    const colArr = colAttr.array

    const entranceScatter = 1.0 - ent
    // Scatter peaks at morph=0.5
    const morphScatter = Math.sin(sm * Math.PI) * 0.8

    const isHover = hoveringRef.current
    const mx = localMouseRef.current.x
    const my = localMouseRef.current.y
    const hoverRadSq = HOVER_RADIUS * HOVER_RADIUS

    const springFactor = Math.min(0.04 * 60 * dt, 1.0)

    for (let i = 0; i < N; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2
      const phase = idlePhase[i]

      // Breathing
      const bx = Math.sin(t * 0.5 + phase) * 0.004
      const by = Math.cos(t * 0.4 + phase * 1.3) * 0.004
      const bz = Math.sin(t * 0.3 + phase * 0.7) * 0.002

      // Lerp between rocket shape and astronaut shape (both centered, same height scale)
      const targetX = rocketShape[ix] * sim + astronautShape[ix] * sm + bx
      const targetY = rocketShape[iy] * sim + astronautShape[iy] * sm + by
      const targetZ = rocketShape[iz] * sim + astronautShape[iz] * sm + bz

      // Scatter during entrance or mid-morph
      const scatterAmt = Math.max(entranceScatter, morphScatter)
      const scX = offsets[ix] * scatterAmt * 8.0
      const scY = offsets[iy] * scatterAmt * 8.0
      const scZ = offsets[iz] * scatterAmt * 5.0

      const finalTx = targetX + scX
      const finalTy = targetY + scY
      const finalTz = targetZ + scZ

      let cx = currentPos[ix]
      let cy = currentPos[iy]
      let cz = currentPos[iz]

      // Mouse repulsion (only when settled)
      if (isHover && morphScatter < 0.3) {
        const ddx = cx - mx
        const ddy = cy - my
        const distSq = ddx * ddx + ddy * ddy
        if (distSq < hoverRadSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq)
          const f = (1.0 - dist / HOVER_RADIUS)
          const push = f * f * PUSH_STRENGTH
          cx += (ddx / dist) * push
          cy += (ddy / dist) * push
        }
      }

      // Spring toward target
      cx += (finalTx - cx) * springFactor
      cy += (finalTy - cy) * springFactor
      cz += (finalTz - cz) * springFactor

      currentPos[ix] = cx
      currentPos[iy] = cy
      currentPos[iz] = cz

      posArr[ix] = cx
      posArr[iy] = cy
      posArr[iz] = cz

      // Color interpolation
      colArr[ix] = rocketColors[ix] * sim + astronautColors[ix] * sm
      colArr[iy] = rocketColors[iy] * sim + astronautColors[iy] * sm
      colArr[iz] = rocketColors[iz] * sim + astronautColors[iz] * sm
    }

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true

    // Opacity
    pts.material.opacity = ent

    // Blending: aditivo no foguete, normal no astronauta
    const targetBlending = morph > 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending
    if (pts.material.blending !== targetBlending) {
      pts.material.blending = targetBlending
      pts.material.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef} position={rocketPos3} scale={rocketScale} rotation={[0, 0, TILT_Z]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={initPositions}
            count={N}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={Float32Array.from(rocketColors)}
            count={N}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          vertexColors
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          map={glowTexture}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

useGLTF.preload('/assets/models/foguete.glb')
useGLTF.preload('/assets/models/astronaut.glb')
