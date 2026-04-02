import * as THREE from 'three'

let cached = null

export default function createGlowTexture() {
  if (cached) return cached

  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const half = size / 2
  const grd = ctx.createRadialGradient(half, half, 0, half, half, half)
  grd.addColorStop(0.0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.2, 'rgba(255,255,255,1)')
  grd.addColorStop(0.35, 'rgba(255,255,255,0.6)')
  grd.addColorStop(0.5, 'rgba(255,255,255,0.08)')
  grd.addColorStop(0.65, 'rgba(0,0,0,0)')

  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  cached = texture
  return texture
}
