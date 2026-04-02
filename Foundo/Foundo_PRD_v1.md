

**PRODUCT REQUIREMENTS DOCUMENT**

**Foundo**

*A plataforma onde founders e devs brasileiros se encontram com segurança para construir juntos.*

| Versao MVP  ·  v1.0  ·  Confidencial Matheus Lucena  ·  ML Creation Studio  ·  Abril 2026 *Para uso exclusivo do time de desenvolvimento* |
| :---: |

# **1\. Visao Geral do Produto**

## **1.1 Problema**

O ecossistema de startups brasileiro enfrenta um desencontro estrutural: founders nao-tecnicos com projetos validados nao encontram co-founders tecnicos de confianca, enquanto devs com capacidade tecnica tern produtos parados por falta de parceiro comercial. O mercado atual carece de um canal seguro, curado e especifico para esse tipo de conexao.

**Agravantes identificados em pesquisa:**

* Epidemia de golpes tech no Brasil: devs de elite se tornaram paranóicos e se retiraram de comunidades e fóruns

* Sindrome do impostor e inseguranca financeira afastam tecnicos do empreendedorismo

* LinkedIn e grupos de WhatsApp nao oferecem curadoria, verificacao ou contexto de co-fundacao

* 39,2% das startups brasileiras sao SaaS — modelo que exige presenca tecnica solida desde o inicio

## **1.2 Solucao**

O Foundo e uma plataforma web de matchmaking curado exclusivamente para o ecossistema de co-fundacao brasileiro. Combina admissao manual com confianca verificada, deck de perfis com matchmaking bilateral, e chat interno para que a conversa permaneca dentro do produto.

| Proposta de Valor Central Nao e mais um app de networking. E o lugar onde a decisao de construir junto acontece — com seguranca, contexto e intencionalidade desde o primeiro contato. |
| :---- |

## **1.3 Publico-Alvo**

| Perfil | Descricao |
| :---- | :---- |
| Founder nao-tecnico | Entre 25 e 45 anos. Tem ideia validada ou empresa em estagio pre-seed. Ja tentou contratar dev e percebeu que precisa de socio, nao de funcionario. Dor: nao sabe onde encontrar parceiro tecnico confiavel. |
| Construtor tecnico | Dev com 3+ anos de experiencia. Trabalha em empresa ou freela. Ja iniciou projetos que nao decolaram por falta de parceiro comercial. Dor: quer empreender mas nao tem a visao de negocio ou vendas que falta. |

## **1.4 Posicionamento**

| Competidor | Posicao | Limitacao |
| :---- | :---- | :---- |
| LinkedIn | Rede horizontal | Sem curadoria, sem foco em co-fundacao, alto ruido |
| Grupos de WhatsApp | Comunidades informais | Sem verificacao, sem matchmaking, sem historico |
| Shapr / Scaling.com | Matchmaking profissional | Em ingles, sem penetracao BR, sem foco em co-fundacao |
| Foundo | Matchmaking curado BR | Admissao manual, chat interno, foco exclusivo em co-fundacao |

# **2\. Stack Tecnica**

## **2.1 Decisoes de Plataforma**

| Componente | Decisao e Racional |
| :---- | :---- |
| Plataforma | Web App responsiva (PWA). Sem app nativo iOS/Android no MVP. Motivo: iteracao rapida, custo reduzido, comportamento de uso predominantemente em desktop para decisoes de co-fundacao. |
| Frontend | Next.js (App Router). Componentes de servidor, roteamento simples, suporte nativo a PWA. |
| Backend / BaaS | Supabase — banco de dados PostgreSQL, autenticacao, storage de fotos, e Realtime para o chat (WebSockets nativos). |
| Email transacional | Resend — para notificacoes de match, mensagens offline e comunicacoes do sistema. |
| Deploy | Vercel — deploy continuo, zero configuracao de servidor, escala automatica. |
| Storage de imagens | Cloudinary — otimizacao e entrega de fotos de perfil. |
| Autenticacao | Supabase Auth — login com Google e GitHub. Email/senha como fallback. |

## **2.2 Estrutura do Banco de Dados**

**Tabelas principais**

| Tabela | Campos Principais | Proposito |
| :---- | :---- | :---- |
| users | id, name, email, avatar\_url, city, role (founder | builder), status (active | observing | partnered), linkedin\_url, github\_url, reference\_name, created\_at, last\_active\_at | Perfil base do usuario |
| projects | id, user\_id, name, problem\_statement, stage (exploration | building | traction | expansion), evidence, status\_update, status\_updated\_at, created\_at | Projeto vinculado ao usuario |
| seeking | id, user\_id, expertise\_areas (array), dedication, horizon, financial\_expectation, contribution\_summary, proof\_of\_work\_url | O que o usuario busca e oferece |
| interests | id, from\_user\_id, to\_user\_id, created\_at | Interesse unilateral — base do match |
| matches | id, user\_a\_id, user\_b\_id, matched\_at, conversation\_id | Match mutuo confirmado |
| conversations | id, match\_id, created\_at, status (active | archived) | Conversa vinculada ao match |
| messages | id, conversation\_id, sender\_id, content, created\_at, is\_system\_message | Mensagens do chat |
| conversation\_reads | id, user\_id, conversation\_id, last\_read\_at | Controle de mensagens nao lidas |
| communities | id, name, contact\_name, slug, users\_approved, users\_pending | Comunidades parceiras |
| match\_followups | id, match\_id, sent\_at, day\_offset (7|30|90), response\_a, response\_b | Acompanhamento pos-match |

## **2.3 Chat com Supabase Realtime**

O chat interno e construido sobre Supabase Realtime (WebSockets), sem dependencia de servico externo. Cada conversa e um canal Realtime. O cliente se inscreve ao abrir a conversa e cancela ao fechar.

**Fluxo tecnico do chat**

1. Match confirmado: funcao Supabase insere registro em conversations e em messages (mensagem inicial do sistema).

2. Ambos os usuarios recebem email via Resend notificando o match com link direto para a conversa.

3. Usuario abre a conversa: cliente Next.js se inscreve no canal Supabase Realtime correspondente ao conversation\_id.

4. Mensagem enviada: insere em messages via Supabase client. O canal broadcast entrega em tempo real para o outro usuario se online.

5. Usuario offline: trigger no Supabase dispara email via Resend com preview da mensagem e link para o chat.

6. Leitura confirmada: ao abrir a conversa, atualiza conversation\_reads com timestamp atual.

| Limitacoes Intencionais do Chat no MVP Texto puro apenas. Sem envio de arquivos, imagens, audio, reacoes ou threads. Essas limitacoes sao decisao estrategica de foco, nao restricao tecnica. Serao reavaliadas apos validacao de uso. |
| :---- |

## **2.4 Estimativa de Custo de Infraestrutura**

| Item | Custo Estimado |
| :---- | :---- |
| Supabase (Free tier) | Gratuito ate 500MB de banco e 2GB de storage. Suficiente para os primeiros 500 usuarios. |
| Vercel (Hobby) | Gratuito para projetos pessoais com dominio customizado. |
| Resend | Gratuito ate 3.000 emails/mes. Proximo tier: $20/mes para 50.000 emails. |
| Cloudinary (Free) | Gratuito ate 25 creditos/mes — suficiente para fotos de perfil com otimizacao. |
| Dominio .com.br | Aproximadamente R$40/ano. |
| Total mes 1-12 | R$0 a R$100/mes dependendo do crescimento. Sem custo fixo relevante no MVP. |

# **3\. Funcionalidades do MVP**

## **3.1 Fluxo de Admissao**

A admissao nao e um cadastro — e um ritual de confianca. Cada etapa existe para filtrar ruido antes do match acontecer. Aprovacao e manual pelo admin (Matheus) nos primeiros 200 usuarios.

**Etapas do fluxo**

| Etapa | Descricao |
| :---- | :---- |
| Etapa 1 — Identidade | Uma pergunta, duas opcoes: Founder com visao de negocio ou Construtor tecnico. Sem opcao intermediaria. Escolha obrigatoria. |
| Etapa 2 — O Projeto | Nome do projeto (max 40 chars), problema que resolve em uma frase, estagio atual (4 opcoes fixas: Exploracao, Construcao, Tracao, Expansao), evidencia do estagio (opcional mas destacado). |
| Etapa 3 — O Que Busca | Expertise desejada (selecao multipla), dedicacao esperada (3 opcoes), horizonte de busca (3 opcoes), expectativa financeira (4 faixas amplas). |
| Etapa 4 — O Que Oferece | Contribuicao principal em uma frase, prova de trabalho (URL opcional), referencia no ecossistema (nome de pessoa — opcional mas com peso na aprovacao). |
| Etapa 5 — Verificacao | LinkedIn OU GitHub — um dos dois obrigatorio. Foto real obrigatoria. Nome real obrigatorio. |
| Etapa 6 — Aguardo | Tela de confirmacao explicando o processo: 'Sua admissao sera revisada em ate 48 horas.' Sem aprovacao automatica. |

**Criterios de aprovacao manual**

* Projeto: especifico e concreto (nao 'quero criar um app')

* O que busca: descricao com nivel de detalhe suficiente para gerar match util

* Contribuicao: clara e verificavel, nao generica

* Ausencia de sinais de ma-fe: inconsistencia entre campos, sem presenca verificavel

**Emails do fluxo de admissao**

| Status | Acao |
| :---- | :---- |
| Aprovado | Email com boas-vindas, instrucoes de uso, e link para completar perfil com status\_update. |
| Reprovado | Email honesto: 'Seu perfil ainda nao tem o nivel de detalhe necessario. Se quiser tentar novamente com mais informacoes sobre o projeto, a porta esta aberta.' |
| Mais informacoes | Email solicitando clareza em campo especifico, com prazo de 5 dias para resposta. |

## **3.2 Perfil do Usuario**

O perfil e dividido em cinco blocos. Todos os campos foram definidos para maximizar a qualidade do match sem criar friccao desnecessaria no preenchimento.

**Bloco 1 — Identidade Fundamental**

| Campo | Regra |
| :---- | :---- |
| role | Founder ou Builder — definido na admissao, editavel pelo admin apenas |
| name | Nome real — obrigatorio |
| avatar\_url | Foto real — obrigatorio (sem avatar gerado por IA) |
| city | Selecao de lista (capitais \+ principais cidades) |
| linkedin\_url ou github\_url | Um dos dois — obrigatorio e verificado manualmente |

**Bloco 2 — O Projeto**

| Campo | Regra |
| :---- | :---- |
| project.name | Texto livre, max 40 chars |
| project.problem\_statement | Uma frase — o problema que resolve, nao a solucao |
| project.stage | Selecao: Exploracao / Construcao / Tracao / Expansao |
| project.evidence | Opcional mas destacado — prova do estagio declarado |
| project.status\_update | Linha curta com timestamp — 'status' do projeto. Atualizavel a qualquer momento. |

**Bloco 3 — O Que Busca**

| Campo | Regra |
| :---- | :---- |
| seeking.expertise\_areas | Multi-select: Engenharia, Design, Growth, Vendas, Dados/IA, Operacoes/Financas |
| seeking.dedication | Selecao: Integral / Meio periodo com transicao / Gradual conforme tracao |
| seeking.horizon | Selecao: 1-3 meses / 3-6 meses / Sem prazo definido |
| seeking.financial\_expectation | Selecao: Equity puro / Equity \+ pro-labore simbolico / Equity \+ remuneracao de mercado / Ainda definindo |

**Bloco 4 — O Que Oferece**

| Campo | Regra |
| :---- | :---- |
| seeking.contribution\_summary | Uma frase — contribuicao especifica e verificavel |
| seeking.proof\_of\_work\_url | URL opcional — repositorio, prototipo, artigo, produto |
| users.reference\_name | Nome de pessoa no ecossistema — opcional, mas perfis com referencia tem prioridade na aprovacao e peso no algoritmo |

**Bloco 5 — Status e Configuracoes**

| Campo | Regra |
| :---- | :---- |
| users.status | 3 estados: Buscando ativamente / Observando / Em parceria. Usuario controla a qualquer momento. |
| city\_preference | Minha cidade / Qualquer cidade no Brasil / Aberto ao exterior |
| contact\_preference | Email / WhatsApp — define como o sistema estrutura a mensagem inicial do match |

## **3.3 O Deck de Matchmaking**

O deck e a tela principal do produto para usuarios aprovados. Exibe cards de perfis compativeis com base no algoritmo de match. O usuario demonstra interesse ou passa. Interesse mutuo gera match.

**Card no deck — 6 elementos fixos**

* Foto e nome

* Cidade e timestamp do ultimo status\_update

* Problema que o projeto resolve (uma linha)

* Estagio atual com indicador visual

* O que busca (uma linha)

* Expectativa financeira como tag discreta

**Acoes no deck**

| Acao | Comportamento |
| :---- | :---- |
| Passar | Usuario nao aparece no deck novamente por 30 dias. Nao e notificado. |
| Ver perfil completo | Abre todos os 5 blocos antes de demonstrar interesse. Incentiva due diligence. |
| Demonstrar interesse | Registra interest na tabela. Se o outro usuario tambem demonstrar interesse, gera match. |
| Limite diario | 10 interesses por dia. Forcca intencionalidade. Sem limite para visualizacoes. |

**Algoritmo de match — regras em ordem de prioridade**

7. Complementaridade: Founder so aparece no deck de Builder, e vice-versa.

8. Compatibilidade financeira: expectativa do Builder compativel com o estagio do Founder.

9. Cidade: mesma cidade primeiro, mesmo estado depois, qualquer cidade por ultimo.

10. Atividade recente: status\_update nos ultimos 30 dias aparece antes de perfis dormentes.

11. Completude: perfis com proof\_of\_work e reference\_name aparecem antes de perfis sem.

| Nota de Implementacao O algoritmo no MVP e implementado como queries SQL com ORDER BY e filtros — sem ML, sem sistema de scoring complexo. Toda a logica acima cabe em uma query paginada. ML e scoring avancado sao backlog para pos-PMF. |
| :---- |

## **3.4 Sistema de Match e Chat**

**Fluxo completo pos-match**

12. Usuario A demonstra interesse em Usuario B.

13. Se Usuario B ja demonstrou interesse em A (ou quando demonstrar), match e confirmado.

14. Sistema insere registro em matches e cria conversation vinculada.

15. Sistema insere mensagem inicial automatica em messages (is\_system\_message \= true).

16. Ambos recebem email de notificacao via Resend com link direto para a conversa.

17. Chat abre com a mensagem inicial visivelmente separada das mensagens dos usuarios.

**Mensagem inicial do sistema (template fixo)**

| Template da mensagem de apresentacao Matheus apresenta \[Nome A\] para \[Nome B\].\[Nome A\] esta construindo \[problem\_statement\] e esta em estagio de \[stage\]. Busca \[contribution\_summary\].\[Nome B\] oferece \[contribution\_summary\] e esta aberto a \[financial\_expectation\].Voces dois demonstraram interesse mutuo. Uma boa primeira mensagem e simples: conte um pouco mais sobre onde o projeto esta agora e o que tornaria essa parceria ideal para voce.Boa sorte. |
| :---- |

**Interface do chat**

| Elemento | Comportamento |
| :---- | :---- |
| Lista de conversas | Sidebar ou secao dedicada com nome, foto, preview da ultima mensagem e indicador de nao lida. |
| Janela de chat | Historico de mensagens com timestamp, separacao visual da mensagem do sistema, campo de texto simples. |
| Notificacao offline | Email via Resend quando usuario recebe mensagem e nao esta com a conversa aberta. Assunto: 'Nova mensagem de \[Nome\] no Foundo.' Preview de uma linha \+ link direto. |
| Indicador de leitura | Baseado em conversation\_reads. Mostra se a mensagem foi lida, sem mostrar 'online agora'. |
| Status de conversa | Usuario pode arquivar conversa. Conversa arquivada sai da lista principal mas fica acessivel em 'Arquivadas'. |

## **3.5 Sistema de Retencao**

**Atualizacao de estagio — gatilho de retorno**

Quando o usuario faz login apos 30 dias sem atualizar o estagio, o app exibe uma tela antes do deck com uma unica pergunta:

| Resposta | Comportamento |
| :---- | :---- |
| Continua igual | Vai direto para o deck. Registra confirmacao sem alteracao. |
| Mudou um pouco | Abre 2-3 campos de atualizacao rapida (60 segundos). Atualiza project e seeking conforme necessario. |
| Mudou muito | Abre fluxo completo de re-declaracao de estagio. |
| Sem projeto ativo | Muda status para Observando. Usuario sai do deck mas permanece na plataforma. |

**Status Observando**

Usuarios em status Observando nao aparecem no deck de ninguem. Continuam recebendo digest semanal por email com sinais de mercado: novos perfis por area e cidade, distribuicao de estagios na plataforma. Podem retornar ao status Buscando com um clique.

**Follow-ups pos-match (automatizados via Supabase triggers \+ Resend)**

| Momento | Acao |
| :---- | :---- |
| Dia 7 | Notificacao interna: 'Como esta indo a conversa com \[Nome\]?' — 2 botoes: Bem / Nao foi pra frente. |
| Dia 30 | Se resposta positiva no dia 7: 'Voces avancaram? Marcaram uma reuniao?' — 2 botoes. |
| Dia 90 | Email fora do app: 'Voce e \[Nome\] conectaram ha 3 meses. Se algo interessante aconteceu, adorariamos saber.' — Link para formulario de 3 perguntas opcionais. |

## **3.6 Painel Administrativo**

O painel admin e para uso exclusivo do founder (Matheus). E o produto dentro do produto — onde a curadoria acontece e a saude da comunidade e monitorada.

**6 visoes do painel**

| Visao | Descricao |
| :---- | :---- |
| Fila de admissao | Todos os perfis aguardando aprovacao com campos visiveis. Acoes: Aprovar / Reprovar (com template editavel) / Pedir mais informacoes. Meta: processar em lotes de 10-15 em ate 48h. |
| Mapa de matches | Todos os matches com data, perfis, e status de follow-up. Codigo de cor: Verde (conversa ativa), Amarelo (sem resposta em 7 dias), Vermelho (abandonado). |
| Radar de atividade | Usuarios sem atualizacao ha mais de 30 dias. Permite envio de mensagem manual personalizada — nao notificacao automatica. |
| Historias de sucesso | Formulario para registro de matches com resultado verificado. Base de prova social para site e comunidades parceiras. |
| Metricas core | 4 numeros: usuarios aprovados, matches realizados, conversas iniciadas, historias de sucesso. Sem metricas de vaidade. |
| Comunidades parceiras | Lista de comunidades com usuarios por origem, taxa de aprovacao por comunidade, e historias vinculadas. |

# **4\. Fora do Escopo do MVP**

As funcionalidades abaixo foram conscientemente excluidas do MVP. Cada exclusao tem razao estrategica. Nada entra antes de haver validacao de necessidade real com usuarios.

| Funcionalidade Excluida | Justificativa |
| :---- | :---- |
| App nativo iOS/Android | Web PWA e suficiente. App nativo triplica custo e tempo de iteracao. |
| Sistema de pagamento / planos premium | Gratuito ate NPS \> 50 e 15 historias verificadas de match com resultado. |
| Feed de posts e conteudo | Transforma o produto em LinkedIn. Dilui o foco em co-fundacao. |
| Gamificacao (pontos, rankings, badges automaticos) | Incompativel com posicionamento de produto serio e curado. |
| Integracao automatica de dados GitHub/LinkedIn | Verificacao manual de link e suficiente no MVP. Automacao e backlog. |
| Perfis publicos indexados no Google | Adiciona complexidade de privacidade e moderacao prematura. |
| Fórum ou sistema de discussao | Segundo modulo — entra somente apos PMF no matchmaking. |
| Contratacao tecnica (nao equity) | Expansao planejada — co-founders primeiro, contratacao depois. |
| Busca avancada por filtros manuais | O algoritmo de match resolve isso no MVP. Busca manual e backlog. |
| Notificacoes push (service worker) | Email e suficiente no MVP. Push notifications adicionam complexidade de permissao. |
| Reacoes, threads ou rich text no chat | Texto puro e a decisao correta para o momento de co-fundacao. |
| Matching por IA ou ML | Logica SQL e suficiente para os primeiros 500 usuarios. ML e backlog. |

# **5\. Identidade e Design**

## **5.1 Nome e Posicionamento**

| Atributo | Definicao |
| :---- | :---- |
| Nome | Foundo |
| Raiz semantica | Found (encontrar) \+ Founder (fundador). Funciona em portugues e ingles. |
| Tagline | A plataforma onde founders e devs brasileiros se encontram com seguranca para construir juntos. |
| Tom de voz | Direto, honesto, sem exagero. Fala como um curador experiente, nao como uma plataforma corporativa. |
| O que nao e | Nao e LinkedIn. Nao e rede social. Nao e marketplace de freelancers. |

## **5.2 Direcao Visual**

Dark quente. Nao o dark frio de ferramentas tech (GitHub, Vercel). Um dark com calor humano — como uma fogueira, nao um data center. Premium e acolhedor simultaneamente.

| Elemento | Direcao |
| :---- | :---- |
| Fundo principal | Dark com subtom quente — nao preto puro. Sugestao: \#13131A com sutileza terrosa. |
| Acento primario | Laranja-ambar queimado. Energia sem agressividade. Sugestao: \#E8632A. |
| Tipografia | Sem serifa com personalidade. Sugestoes: Geist, Satoshi, ou Plus Jakarta Sans. Evitar Inter (comoditizado). |
| Cards no deck | Bordas sutis com radius generoso. Foto prominente mas nao dominante. Informacao hierarquizada. |
| Anti-padrao | Sem glassmorphism. Sem gradiente em texto. Sem neon. Sem animacoes desnecessarias. |
| Inspiracao | Raycast (dark com calor), Arc Browser (personalidade sem ruido), Linear (precisao). |

# **6\. Estrategia de Lancamento**

## **6.1 Canal Principal: Parcerias com Comunidades**

O canal de aquisicao primario no lancamento e parceria direta com comunidades e aceleradoras brasileiras. Nao distribuicao — colaboracao. A proposta para cada parceiro e acesso prioritario e curado para seus membros, nao promocao generica.

**Script da conversa de parceria**

| Estrutura da abordagem 1\. O problema compartilhado: 'Voce deve ver isso todo dia — founders com projetos parados por nao encontrar co-founder tecnico, e devs com capacidade que nunca decolam por falta de parceiro comercial.'2. O que estou construindo: 'O Foundo resolve exatamente isso. Mas quero que seja algo que as melhores comunidades confiem — nao mais um produto generico.'3. A proposta: 'Acesso prioritario e curado para seus membros. Eles entram na frente, com aprovacao garantida, e me comprometo a fazer matches de qualidade dentro do ecossistema de voces primeiro.' |
| :---- |

**Comunidades-alvo por perfil**

| Categoria | Comunidades | Racional |
| :---- | :---- | :---- |
| Para Founders nao-tecnicos | ACE Startups, Startup Farm, Liga Ventures, Endeavor Scale-Up, SEBRAE startups | Alumni com projetos validados em estagio inicial |
| Para Builders tecnicos | Dev Samurai, Rocketseat, Trybe alumni, r/brdev (posts curados), bootcamps tech | Devs com veia empreendedora represada |
| Para os dois perfis | Google for Startups Brasil, PM3 comunidade, Product Arena, grupos de ex-aceleradoras | Mix natural de founders e tecnicos |

## **6.2 Estrategia Founder-Led**

Matheus aparece publicamente como founder do Foundo usando sua marca pessoal — credibilidade do historico como head de produto e fundador do ML Creation Studio como contexto, nao como peso.

* Producao de conteudo sobre o problema — nao sobre o produto — antes do lancamento

* Presenca ativa em comunidades como participante, nao como vendedor

* Build in public: cada decisao de produto relevante vira conteudo editorial

* Tres posts por mes com profundidade real superam cinquenta posts rasos

## **6.3 Calendario dos Primeiros 90 Dias**

| Periodo | Acoes e Metas |
| :---- | :---- |
| Dias 1-30(Pre-produto) | 20 entrevistas de problema com founders e devs. Conteudo publico sobre a dor. Identificacao de 2 comunidades parceiras. Landing page de lista de espera no ar. Meta: 100 inscritos, 20 entrevistas realizadas. |
| Dias 31-60(Construcao) | Dev trabalhando no MVP. Conteudo continua — sobre o problema, nao o produto ainda. Selecao manual dos primeiros 50 perfis da lista de espera. Comunicacao individual personalizada para cada um. Meta: MVP em staging, 50 perfis aprovados. |
| Dias 61-90(Lancamento fechado) | 50 perfis entram. Admin acompanha cada match pessoalmente. Emails de introducao enviados manualmente. Feedback diario. Conteudo sobre o que esta aprendendo. Meta: 10 matches com conversa iniciada, 3 historias de progresso documentadas. |

# **7\. Metricas de Sucesso**

## **7.1 North Star Metric**

| Metrica Principal Numero de matches que geraram contato real (conversa iniciada no chat) nos primeiros 30 dias apos o match. Esta metrica captura valor real entregue — nao volume de usuarios, nao numero de matches, nao tempo no app. |
| :---- |

## **7.2 Metricas por Fase**

| Fase | Metricas | Meta |
| :---- | :---- | :---- |
| Fase 1Dias 1-90 | Usuarios aprovados, Taxa de aprovacao na admissao, Matches realizados, Conversas iniciadas, Historias de progresso documentadas | Meta: 50 usuarios, 10 matches, 3 historias |
| Fase 2Dias 91-180 | Retencao D30 (usuarios que voltaram em 30 dias), NPS com n \>= 30, Taxa de atualizacao de estagio, Matches com resposta positiva no follow-up D30 | Meta: D30 \> 35%, NPS \> 40 |
| Fase 3Dias 181-365 | MRR apos lancamento do plano premium, Churn mensal, CAC por canal de parceria, Historias de sucesso verificadas acumuladas | Meta: NPS \> 50, 15 historias — gatilho para monetizacao |

## **7.3 O Que Nao Medir**

| Metrica a Evitar | Motivo |
| :---- | :---- |
| Usuarios cadastrados (sem aprovacao) | Ruido — o funil comeca na aprovacao, nao no cadastro |
| Visualizacoes de perfil | Metrica de vaidade incompativel com o posicionamento |
| Tempo gasto no app | Retencao por valor e diferente de retencao por habito ou dependencia |
| Numero de swipes | Volume sem qualidade — o limite de 10 interesses/dia ja resolve isso |

## **7.4 Criterios para Monetizacao**

O Foundo nao cobra nada antes de atingir simultaneamente:

* NPS acima de 50 com pelo menos 50 respondentes

* 15 historias verificadas de matches com resultado real (reuniao, parceria, contratacao, empresa formada)

* Retencao D30 acima de 40%

Quando esses tres criterios forem atingidos, o plano premium entra com tres funcionalidades: mais interesses por dia (de 10 para 25), filtros avancados por stack e estagio, e destaque no deck por 48h apos atualizacao de perfil. Preco estimado: R$59 a R$89/mes.

# **8\. Riscos e Mitigacoes**

| Risco | Mitigacao |
| :---- | :---- |
| Cold StartSem usuarios nao ha valor, sem valor nao ha usuarios. | Lancamento em jardim murado: 50 usuarios curados manualmente. Parceria com 1-2 comunidades que ja tem os dois perfis. Founder presente nas comunidades antes do produto existir. |
| Desequilibrio 50/50Um perfil domina e o outro para de entrar. | Duas listas de espera separadas internamente. Aprovacao em lotes alternados. Se uma lista crescer muito mais, pausa aprovacoes de um lado ate reequilibrar. |
| Qualidade do chatBug ou instabilidade no lancamento destroi confianca. | Testes extensivos em staging com os 50 primeiros perfis antes do lancamento publico. Supabase Realtime e maduro e bem documentado — risco tecnico baixo se implementado corretamente. |
| Usuarios migrando para WhatsAppPode acontecer mesmo com chat interno. | Aceitar que isso vai ocorrer em alguns casos — nao e uma batalha vale a pena travar no MVP. O dado util e saber quantos ficam no chat interno. |
| Moderacao degradandoSem cuidado ativo o fórum/chat vira terra de ninguem. | Admin monitora o radar de atividade semanalmente. Mensagens manuais personalizadas para usuarios dormentes. Politica clara de uso nos termos. |
| Scope creep do devFeatures nao planejadas entram durante o desenvolvimento. | PRD como documento de referencia imutavel durante o sprint. Qualquer adicao passa por aprovacao do founder com justificativa estrategica documentada. |

# **9\. Roadmap Pos-MVP**

O que vem depois do MVP — em ordem de prioridade baseada em hipoteses a validar, nao em vontade de construir.

| Versao | Descricao |
| :---- | :---- |
| V1.1 — Integracao GitHub/LinkedIn(Pos 200 usuarios aprovados) | Puxar dados automaticamente para validar autoridade tecnica sem preenchimento manual. Reduz friccao de admissao e aumenta qualidade de verificacao. |
| V1.2 — Plano Premium(Pos criterios de monetizacao atingidos) | Mais interesses por dia, filtros avancados, destaque no deck. Preco: R$59-89/mes. |
| V1.3 — Perfis Publicos Indexados(Pos 500 usuarios) | SEO organico: perfis publicos indexaveis no Google para buscas como 'co-founder tecnico Sao Paulo'. Canal de aquisicao organica de alto valor. |
| V2.0 — Expansao Latinoamerica(Pos PMF solido no Brasil) | Interface em espanhol, comunidades parceiras em Mexico, Colombia e Argentina. Mesma mecanica, novo mercado. |
| V2.1 — Modulo de Contratacao Tecnica(Expansao planejada) | Alem de co-founders: primeiros devs para contratar (nao equity). Novo perfil de usuario, mesma base de confianca. |
| V3.0 — Forum de Alto Sinal(Segundo modulo principal) | Forum tecnico com reputacao por utilidade, syntax highlighting, anti-AI slop. Entra somente quando a comunidade de matchmaking tiver vida propria. |

*Foundo  ·  PRD v1.0  ·  Matheus Lucena  ·  ML Creation Studio  ·  Abril 2026*