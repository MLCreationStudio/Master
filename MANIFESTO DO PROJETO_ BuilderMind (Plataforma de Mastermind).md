# **MANIFESTO DO PROJETO: BuilderMind (Plataforma de Mastermind)**

**Status:** Conceito validado internamente. Pronto para estruturação do MVP via Lovable e definição de Go-to-Market.

**Autor:** Matheus Lucena | **Data:** 29/03/2026

### **O que é o BuilderMind**

O BuilderMind é a plataforma definitiva de networking de utilidade para "Construtores" (Indie Hackers, Desenvolvedores e Founders). Ele resolve a solidão empreendedora abandonando o modelo tradicional de "feed infinito" das redes sociais e apostando em Matchmaking cirúrgico. A plataforma agrupa empreendedores em estágios exatos de faturamento e visão de negócio em "Masterminds" fechados de 4 pessoas, fornecendo as ferramentas nativas para que o grupo se gerencie e cresça junto.

**Diferencial central:** O método "Anti-WhatsApp" de Accountability. Nós não entregamos apenas um chat; entregamos um gerente de projetos invisível. A plataforma embute a dinâmica de reuniões (*Hot Seat*), check-ins semanais obrigatórios e rastreamento de metas diretamente na interface de comunicação, criando uma barreira de saída (Lock-in) emocional e prática.

### **One-liner**

"A cura para a solidão empreendedora: masterminds curados por receita e accountability nativo para construtores operarem no seu máximo."

### **Por que o BuilderMind existe**

**O problema**

* **A Câmara de Eco das Redes:** X (Twitter) e LinkedIn são otimizados para barulho, algoritmos de vaidade e venda. Não há espaço seguro para o construtor expor vulnerabilidades ou pedir ajuda técnica real sem ser julgado ou ignorado.  
* **A Maldição do WhatsApp/Discord:** Quando founders tentam criar grupos de apoio nessas plataformas genéricas, o grupo morre em 3 semanas. Falta pauta, falta cobrança (*accountability*) e os membros viram "leitores fantasmas".  
* **Assimetria Destrutiva:** Grupos abertos misturam pessoas faturando R$ 50k/mês com iniciantes que não sabem comprar um domínio. Isso gera frustração para os experientes e síndrome do impostor para os novatos.

**A oportunidade**

* **Nicho Altamente Engajado:** Construtores são *early adopters*, passam o dia no computador e têm uma dor latente por pertencimento e validação técnica (movimento *Build in Public*).  
* **Monetização via "Skin in the Game":** Em vez de vender anúncios, cobramos para afastar curiosos (Setup Fee / Paywall de Qualidade), gerando caixa imediato desde o Dia 1 com CAC virtualmente zero através de crescimento liderado pelo produto (PLG).  
* **Retenção por Pressão Social Positiva:** A taxa de cancelamento (Churn) despenca quando abandonar o aplicativo significa abandonar seus parceiros de negócio e quebrar o seu "streak" de consistência.

### **Arquitetura Técnica**

**Flywheel**

Aquisição via Prova de Trabalho no X/LinkedIn

→ Pagamento do Setup Fee (R$ 29\) como "Paywall de Qualidade"

→ Onboarding Cognitivo (O usuário molda o seu grupo ideal)

→ Matchmaking Curado (Grupos de 4 pessoas no mesmo MRR)

→ Engajamento guiado pelo sistema (Check-ins, Hot Seats, Semáforo de Metas)

→ Usuário bate metas, aumenta faturamento e convida outros construtores qualificados (Loops de PLG)

→ A comunidade escala baseada em qualidade, não quantidade.

**Pipeline**

**USUÁRIO FINAL (Construtor / Indie Hacker)**

│ Acessa a Landing Page orientada a Neuro-Conversão

▼

**PAYWALL & ONBOARDING (Divulgação Progressiva)**

│ Paga R$ 29\. Preenche Superpoder, Estágio de MRR, Endgame e Fuso Horário.

│ Sente o "Efeito Posse" ao ver o sistema calculando o match.

▼

**MOTOR DE MATCHMAKING (Core Logic)**

│ Cruza os dados determinísticos.

│ Aloca o usuário em um Mastermind perfeito de 4 pessoas (Cowan's 4±1).

▼

**O PAINEL FRANKENSTEIN ELEGANTE (A Interface)**

│ **Centro:** Chat fluido estilo WhatsApp.

│ **Lateral Esquerda:** Presença e Áudio estilo Discord.

│ **Inputs:** Comandos / estilo Notion.

│ **Gaveta:** Kanban de Metas estilo ClickUp (Revelação Progressiva).

▼

**MOTOR DE ACCOUNTABILITY (Backend Gamificado)**

│ Monitora check-ins, aplica regras de strike (anti-fantasma) e registra streaks.

### **Componentes existentes vs novos**

| Componente | Status | Esforço | Detalhes |
| :---- | :---- | :---- | :---- |
| **Landing Page de Neuro-conversão** | Novo | Médio | Design focado em Von Restorff (botão isolado) e Trajetória Emocional. |
| **Integração de Pagamento (Stripe)** | Novo | Baixo | Cobrança única de R$ 29 integrada direto no fim do fluxo de onboarding. |
| **Algoritmo de Matchmaking** | Novo | Alto | Regras rígidas de MRR, Endgame (VC vs Bootstrapper) e Fuso Horário. |
| **Painel de Chat e UI/UX** | Novo | Alto | Requer arquitetura front-end robusta para não gerar sobrecarga cognitiva. |
| **Motor de Gamificação (Backend)** | Novo | Médio | Triggers SQL para regras de *Strike*, Streaks e Semáforo de Metas. |

### **5 Pontos de Contato no Produto**

A UX do BuilderMind é focada em fluidez, organização sob demanda e pressão social positiva.

1. **Onboarding "Endowment Effect" (Simulador de Match)**  
   Interface sem formulários longos. O usuário responde às perguntas como se fosse um chat interativo, sentindo que a curadoria está acontecendo em tempo real antes mesmo de pagar.  
   *Valor:* Ativa o sentimento de posse e dispara a conversão do Setup Fee.  
2. **A "Praça Central" (Chat Fluido)**  
   O centro da tela é despoluído, imitando a simplicidade do WhatsApp web. Nenhuma tarefa ou painel complexo bloqueia a comunicação rápida.  
   *Valor:* Reduz a fricção e utiliza o modelo mental já estabelecido do usuário brasileiro.  
3. **O Semáforo de Accountability (Barra Lateral)**  
   Ao lado dos avatares estilo Discord, um indicador visual (Verde, Amarelo, Vermelho) mostra se o membro já cumpriu a meta da semana ou se está atrasado.  
   *Valor:* Responsabilização visual imediata. Ninguém quer ser o único vermelho do grupo.  
4. **Slash Commands do Notion (/)**  
   O usuário digita /checkin no chat e um modal elegante se abre para ele preencher suas vitórias e bloqueios.  
   *Valor:* Mantém a interface limpa (Revelação Progressiva), entregando o poder de documentação do Notion apenas quando solicitado.  
5. **Gaveta de Kanban Focada (ClickUp Minimalista)**  
   Uma aba lateral retrátil que exibe *apenas* a principal meta inegociável de cada membro do grupo naquela semana.  
   *Valor:* Organiza a execução sem a complexidade de um gestor de projetos corporativo.

### **Casos de Uso Expandidos**

**Tier 1 — Core (O Motor Inicial)**

| Caso de Uso | Descrição | Impacto |

| :--- | :--- | :--- |

| **Zero to One (Ideação)** | Founders sem faturamento buscando validar a primeira ideia e lançar o MVP. | **Altíssimo** — Maior volume de usuários, necessitam de alto apoio emocional. |

| **Bootstrappers (1k a 10k MRR)** | Empreendedores tracionados focados em marketing, vendas e estabilidade de produto. | **Core** — Formam os melhores grupos, alto engajamento técnico. |

**Tier 2 — Operacional Complexo (Escala)**

| Caso de Uso | Descrição | Impacto |

| :--- | :--- | :--- |

| **VC-Backed Founders** | Founders que captaram investimento, queimam caixa e lidam com pressão de board e contratação. | **Alto** — Ticket de monetização futuro elevado, demandas muito específicas. |

| **Agências / Service Businesses** | Donos de agências ou software houses buscando previsibilidade e transição para produto. | **Médio** — Necessitam de grupos segregados para não poluir os grupos de SaaS puro. |

**Tier 3 — Estratégico (Phase 2+)**

| Caso de Uso | Descrição | Impacto |

| :--- | :--- | :--- |

| **Matchmaking de Sócios (Co-founders)** | Usar o algoritmo não para masterminds, mas para o "Tinder" de desenvolvedores buscando marqueteiros. | **Muito Alto** — Criação de novos negócios dentro da plataforma. |

| **Hub de Recrutamento B2B** | Empresas pagam para acessar a base filtrada de devs qualificados pelo algoritmo. | **Alto** — Via de monetização massiva indireta. |

### **Landscape Competitivo**

**Concorrentes diretos e indiretos**

| Plataforma | Preço | Diferencial deles | Ameaça pro BuilderMind | Gap que preenchemos |
| :---- | :---- | :---- | :---- | :---- |
| **WhatsApp / Telegram** | Grátis | Ubiquidade, todos já têm instalado. | **ALTA** — Risco do grupo dar "match" conosco e fugir para lá. | O Wpp não tem método, painel de metas ou regras de expulsão de fantasmas. |
| **Discord** | Grátis | Canais de voz rápidos, bots, sub-comunidades. | **MÉDIA** — Muito barulhento, causa fadiga e distração rápida. | Foco absoluto. Sem 50 canais piscando; apenas 4 pessoas focadas. |
| **X (Twitter)** | Grátis | Alcance orgânico, movimento *Build in Public*. | **BAIXA** — É um palco (1 para N), não uma sala de reuniões (1 para 1). | Nós oferecemos profundidade e conexão real sem a necessidade de "viralizar". |
| **Comunidades Pagas (Patreon/Skool)** | Alto | Mentoria de um "Guru", acesso a conteúdo fechado. | **BAIXA** — O modelo é hierárquico (Top-down). | O BuilderMind é horizontal (Peer-to-peer). Pessoas no mesmo nível se ajudando. |

### **Defesa Competitiva (Moats)**

1. **A Engenharia do Compromisso (Accountability Nativo)**  
   Enquanto o WhatsApp é passivo, o nosso backend é ativo. A plataforma orquestra as interações, cobra check-ins e gera o semáforo de metas. Esse "Método" embutido no software é impossível de replicar num grupo de Telegram.  
2. **A Cultura da Qualidade (Custo de Mudança Emocional)**  
   Ao cobrar na entrada e aplicar regras anti-fantasma rigorosas, filtramos os curiosos. O usuário sente que faz parte da "elite" da execução. Abandonar o app significa perder acesso ao grupo que conhece todo o histórico da sua empresa.  
3. **Algoritmo Proprietary de Curadoria**  
   A mágica está no Match. Quanto mais construtores entrarem, mais líquido se torna o mercado, e mais cirúrgicos ficam os grupos (ex: "4 founders de SaaS B2B focados no mercado jurídico usando React").

### **Monetização**

Modelo: Setup Fee inicial para validação \+ Modelo Freemium/Premium e Marketplace Indireto.

| Tier | Preço Estimado | O que inclui | Upgrade Driver (Upsell) |
| :---- | :---- | :---- | :---- |
| **Fundador (Setup Fee)** | R$ 29 (Único) | Matchmaking inicial, acesso ao grupo, Painel de Accountability básico. | "Quer criar um novo grupo com um nicho mais específico ou acessar grupos de MRR mais alto?" |
| **Pro (Skin in the Game)** | Depósito de Comprometimento (Ex: R$ 100\) | Se cumprir metas, o dinheiro volta. Se falhar, o sistema retém. | Gamificação agressiva de produtividade para usuários que precisam de pressão. |
| **Perks B2B (Fase 2\)** | Gratuito para o usuário, B2B Paga. | Descontos massivos na AWS, Stripe, Vercel, Notion. | O usuário economiza US$ 1.000 em infraestrutura só por estar ativo na rede. |

