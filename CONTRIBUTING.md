# Contribuindo

## Fluxo recomendado

1. Atualize a branch local
2. Faça mudanças pequenas e coesas
3. Rode a suíte de qualidade:

```bash
npm run typecheck
npm run lint
npm run build
npm run test:run
npm run test:e2e
```

4. Revise acessibilidade e comportamento responsivo
5. Só então abra PR ou faça push

## Convenções

- Componentes: PascalCase
- Hooks: `use*`
- Código: inglês
- Conteúdo da interface: português
- Evite hardcodes de contato; use `src/config/site.ts`

## Regras importantes

- Não delete `archive/`
- Preserve a compatibilidade visual da home
- Trate performance como requisito, não como refinamento opcional
- Para animações scroll-driven, prefira o padrão já existente com GSAP e `useGSAP`
