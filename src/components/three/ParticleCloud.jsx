import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import createGlowTexture from './GlowTexture'
import { loadPointCloudSet } from './loadPointClouds'

gsap.registerPlugin(ScrollTrigger)

const PARTICLE_COUNT = {
  mobile: 2500,
  notebook: 5000,
  desktop: 8000,
}
const GREEN = new THREE.Color('#07dd2b')
const HOVER_RADIUS = 0.9
const PUSH_STRENGTH = 0.4
const TILT_Z = -Math.PI / 5.2

function isMobile() {
  return window.innerWidth <= 768
}

function isNotebook() {
  return window.innerWidth < 1500
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

  const mobile = useMemo(() => isMobile(), [])
  const notebook = useMemo(() => !isMobile() && isNotebook(), [])
  const particleCount = mobile
    ? PARTICLE_COUNT.mobile
    : notebook
      ? PARTICLE_COUNT.notebook
      : PARTICLE_COUNT.desktop

  const rocketPos3 = useMemo(() => {
    if (mobile) return [0, -3.2, 0]
    if (notebook) return [4.5, -0.6, 0]
    return [4.5, -0.6, 0]
  }, [mobile, notebook])

  const rocketScale = useMemo(() => {
    if (mobile) return 0.8
    if (notebook) return 1.6
    return 1.6
  }, [mobile, notebook])

  const astroPos3 = useMemo(() => {
    if (mobile) return [0, -3.5, 0]
    if (notebook) return [-5.5, -0.1, 0]
    return [-3.5, 0, 0]
  }, [mobile, notebook])

  const astroScale = useMemo(() => {
    if (mobile) return 0.65
    if (notebook) return 1.4
    return 1.4
  }, [mobile, notebook])

  const [pointClouds, setPointClouds] = useState(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([
      loadPointCloudSet('/assets/models/foguete.points.json'),
      loadPointCloudSet('/assets/models/astronaut.points.json'),
    ]).then(([rocketSet, astronautSet]) => {
      if (cancelled) return
      setPointClouds({
        rocketShape: rocketSet[particleCount],
        astronautShape: astronautSet[particleCount],
      })
    })

    return () => {
      cancelled = true
    }
  }, [particleCount])

  const geometryData = useMemo(() => {
    if (!pointClouds?.rocketShape || !pointClouds?.astronautShape) return null

    const { rocketShape, astronautShape } = pointClouds
    const offsets = new Float32Array(particleCount * 3)
    const idlePhase = new Float32Array(particleCount)
    const currentPos = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i += 1) {
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
  }, [particleCount, pointClouds])

  const initPositions = useMemo(() => (geometryData ? Float32Array.from(geometryData.currentPos) : null), [geometryData])

  const rocketColors = useMemo(() => {
    if (!geometryData) return null

    const { rocketShape } = geometryData
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i += 1) {
      const ix = i * 3
      const ny = (rocketShape[ix + 1] + 2.75) / 5.5
      if (ny < 0.3) {
        const value = 1 + Math.random() * 0.5
        colors[ix] = GREEN.r * value
        colors[ix + 1] = GREEN.g * value
        colors[ix + 2] = GREEN.b * value
      } else if (Math.random() < 0.15) {
        const value = 0.8 + Math.random() * 0.6
        colors[ix] = GREEN.r * value
        colors[ix + 1] = GREEN.g * value
        colors[ix + 2] = GREEN.b * value
      } else {
        const white = 1 + Math.random() * 0.4
        colors[ix] = white
        colors[ix + 1] = white
        colors[ix + 2] = white
      }
    }

    return colors
  }, [geometryData, particleCount])

  const astronautColors = useMemo(() => {
    if (!geometryData) return null

    const { astronautShape } = geometryData
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i += 1) {
      const ix = i * 3
      const ny = (astronautShape[ix + 1] + 2.75) / 5.5
      const random = Math.random()
      if (ny > 0.65 && ny < 0.85 && random > 0.3) {
        const value = 0.6 + Math.random() * 0.4
        colors[ix] = GREEN.r * value
        colors[ix + 1] = GREEN.g * value
        colors[ix + 2] = GREEN.b * value
      } else if (random < 0.08) {
        colors[ix] = GREEN.r * 0.8
        colors[ix + 1] = GREEN.g * 0.8
        colors[ix + 2] = GREEN.b * 0.8
      } else {
        const white = 0.85 + Math.random() * 0.15
        colors[ix] = white
        colors[ix + 1] = white
        colors[ix + 2] = white
      }
    }

    return colors
  }, [geometryData, particleCount])

  const glowTexture = useMemo(() => createGlowTexture(), [])

  useEffect(() => {
    gsap.to(progressRef.current, {
      entrance: 1,
      duration: mobile ? 1.2 : 3,
      ease: 'power2.out',
      delay: 0.4,
    })
  }, [mobile])

  useEffect(() => {
    const heroElement = document.querySelector('.hero-wrapper')
    const alertElement = document.querySelector('#alerta')
    if (!heroElement || !alertElement) return undefined

    const trigger = ScrollTrigger.create({
      trigger: heroElement,
      start: 'top top',
      endTrigger: alertElement,
      end: 'center center',
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current.morph = self.progress
      },
    })

    return () => trigger.kill()
  }, [])

  useEffect(() => {
    const raycaster = new THREE.Raycaster()
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const ndc = new THREE.Vector2()
    const hit = new THREE.Vector3()
    const inverseMatrix = new THREE.Matrix4()

    const onMove = (event) => {
      ndc.x = (event.clientX / window.innerWidth) * 2 - 1
      ndc.y = -(event.clientY / window.innerHeight) * 2 + 1
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

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [camera])

  useFrame((_, delta) => {
    if (!geometryData || !rocketColors || !astronautColors) return

    const points = pointsRef.current
    const group = groupRef.current
    if (!points || !group) return

    const { rocketShape, astronautShape, offsets, idlePhase, currentPos } = geometryData
    const entrance = progressRef.current.entrance
    const morph = progressRef.current.morph
    const dt = Math.min(delta, 0.05)
    timeRef.current += dt
    const time = timeRef.current

    const smoothMorph = morph * morph * (3 - 2 * morph)
    const inverseMorph = 1 - smoothMorph

    group.position.set(
      rocketPos3[0] * inverseMorph + astroPos3[0] * smoothMorph,
      rocketPos3[1] * inverseMorph + astroPos3[1] * smoothMorph,
      rocketPos3[2] * inverseMorph + astroPos3[2] * smoothMorph,
    )

    const scale = rocketScale * inverseMorph + astroScale * smoothMorph
    group.scale.set(scale, scale, scale)
    group.rotation.z = TILT_Z * inverseMorph
    group.rotation.y = 0

    const positionAttribute = points.geometry.getAttribute('position')
    const positionArray = positionAttribute.array
    const colorAttribute = points.geometry.getAttribute('color')
    const colorArray = colorAttribute.array

    const entranceScatter = 1 - entrance
    const morphScatter = Math.sin(smoothMorph * Math.PI) * 0.8
    const isHover = hoveringRef.current
    const mouseX = localMouseRef.current.x
    const mouseY = localMouseRef.current.y
    const hoverRadiusSquared = HOVER_RADIUS * HOVER_RADIUS
    const springFactor = Math.min(0.04 * 60 * dt, 1)

    for (let i = 0; i < particleCount; i += 1) {
      const ix = i * 3
      const iy = ix + 1
      const iz = ix + 2
      const phase = idlePhase[i]

      const breathingX = Math.sin(time * 0.5 + phase) * 0.004
      const breathingY = Math.cos(time * 0.4 + phase * 1.3) * 0.004
      const breathingZ = Math.sin(time * 0.3 + phase * 0.7) * 0.002

      const targetX = rocketShape[ix] * inverseMorph + astronautShape[ix] * smoothMorph + breathingX
      const targetY = rocketShape[iy] * inverseMorph + astronautShape[iy] * smoothMorph + breathingY
      const targetZ = rocketShape[iz] * inverseMorph + astronautShape[iz] * smoothMorph + breathingZ

      const scatterAmount = Math.max(entranceScatter, morphScatter)
      const scatterX = offsets[ix] * scatterAmount * 8
      const scatterY = offsets[iy] * scatterAmount * 8
      const scatterZ = offsets[iz] * scatterAmount * 5

      const finalTargetX = targetX + scatterX
      const finalTargetY = targetY + scatterY
      const finalTargetZ = targetZ + scatterZ

      let currentX = currentPos[ix]
      let currentY = currentPos[iy]
      let currentZ = currentPos[iz]

      if (isHover && morphScatter < 0.3) {
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

      currentX += (finalTargetX - currentX) * springFactor
      currentY += (finalTargetY - currentY) * springFactor
      currentZ += (finalTargetZ - currentZ) * springFactor

      currentPos[ix] = currentX
      currentPos[iy] = currentY
      currentPos[iz] = currentZ

      positionArray[ix] = currentX
      positionArray[iy] = currentY
      positionArray[iz] = currentZ

      colorArray[ix] = rocketColors[ix] * inverseMorph + astronautColors[ix] * smoothMorph
      colorArray[iy] = rocketColors[iy] * inverseMorph + astronautColors[iy] * smoothMorph
      colorArray[iz] = rocketColors[iz] * inverseMorph + astronautColors[iz] * smoothMorph
    }

    positionAttribute.needsUpdate = true
    colorAttribute.needsUpdate = true
    points.material.opacity = entrance

    const targetBlending = morph > 0.5 ? THREE.NormalBlending : THREE.AdditiveBlending
    if (points.material.blending !== targetBlending) {
      points.material.blending = targetBlending
      points.material.needsUpdate = true
    }
  })

  if (!geometryData || !initPositions || !rocketColors || !astronautColors) {
    return null
  }

  return (
    <group ref={groupRef} position={rocketPos3} scale={rocketScale} rotation={[0, 0, TILT_Z]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={initPositions} count={particleCount} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={rocketColors} count={particleCount} itemSize={3} />
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

