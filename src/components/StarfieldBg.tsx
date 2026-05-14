import { useEffect, useRef } from 'react'

const NEBULA_COLORS = [
  [7, 180, 40],
  [5, 140, 30],
  [10, 160, 50],
  [3, 100, 20],
  [15, 130, 60],
] as const

interface StarLayerConfig {
  drift: number
  sizeMin: number
  sizeMax: number
  opMin: number
  opMax: number
  parallax: number
  stars: Star[]
}

interface Star {
  x: number
  y: number
  r: number
  o: number
  dx: number
  dy: number
  phase: number
  twinkleSpeed: number
  twinkleAmp: number
}

interface Nebula {
  x: number
  y: number
  rx: number
  ry: number
  color: readonly [number, number, number]
  op: number
  targetOp: number
  rising: boolean
  riseSpeed: number
  fallSpeed: number
  drift: number
}

export default function StarfieldBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined

    const ctx = canvas.getContext('2d')
    if (!ctx) return undefined

    let animationFrameId = 0
    let width = 0
    let height = 0
    let totalHeight = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let targetScrollY = 0
    let scrollY = 0
    let lastNow = 0
    let lenisAttached = false

    const layers: StarLayerConfig[] = [
      { stars: [], drift: 0.008, sizeMin: 0.3, sizeMax: 0.7, opMin: 0.15, opMax: 0.4, parallax: 0.02 },
      { stars: [], drift: 0.015, sizeMin: 0.5, sizeMax: 1.1, opMin: 0.25, opMax: 0.65, parallax: 0.05 },
      { stars: [], drift: 0.025, sizeMin: 0.8, sizeMax: 1.6, opMin: 0.4, opMax: 0.9, parallax: 0.1 },
    ]
    const nebulae: Nebula[] = []

    const getPageHeight = () =>
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight,
      )

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const makeStarProps = (layer: StarLayerConfig, yMin: number, yMax: number): Star => ({
      x: Math.random() * width,
      y: yMin + Math.random() * (yMax - yMin),
      r: layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin),
      o: layer.opMin + Math.random() * (layer.opMax - layer.opMin),
      dx: (Math.random() - 0.5) * layer.drift,
      dy: (Math.random() - 0.5) * layer.drift * 0.4,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.3 + Math.random() * 1.2,
      twinkleAmp: 0.15 + Math.random() * 0.25,
    })

    const starCounts = (pageHeight: number) => {
      const area = width * pageHeight
      return [
        Math.min(3000, Math.round(area / 5000)),
        Math.min(2000, Math.round(area / 8000)),
        Math.min(1000, Math.round(area / 14000)),
      ]
    }

    const makeNebula = (yMin: number, yMax: number): Nebula => {
      const color = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)] ?? NEBULA_COLORS[0]
      return {
        x: Math.random() * width,
        y: yMin + Math.random() * (yMax - yMin),
        rx: (300 + Math.random() * 400) * (width / 1920),
        ry: (250 + Math.random() * 300) * (height / 1080),
        color,
        op: 0,
        targetOp: 0.02 + Math.random() * 0.025,
        rising: true,
        riseSpeed: 0.0001 + Math.random() * 0.00006,
        fallSpeed: 0.00005 + Math.random() * 0.00004,
        drift: (Math.random() - 0.5) * 0.0003,
      }
    }

    const createAll = () => {
      totalHeight = getPageHeight()
      const counts = starCounts(totalHeight)

      layers.forEach((layer, layerIndex) => {
        layer.stars.length = 0
        const count = counts[layerIndex] ?? 0
        for (let i = 0; i < count; i += 1) {
          layer.stars.push(makeStarProps(layer, 0, totalHeight))
        }
      })

      nebulae.length = 0
      const nebulaCount = Math.max(8, Math.round((totalHeight / height) * 2.5))
      for (let i = 0; i < nebulaCount; i += 1) {
        const nebula = makeNebula(0, totalHeight)
        nebula.op = Math.random() * nebula.targetOp
        nebula.rising = Math.random() > 0.5
        nebulae.push(nebula)
      }
    }

    const extendIfGrown = () => {
      const newHeight = getPageHeight()
      if (newHeight <= totalHeight + 50) return
      const oldHeight = totalHeight
      totalHeight = newHeight

      const counts = starCounts(newHeight)
      layers.forEach((layer, layerIndex) => {
        const count = counts[layerIndex] ?? 0
        const extra = Math.round((count * (newHeight - oldHeight)) / newHeight)
        for (let i = 0; i < extra; i += 1) {
          layer.stars.push(makeStarProps(layer, oldHeight, newHeight))
        }
      })

      const extraNebulae = Math.round(((newHeight - oldHeight) / height) * 2.5)
      for (let i = 0; i < extraNebulae; i += 1) {
        nebulae.push(makeNebula(oldHeight, newHeight))
      }
    }

    const tryAttachLenis = () => {
      if (lenisAttached || !window.__lenis) return
      window.__lenis.on('scroll', ({ scroll }: { scroll: number }) => {
        targetScrollY = scroll
      })
      lenisAttached = true
    }

    const draw = (now: number) => {
      animationFrameId = requestAnimationFrame(draw)
      const dt = Math.min((now - lastNow) * 0.001, 0.05)
      lastNow = now
      const elapsed = now * 0.001

      if (!lenisAttached) tryAttachLenis()
      scrollY = targetScrollY

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#040507'
      ctx.fillRect(0, 0, width, height)

      for (const nebula of nebulae) {
        const drawY = nebula.y - scrollY

        if (drawY > -nebula.ry * 3 && drawY < height + nebula.ry * 3) {
          const radius = Math.max(nebula.rx, nebula.ry)
          const [cr, cg, cb] = nebula.color
          const gradient = ctx.createRadialGradient(nebula.x, drawY, 0, nebula.x, drawY, radius)
          gradient.addColorStop(0, `rgba(${cr},${cg},${cb},${nebula.op * 0.6})`)
          gradient.addColorStop(0.15, `rgba(${cr},${cg},${cb},${nebula.op * 0.4})`)
          gradient.addColorStop(0.4, `rgba(${cr},${cg},${cb},${nebula.op * 0.15})`)
          gradient.addColorStop(0.7, `rgba(${cr},${cg},${cb},${nebula.op * 0.04})`)
          gradient.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.fillStyle = gradient
          ctx.beginPath()
          ctx.ellipse(nebula.x, drawY, nebula.rx, nebula.ry, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        if (nebula.rising) {
          nebula.op += nebula.riseSpeed
          if (nebula.op >= nebula.targetOp) {
            nebula.op = nebula.targetOp
            nebula.rising = false
          }
        } else {
          nebula.op -= nebula.fallSpeed
          if (nebula.op <= 0) {
            Object.assign(nebula, makeNebula(0, totalHeight))
          }
        }

        nebula.x += nebula.drift * width * dt
        if (nebula.x < -nebula.rx) nebula.x = width + nebula.rx
        if (nebula.x > width + nebula.rx) nebula.x = -nebula.rx
      }

      for (const layer of layers) {
        for (const star of layer.stars) {
          star.x += star.dx
          star.y += star.dy

          if (star.x < -2) star.x = width + 2
          if (star.x > width + 2) star.x = -2
          if (star.y < 0) star.y = totalHeight
          if (star.y > totalHeight) star.y = 0

          const drawY = star.y - scrollY * (1 - layer.parallax)
          if (drawY < -2 || drawY > height + 2) continue

          const twinkle = Math.sin(elapsed * star.twinkleSpeed + star.phase) * star.twinkleAmp
          const drawOpacity = Math.max(0.05, Math.min(1, star.o + twinkle))

          if (star.r > 1) {
            const haloRadius = star.r * 4
            const gradient = ctx.createRadialGradient(star.x, drawY, 0, star.x, drawY, haloRadius)
            gradient.addColorStop(0, `rgba(200,215,255,${drawOpacity * 0.35})`)
            gradient.addColorStop(1, 'rgba(200,215,255,0)')
            ctx.fillStyle = gradient
            ctx.beginPath()
            ctx.arc(star.x, drawY, haloRadius, 0, Math.PI * 2)
            ctx.fill()
          }

          ctx.beginPath()
          ctx.arc(star.x, drawY, star.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${drawOpacity})`
          ctx.fill()
        }
      }
    }

    const onScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0
    }

    const init = () => {
      resize()
      createAll()
      onScroll()
      animationFrameId = requestAnimationFrame(draw)
      tryAttachLenis()
      window.setTimeout(extendIfGrown, 400)
      window.setTimeout(extendIfGrown, 1200)
      window.setTimeout(extendIfGrown, 3000)
    }

    init()

    const onResize = () => {
      const previousWidth = width
      resize()
      if (Math.abs(width - previousWidth) > 10) {
        createAll()
      }
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen pointer-events-none"
      style={{ zIndex: -2 }}
    />
  )
}
