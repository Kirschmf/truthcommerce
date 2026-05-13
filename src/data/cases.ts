import type { CaseStudy } from '../types/site'

export const CASES: CaseStudy[] = [
  {
    id: '01',
    client: 'SOPY',
    segment: 'Higiene & Cuidados',
    headline: 'Loja Online de Lava Roupas em Cápsulas',
    intro: 'Só colocar na máquina e dissolve 100%',
    description:
      'Estruturação completa na Nuvemshop, com o plano Nuvemshop Next conseguimos desenvolver uma loja personalizada e exclusiva.',
    metrics: [
      { label: 'Canais Ativos', value: 1, suffix: '', prefix: '' },
      { label: '2 Meses de Operação', value: 50, suffix: ' Vendas', prefix: '+' },
      { label: 'Estoque Sincronizado', value: 100, suffix: '%', prefix: '' },
    ],
    stack: {
      erp: { name: 'Omie', present: true },
      ecommerce: { name: 'Nuvemshop', present: true },
      marketplaces: [],
    },
    cta: { label: 'Visitar loja', href: 'https://www.sopy.com.br/', type: 'ecommerce' },
    img: '/assets/images/sopy-print.png',
  },
  {
    id: '02',
    client: 'MP DISTRIBUIDORA',
    segment: 'Distribuição & Atacado',
    headline: 'Tabacaria e Bebidas com Operação digital',
    intro: 'Distribuidor exclusivo RS — GUDANG GARAM. Cigarros, bebidas e produtos de tabacaria.',
    description:
      'Operação digital direta para revenda e consumidor final, com automação de pedidos e estoque integrados ao ERP. Canal próprio sem dependência de marketplace.',
    metrics: [
      { label: 'Estoque Sincronizado', value: 100, suffix: '%', prefix: '' },
      { label: 'Meios de Pagamento', value: 'Cartão e PIX', suffix: '', prefix: '' },
      { label: 'Automação total', value: 100, suffix: '%', prefix: '' },
    ],
    stack: {
      erp: { name: 'Bling', present: true },
      ecommerce: { name: 'Shopify', present: true },
      marketplaces: [],
    },
    cta: { label: 'Visitar loja', href: 'https://mpdistribuidorars.com.br/', type: 'ecommerce' },
    img: '/assets/images/mp-print.png',
  },
  {
    id: '03',
    client: 'NEXT EVENTOS',
    segment: 'Eventos & Entretenimento',
    headline: 'Plataforma de Venda de Tickets Sob Medida',
    intro: 'Site de venda de tickets esportivos e para eventos no geral.',
    description:
      'Plataforma desenvolvida em código próprio (Vite + React + TypeScript + Postgres 17 + PL/pgSQL), com gestão de operação via CRM dedicado em vez de ERP tradicional.',
    metrics: [
      { label: 'Sync em tempo real', value: 100, suffix: '%', prefix: '' },
      { label: 'Pedidos por mês', value: 1800, suffix: '+', prefix: '' },
      { label: 'Ruptura de estoque', value: 0, suffix: '%', prefix: '' },
    ],
    stack: {
      erp: { name: 'Não utiliza ERP — gestão via CRM', present: false },
      ecommerce: { name: 'Custom · Vite + React + TypeScript', present: true },
      marketplaces: [],
    },
    cta: { label: 'Visitar loja', href: 'https://nexteventosbrasil.com/', type: 'custom' },
    img: '/assets/images/next-print.png',
  },
  {
    id: '04',
    client: 'JOHNNY COOKER',
    segment: 'Cozinha & Churrasco',
    headline: 'Loja Online de Produtos de Cozinha e Churrasco',
    intro: 'Marca brasileira para cozinha, churrasco e adega — estética, funcionalidade e durabilidade.',
    description:
      'Reestruturação de catálogo, UX de checkout e integração entre ERP e plataforma de e-commerce. Foco em experiência de marca.',
    metrics: [
      { label: 'Sincronização de estoque', value: 100, suffix: '%', prefix: '' },
      { label: 'Meios de Pagamento', value: 'Cartão e PIX', suffix: '', prefix: '' },
      { label: 'Prazo do projeto', value: 60, suffix: ' dias', prefix: '' },
    ],
    stack: {
      erp: { name: 'Bling', present: true },
      ecommerce: { name: 'Shopify', present: true },
      marketplaces: [],
    },
    cta: { label: 'Visitar loja', href: 'https://johnnycooker.com.br/', type: 'ecommerce' },
    img: '/assets/images/johny-print.png',
  },
  {
    id: '05',
    client: 'HYPE KBEAUTY',
    segment: 'Beleza & K-Beauty',
    headline: 'Loja de Skincare Coreano com Operação Digital Completa',
    intro: 'Curadoria especializada em cosméticos coreanos — skincare e autocuidado.',
    description:
      'Arquitetura de catálogo com taxonomia técnica, tratamento de ativos visuais e integração ERP/loja. Operação 100% canal próprio com foco em curadoria.',
    metrics: [
      { label: 'Produtos Estruturados', value: 50, suffix: '', prefix: '+' },
      { label: 'Meios de Pagamento', value: 'Cartão e PIX', suffix: '', prefix: '' },
      { label: 'Canais ativos', value: 1, suffix: '', prefix: '' },
    ],
    stack: {
      erp: { name: 'Bling', present: true },
      ecommerce: { name: 'Nuvemshop', present: true },
      marketplaces: [],
    },
    cta: { label: 'Visitar loja', href: 'https://www.hypekbeauty.com.br/', type: 'ecommerce' },
    img: '/assets/images/kbeauty-print.png',
  },
  {
    id: '06',
    client: 'CAFE CARANDAI',
    segment: 'Alimentação & Café',
    headline: 'Loja Online de Café com Operação Digital Completa',
    intro: 'Café 100% arábica das montanhas de Minas Gerais — tradição mineira e sabor marcante.',
    description:
      'Entrada no digital com estrutura completa: loja própria, integração ERP, expansão para os principais marketplaces e automação de pedidos.',
    metrics: [
      { label: 'Sincronização de estoque', value: 100, suffix: '%', prefix: '' },
      { label: 'Canais ativos', value: 4, suffix: '', prefix: '' },
      { label: 'Configuração Fiscal', value: 100, suffix: '%', prefix: '' },
    ],
    stack: {
      erp: { name: 'Bling', present: true },
      ecommerce: { name: 'Nuvemshop', present: true },
      marketplaces: ['Mercado Livre', 'Shopee', 'Amazon'],
    },
    cta: { label: 'Visitar loja', href: 'https://cafecarandai.com.br/', type: 'ecommerce' },
    img: '/assets/images/cafe-print.png',
  },
]

export default CASES
