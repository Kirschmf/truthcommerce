# Truth Commerce Site

Site institucional da Truth Commerce construído com React, Vite, Tailwind CSS e experiências visuais 3D em Three.js / React Three Fiber.

## Stack

- React 19
- Vite 8
- Tailwind CSS v4
- GSAP + ScrollTrigger
- Three.js + React Three Fiber + Drei
- Lenis
- TypeScript gradual
- Vitest + Testing Library
- Playwright

## Requisitos

- Node 22+
- npm 10+

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run typecheck
npm run lint
npm run format
npm run format:check
npm run test:run
npm run test:e2e
```

## Estrutura

```txt
src/
  components/
  components/three/
  config/
  data/
  hooks/
  pages/
  styles/
  test/
  types/
```

## Arquitetura atual

- `src/main.tsx` monta o app com `BrowserRouter`
- `src/App.tsx` compõe layout global, rotas e navegação contextual
- `src/pages/HomePage.tsx` monta a home com seções lazy e scroll suave
- `src/pages/NossosServicosPage.tsx` expõe a página de serviços
- `src/config/site.ts` concentra URLs de contato e links institucionais

## Variáveis de ambiente

O projeto aceita estas variáveis opcionais:

```bash
VITE_WHATSAPP_URL=
VITE_CONTACT_EMAIL=
VITE_INSTAGRAM_URL=
VITE_LINKEDIN_URL=
```

Sem `VITE_WHATSAPP_URL`, o fallback de contato principal vira `mailto:`.

## Qualidade

Antes de abrir PR ou subir mudanças, rode:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:run
npm run test:e2e
```

## Deploy

Deploy principal em Vercel.

- `vercel.json` contém rewrites SPA e headers de segurança
- rotas suportadas:
  - `/`
  - `/nossos-servicos`

## Observações

- `archive/` contém materiais legados e não deve ser removido
- `docs/` contém referências visuais / inspiração e não faz parte do deploy
