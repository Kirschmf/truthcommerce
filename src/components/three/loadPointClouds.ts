type PointCloudPayload = Record<string, number[]>

const cache = new Map<string, Promise<Record<number, Float32Array>>>()

export async function loadPointCloudSet(url: string) {
  let request = cache.get(url)

  if (!request) {
    request = fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load point cloud set: ${url}`)
        }
        return response.json() as Promise<PointCloudPayload>
      })
      .then((payload) =>
        Object.fromEntries(
          Object.entries(payload).map(([count, values]) => [Number(count), Float32Array.from(values)]),
        ),
      )

    cache.set(url, request)
  }

  return request
}
