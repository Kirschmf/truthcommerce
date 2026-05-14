const cache = new Map<string, Promise<Record<number, Float32Array>>>()

function decode(buffer: ArrayBuffer) {
  const output: Record<number, Float32Array> = {}
  let offset = 0

  while (offset < buffer.byteLength) {
    const header = new Uint32Array(buffer, offset, 2)
    const count = header[0] ?? 0
    const length = header[1] ?? 0
    offset += header.byteLength

    output[count] = new Float32Array(buffer.slice(offset, offset + length * 4))
    offset += length * 4
  }

  return output
}

export async function loadPointCloudSet(url: string) {
  let request = cache.get(url)

  if (!request) {
    request = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load point cloud set: ${url}`)
        }
        return response.arrayBuffer()
      })
      .then(decode)

    cache.set(url, request)
  }

  return request
}
