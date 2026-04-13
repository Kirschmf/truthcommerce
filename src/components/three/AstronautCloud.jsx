import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createGlowTexture from './GlowTexture'
import sampleGLB from './sampleGLB'

gsap.registerPlugin(ScrollTrigger)

const N = 50000
const HOVER_RADIUS = 0.35
const PUSH_STRENGTH = 0.25
const GREEN = new THREE.Color('#07dd2b')

function isMobile() {
  return window.innerWidth <= 768
}

export default function AstronautCloud() {
  const groupRef = useRef()
  const pointsRef = useRef()
  // scrollVisibility: 0 = fully scattered/invisible, 1 = fully assembled/visible
  const progressRef = useRef({ scrollVisibility: 0 })
  const localMouseRef = useRef(new THREE.Vector3(-999, -999, 0))
  const hoveringRef = useRef(false)
  const timeRef = useRef(0)
  const { camera, gl } = useThree()

  const astronautGltf = useGLTF('/assets/models/astronaut.glb')

  const { astronautPos, currentPos, idlePhase, spawnOffsets } = useMemo(() => {
    const astronautPos = sampleGLB(astronautGltf, N)
    const currentPos = new Float32Array(N * 3)
    const idlePhase = new Float32Array(N)
    const spawnOffsets = new Float32Array(N * 3)

    for (let i = 0; i < N; i++) {
      const ix = i * 3
      idlePhase[i] = Math.random() * Math.PI * 2

      spawnOffsets[ix] = (Math.random() - 0.5) * 4
      spawnOffsets[ix + 1] = (Math.random() - 0.5) * 4
      spawnOffsets[ix + 2] = (Math.random() - 0.5) * 2

      currentPos[ix] = astronautPos[ix] + spawnOffsets[ix]
      currentPos[ix + 1] = astronautPos[ix + 1] + spawnOffsets[ix + 1]
      currentPos[ix + 2] = astronautPos[ix + 2] + spawnOffsets[ix + 2]
    }

    return { astronautPos, currentPos, idlePhase, spawnOffsets }
  }, [astronautGltf])

  const initColors = useMemo(() => {
    const c = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      const ix = i * 3
      const normalizedY = (astronautPos[ix + 1] + 2.75) / 5.5
      const rand = Math.random()
      if (normalizedY > 0.65 && normalizedY < 0.85 && rand > 0.3) {
        const intensity = 0.6 + Math.random() * 0.4
        c[ix] = GREEN.r * intensity
        c[ix + 1] = GREEN.g * intensity
        c[ix + 2] = GREEN.b * intensity
      } else if (rand < 0.08) {
        c[ix] = GREEN.r * 0.8
        c[ix + 1] = GREEN.g * 0.8
        c[ix + 2] = GREEN.b * 0.8
      } else {
        const w = 0.85 + Math.random() * 0.15
        c[ix] = w; c[ix + 1] = w; c[ix + 2] = w
      }
    }
    return c
  }, [astronautPos])

  const glowTexture = useMemo(() => createGlowTexture(), [])

  // Initial transform
  useEffect(() => {
    if (!groupRef.current) return
    const mobile = isMobile()
    const g = groupRef.current
    const s = mobile ? 0.9 : 1.4
    g.scale.set(s, s, s)
    g.position.set(0, 0, 0)

    if (pointsRef.current) {
      pointsRef.current.material.opacity = 0
    }
  }, [])

  // Scroll-driven entrance (assemble) + exit (scatter)
  useEffect(() => {
    // Entrance: assemble as section scrolls into view
    const stEnter = ScrollTrigger.create({
      trigger: '#alerta',
      start: 'top 95%',
      end: 'top 35%',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current.scrollVisibility = self.progress
      },
    })

    // Exit: scatter when section bottom approaches viewport top
    const stExit = ScrollTrigger.create({
      trigger: '#alerta',
      start: 'bottom 70%',
      end: 'bottom 15%',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current.scrollVisibility = 1 - self.progress
      },
    })

    return () => {
      stEnter.kill()
      stExit.kill()
    }
  }, [])

  // Mouse tracking — use canvas bounding rect for correct NDC
  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    const inv = new THREE.Matrix4()
    const canvas = gl.domElement

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      hoveringRef.current = true
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.ray.intersectPlane(plane, hit) && groupRef.current) {
        groupRef.current.updateMatrixWorld()
        inv.copy(groupRef.current.matrixWorld).invert()
        localMouseRef.current.copy(hit).applyMatrix4(inv)
      }
    }
    const onLeave = () => { hoveringRef.current = false }

    const container = canvas.parentElement
    container.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('mouseleave', onLeave)
    return () => {
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [camera, gl])

  // Render loop
  useFrame((_, delta) => {
    const pts = pointsRef.current
    if (!pts) return

    const vis = progressRef.current.scrollVisibility

    // Skip work when fully invisible
    if (vis <= 0.001) {
      pts.material.opacity = 0
      return
    }

    const geo = pts.geometry
    const dt = Math.min(delta, 0.05)
    timeRef.current += dt

    const isHover = hoveringRef.current
    const mx = localMouseRef.current.x
    const my = localMouseRef.current.y
    const t = timeRef.current

    const springFactor = Math.min(0.04 * 60 * dt, 1.0)

    const posAttr = geo.getAttribute('position')
    const posArr = posAttr.array
    const hoverRadSq = HOVER_RADIUS * HOVER_RADIUS

    // scatter = how much particles are dispersed (1 = fully scattered, 0 = assembled)
    const scatter = 1.0 - vis

    for (let i = 0; i < N; i++) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      // Target = astronaut shape + subtle breathing
      const bx = astronautPos[ix] + Math.sin(t * 0.5 + idlePhase[i]) * 0.005
      const by = astronautPos[iy] + Math.cos(t * 0.4 + idlePhase[i] * 1.3) * 0.005
      const bz = astronautPos[iz] + Math.sin(t * 0.3 + idlePhase[i] * 0.7) * 0.003

      // Dispersion offset based on scroll
      const disperseX = spawnOffsets[ix] * scatter * 2.5
      const disperseY = spawnOffsets[iy] * scatter * 2.5
      const disperseZ = spawnOffsets[iz] * scatter * 1.5

      const finalTx = bx + disperseX
      const finalTy = by + disperseY
      const finalTz = bz + disperseZ

      let cx = currentPos[ix]
      let cy = currentPos[iy]
      let cz = currentPos[iz]

      // Mouse repulsion (only when mostly assembled)
      if (isHover && vis > 0.5) {
        const dx = cx - mx
        const dy = cy - my
        const distSq = dx * dx + dy * dy
        if (distSq < hoverRadSq && distSq > 0.0001) {
          const dist = Math.sqrt(distSq)
          const f = (1.0 - dist / HOVER_RADIUS)
          const s = f * f * PUSH_STRENGTH
          cx += (dx / dist) * s
          cy += (dy / dist) * s
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
    }

    posAttr.needsUpdate = true

    // Opacity follows visibility with quadratic ease
    const easedVis = vis * vis
    pts.material.opacity = easedVis * 0.9

    // Slow 360° rotation (~60s per revolution)
    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={currentPos}
            count={N}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            array={initColors}
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
