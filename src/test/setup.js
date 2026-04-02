import '@testing-library/jest-dom'

// Mock matchMedia for GSAP ScrollTrigger in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
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

// Mock ResizeObserver for R3F
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver

// Mock Canvas contexts for Three.js/R3F and 2D starfield
const originalGetContext = HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = function (type, ...args) {
  if (type === '2d') {
    const noop = () => {}
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
      get fillStyle() { return '#000' },
      set fillStyle(_v) {},
      get strokeStyle() { return '#000' },
      set strokeStyle(_v) {},
      get font() { return '10px sans-serif' },
      set font(_v) {},
      getImageData: () => ({ data: new Uint8ClampedArray(4) }),
      putImageData: noop,
    }
  }
  if (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl') {
    return {
      canvas: this,
      getExtension: () => null,
      getParameter: () => 0,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      getShaderParameter: () => true,
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      getProgramParameter: () => true,
      useProgram: () => {},
      createBuffer: () => ({}),
      bindBuffer: () => {},
      bufferData: () => {},
      enable: () => {},
      disable: () => {},
      depthFunc: () => {},
      clearColor: () => {},
      clear: () => {},
      viewport: () => {},
      createTexture: () => ({}),
      bindTexture: () => {},
      texImage2D: () => {},
      texParameteri: () => {},
      activeTexture: () => {},
      generateMipmap: () => {},
      pixelStorei: () => {},
      blendFunc: () => {},
      blendEquation: () => {},
      drawArrays: () => {},
      drawElements: () => {},
      getShaderInfoLog: () => '',
      getProgramInfoLog: () => '',
      getAttribLocation: () => 0,
      getUniformLocation: () => ({}),
      uniform1i: () => {},
      uniform1f: () => {},
      uniform2f: () => {},
      uniform3f: () => {},
      uniform4f: () => {},
      uniformMatrix4fv: () => {},
      enableVertexAttribArray: () => {},
      vertexAttribPointer: () => {},
      createFramebuffer: () => ({}),
      bindFramebuffer: () => {},
      framebufferTexture2D: () => {},
      checkFramebufferStatus: () => 36053,
      deleteFramebuffer: () => {},
      deleteTexture: () => {},
      deleteBuffer: () => {},
      deleteShader: () => {},
      deleteProgram: () => {},
      scissor: () => {},
      colorMask: () => {},
      stencilFunc: () => {},
      stencilOp: () => {},
      stencilMask: () => {},
      createRenderbuffer: () => ({}),
      bindRenderbuffer: () => {},
      renderbufferStorage: () => {},
      framebufferRenderbuffer: () => {},
      getSupportedExtensions: () => [],
      getContextAttributes: () => ({}),
      isContextLost: () => false,
      drawingBufferWidth: 800,
      drawingBufferHeight: 600,
    }
  }
  return null
}
