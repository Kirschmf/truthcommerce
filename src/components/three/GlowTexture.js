import * as THREE from 'three'

let cached = null

export default function createGlowTexture() {
  if (cached) return cached

  const size = 1024
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  const half = size / 2
  const grd = ctx.createRadialGradient(half, half, 0, half, half, half)
  grd.addColorStop(0.0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.15, 'rgba(255,255,255,0.9)')
  grd.addColorStop(0.4, 'rgba(255,255,255,0.3)')
  grd.addColorStop(1.0, 'rgba(0,0,0,0)')

  ctx.fillStyle = grd
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearMipMapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = true
  cached = texture
  return texture
}
