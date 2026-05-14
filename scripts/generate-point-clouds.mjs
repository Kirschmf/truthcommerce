import { writeFile } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import sampleGLB from '../src/components/three/sampleGLB.js'

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
    output: '/home/matheuskirsch/truth-site/public/assets/models/foguete.points.json',
    counts: [2500, 5000, 8000],
  },
  {
    name: 'astronaut',
    url: 'http://127.0.0.1:43123/assets/models/astronaut.glb',
    output: '/home/matheuskirsch/truth-site/public/assets/models/astronaut.points.json',
    counts: [2500, 3500, 5000, 8000, 9000],
  },
  {
    name: 'satellite',
    url: 'http://127.0.0.1:43123/assets/models/satellite.glb',
    output: '/home/matheuskirsch/truth-site/public/assets/models/satellite.points.json',
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
  const payload = {}

  for (const count of model.counts) {
    const sampled = sampleGLB(gltf, count)
    payload[count] = Array.from(sampled)
  }

  await writeFile(model.output, JSON.stringify(payload))
  console.log(`generated ${model.name} -> ${pathToFileURL(model.output).href}`)
}
