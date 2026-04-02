import * as THREE from 'three'

/**
 * Sample N points on the surface of a GLTF model.
 * Returns Float32Array of length N*3 with xyz positions.
 * Faithfully replicates legacy algorithm: area-weighted CDF + barycentric sampling.
 */
export default function sampleGLB(gltf, count) {
  const triangles = []
  let totalArea = 0

  gltf.scene.traverse((child) => {
    if (!child.isMesh) return
    if (/Text|Backdrop|Side/i.test(child.name)) return

    let geo = child.geometry.clone()
    geo.applyMatrix4(child.matrixWorld)
    if (geo.index) geo = geo.toNonIndexed()

    const pos = geo.getAttribute('position')
    const vA = new THREE.Vector3()
    const vB = new THREE.Vector3()
    const vC = new THREE.Vector3()
    const ab = new THREE.Vector3()
    const ac = new THREE.Vector3()

    for (let i = 0; i < pos.count; i += 3) {
      vA.fromBufferAttribute(pos, i)
      vB.fromBufferAttribute(pos, i + 1)
      vC.fromBufferAttribute(pos, i + 2)

      ab.subVectors(vB, vA)
      ac.subVectors(vC, vA)
      const area = ab.cross(ac).length() * 0.5

      if (area < 0.00001) continue

      triangles.push({ vA: vA.clone(), vB: vB.clone(), vC: vC.clone(), area })
      totalArea += area
    }

    geo.dispose()
  })

  // Build CDF
  const cdf = new Float64Array(triangles.length)
  let cumulative = 0
  for (let i = 0; i < triangles.length; i++) {
    cumulative += triangles[i].area / totalArea
    cdf[i] = cumulative
  }

  // Normalize model height to 5.5
  const box = new THREE.Box3()
  for (const tri of triangles) {
    box.expandByPoint(tri.vA)
    box.expandByPoint(tri.vB)
    box.expandByPoint(tri.vC)
  }
  const sizeY = box.max.y - box.min.y
  const scale = sizeY > 0 ? 5.5 / sizeY : 1
  const center = new THREE.Vector3()
  box.getCenter(center)

  // Sample points
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const r = Math.random()
    // Binary search in CDF
    let lo = 0, hi = cdf.length - 1
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (cdf[mid] < r) lo = mid + 1
      else hi = mid
    }

    const tri = triangles[lo]
    // Barycentric sampling
    let u = Math.random()
    let v = Math.random()
    if (u + v > 1) { u = 1 - u; v = 1 - v }
    const w = 1 - u - v

    const ix = i * 3
    positions[ix]     = (tri.vA.x * w + tri.vB.x * u + tri.vC.x * v - center.x) * scale
    positions[ix + 1] = (tri.vA.y * w + tri.vB.y * u + tri.vC.y * v - center.y) * scale
    positions[ix + 2] = (tri.vA.z * w + tri.vB.z * u + tri.vC.z * v - center.z) * scale
  }

  return positions
}
