import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import createGlowTexture from './GlowTexture'
import sampleGLB from './sampleGLB'
import { CASES as CASE_DATA } from '../../data/cases'

const CASES = CASE_DATA

// 6 cases × 3 = 18 cards on the ring
const FULL_CASES = [...CASES, ...CASES, ...CASES]
const TOTAL      = FULL_CASES.length
const RADIUS     = 3500
const CARD_W     = 1100
const CARD_H     = 620
const SAT_N      = 20000
const SAT_SCALE  = 1500 / 5.5  // normalize sampleGLB height (5.5) → 1500 Three.js units

const vertShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// Front face: image at 15% brightness (dark)
// Back face:  image at full brightness
// uDim: extra global dim multiplier (used when 2D overlay takes over and the ring becomes backdrop)
const fragShader = `
uniform sampler2D map;
uniform float uDim;
varying vec2 vUv;
void main() {
  vec2 uv = vUv;
  if (!gl_FrontFacing) uv.x = 1.0 - uv.x;
  vec4 tex = texture2D(map, uv);
  vec3 col = tex.rgb;
  if (gl_FrontFacing) col *= 0.15;
  col *= uDim;
  gl_FragColor = vec4(col, 1.0);
}
`

export default function Carousel3D({ scrollProgressRef, onCardClick, interactive3DRef }) {
  const groupRef     = useRef()
  const satGroupRef  = useRef()
  const satPointsRef = useRef()
  const { camera, scene, gl } = useThree()

  const ringRotRef    = useRef(0)
  const targetRotRef  = useRef(0)
  const hudOpacityRef = useRef(0)
  const dragRef       = useRef({ active: false, startX: 0, moved: 0 })
  const mouseRef      = useRef(new THREE.Vector2(-999, -999))
  const raycaster     = useMemo(() => new THREE.Raycaster(), [])
  const cardMeshesRef = useRef([])

  // ── Models ───────────────────────────────────────────────────
  const satelliteGltf = useGLTF('/assets/models/satellite.glb')

  // 6 unique textures shared across 18 card slots
  const baseTextures = useLoader(THREE.TextureLoader, CASES.map(c => c.img))

  // ── Cylinder card meshes ─────────────────────────────────────
  const cardMeshes = useMemo(() => {
    const meshes = FULL_CASES.map((c, i) => {
      const angle    = (i / TOTAL) * Math.PI * 2
      const thetaLen = CARD_W / RADIUS

      const geo = new THREE.CylinderGeometry(
        RADIUS, RADIUS, CARD_H,
        32, 1, true,
        angle - thetaLen / 2,
        thetaLen,
      )

      const mat = new THREE.ShaderMaterial({
        vertexShader: vertShader,
        fragmentShader: fragShader,
        uniforms: {
          map: { value: baseTextures[i % CASES.length] },
          uDim: { value: 1.0 },
        },
        side: THREE.DoubleSide,
        transparent: true,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.userData.caseIndex = i % CASES.length
      return mesh
    })

    cardMeshesRef.current = meshes
    return meshes
  }, [baseTextures])

  // ── Satellite particle cloud ─────────────────────────────────
  const { satCurrentPos, satNoise, satBasePos, satColors } = useMemo(() => {
    const rawPos     = sampleGLB(satelliteGltf, SAT_N)
    const basePos    = new Float32Array(SAT_N * 3)
    const noise      = new Float32Array(SAT_N * 3)
    const currentPos = new Float32Array(SAT_N * 3)
    const colors     = new Float32Array(SAT_N * 3)
    const green      = new THREE.Color('#07dd2b')

    for (let i = 0; i < SAT_N; i++) {
      const ix = i * 3
      // Scale from sampleGLB-normalized height (5.5) to 1500 world units
      basePos[ix]     = rawPos[ix]     * SAT_SCALE
      basePos[ix + 1] = rawPos[ix + 1] * SAT_SCALE
      basePos[ix + 2] = rawPos[ix + 2] * SAT_SCALE

      currentPos[ix]     = basePos[ix]
      currentPos[ix + 1] = basePos[ix + 1]
      currentPos[ix + 2] = basePos[ix + 2]

      noise[ix]     = (Math.random() - 0.5) * 2
      noise[ix + 1] = (Math.random() - 0.5) * 2
      noise[ix + 2] = (Math.random() - 0.5) * 2

      // 15% green accents, 85% white/silver
      if (Math.random() > 0.85) {
        const v = 0.6 + Math.random() * 0.4
        colors[ix] = green.r * v; colors[ix + 1] = green.g * v; colors[ix + 2] = green.b * v
      } else {
        const w = 0.85 + Math.random() * 0.15
        colors[ix] = w; colors[ix + 1] = w; colors[ix + 2] = w
      }
    }

    return { satCurrentPos: currentPos, satNoise: noise, satBasePos: basePos, satColors: colors }
  }, [satelliteGltf])

  const glowTex = useMemo(() => createGlowTexture(), [])

  // ── Interaction ───────────────────────────────────────────────
  const isInteractive = () => interactive3DRef ? interactive3DRef.current !== false : true

  useEffect(() => {
    const canvas = gl.domElement

    const onWheel = (e) => {
      if (!isInteractive()) return
      if (hudOpacityRef.current > 0.5) {
        targetRotRef.current += e.deltaY * 0.0008
      }
    }

    const onDown = (e) => {
      if (!isInteractive()) return
      if (hudOpacityRef.current > 0.5) {
        dragRef.current = { active: true, startX: e.clientX, moved: 0 }
      }
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1
      mouseRef.current.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1
      if (dragRef.current.active && isInteractive()) {
        const dx = e.clientX - dragRef.current.startX
        targetRotRef.current += dx * 0.002
        dragRef.current.moved += Math.abs(dx)
        dragRef.current.startX = e.clientX
      }
    }

    const onUp = () => { dragRef.current.active = false }

    const onClick = (e) => {
      if (!isInteractive()) return
      if (hudOpacityRef.current < 0.5) return
      // Ignore clicks that were really drags (>6px movement)
      if (dragRef.current.moved > 6) return

      const rect = canvas.getBoundingClientRect()
      const ndc = {
        x:  ((e.clientX - rect.left) / rect.width)  * 2 - 1,
        y: -((e.clientY - rect.top)  / rect.height) * 2 + 1,
      }

      // Force matrices to current values before raycasting (ring rotates per frame)
      if (groupRef.current) groupRef.current.updateMatrixWorld(true)

      raycaster.setFromCamera(ndc, camera)
      const hits = raycaster.intersectObjects(cardMeshesRef.current, false)
      if (hits.length > 0 && onCardClick) {
        // Resolve case via indexOf in the live mesh array — bulletproof against stale userData
        const meshIdx = cardMeshesRef.current.indexOf(hits[0].object)
        const idx = meshIdx >= 0 ? meshIdx % CASES.length : hits[0].object.userData.caseIndex
        const picked = CASES[idx]
        onCardClick(picked)
      }
    }

    window.addEventListener('wheel',     onWheel,  { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove,   { passive: true })
    window.addEventListener('mouseup',   onUp)
    canvas.addEventListener('click',     onClick)

    return () => {
      window.removeEventListener('wheel',     onWheel)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',   onUp)
      canvas.removeEventListener('click',     onClick)
    }
  }, [camera, gl, onCardClick, raycaster])

  // ── Render loop ───────────────────────────────────────────────
  useFrame(() => {
    const p = scrollProgressRef.current || 0

    let camY, camZ, lookZ, tilt, hudOpacity, backdrop

    if (p < 0.45) {
      // Phase 1: dive into the ring
      const t    = p / 0.45
      const ease = t * t * (3 - 2 * t)  // smoothstep
      camY       = 4000 * (1 - ease)
      camZ       = 8000 + (-500 - 8000) * ease  // 8000 → -500
      lookZ      = -4000 * ease                  // 0 → -4000
      tilt       = 0.20 * (1 - ease)
      hudOpacity = ease
      backdrop   = 0
    } else {
      // Phase 2: HOLD at zoom max — camera stable, ring becomes cinematic backdrop
      // backdrop ramps 0→1 across 0.45 → 0.6 (matches CarrosselCases overlay opacity curve)
      const t = Math.min(1, Math.max(0, (p - 0.45) / 0.15))
      backdrop = t * t * (3 - 2 * t)
      camY = 0; camZ = -500; lookZ = -4000; tilt = 0
      // HUD stays visible during hold; soft fade only at the very end (p > 0.95)
      hudOpacity = p < 0.95 ? 1 : Math.max(0, 1 - (p - 0.95) * 20)
    }

    hudOpacityRef.current = hudOpacity

    camera.position.set(0, camY, camZ)
    camera.lookAt(0, 0, lookZ)

    // Fog: tight when inside ring (hud > 0.5), wider/darker when overlay active
    if (scene.fog) {
      if (hudOpacity > 0.5) {
        // Pull fog closer as backdrop ramps up → cards sink into atmosphere
        scene.fog.near = 100
        scene.fog.far  = 15000 - backdrop * 8000  // 15000 → 7000
      } else {
        scene.fog.near = 0
        scene.fog.far  = 100000
      }
    }

    // Card brightness: dim when overlay active so the 2D card is unambiguously the foreground
    // 1.0 (normal) → 0.35 (dim) over backdrop 0→1
    const dim = 1 - backdrop * 0.65
    for (let i = 0; i < cardMeshesRef.current.length; i++) {
      const m = cardMeshesRef.current[i]
      if (m && m.material && m.material.uniforms && m.material.uniforms.uDim) {
        m.material.uniforms.uDim.value = dim
      }
    }

    // Ring: tilt + auto-spin + drag
    if (groupRef.current) {
      groupRef.current.rotation.x = tilt

      if (!dragRef.current.active) {
        // Slower spin when in hold/backdrop mode; original 0.003 during dive-in
        const spin = hudOpacity > 0.8
          ? (0.0003 + backdrop * 0.0005)  // 0.0003 → 0.0008 as backdrop ramps
          : 0.003
        targetRotRef.current -= spin
      }
      ringRotRef.current += (targetRotRef.current - ringRotRef.current) * 0.06
      groupRef.current.rotation.y = ringRotRef.current
    }

    // Satellite: formed when outside, scattered when camera enters
    // satScatter = hudOpacity * 1200 → 0 = formed, 1200 = fully scattered
    const satScatter  = hudOpacity * 1200
    const satOpacity  = Math.max(0, 1 - hudOpacity * 2)  // gone by hudOpacity=0.5

    if (satPointsRef.current) {
      satPointsRef.current.material.opacity = satOpacity

      if (satOpacity > 0.01) {
        const posAttr = satPointsRef.current.geometry.getAttribute('position')
        const posArr  = posAttr.array

        for (let i = 0; i < SAT_N; i++) {
          const ix = i * 3
          const tx = satBasePos[ix]     + satNoise[ix]     * satScatter
          const ty = satBasePos[ix + 1] + satNoise[ix + 1] * satScatter
          const tz = satBasePos[ix + 2] + satNoise[ix + 2] * satScatter

          satCurrentPos[ix]     += (tx - satCurrentPos[ix])     * 0.04
          satCurrentPos[ix + 1] += (ty - satCurrentPos[ix + 1]) * 0.04
          satCurrentPos[ix + 2] += (tz - satCurrentPos[ix + 2]) * 0.04

          posArr[ix]     = satCurrentPos[ix]
          posArr[ix + 1] = satCurrentPos[ix + 1]
          posArr[ix + 2] = satCurrentPos[ix + 2]
        }

        posAttr.needsUpdate = true
      }
    }

    // Satellite group: slow rotation
    if (satGroupRef.current) {
      satGroupRef.current.rotation.y += 0.002
    }

    // Hover cursor — only when 3D is the active interaction layer
    if (hudOpacity > 0.5 && isInteractive()) {
      raycaster.setFromCamera(mouseRef.current, camera)
      const hits = raycaster.intersectObjects(cardMeshesRef.current)
      gl.domElement.style.cursor = hits.length > 0 ? 'pointer' : 'default'
    } else {
      gl.domElement.style.cursor = 'default'
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

      {/* Satellite particle cloud */}
      <group ref={satGroupRef}>
        <points ref={satPointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              array={satCurrentPos}
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

useGLTF.preload('/assets/models/satellite.glb')
