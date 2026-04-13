import { useRef, useEffect } from 'react'

const NEBULA_COLORS = [
  [7, 221, 43], [5, 160, 30], [10, 255, 70],
  [3, 120, 20], [20, 200, 100], [30, 230, 80],
]

export default function StarfieldBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let raf
    let W, H
    let totalH = 0
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let scrollY = 0
    let lastNow = 0

    const layers = [
      { stars: [], drift: 0.008, sizeMin: 0.3, sizeMax: 0.7,  opMin: 0.15, opMax: 0.4,  parallax: 0.02 },
      { stars: [], drift: 0.015, sizeMin: 0.5, sizeMax: 1.1,  opMin: 0.25, opMax: 0.65, parallax: 0.05 },
      { stars: [], drift: 0.025, sizeMin: 0.8, sizeMax: 1.6,  opMin: 0.4,  opMax: 0.9,  parallax: 0.10 },
    ]
    const nebulae = []

    function getPageHeight() {
      return Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        window.innerHeight,
      )
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width  = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    // ── Star helpers ──────────────────────────────────────────
    function makeStarProps(layer, yMin, yMax) {
      return {
        x: Math.random() * W,
        y: yMin + Math.random() * (yMax - yMin),
        r: layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin),
        o: layer.opMin  + Math.random() * (layer.opMax  - layer.opMin),
        dx: (Math.random() - 0.5) * layer.drift,
        dy: (Math.random() - 0.5) * layer.drift * 0.4,
        phase:        Math.random() * Math.PI * 2,
        twinkleSpeed: 0.3 + Math.random() * 1.2,
        twinkleAmp:   0.15 + Math.random() * 0.25,
      }
    }

    function starCounts(pageH) {
      const area = W * pageH
      return [
        Math.min(3000, Math.round(area / 5000)),
        Math.min(2000, Math.round(area / 8000)),
        Math.min(1000, Math.round(area / 14000)),
      ]
    }

    // ── Nebula helpers ────────────────────────────────────────
    function makeNebula(yMin, yMax) {
      const color = NEBULA_COLORS[Math.floor(Math.random() * NEBULA_COLORS.length)]
      return {
        x:          Math.random() * W,
        y:          yMin + Math.random() * (yMax - yMin),
        rx:         (200 + Math.random() * 300) * (W / 1920),
        ry:         (150 + Math.random() * 200) * (H / 1080),
        color,
        op:         0,
        targetOp:   0.05 + Math.random() * 0.05,
        rising:     true,
        riseSpeed:  0.00015 + Math.random() * 0.0001,
        fallSpeed:  0.00008 + Math.random() * 0.00006,
        drift:      (Math.random() - 0.5) * 0.0004,
      }
    }

    // ── Full init ─────────────────────────────────────────────
    function createAll() {
      totalH = getPageHeight()
      const counts = starCounts(totalH)

      layers.forEach((layer, li) => {
        layer.stars.length = 0
        for (let i = 0; i < counts[li]; i++) {
          layer.stars.push(makeStarProps(layer, 0, totalH))
        }
      })

      nebulae.length = 0
      const nebulaCount = Math.max(8, Math.round((totalH / H) * 2.5))
      for (let i = 0; i < nebulaCount; i++) {
        const n = makeNebula(0, totalH)
        // Stagger initial opacity so they don't all appear at once
        n.op     = Math.random() * n.targetOp
        n.rising = Math.random() > 0.5
        nebulae.push(n)
      }
    }

    // ── Extend when page grows after Three.js/GSAP expand DOM ─
    function extendIfGrown() {
      const newH = getPageHeight()
      if (newH <= totalH + 50) return
      const oldH = totalH
      totalH = newH

      const counts = starCounts(newH)
      layers.forEach((layer, li) => {
        const extra = Math.round(counts[li] * (newH - oldH) / newH)
        for (let i = 0; i < extra; i++) {
          layer.stars.push(makeStarProps(layer, oldH, newH))
        }
      })

      const extraNebulae = Math.round((newH - oldH) / H * 2.5)
      for (let i = 0; i < extraNebulae; i++) {
        nebulae.push(makeNebula(oldH, newH))
      }
    }

    // ── Draw loop ─────────────────────────────────────────────
    function draw(now) {
      raf = requestAnimationFrame(draw)
      const dt      = Math.min((now - lastNow) * 0.001, 0.05)
      lastNow       = now
      const elapsed = now * 0.001

      ctx.clearRect(0, 0, W, H)
      ctx.fillStyle = '#040507'
      ctx.fillRect(0, 0, W, H)

      // ── Nebulae (source-over, all green variants) ──────────
      for (const n of nebulae) {
        const drawY = n.y - scrollY

        if (drawY > -n.ry * 3 && drawY < H + n.ry * 3) {
          const grd = ctx.createRadialGradient(n.x, drawY, 0, n.x, drawY, Math.max(n.rx, n.ry))
          grd.addColorStop(0,   `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.op})`)
          grd.addColorStop(0.4, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${n.op * 0.4})`)
          grd.addColorStop(1,   'rgba(0,0,0,0)')
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.ellipse(n.x, drawY, n.rx, n.ry, 0, 0, Math.PI * 2)
          ctx.fill()
        }

        // Fade in → out → reposition
        if (n.rising) {
          n.op += n.riseSpeed
          if (n.op >= n.targetOp) { n.op = n.targetOp; n.rising = false }
        } else {
          n.op -= n.fallSpeed
          if (n.op <= 0) {
            Object.assign(n, makeNebula(0, totalH))
          }
        }

        // Slow horizontal drift
        n.x += n.drift * W * dt
        if (n.x < -n.rx) n.x = W + n.rx
        if (n.x > W + n.rx) n.x = -n.rx
      }

      // ── Star layers (back → front) ─────────────────────────
      for (const layer of layers) {
        for (const s of layer.stars) {
          // Drift
          s.x += s.dx
          s.y += s.dy

          // Wrap X
          if (s.x < -2) s.x = W + 2
          if (s.x > W + 2) s.x = -2
          // Wrap Y across full page height
          if (s.y < 0)       s.y = totalH
          if (s.y > totalH)  s.y = 0

          // Screen Y: far layers lag slightly behind scroll (depth parallax)
          const drawY = s.y - scrollY * (1 - layer.parallax)

          // Cull off-screen
          if (drawY < -2 || drawY > H + 2) continue

          // Twinkle
          const twinkle = Math.sin(elapsed * s.twinkleSpeed + s.phase) * s.twinkleAmp
          const drawOp  = Math.max(0.05, Math.min(1, s.o + twinkle))

          // Halo for larger stars (white-blue, source-over)
          if (s.r > 1.0) {
            const haloR = s.r * 4
            const grad  = ctx.createRadialGradient(s.x, drawY, 0, s.x, drawY, haloR)
            grad.addColorStop(0, `rgba(200,215,255,${drawOp * 0.35})`)
            grad.addColorStop(1, 'rgba(200,215,255,0)')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.arc(s.x, drawY, haloR, 0, Math.PI * 2)
            ctx.fill()
          }

          // Core dot
          ctx.beginPath()
          ctx.arc(s.x, drawY, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${drawOp})`
          ctx.fill()
        }
      }
    }

    function onScroll() {
      scrollY = window.scrollY || window.pageYOffset || 0
    }

    function init() {
      resize()
      createAll()
      onScroll()
      raf = requestAnimationFrame(draw)

      // Lenis smooth-scroll integration
      if (window.__lenis) {
        window.__lenis.on('scroll', ({ scroll }) => { scrollY = scroll })
      }

      // Extend field after Three.js/GSAP finish expanding the DOM
      setTimeout(extendIfGrown, 400)
      setTimeout(extendIfGrown, 1200)
      setTimeout(extendIfGrown, 3000)
    }

    init()

    const onResize = () => { resize(); createAll() }
    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
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
