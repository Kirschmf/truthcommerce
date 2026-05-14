import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createGlowTexture from './GlowTexture'
import sampleGLB from './sampleGLB'

gsap.registerPlugin(ScrollTrigger)

const PARTICLE_COUNT = {
  mobile: 3500,
  desktop: 9000,
}
const HOVER_RADIUS = 0.35
const PUSH_STRENGTH = 0.25
const GREEN = new THREE.Color('#07dd2b')

function isMobile() {
  return window.innerWidth <= 768
}

export default function AstronautCloud() {
  const groupRef = useRef()
  const pointsRef = useRef()
  const progressRef = useRef({ scrollVisibility: 0 })
  const localMouseRef = useRef(new THREE.Vector3(-999, -999, 0))
  const hoveringRef = useRef(false)
  const timeRef = useRef(0)
  const { camera, gl } = useThree()

  const astronautGltf = useGLTF('/assets/models/astronaut.glb')
  const particleCount = isMobile() ? PARTICLE_COUNT.mobile : PARTICLE_COUNT.desktop

  const { astronautPos, currentPos, idlePhase, spawnOffsets } = useMemo(() => {
    const sampledPositions = sampleGLB(astronautGltf, particleCount)
    const positions = new Float32Array(particleCount * 3)
    const phases = new Float32Array(particleCount)
    const offsets = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i += 1) {
      const ix = i * 3
      phases[i] = Math.random() * Math.PI * 2
      offsets[ix] = (Math.random() - 0.5) * 4
      offsets[ix + 1] = (Math.random() - 0.5) * 4
      offsets[ix + 2] = (Math.random() - 0.5) * 2

      positions[ix] = sampledPositions[ix] + offsets[ix]
      positions[ix + 1] = sampledPositions[ix + 1] + offsets[ix + 1]
      positions[ix + 2] = sampledPositions[ix + 2] + offsets[ix + 2]
    }

    return {
      astronautPos: sampledPositions,
      currentPos: positions,
      idlePhase: phases,
      spawnOffsets: offsets,
    }
  }, [astronautGltf, particleCount])

  const colors = useMemo(() => {
    const palette = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i += 1) {
      const ix = i * 3
      const normalizedY = (astronautPos[ix + 1] + 2.75) / 5.5
      const random = Math.random()

      if (normalizedY > 0.65 && normalizedY < 0.85 && random > 0.3) {
        const intensity = 0.6 + Math.random() * 0.4
        palette[ix] = GREEN.r * intensity
        palette[ix + 1] = GREEN.g * intensity
        palette[ix + 2] = GREEN.b * intensity
      } else if (random < 0.08) {
        palette[ix] = GREEN.r * 0.8
        palette[ix + 1] = GREEN.g * 0.8
        palette[ix + 2] = GREEN.b * 0.8
      } else {
        const white = 0.85 + Math.random() * 0.15
        palette[ix] = white
        palette[ix + 1] = white
        palette[ix + 2] = white
      }
    }

    return palette
  }, [astronautPos, particleCount])

  const glowTexture = useMemo(() => createGlowTexture(), [])

  useEffect(() => {
    if (!groupRef.current) return

    const scale = isMobile() ? 0.9 : 1.4
    groupRef.current.scale.set(scale, scale, scale)
    groupRef.current.position.set(0, 0, 0)

    if (pointsRef.current) {
      pointsRef.current.material.opacity = 0
    }
  }, [])

  useEffect(() => {
    const alertElement = document.querySelector('#alerta')
    if (!alertElement) return undefined

    const enterTrigger = ScrollTrigger.create({
      trigger: alertElement,
      start: 'top 95%',
      end: 'top 35%',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current.scrollVisibility = self.progress
      },
    })

    const exitTrigger = ScrollTrigger.create({
      trigger: alertElement,
      start: 'bottom 70%',
      end: 'bottom 15%',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current.scrollVisibility = 1 - self.progress
      },
    })

    return () => {
      enterTrigger.kill()
      exitTrigger.kill()
    }
  }, [])

  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    const inverseMatrix = new THREE.Matrix4()
    const canvas = gl.domElement
    const container = canvas.parentElement

    if (!container) return undefined

    const onMove = (event) => {
      const rect = canvas.getBoundingClientRect()
      ndc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      ndc.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      hoveringRef.current = true
      raycaster.setFromCamera(ndc, camera)
      if (raycaster.ray.intersectPlane(plane, hit) && groupRef.current) {
        groupRef.current.updateMatrixWorld()
        inverseMatrix.copy(groupRef.current.matrixWorld).invert()
        localMouseRef.current.copy(hit).applyMatrix4(inverseMatrix)
      }
    }

    const onLeave = () => {
      hoveringRef.current = false
    }

    container.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('mouseleave', onLeave)

    return () => {
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [camera, gl])

  useFrame((_, delta) => {
    const points = pointsRef.current
    if (!points) return

    const visibility = progressRef.current.scrollVisibility

    if (visibility <= 0.001) {
      points.material.opacity = 0
      return
    }

    const geometry = points.geometry
    const dt = Math.min(delta, 0.05)
    timeRef.current += dt
    const time = timeRef.current

    const isHover = hoveringRef.current
    const mouseX = localMouseRef.current.x
    const mouseY = localMouseRef.current.y
    const springFactor = Math.min(0.04 * 60 * dt, 1)
    const hoverRadiusSquared = HOVER_RADIUS * HOVER_RADIUS
    const scatter = 1 - visibility

    const positionAttribute = geometry.getAttribute('position')
    const positionArray = positionAttribute.array

    for (let i = 0; i < particleCount; i += 1) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2

      const breathingX = astronautPos[ix] + Math.sin(time * 0.5 + idlePhase[i]) * 0.005
      const breathingY = astronautPos[iy] + Math.cos(time * 0.4 + idlePhase[i] * 1.3) * 0.005
      const breathingZ = astronautPos[iz] + Math.sin(time * 0.3 + idlePhase[i] * 0.7) * 0.003

      const targetX = breathingX + spawnOffsets[ix] * scatter * 2.5
      const targetY = breathingY + spawnOffsets[iy] * scatter * 2.5
      const targetZ = breathingZ + spawnOffsets[iz] * scatter * 1.5

      let currentX = currentPos[ix]
      let currentY = currentPos[iy]
      let currentZ = currentPos[iz]

      if (isHover && visibility > 0.5) {
        const deltaX = currentX - mouseX
        const deltaY = currentY - mouseY
        const distanceSquared = deltaX * deltaX + deltaY * deltaY
        if (distanceSquared < hoverRadiusSquared && distanceSquared > 0.0001) {
          const distance = Math.sqrt(distanceSquared)
          const factor = 1 - distance / HOVER_RADIUS
          const push = factor * factor * PUSH_STRENGTH
          currentX += (deltaX / distance) * push
          currentY += (deltaY / distance) * push
        }
      }

      currentX += (targetX - currentX) * springFactor
      currentY += (targetY - currentY) * springFactor
      currentZ += (targetZ - currentZ) * springFactor

      currentPos[ix] = currentX
      currentPos[iy] = currentY
      currentPos[iz] = currentZ

      positionArray[ix] = currentX
      positionArray[iy] = currentY
      positionArray[iz] = currentZ
    }

    positionAttribute.needsUpdate = true
    points.material.opacity = visibility * visibility * 0.9

    if (groupRef.current) {
      groupRef.current.rotation.y += dt * 0.25
    }
  })

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={currentPos} count={particleCount} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={colors} count={particleCount} itemSize={3} />
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
