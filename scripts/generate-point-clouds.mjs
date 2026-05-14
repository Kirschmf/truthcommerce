import { writeFile } from 'node:fs/promises'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import sampleGLB from '../src/components/three/sampleGLB.js'

globalThis.self = globalThis

globalThis.ProgressEvent = class ProgressEvent {
  constructor(type, init = {}) {
    this.type = type
    Object.assign(this, init)
  }
}

const MODELS = [
  {
    name: 'foguete',
    url: 'http://127.0.0.1:43123/assets/models/foguete.glb',
    output: '/home/matheuskirsch/truth-site/public/assets/models/foguete.points.bin',
    counts: [2500, 5000, 8000],
  },
  {
    name: 'astronaut',
    url: 'http://127.0.0.1:43123/assets/models/astronaut.glb',
    output: '/home/matheuskirsch/truth-site/public/assets/models/astronaut.points.bin',
    counts: [2500, 3500, 5000, 8000, 9000],
  },
  {
    name: 'satellite',
    url: 'http://127.0.0.1:43123/assets/models/satellite.glb',
    output: '/home/matheuskirsch/truth-site/public/assets/models/satellite.points.bin',
    counts: [6000],
  },
]

function loadGltf(url) {
  const loader = new GLTFLoader()
  return new Promise((resolve, reject) => {
    loader.load(url, resolve, undefined, reject)
  })
}

for (const model of MODELS) {
  const gltf = await loadGltf(model.url)
  const chunks = []

  for (const count of model.counts) {
    const sampled = sampleGLB(gltf, count)
    const header = new Uint32Array([count, sampled.length])
    chunks.push(Buffer.from(header.buffer))
    chunks.push(Buffer.from(sampled.buffer))
  }

  await writeFile(model.output, Buffer.concat(chunks))
  console.log(`generated ${model.name}`)
}
