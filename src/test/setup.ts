import '@testing-library/jest-dom'
import { vi } from 'vitest'

window.pipedriveLeadboosterConfig = undefined
window.LeadBooster = {
  q: [],
  on: vi.fn(),
  trigger: vi.fn(),
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver

const originalGetContext = HTMLCanvasElement.prototype.getContext.bind(
  HTMLCanvasElement.prototype,
)

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
    const noop = () => {}

    if (type === '2d') {
      return {
        canvas: this,
        clearRect: noop,
        fillRect: noop,
        fillText: noop,
        strokeRect: noop,
        beginPath: noop,
        closePath: noop,
        moveTo: noop,
        lineTo: noop,
        arc: noop,
        ellipse: noop,
        fill: noop,
        stroke: noop,
        save: noop,
        restore: noop,
        translate: noop,
        rotate: noop,
        scale: noop,
        drawImage: noop,
        createRadialGradient: () => ({ addColorStop: noop }),
        createLinearGradient: () => ({ addColorStop: noop }),
        setTransform: noop,
        measureText: () => ({ width: 0 }),
        get fillStyle() {
          return '#000'
        },
        set fillStyle(_value: string) {},
        get strokeStyle() {
          return '#000'
        },
        set strokeStyle(_value: string) {},
        get font() {
          return '10px sans-serif'
        },
        set font(_value: string) {},
        getImageData: () => ({ data: new Uint8ClampedArray(4) }),
        putImageData: noop,
      } as unknown as CanvasRenderingContext2D
    }

    if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
      return {
        canvas: this,
        getExtension: () => null,
        getParameter: () => 0,
        createShader: () => ({}),
        shaderSource: noop,
        compileShader: noop,
        getShaderParameter: () => true,
        createProgram: () => ({}),
        attachShader: noop,
        linkProgram: noop,
        getProgramParameter: () => true,
        useProgram: noop,
        createBuffer: () => ({}),
        bindBuffer: noop,
        bufferData: noop,
        enable: noop,
        disable: noop,
        depthFunc: noop,
        clearColor: noop,
        clear: noop,
        viewport: noop,
        createTexture: () => ({}),
        bindTexture: noop,
        texImage2D: noop,
        texParameteri: noop,
        activeTexture: noop,
        generateMipmap: noop,
        pixelStorei: noop,
        blendFunc: noop,
        blendEquation: noop,
        drawArrays: noop,
        drawElements: noop,
        getShaderInfoLog: () => '',
        getProgramInfoLog: () => '',
        getAttribLocation: () => 0,
        getUniformLocation: () => ({}),
        uniform1i: noop,
        uniform1f: noop,
        uniform2f: noop,
        uniform3f: noop,
        uniform4f: noop,
        uniformMatrix4fv: noop,
        enableVertexAttribArray: noop,
        vertexAttribPointer: noop,
        createFramebuffer: () => ({}),
        bindFramebuffer: noop,
        framebufferTexture2D: noop,
        checkFramebufferStatus: () => 36053,
        deleteFramebuffer: noop,
        deleteTexture: noop,
        deleteBuffer: noop,
        deleteShader: noop,
        deleteProgram: noop,
        scissor: noop,
        colorMask: noop,
        stencilFunc: noop,
        stencilOp: noop,
        stencilMask: noop,
        createRenderbuffer: () => ({}),
        bindRenderbuffer: noop,
        renderbufferStorage: noop,
        framebufferRenderbuffer: noop,
        getSupportedExtensions: () => [],
        getContextAttributes: () => ({}),
        isContextLost: () => false,
        drawingBufferWidth: 800,
        drawingBufferHeight: 600,
      } as unknown as WebGLRenderingContext
    }

    return originalGetContext.call(this, type as never, ...(args as []))
  },
})
