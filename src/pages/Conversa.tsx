import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TOPICOS } from '../data/topicos';
import { Typewriter, ProgressBar, TopicIndicator, GlassPanel } from '../components/ui';
import './Conversa.css';

interface Mensagem {
  tipo: 'pergunta' | 'resposta';
  texto: string;
}

const FOLLOW_UPS = [
  'Pode me contar um pouco mais sobre isso?',
  'Interessante. Consegue detalhar melhor esse ponto para eu entender o contexto?',
  'Ficou claro, mas se puder dar mais um exemplo ou detalhe, meu cálculo será mais assertivo.',
  'Entendi. Como isso funciona no dia a dia do seu negócio?'
];

const MICRO_FEEDBACKS = [
  'Ótimo ponto. Isso ajuda muito na precisão do seu Score.',
  'Excelente detalhamento. O algoritmo está aprendendo rápido.',
  'Entendido. Esse dado é crucial para o cálculo do seu CAC ideal.',
  'Perfeito. Notei uma clareza estratégica aqui.',
  'Dados recebidos. Estamos refinando seu perfil competitivo...'
];

export default function Conversa() {
  const location = useLocation();
  const navigate = useNavigate();
  const cargaRapida = (location.state as any)?.cargaRapida;
  
  const [topicoAtual, setTopicoAtual] = useState(0);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [respostas, setRespostas] = useState<Record<string, string>>(cargaRapida?.dados || {});
  const [modeloCobranca, setModeloCobranca] = useState('');
  const [inputTypeOverride, setInputTypeOverride] = useState<'texto' | null>(null);
  const [complementaresFeitas, setComplementaresFeitas] = useState(0);
  const [qualidade, setQualidade] = useState(20);
  const [feedbackAtual, setFeedbackAtual] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const topico = TOPICOS[topicoAtual];
  const tipoInput = inputTypeOverride || topico?.tipo;

  const getTopicoMensagem = useCallback((index: number) => {
    const t = TOPICOS[index];
    if (cargaRapida?.isPreenchido) {
      if (t.id === 1) return cargaRapida.dados.intro_nicho || `Notei que você atua com ${cargaRapida.dados.subnicho}. É esse o foco principal?`;
      if (t.id === 2) return cargaRapida.dados.intro_icp || `Pelo que vi, seu foco é em ${cargaRapida.dados.icp_desc}. Correto?`;
      if (t.id === 4) return cargaRapida.dados.intro_diferencial || `Identifiquei que seu diferencial é ${cargaRapida.dados.concorrentes_desc}. Procede?`;
    }
    return t.pergunta;
  }, [cargaRapida]);

  useEffect(() => {
    setMensagens([{ tipo: 'pergunta', texto: getTopicoMensagem(0) }]);
  }, [getTopicoMensagem]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, isProcessing]);

  useEffect(() => {
    if (!isTyping && !isProcessing) {
      inputRef.current?.focus();
    }
  }, [isTyping, isProcessing]);

  const handleTypewriterComplete = useCallback(() => {
    setIsTyping(false);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!inputValue.trim() || isTyping || isProcessing) return;

    const valor = inputValue.trim();
    const campo = topico.campo;

    setMensagens(prev => [...prev, { tipo: 'resposta', texto: valor }]);
    const novasRespostas = { ...respostas, [campo]: valor };
    setRespostas(novasRespostas);
    setInputValue('');
    setIsProcessing(true);

    const ganho = valor.length > 50 ? 15 : 8;
    setQualidade(prev => Math.min(prev + ganho, 100));

    if (valor.length > 20) {
      setFeedbackAtual(MICRO_FEEDBACKS[Math.floor(Math.random() * MICRO_FEEDBACKS.length)]);
      setTimeout(() => setFeedbackAtual(''), 3000);
    }

    if (topicoAtual === 2 && !modeloCobranca) {
      setTimeout(() => {
        setIsProcessing(false);
        setIsTyping(true);
        setInputTypeOverride('texto');
        setMensagens(prev => [...prev, {
          tipo: 'pergunta',
          texto: 'E como você cobra? Valor único por venda, mensalidade recorrente, ou parcelado?'
        }]);
        setModeloCobranca('waiting');
      }, 800);
      return;
    }

    if (modeloCobranca === 'waiting') {
      novasRespostas['modelo_cobranca'] = valor.toLowerCase().includes('recorr') ? 'recorrente'
        : valor.toLowerCase().includes('parcel') ? 'parcelado' : 'unico';
      setRespostas(novasRespostas);
      setModeloCobranca(novasRespostas['modelo_cobranca']);
    }

    if (
      valor.length < 30 && 
      topico.tipo === 'texto' && 
      modeloCobranca !== 'waiting' &&
      complementaresFeitas < (topico.complementaresMax || 0)
    ) {
      setTimeout(() => {
        setIsProcessing(false);
        setIsTyping(true);
        setComplementaresFeitas(prev => prev + 1);
        setMensagens(prev => [...prev, {
          tipo: 'pergunta',
          texto: FOLLOW_UPS[Math.floor(Math.random() * FOLLOW_UPS.length)]
        }]);
      }, 600);
      return;
    }

    const proximo = topicoAtual + 1;
    if (proximo >= TOPICOS.length) {
      setTimeout(() => {
        navigate('/processando', { state: { respostas: novasRespostas } });
      }, 600);
      return;
    }

    setTimeout(() => {
      setIsProcessing(false);
      setIsTyping(true);
      setInputTypeOverride(null);
      setComplementaresFeitas(0);
      setTopicoAtual(proximo);
      setMensagens(prev => [...prev, {
        tipo: 'pergunta',
        texto: getTopicoMensagem(proximo),
      }]);
    }, 800);
  }, [inputValue, isTyping, isProcessing, topico, topicoAtual, respostas, modeloCobranca, complementaresFeitas, navigate, getTopicoMensagem]);

  const handleSelectOption = useCallback((value: string, label: string) => {
    setInputValue(value);
    const campo = topico.campo;
    setMensagens(prev => [...prev, { tipo: 'resposta', texto: label }]);
    setRespostas(prev => ({ ...prev, [campo]: value }));

    const proximo = topicoAtual + 1;
    if (proximo >= TOPICOS.length) {
      const novasRespostas = { ...respostas, [campo]: value };
      setTimeout(() => {
        navigate('/processando', { state: { respostas: novasRespostas } });
      }, 600);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsTyping(true);
      setComplementaresFeitas(0);
      setTopicoAtual(proximo);
      setInputValue('');
      setMensagens(prev => [...prev, {
        tipo: 'pergunta',
        texto: getTopicoMensagem(proximo),
      }]);
    }, 800);
  }, [topico, topicoAtual, respostas, navigate, getTopicoMensagem]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="conversa-page terminal-bg">
      <ProgressBar current={topicoAtual + 1} total={TOPICOS.length} />
      
      <div className="conversa-header-hud terminal-border-glow">
        <div className="hud-line">
           <span className="terminal-text">SYS_LINK // </span>
           <span className="text-mono text-emerald-500">DIAGNOSTICO_GTM_ACTIVE</span>
        </div>
        <div className="hud-line">
           <span className="terminal-text">CONFIDENCE // </span>
           <span className="text-mono">{qualidade}%</span>
        </div>
        {feedbackAtual && (
          <div className="hud-feedback-toast fade-in font-mono text-[0.55rem] text-emerald-400/60 mt-2">
            &gt; {feedbackAtual}
          </div>
        )}
      </div>

      <div className="conversa-history container max-w-[800px] mx-auto pt-48 pb-64 px-6">
        {mensagens.map((msg, i) => {
          const isLatestQuestion = msg.tipo === 'pergunta' && i === mensagens.length - 1;
          const shouldTypewrite = isLatestQuestion && isTyping;

          return (
            <div key={`${msg.tipo}-${i}`} className={`chat-bubble-v3 ${msg.tipo}`}>
              <div className="bubble-meta font-mono">
                 [{msg.tipo === 'pergunta' ? 'SYSTEM_LOG' : 'USER_AUTH'}] {new Date().toLocaleTimeString()}
              </div>
              <div className="bubble-text">
                {shouldTypewrite ? (
                  <Typewriter text={msg.texto} onComplete={handleTypewriterComplete} />
                ) : (
                  <span className="text-mono">{msg.texto}</span>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="chat-bubble-v3 pergunta">
             <div className="font-mono text-[0.6rem] text-emerald-500/50 animate-pulse">
                &gt; ANALYZING_QUERY_CHUNKS...
             </div>
          </div>
        )}

        <div ref={bottomRef} className="h-20" />
      </div>

      <div className="conversa-input-bar">
        <div className="container max-w-[800px] mx-auto px-6">
          <GlassPanel className="p-4 !rounded-xl terminal-border-glow !bg-black/40">
            {(!isTyping && !isProcessing && topico) ? (
               <div className="fade-in">
                  {tipoInput === 'select' && topico.opcoes ? (
                    <div className="flex flex-wrap gap-2">
                      {topico.opcoes.map(opt => (
                        <button key={opt.value} className="terminal-chip" onClick={() => handleSelectOption(opt.value, opt.label)}>
                          [{opt.label}]
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-4 items-center relative">
                      <span className="text-emerald-500 font-mono pl-2">&gt;</span>
                      <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        className="terminal-input-v3 flex-1 font-mono text-sm"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={topico?.placeholder?.toLowerCase().replace(/ /g, '_') || 'enter_data...'}
                        rows={1}
                      />
                      <button className="terminal-send-btn" onClick={handleSubmit} disabled={!inputValue.trim()}>
                        [RETURN]
                      </button>
                    </div>
                  )}
               </div>
            ) : (
               <div className="h-[42px] flex items-center justify-center font-mono text-[0.6rem] tracking-[0.4em] uppercase text-emerald-500/40">
                  <span className="animate-pulse">CPU_PROCESSING_SEQUENCE...</span>
               </div>
            )}
          </GlassPanel>
        </div>
      </div>

      <TopicIndicator current={topicoAtual + 1} total={TOPICOS.length} />
    </div>
  );
}
