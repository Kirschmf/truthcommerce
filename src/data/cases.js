export const CASES = [
  {
    id: '01',
    client: 'SOPY',
    segment: 'Higiene & Cuidados',
    headline: '+340% de GMV em 6 meses',
    intro: 'Venda de cápsulas de sabão para máquinas de lavar.',
    description:
      'Migração completa de PDV físico para ecossistema digital. Estrutura de canal próprio com integração ao ERP, catálogo unificado e operação de loja online enxuta.',
    metrics: [
      { label: 'Crescimento GMV', value: 340, suffix: '%', prefix: '+' },
      { label: 'Marketplaces integrados', value: 0, suffix: '', prefix: '' },
      { label: 'Dias de implementação', value: 21, suffix: 'd', prefix: '' },
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
    headline: 'Canal direto B2B/B2C operacional',
    intro: 'Distribuidor exclusivo RS — GUDANG GARAM. Cigarros, bebidas e produtos de tabacaria.',
    description:
      'Operação digital direta para revenda e consumidor final, com automação de pedidos e estoque integrados ao ERP. Canal próprio sem dependência de marketplace.',
    metrics: [
      { label: 'Sync em tempo real', value: 100, suffix: '%', prefix: '' },
      { label: 'Setup em', value: 48, suffix: 'h', prefix: '' },
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
    headline: 'Plataforma de tickets sob medida',
    intro: 'Site de venda de tickets esportivos para eventos no geral.',
    description:
      'Plataforma desenvolvida em código próprio (Next.js + React + banco de dados relacional), com gestão de operação via CRM dedicado em vez de ERP tradicional.',
    metrics: [
      { label: 'Sync em tempo real', value: 100, suffix: '%', prefix: '' },
      { label: 'Pedidos por mês', value: 1800, suffix: '+', prefix: '' },
      { label: 'Ruptura de estoque', value: 0, suffix: '%', prefix: '' },
    ],
    stack: {
      erp: { name: 'Não utiliza ERP — gestão via CRM', present: false },
      ecommerce: { name: 'Custom · Next.js + React', present: true },
      marketplaces: [],
    },
    cta: null,
    img: '/assets/images/next-print.png',
  },
  {
    id: '04',
    client: 'JOHNNY COOKER',
    segment: 'Cozinha & Churrasco',
    headline: '+218% de conversão',
    intro: 'Marca brasileira para cozinha, churrasco e adega — estética, funcionalidade e durabilidade.',
    description:
      'Reestruturação de catálogo, UX de checkout e integração entre ERP e plataforma de e-commerce. Foco em experiência de marca e ticket médio.',
    metrics: [
      { label: 'Aumento de conversão', value: 218, suffix: '%', prefix: '+' },
      { label: 'Ticket médio', value: 2, suffix: 'x', prefix: '' },
      { label: 'Prazo do projeto', value: 90, suffix: 'd', prefix: '' },
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
    headline: '3.200 SKUs catalogados do zero',
    intro: 'Curadoria especializada em cosméticos coreanos — skincare e autocuidado.',
    description:
      'Arquitetura de catálogo com taxonomia técnica, tratamento de ativos visuais e integração ERP/loja. Operação 100% canal próprio com foco em curadoria.',
    metrics: [
      { label: 'SKUs estruturados', value: 3200, suffix: '', prefix: '' },
      { label: 'Redução de erros', value: 94, suffix: '%', prefix: '-' },
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
    headline: '+180% de receita online',
    intro: 'Café 100% arábica das montanhas de Minas Gerais — tradição mineira e sabor marcante.',
    description:
      'Entrada no digital com estrutura completa: loja própria, integração ERP, expansão para Mercado Livre e automação de pedidos.',
    metrics: [
      { label: 'Crescimento de receita', value: 180, suffix: '%', prefix: '+' },
      { label: 'Canais ativos', value: 2, suffix: '', prefix: '' },
      { label: 'Tempo de setup', value: 30, suffix: 'd', prefix: '' },
    ],
    stack: {
      erp: { name: 'Bling', present: true },
      ecommerce: { name: 'Nuvemshop', present: true },
      marketplaces: ['Mercado Livre'],
    },
    cta: { label: 'Visitar loja', href: 'https://cafecarandai.com.br/', type: 'ecommerce' },
    img: '/assets/images/cafe-print.png',
  },
]

export default CASES
