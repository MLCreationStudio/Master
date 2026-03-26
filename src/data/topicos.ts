/** Tópicos do Módulo 1 — Conversa Adaptativa */
export interface Topico {
  id: number;
  titulo: string;
  pergunta: string;
  campo: string;
  tipo: 'texto' | 'numero' | 'select';
  opcoes?: { value: string; label: string }[];
  complementaresMax: number;
  placeholder?: string;
}

export const TOPICOS: Topico[] = [
  {
    id: 1,
    titulo: 'O produto',
    pergunta: 'Me conte sobre o seu negócio. O que você vende e qual problema resolve para o seu cliente?',
    campo: 'produto_desc',
    tipo: 'texto',
    complementaresMax: 2,
    placeholder: 'Descreva seu produto ou serviço...',
  },
  {
    id: 2,
    titulo: 'O cliente',
    pergunta: 'Quem é o seu cliente ideal? Descreva a pessoa que mais compra de você — ou que você gostaria que comprasse.',
    campo: 'icp_desc',
    tipo: 'texto',
    complementaresMax: 2,
    placeholder: 'Descreva seu cliente ideal...',
  },
  {
    id: 3,
    titulo: 'Ticket e modelo',
    pergunta: 'Qual o valor médio que cada cliente paga por vez? E como você cobra — valor único, recorrente ou parcelado?',
    campo: 'ticket_medio',
    tipo: 'numero',
    complementaresMax: 1,
    placeholder: 'Ex: 500',
  },
  {
    id: 4,
    titulo: 'Concorrentes',
    pergunta: 'Quem são seus principais concorrentes? E por que um cliente escolheria você em vez deles?',
    campo: 'concorrentes_desc',
    tipo: 'texto',
    complementaresMax: 2,
    placeholder: 'Descreva seus concorrentes e seu diferencial...',
  },
  {
    id: 5,
    titulo: 'Foco geográfico',
    pergunta: 'Onde estão seus clientes? Você atende uma cidade específica, um estado, o Brasil inteiro ou vende online para qualquer lugar?',
    campo: 'foco_geografico',
    tipo: 'texto',
    complementaresMax: 1,
    placeholder: 'Ex: São Paulo capital, online Brasil inteiro...',
  },
  {
    id: 6,
    titulo: 'Histórico de marketing',
    pergunta: 'Você já investiu em marketing antes? Me conte o que tentou — o que funcionou e o que não deu certo.',
    campo: 'historico_marketing',
    tipo: 'texto',
    complementaresMax: 1,
    placeholder: 'Se nunca fez, diga "nunca investi em marketing"',
  },
  {
    id: 7,
    titulo: 'Budget',
    pergunta: 'Quanto você pode investir por mês em marketing — incluindo ferramentas, produção e mídia? Não precisa ser um número exato.',
    campo: 'budget_total',
    tipo: 'numero',
    complementaresMax: 1,
    placeholder: 'Ex: 2000',
  },
  {
    id: 8,
    titulo: 'Meta de resultado',
    pergunta: 'Quantos novos clientes por mês você precisa para que valha a pena? Pense no mínimo que faria diferença.',
    campo: 'meta_clientes',
    tipo: 'numero',
    complementaresMax: 1,
    placeholder: 'Ex: 10',
  },
  {
    id: 9,
    titulo: 'Prazo',
    pergunta: 'Em quanto tempo você espera ver resultado? Escolha o que é mais realista para você.',
    campo: 'prazo_esperado',
    tipo: 'select',
    opcoes: [
      { value: '30', label: '30 dias — preciso de resultado rápido' },
      { value: '60', label: '60 dias — posso esperar um pouco' },
      { value: '90', label: '90 dias — entendo que leva tempo' },
      { value: '180', label: '6 meses — estou construindo para o longo prazo' },
    ],
    complementaresMax: 1,
  },
];
