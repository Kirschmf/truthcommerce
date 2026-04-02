import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import createGlowTexture from './GlowTexture'

const CASES = [
  { t: 'SOPY', img: '/assets/images/sopy-print.png' },
  { t: 'MP DISTRIBUIDORA', img: '/assets/images/mp-print.png' },
  { t: 'NEXT EVENTOS', img: '/assets/images/next-print.png' },
  { t: 'JOHNNY COOKER', img: '/assets/images/johny-print.png' },
  { t: 'HYPE KBEAUTY', img: '/assets/images/kbeauty-print.png' },
  { t: 'CAFE CARANDAI', img: '/assets/images/cafe-print.png' },
]

// Only duplicate once (12 cards) instead of 3x (18) — reduces texture loads
const FULL_CASES = [...CASES, ...CASES]
const TOTAL = FULL_CASES.length

const RADIUS = 3500
const CARD_W = 1100
const CARD_H = 620
const SAT_N = 8000
const SAT_SCATTER = 1200

// Vertex shader for cylinder cards
const vertShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Fragment shader — darkened front face with texture
const fragShader = `
uniform sampler2D map;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
  vec4 tex = texture2D(map, uv);
  vec3 col = tex.rgb;
  if (gl_FrontFacing) col *= 0.15;
  gl_FragColor = vec4(col, 1.0);
}
`

export default function Carousel3D({ scrollProgress }) {
  const groupRef = useRef()
  const satRef = useRef()
  const { camera, scene } = useThree()

  const ringRotRef = useRef(0)
  const targetRotRef = useRef(0)
  const dragRef = useRef({ active: false, startX: 0 })

  // Load textures
  const textures = useLoader(
    THREE.TextureLoader,
    FULL_CASES.map((c) => c.img)
  )

  // Build cylinder card meshes
  const cardMeshes = useMemo(() => {
    return FULL_CASES.map((c, i) => {
      const angle = (i / TOTAL) * Math.PI * 2
      const thetaLen = CARD_W / RADIUS

      const geo = new THREE.CylinderGeometry(
        RADIUS, RADIUS, CARD_H,
        32, 1, true,
        angle - thetaLen / 2, thetaLen
      )

      const mat = new THREE.ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        uniforms: { map: { value: textures[i] } },
        side: THREE.DoubleSide,
        transparent: true,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.userData = { ...c, index: i }
      return mesh
    })
  }, [textures])

  // Satellite particles
  const { satPositions, satColors, satBasePos, satNoise, satVelocities, satCurrentPos } = useMemo(() => {
    const positions = new Float32Array(SAT_N * 3)
    const colors = new Float32Array(SAT_N * 3)
    const basePos = new Float32Array(SAT_N * 3)
    const noise = new Float32Array(SAT_N * 3)
    const velocities = new Float32Array(SAT_N * 3)
    const currentPos = new Float32Array(SAT_N * 3)

    const green = new THREE.Color('#07dd2b')

    for (let i = 0; i < SAT_N; i++) {
      const ix = i * 3
      // Distribute on sphere surface (r ~800)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 600 + Math.random() * 400

      positions[ix] = r * Math.sin(phi) * Math.cos(theta)
      positions[ix + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[ix + 2] = r * Math.cos(phi)

      basePos[ix] = positions[ix]
      basePos[ix + 1] = positions[ix + 1]
      basePos[ix + 2] = positions[ix + 2]

      currentPos[ix] = positions[ix]
      currentPos[ix + 1] = positions[ix + 1]
      currentPos[ix + 2] = positions[ix + 2]

      noise[ix] = (Math.random() - 0.5) * 2
      noise[ix + 1] = (Math.random() - 0.5) * 2
      noise[ix + 2] = (Math.random() - 0.5) * 2

      velocities[ix] = (Math.random() - 0.5) * 0.3
      velocities[ix + 1] = (Math.random() - 0.5) * 0.3
      velocities[ix + 2] = (Math.random() - 0.5) * 0.3

      // Colors: mostly white, 15% green accents
      if (Math.random() > 0.85) {
        const intensity = 0.6 + Math.random() * 0.4
        colors[ix] = green.r * intensity
        colors[ix + 1] = green.g * intensity
        colors[ix + 2] = green.b * intensity
      } else {
        const w = 0.85 + Math.random() * 0.15
        colors[ix] = w
        colors[ix + 1] = w
        colors[ix + 2] = w
      }
    }

    return { satPositions: positions, satColors: colors, satBasePos: basePos, satNoise: noise, satVelocities: velocities, satCurrentPos: currentPos }
  }, [])

  const glowTex = useMemo(() => createGlowTexture(), [])

  // Wheel + drag interaction
  useEffect(() => {
    const onWheel = (e) => {
      if (scrollProgress.current > 0.2 && scrollProgress.current < 0.8) {
        targetRotRef.current += e.deltaY * 0.0008
      }
    }

    const onDown = (e) => {
      if (scrollProgress.current > 0.2 && scrollProgress.current < 0.8) {
        dragRef.current.active = true
        dragRef.current.startX = e.clientX
      }
    }

    const onMove = (e) => {
      if (dragRef.current.active) {
        targetRotRef.current += (e.clientX - dragRef.current.startX) * 0.002
        dragRef.current.startX = e.clientX
      }
    }

    const onUp = () => { dragRef.current.active = false }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
  }, [scrollProgress])

  // Animation loop
  useFrame(() => {
    const p = scrollProgress.current || 0

    // 3-phase camera proxy interpolation
    let camY, camZ, lookY, lookZ, tilt, hudOpacity

    if (p < 0.33) {
      // Phase 1: Dive in
      const t = p / 0.33
      const ease = t * t * (3 - 2 * t) // smoothstep
      camY = 4000 + (0 - 4000) * ease
      camZ = 8000 + (-500 - 8000) * ease
      lookY = 0
      lookZ = 0 + (-4000 - 0) * ease
      tilt = 0.20 + (0 - 0.20) * ease
      hudOpacity = ease
    } else if (p < 0.66) {
      // Phase 2: Exploration
      camY = 0
      camZ = -500
      lookY = 0
      lookZ = -4000
      tilt = 0
      hudOpacity = 1
    } else {
      // Phase 3: Exit
      const t = (p - 0.66) / 0.34
      const ease = t * t * (3 - 2 * t)
      camY = 0 + (4000 - 0) * ease
      camZ = -500 + (8000 - (-500)) * ease
      lookY = 0
      lookZ = -4000 + (0 - (-4000)) * ease
      tilt = 0 + 0.20 * ease
      hudOpacity = 1 - ease
    }

    camera.position.set(0, camY, camZ)
    camera.lookAt(0, lookY, lookZ)

    // Fog density
    if (scene.fog) {
      scene.fog.near = hudOpacity > 0.5 ? 100 : 0
      scene.fog.far = hudOpacity > 0.5 ? 15000 : 100000
    }

    // Carousel group rotation
    if (groupRef.current) {
      groupRef.current.rotation.x = tilt

      // Auto-spin
      const autoSpeed = hudOpacity > 0.8 ? 0.0003 : 0.003
      if (!dragRef.current.active) {
        targetRotRef.current -= autoSpeed
      }
      ringRotRef.current += (targetRotRef.current - ringRotRef.current) * 0.06
      groupRef.current.rotation.y = ringRotRef.current
    }

    // Satellite particles
    if (satRef.current) {
      const satGeo = satRef.current.geometry
      const satMat = satRef.current.material
      const posAttr = satGeo.getAttribute('position')
      const posArr = posAttr.array

      const scatter = hudOpacity * SAT_SCATTER
      const satOpacity = 1.0 - Math.max(0, (hudOpacity - 0.6) * 2.5)
      satMat.opacity = Math.max(0, Math.min(1, satOpacity))

      satRef.current.parent.rotation.y += 0.002

      for (let i = 0; i < SAT_N; i++) {
        const ix = i * 3
        const iy = ix + 1
        const iz = ix + 2

        // Target with scatter
        const tx = satBasePos[ix] + satNoise[ix] * scatter
        const ty = satBasePos[iy] + satNoise[iy] * scatter
        const tz = satBasePos[iz] + satNoise[iz] * scatter

        // Drift
        let cx = satCurrentPos[ix] + satVelocities[ix]
        let cy = satCurrentPos[iy] + satVelocities[iy]
        let cz = satCurrentPos[iz] + satVelocities[iz]

        // Spring
        cx += (tx - cx) * 0.04
        cy += (ty - cy) * 0.04
        cz += (tz - cz) * 0.04

        satCurrentPos[ix] = cx
        satCurrentPos[iy] = cy
        satCurrentPos[iz] = cz

        posArr[ix] = cx
        posArr[iy] = cy
        posArr[iz] = cz
      }

      posAttr.needsUpdate = true
    }
  })

  return (
    <>
      {/* Card ring */}
      <group ref={groupRef}>
        {cardMeshes.map((mesh, i) => (
          <primitive key={i} object={mesh} />
        ))}
      </group>

      {/* Satellite particles */}
      <group>
        <points ref={satRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={satPositions}
              count={SAT_N}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              array={satColors}
              count={SAT_N}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={20}
            map={glowTex}
            vertexColors
            transparent
            opacity={1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            sizeAttenuation
          />
        </points>
      </group>
    </>
  )
}
