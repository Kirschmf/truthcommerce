const SERVICE_ITEMS = [
  {
    index: '01',
    title: 'Consultoria em E-commerce 360º',
    text: 'Com uma metodologia única que abraça planejamento, criação e execução, focamos em resultados de longo prazo. Nossa visão é construir não apenas um e-commerce bem-sucedido, mas uma marca duradoura que continua a crescer e se adaptar às mudanças do mercado. Nossa Consultoria em E-commerce vai além das soluções padrão. Nossa abordagem é totalmente personalizada, combinando análise de dados profunda com criatividade inovadora para desenvolver estratégias que não apenas atendem, mas superam suas metas de e-commerce. Especialistas em cada área do e-commerce trabalham juntos para cobrir todos os aspectos do seu negócio, garantindo que cada detalhe contribua para o seu crescimento.',
  },
  {
    index: '02',
    title: 'Construção de E-commerce',
    text: 'Quer lançar seu próprio e-commerce de sucesso? Nós temos a solução perfeita para você! Oferecemos serviços especializados de construção de e-commerce premium, sob medida para suas necessidades. Aumente suas vendas online e conquiste novos clientes. Não perca tempo, entre em contato conosco agora mesmo e comece a construir seu império digital!',
  },
  {
    index: '03',
    title: 'Estratégia de Ranqueamento em Marketplace',
    text: 'Quer se destacar nos marketplaces e aumentar suas vendas? Nós temos a estratégia perfeita de ranqueamento para você! Com nossa expertise em otimização de produtos e conhecimento dos algoritmos dos marketplaces, podemos impulsionar sua visibilidade e colocar seus produtos no topo das buscas. Aumente sua relevância, conquiste mais clientes e maximize seu sucesso no marketplace. Entre em contato conosco agora mesmo e comece a subir no ranking!',
  },
  {
    index: '04',
    title: 'Logística Integrada',
    text: 'Procurando uma solução de logística integrada para o seu e-commerce? Temos exatamente o que você precisa! Nossa expertise em logística integrada permite que você simplifique suas operações de entrega, gerenciando de forma eficiente todo o processo. Garanta entregas rápidas, rastreamento de pedidos em tempo real e uma experiência impecável para seus clientes. Entre em contato conosco hoje mesmo e leve seu e-commerce a um novo patamar!',
  },
  {
    index: '05',
    title: 'Dropshipping Profissional',
    text: 'Quer iniciar um negócio de dropshipping de sucesso? Conte com nosso serviço de Dropshipping Profissional! Com nossa expertise em gerenciamento de fornecedores, processos de pedido e logística, oferecemos soluções completas para você iniciar e expandir seu negócio de dropshipping. Esqueça as preocupações com estoque e envio — deixe tudo por nossa conta! Entre em contato conosco agora mesmo e comece a construir um negócio lucrativo de dropshipping!',
  },
  {
    index: '06',
    title: 'Especialistas NuvemShop',
    text: 'Com nossa experiência e conhecimento especializado na plataforma NuvemShop, oferecemos soluções personalizadas para impulsionar seu e-commerce. Desde a criação e customização da sua loja até estratégias de marketing e otimização de conversão, estamos aqui para ajudar você a alcançar o sucesso online. Entre em contato conosco hoje mesmo e leve sua loja para o topo!',
  },
  {
    index: '07',
    title: 'Especialistas Shopify',
    text: 'Com nossa expertise na plataforma Shopify, oferecemos soluções personalizadas e estratégias eficientes para maximizar suas vendas e melhorar a experiência do cliente. Desde a criação e design da loja até a otimização de conversão e integração de aplicativos, estamos aqui para ajudar você a alcançar resultados excepcionais. Entre em contato conosco hoje mesmo e leve sua loja Shopify ao próximo nível!',
  },
]

const CTA_HREF = 'https://wa.me/SEUNUMEROAQUI'

export default function NossosServicosPage() {
  return (
    <main>
      <section className="relative overflow-hidden px-[5%] pt-36 pb-18 md:pt-44 md:pb-24">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-[1180px] mx-auto grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--green)] mb-6">
              <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
              Nossos Serviços
            </span>
            <h1 className="font-heading text-[clamp(2.2rem,7vw,4.8rem)] font-semibold leading-[1.02] tracking-[-0.04em] max-w-[10ch]">
              Conheça as soluções premium que oferecemos para sua empresa
            </h1>
          </div>

          <div className="space-y-6 text-text-muted text-[1rem] md:text-[1.08rem] leading-[1.8] max-w-[560px]">
            <p>
              A Truth é lider porque se preocupa com os resultados de seus clientes. Entenda o que podemos oferecer para você.
            </p>
            <p>
              Desenvolvemos soluções personalizadas e inovadoras para ajudar empresas a terem sucesso online.
            </p>
            <p>
              Com nossa expertise em tecnologia e conhecimento do mercado, entregamos soluções que aumentam as vendas, melhoram a experiência do cliente e impulsionam o crescimento.
            </p>
            <p>
              Se você está pronto para levar seu e-commerce para o próximo nível, nós estamos aqui para ajudar.
            </p>
            <p className="text-text-main">Vamos juntos construir uma história de sucesso no comércio eletrônico!</p>
          </div>
        </div>
      </section>

      <section id="servicos-page" className="px-[5%] py-18 md:py-24">
        <div className="max-w-[1180px] mx-auto">
          <div className="mb-12 md:mb-16 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--green)] mb-4">
                Arquitetura Comercial
              </p>
              <h2 className="font-heading text-[clamp(1.9rem,5vw,3.2rem)] font-semibold tracking-[-0.03em] leading-[1.08] max-w-[14ch]">
                Soluções desenhadas para crescer junto com a sua operação.
              </h2>
            </div>
            <a
              href={CTA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[13px] font-medium tracking-[0.02em] transition-all duration-300 hover:border-[var(--green)] hover:text-[var(--green)]"
            >
              Falar com especialista <span>→</span>
            </a>
          </div>

          <div className="grid gap-6 md:gap-8">
            {SERVICE_ITEMS.map((item) => (
              <article
                key={item.title}
                className="group grid gap-5 rounded-[24px] border border-white/[0.07] bg-white/[0.02] p-6 md:p-8 lg:grid-cols-[120px_1fr] lg:gap-8 transition-colors duration-300 hover:border-[var(--green)]/30"
              >
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--green)]">
                  {item.index}
                </div>
                <div>
                  <h3 className="font-heading text-[1.45rem] md:text-[1.8rem] font-semibold tracking-[-0.02em] leading-[1.15] mb-4 text-text-main">
                    {item.title}
                  </h3>
                  <p className="text-text-muted text-[0.98rem] md:text-[1.05rem] leading-[1.8]">
                    {item.text}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-[5%] pt-4 pb-20 md:pb-28">
        <div className="max-w-[1180px] mx-auto rounded-[28px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(7,221,43,0.08),rgba(255,255,255,0.02))] px-6 py-10 md:px-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--green)] mb-4">
                Próximo passo
              </p>
              <h2 className="font-heading text-[clamp(1.8rem,4.5vw,3rem)] font-semibold tracking-[-0.03em] leading-[1.08] mb-4 max-w-[16ch]">
                Sua operação merece uma estrutura preparada para vender mais.
              </h2>
              <p className="text-text-muted text-[1rem] md:text-[1.05rem] leading-[1.75] max-w-[58ch]">
                Reunimos estratégia, tecnologia, operação e performance para transformar cada etapa do seu e-commerce em vantagem competitiva.
              </p>
            </div>
            <a
              href={CTA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-[#EBEBEB] px-7 py-3.5 text-[13px] font-medium text-[#050505] transition-all duration-300 hover:bg-white hover:-translate-y-px"
            >
              Solicitar diagnóstico <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
