import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingDots } from '../components/ui';
import { supabase } from '../lib/supabase';
import './Processando.css'; // Reusing the same styles

const FRASES_CARGA = [
  'Iniciando Carga Rápida...',
  'Lendo conteúdo da página...',
  'Identificando nicho e subnicho de atuação...',
  'Mapeando o perfil do cliente ideal (ICP)...',
  'Analisando diferenciais competitivos...',
  'Sintetizando contexto do negócio...',
  'Tudo pronto. Iniciando diagnóstico...',
];

export default function ProcessandoCarga() {
  const location = useLocation();
  const navigate = useNavigate();
  const [fraseAtual, setFraseAtual] = useState(0);

  const urlInput = (location.state as any)?.url || '';

  useEffect(() => {
    if (!urlInput) {
      navigate('/');
      return;
    }

    const interval = setInterval(() => {
      setFraseAtual(prev => {
        if (prev >= FRASES_CARGA.length - 1) {
          clearInterval(interval);
          
          const analisarCarga = async () => {
            try {
              const { data, error } = await supabase.functions.invoke('analisar-carga-rapida', {
                body: { url: urlInput }
              });

              if (error) throw error;

              navigate('/diagnostico', {
                state: {
                  cargaRapida: {
                    isPreenchido: true,
                    dados: data?.dados || {}
                  }
                },
              });
            } catch (err) {
              console.error('Erro na carga rápida:', err);
              // Fallback para conversa limpa em caso de erro
              navigate('/diagnostico');
            }
          };

          analisarCarga();
          return prev;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [navigate, urlInput]);

  return (
    <div className="processando-page">
      <div className="processando-content">
        {FRASES_CARGA.map((frase, i) => (
          <p
            key={i}
            className={`processando-frase ${i === fraseAtual ? 'active' : ''} ${i < fraseAtual ? 'done' : ''}`}
          >
            {frase}
          </p>
        ))}
        {fraseAtual < FRASES_CARGA.length - 1 && (
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
             <LoadingDots />
          </div>
        )}
      </div>
    </div>
  );
}
