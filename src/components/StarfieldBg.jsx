import { useRef, useEffect } from 'react'

export default function StarfieldBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let raf
    let W, H
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let scrollY = 0

    // ── Parallax star layers ──────────────────────────────
    // 3 depth layers: far (slow, dim, small), mid, near (fast, bright, large)
    const layers = [
      { stars: [], speed: 0.02, drift: 0.008, sizeMin: 0.3, sizeMax: 0.7, opMin: 0.15, opMax: 0.4, parallax: 0.02 },
      { stars: [], speed: 0.04, drift: 0.015, sizeMin: 0.5, sizeMax: 1.1, opMin: 0.25, opMax: 0.65, parallax: 0.05 },
      { stars: [], speed: 0.07, drift: 0.025, sizeMin: 0.8, sizeMax: 1.6, opMin: 0.4, opMax: 0.9, parallax: 0.10 },
    ]

    // Bright accent stars that pulse with a glow
    const glowStars = []

    // ── Nebula clouds ─────────────────────────────────────
    const nebulae = []

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function createStars() {
      const area = W * H

      // Populate depth layers
      const counts = [
        Math.min(500, Math.round(area / 5000)),   // far — many small
        Math.min(300, Math.round(area / 8000)),    // mid
        Math.min(150, Math.round(area / 14000)),   // near — fewer large
      ]

      layers.forEach((layer, li) => {
        layer.stars.length = 0
        const count = counts[li]
        for (let i = 0; i < count; i++) {
          layer.stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: layer.sizeMin + Math.random() * (layer.sizeMax - layer.sizeMin),
            o: layer.opMin + Math.random() * (layer.opMax - layer.opMin),
            dx: (Math.random() - 0.5) * layer.drift,
            dy: (Math.random() - 0.5) * layer.drift * 0.4,
            // Twinkle
            phase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.3 + Math.random() * 1.2,
            twinkleAmp: 0.15 + Math.random() * 0.25,
          })
        }
      })

      // Glow stars — bright with colored halo
      glowStars.length = 0
      const glowCount = Math.min(25, Math.round(area / 80000))
      const glowColors = [
        { r: 7, g: 221, b: 43 },     // brand green
        { r: 80, g: 160, b: 255 },    // blue
        { r: 160, g: 120, b: 255 },   // purple
        { r: 255, g: 255, b: 255 },   // white
      ]
      for (let i = 0; i < glowCount; i++) {
        const color = glowColors[Math.floor(Math.random() * glowColors.length)]
        glowStars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          coreR: 1.0 + Math.random() * 1.0,
          glowR: 8 + Math.random() * 16,
          color,
          phase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.2 + Math.random() * 0.6,
          baseOp: 0.3 + Math.random() * 0.4,
          parallax: 0.03 + Math.random() * 0.07,
        })
      }

      // Nebulae — large soft gradient blobs
      nebulae.length = 0
      const nebulaConfigs = [
        { cx: 0.15, cy: 0.2, rx: 400, ry: 250, color: [7, 221, 43], op: 0.025, drift: 0.0003 },
        { cx: 0.8, cy: 0.35, rx: 350, ry: 300, color: [80, 60, 200], op: 0.03, drift: -0.0002 },
        { cx: 0.5, cy: 0.7, rx: 500, ry: 200, color: [30, 100, 255], op: 0.02, drift: 0.00015 },
        { cx: 0.25, cy: 0.85, rx: 300, ry: 350, color: [120, 40, 180], op: 0.022, drift: -0.00025 },
        { cx: 0.7, cy: 0.1, rx: 280, ry: 180, color: [7, 180, 60], op: 0.018, drift: 0.0002 },
      ]
      nebulaConfigs.forEach((cfg) => {
        nebulae.push({
          x: cfg.cx * W,
          y: cfg.cy * H,
          rx: cfg.rx * (W / 1920),
          ry: cfg.ry * (H / 1080),
          color: cfg.color,
          baseOp: cfg.op,
          phase: Math.random() * Math.PI * 2,
          breathSpeed: 0.1 + Math.random() * 0.15,
          drift: cfg.drift,
          parallax: 0.015 + Math.random() * 0.03,
        })
      })
    }

    // Throttle to ~30fps
    let lastTime = 0
    const FRAME_INTERVAL = 1000 / 30
    let elapsed = 0

    function draw(now) {
      raf = requestAnimationFrame(draw)

      const dt = now - lastTime
      if (dt < FRAME_INTERVAL) return
      lastTime = now
      elapsed += dt * 0.001

      ctx.clearRect(0, 0, W, H)

      // Base background
      ctx.fillStyle = '#040507'
      ctx.fillRect(0, 0, W, H)

      // ── Draw nebulae (soft glowing clouds) ──────────────
      ctx.globalCompositeOperation = 'screen'
      for (const n of nebulae) {
        const breathe = Math.sin(elapsed * n.breathSpeed + n.phase) * 0.4 + 0.6
        const op = n.baseOp * breathe
        const offsetY = scrollY * n.parallax

        const grd = ctx.createRadialGradient(
          n.x, n.y - offsetY, 0,
          n.x, n.y - offsetY, Math.max(n.rx, n.ry)
        )
        grd.addColorStop(0, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${op})`)
        grd.addColorStop(0.4, `rgba(${n.color[0]},${n.color[1]},${n.color[2]},${op * 0.4})`)
        grd.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = grd
        ctx.beginPath()
        ctx.ellipse(n.x, n.y - offsetY, n.rx, n.ry, 0, 0, Math.PI * 2)
        ctx.fill()

        // Slow drift
        n.x += n.drift * W * (dt * 0.001)
        if (n.x < -n.rx) n.x = W + n.rx
        if (n.x > W + n.rx) n.x = -n.rx
      }
      ctx.globalCompositeOperation = 'source-over'

      // ── Draw star layers (back to front) ────────────────
      for (const layer of layers) {
        const offsetY = scrollY * layer.parallax

        for (const s of stars_loop(layer, elapsed, offsetY)) {
          // Core dot
          ctx.beginPath()
          ctx.arc(s.drawX, s.drawY, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${s.drawOp})`
          ctx.fill()
        }
      }

      // ── Draw glow stars ─────────────────────────────────
      ctx.globalCompositeOperation = 'screen'
      for (const g of glowStars) {
        const pulse = Math.sin(elapsed * g.pulseSpeed + g.phase) * 0.35 + 0.65
        const op = g.baseOp * pulse
        const offsetY = scrollY * g.parallax

        const drawX = g.x
        const drawY = g.y - offsetY

        // Outer glow
        const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, g.glowR * pulse)
        grad.addColorStop(0, `rgba(${g.color.r},${g.color.g},${g.color.b},${op * 0.6})`)
        grad.addColorStop(0.3, `rgba(${g.color.r},${g.color.g},${g.color.b},${op * 0.15})`)
        grad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(drawX, drawY, g.glowR * pulse, 0, Math.PI * 2)
        ctx.fill()

        // Bright core
        ctx.beginPath()
        ctx.arc(drawX, drawY, g.coreR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.min(1, op * 1.8)})`
        ctx.fill()
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    // Helper: iterate a layer's stars, update positions & return draw data
    function* stars_loop(layer, time, offsetY) {
      for (const s of layer.stars) {
        s.x += s.dx
        s.y += s.dy

        // Wrap edges
        if (s.x < -2) s.x = W + 2
        if (s.x > W + 2) s.x = -2
        if (s.y < -2) s.y = H + 2
        if (s.y > H + 2) s.y = -2

        // Twinkle
        const twinkle = Math.sin(time * s.twinkleSpeed + s.phase) * s.twinkleAmp
        const drawOp = Math.max(0.05, Math.min(1, s.o + twinkle))

        yield {
          drawX: s.x,
          drawY: s.y - offsetY,
          r: s.r,
          drawOp,
        }
      }
    }

    function onScroll() {
      scrollY = window.scrollY || window.pageYOffset || 0
    }

    function init() {
      resize()
      createStars()
      onScroll()
      raf = requestAnimationFrame(draw)
    }

    init()

    const onResize = () => {
      resize()
      createStars()
    }
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
