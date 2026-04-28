# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Institutional website for **Truth Commerce** (truthcommerce.com.br) — a B2B e-commerce infrastructure company. Single-page React app with heavy 3D visuals (Three.js particle clouds, scroll-driven animations).

## Commands

```bash
npm run dev          # Start Vite dev server (HMR)
npm run build        # Production build
npm run preview      # Preview production build
npm test             # Run Vitest in watch mode
npx vitest run       # Single test run (CI-friendly)
npx vitest run src/App.test.jsx  # Run a single test file
npm run test:ui      # Vitest browser UI
npm run test:coverage  # Coverage report
npm run test:e2e       # Playwright E2E tests (launches Chromium)
npm run test:e2e:ui    # Playwright interactive UI mode
```

No linter or formatter is configured (no ESLint, Prettier, or similar).

## Architecture

### Stack
- **React 19** + **Vite 8** (ES modules, `"type": "module"`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin (no `tailwind.config.js` — theme defined in `@theme` block in `src/styles/global.css`)
- **GSAP 3.14** + ScrollTrigger for scroll animations
- **Three.js + React Three Fiber v9 + @react-three/drei** for 3D particle clouds
- **Lenis** for smooth scroll (singleton via `useLenis` hook, exposed as `window.__lenis`)
- **Framer Motion** for component transitions
- **Vitest 4 + Testing Library + jsdom** for unit tests
- **Playwright** for E2E tests (Chromium)

### App Structure
`src/main.jsx` → `<App />` renders all sections in order:

1. `StarfieldBg` — full-page 2D canvas starfield (z-behind everything)
2. `Header` — navbar with mobile menu
3. `HeroSection` — typewriter title + `HeroCanvas` (R3F particle cloud: rocket GLB → astronaut morph on scroll)
4. `AlertaCritico` — warning section with scroll reveals
5. `Metodologia` — 4-card grid
6. `LogoMarquee` — GSAP-driven logo carousel
7. `CeoSection` — sticky photo + scrolling data cards
8. `Servicos` — hover-to-swap image list
9. `CarrosselCases` — **lazy-loaded** (`React.lazy`), Three.js cylinder carousel + satellite particles
10. `Depoimentos` — testimonials section
11. `FaqSection` — GSAP accordion
12. `Footer` — CTA + parallax background

### Key Directories
```
src/components/          # Page sections (PascalCase.jsx)
src/components/three/    # R3F 3D components (HeroCanvas, CarouselCanvas, ParticleCloud, etc.)
src/hooks/               # useLenis.js, useTypewriter.js
src/styles/              # global.css (Tailwind + @theme), tokens.css (CSS custom properties)
public/assets/           # Static assets: models/*.glb, images/*, videos/
docs/                    # HTML reference/inspiration files (design mockups, not deployed)
e2e/                     # Playwright E2E test specs (e.g., home.spec.js)
archive/                 # Deprecated legacy files — NEVER delete
```

### 3D Pipeline
- GLB models (`foguete.glb`, `astronaut.glb`, `satellite.glb`) in `public/assets/models/`
- `sampleGLB.js` samples GLB mesh vertices into point cloud positions
- `ParticleCloud.jsx` renders 9K-point `<points>` with glow texture from `GlowTexture.js`
- Hero morphs rocket→astronaut via ScrollTrigger-driven position interpolation
- `AlertaCanvas` + `AstronautCloud` provide a second R3F scene for the AlertaCritico section
- Carousel uses `Carousel3D.jsx` with cylindrical geometry + satellite particle cloud

### Design System
- Colors: `--green: #07dd2b` (brand accent), `--bg-base: #040507` (deep black)
- Fonts: Sora (headings), Inter (body), Space Mono (mono) — Google Fonts
- Theme tokens defined in two places: CSS custom properties in `tokens.css` and Tailwind `@theme` block in `global.css`
- Everything is dark theme
- `body::before` in `global.css` renders an SVG noise texture overlay at `z-index: 1` with `pointer-events: none` — be careful with z-index stacking

### Scroll Architecture
- `useLenis` hook (called once in `App`) creates a singleton Lenis instance and bridges it to GSAP: `lenisInstance.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add` drives Lenis RAF
- All scroll-driven GSAP animations depend on this bridge — removing or reordering it breaks ScrollTrigger timing
- Lenis instance is exposed as `window.__lenis` for imperative access (e.g., `window.__lenis.scrollTo()`)

### Testing
- Vitest config lives in `vite.config.js` (`test` key), not a separate file
- `test.globals: true` — Vitest globals (`describe`, `it`, `expect`) are available without imports
- Test setup in `src/test/setup.js` mocks `matchMedia`, `ResizeObserver`, and canvas contexts (2D + WebGL) for jsdom compatibility with Three.js/R3F
- Playwright config (`playwright.config.js`) auto-starts `npm run dev` on port 5173 — no need to start a separate dev server for E2E tests
- E2E tests run only in Chromium (`projects` config)

## Code Conventions
- Components: PascalCase files, one per file, default export
- Hooks: `use` prefix (e.g., `useTypewriter.js`)
- GSAP animations: always use `useGSAP()` from `@gsap/react`, never `useEffect`
- Assets: import via path or reference from `public/`, never hardcode strings
- Folders: kebab-case

## Important Rules
- Always confirm with user before deleting or overwriting files
- Preserve `archive/` — never delete
- Language: project uses Portuguese for content/section names, English for code
