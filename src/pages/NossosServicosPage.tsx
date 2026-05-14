import { PRIMARY_CONTACT_HREF } from '../config/site'

interface ServiceItem {
  index: string
  title: string
  text: string
}

const SERVICE_ITEMS: ServiceItem[] = [
  {
    index: '01',
    title: 'Consultoria em E-commerce 360º',
    text: 'Se o seu e-commerce vende abaixo do potencial, nós encontramos exatamente onde está o gargalo. Analisamos operação, catálogo, tecnologia, conversão e canais de venda para construir um plano claro de crescimento. O foco é simples: aumentar receita, proteger margem e transformar sua estrutura em um ativo que suporta escala de verdade.',
  },
  {
    index: '02',
    title: 'Construção de E-commerce',
    text: 'Criamos lojas virtuais pensadas para vender desde o primeiro acesso. Estruturamos experiência, arquitetura, integrações e operação para que sua empresa entre no digital com segurança e profissionalismo. Você não recebe apenas um site bonito — recebe uma base comercial preparada para converter mais e crescer sem retrabalho.',
  },
  {
    index: '03',
    title: 'Estratégia de Ranqueamento em Marketplace',
    text: 'Seus produtos precisam aparecer antes dos concorrentes para vender mais todos os dias. Trabalhamos posicionamento, estrutura de anúncio, atributos, catálogo e inteligência operacional para aumentar visibilidade e relevância dentro dos marketplaces. O resultado buscado é mais tráfego qualificado, mais giro e mais faturamento com previsibilidade.',
  },
  {
    index: '04',
    title: 'Logística Integrada',
    text: 'Toda venda perdida por atraso, erro de estoque ou falha operacional custa caro. Organizamos sua logística para que pedidos, estoque, expedição e acompanhamento funcionem como um sistema único. Isso melhora a experiência do cliente, reduz ruído interno e cria uma operação preparada para sustentar volume com eficiência.',
  },
  {
    index: '05',
    title: 'Especialistas em Marketplace',
    text: 'Se a sua empresa quer vender com força em canais como NuvemShop, Shopify e ecossistemas de marketplace, nós assumimos a parte estratégica e técnica. Estruturamos loja, integrações, vitrine, conversão e rotina operacional para acelerar vendas com consistência. Você ganha mais velocidade de execução e uma presença digital muito mais competitiva.',
  },
]

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
              A Truth entra onde a maioria das empresas trava: operação desorganizada, estrutura fraca e vendas abaixo do potencial.
            </p>
            <p>
              Nosso trabalho é transformar tecnologia, catálogo, integração e execução comercial em crescimento real para o seu negócio.
            </p>
            <p>
              Cada solução abaixo foi pensada para gerar mais vendas, mais previsibilidade e uma operação pronta para escalar sem perder margem no caminho.
            </p>
            <p>
              Se a sua empresa quer crescer com segurança no digital, você precisa de uma estrutura que aguente o volume e converta melhor.
            </p>
            <p className="text-text-main">É isso que nós construímos com você.</p>
          </div>
        </div>
      </section>

      <section id="servicos-page" className="px-[5%] py-18 md:py-24">
        <div className="max-w-[1180px] mx-auto">
          <div className="mb-12 md:mb-16">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--green)] mb-4">
              Arquitetura Comercial
            </p>
            <h2 className="font-heading text-[clamp(1.9rem,5vw,3.2rem)] font-semibold tracking-[-0.03em] leading-[1.08] max-w-[14ch]">
              Soluções pensadas para destravar vendas e sustentar escala.
            </h2>
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

      <section className="px-[5%] pt-4 pb-8 md:pb-12">
        <div className="max-w-[1180px] mx-auto rounded-[28px] border border-white/[0.08] bg-[linear-gradient(135deg,rgba(7,221,43,0.08),rgba(255,255,255,0.02))] px-6 py-10 md:px-10 md:py-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--green)] mb-4">
                Próximo passo
              </p>
              <h2 className="font-heading text-[clamp(1.8rem,4.5vw,3rem)] font-semibold tracking-[-0.03em] leading-[1.08] mb-4 max-w-[16ch]">
                Se a sua estrutura não suporta crescimento, a sua venda para antes da escala.
              </h2>
              <p className="text-text-muted text-[1rem] md:text-[1.05rem] leading-[1.75] max-w-[58ch]">
                Nós unimos estratégia, tecnologia e operação para montar uma base comercial capaz de vender mais hoje e crescer com segurança amanhã.
              </p>
            </div>
            <a
              href={PRIMARY_CONTACT_HREF}
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
