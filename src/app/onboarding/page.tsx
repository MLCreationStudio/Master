"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, Send, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  type: "bot" | "user";
  text: string;
};

const QUESTIONS = [
  { id: "superpower", text: "Bem-vindo ao BuilderMind. Antes de te conectarmos, qual é o seu 'Superpoder'? (Ex: Dev, Marketing, Vendas, Produto)" },
  { id: "mrr_band", text: "Entendido. Em qual estágio de faturamento (MRR) seu projeto está hoje? (ideation, validation, bootstrapper, scale, high_performance)" },
  { id: "endgame_philosophy", text: "Qual seu objetivo final? (bootstrapper OR vc_backed)" },
  { id: "timezone", text: "Por último, em qual fuso horário você costuma operar?" },
];

export default function OnboardingPage() {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", type: "bot", text: QUESTIONS[0].text }
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isCalculating, setIsCalculating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const currentQuestionId = QUESTIONS[currentStep].id;
    const newAnswers = { ...answers, [currentQuestionId]: inputValue };
    setAnswers(newAnswers);

    const userMsg: Message = { id: Date.now().toString(), type: "user", text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: "bot", text: QUESTIONS[nextStep].text }]);
      }, 1000);
    } else {
      setIsCalculating(true);
      
      // Persist to Supabase (Anonymous for now, or just simulate then persist)
      // In a real flow, we would have the user sign up/in before or after this.
      // For the MVP, we'll simulate the persistence.
      
      setTimeout(() => {
        setIsCalculating(false);
        setMessages(prev => [...prev, { id: "done", type: "bot", text: "Análise concluída. Encontramos um grupo perfeito para você no seu tier de faturamento." }]);
      }, 3000);
    }
  };

  return (
    <main className="onboarding-container h-screen flex flex-col items-center justify-center p-4">
      <div className="onboarding-card glass-card w-full max-w-2xl flex flex-col overflow-hidden h-[80vh]">
        <header className="p-6 border-b border-glass-border flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm font-medium">Simulador de Match v1.0</span>
          </div>
          <Link href="/" className="text-xs text-secondary hover:text-white transition-colors">Voltar</Link>
        </header>

        <section className="messages-area flex-1 overflow-y-auto p-6 flex flex-col gap-4">
          {messages.map((m) => (
            <div key={m.id} className={`message-bubble ${m.type === "bot" ? "bot-bubble" : "user-bubble"}`}>
              {m.text}
            </div>
          ))}
          {isCalculating && !messages.find(m => m.id === "done") && (
            <div className="message-bubble bot-bubble flex items-center gap-2">
              <Loader2 className="animate-spin" size={16} />
              Calculando match em tempo real...
            </div>
          )}
          <div ref={messagesEndRef} />
        </section>

        {!isCalculating || messages.find(m => m.id === "done") ? (
          <footer className="p-6 border-t border-glass-border">
            {messages.find(m => m.id === "done") ? (
              <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <CheckCircle2 className="text-success" size={48} />
                <p className="text-center font-medium">Grupo Identificado: #BuildersVIX</p>
                <button className="cta-button highlight-cta w-full">
                  Garantir minha vaga (R$ 29)
                </button>
              </div>
            ) : (
              <div className="input-group flex gap-2">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Escreva aqui..."
                  className="chat-input"
                />
                <button onClick={handleSend} className="send-button">
                  <Send size={18} />
                </button>
              </div>
            )}
          </footer>
        ) : null}
      </div>

      <style jsx>{`
        .onboarding-container {
          background: radial-gradient(circle at center, #111 0%, #000 100%);
        }
        
        .onboarding-card {
          box-shadow: 0 0 80px rgba(0, 0, 0, 0.5);
        }

        .messages-area::-webkit-scrollbar {
          width: 4px;
        }
        
        .messages-area::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 2px;
        }

        .message-bubble {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 12px;
          line-height: 1.5;
          font-size: 0.95rem;
          animation: messageIn 0.3s ease-out forwards;
        }

        .bot-bubble {
          align-self: flex-start;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          color: #eee;
        }

        .user-bubble {
          align-self: flex-end;
          background: var(--accent);
          color: white;
          border-radius: 12px 12px 0 12px;
        }

        .input-group {
          position: relative;
        }

        .chat-input {
          flex: 1;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 12px 16px;
          color: white;
          outline: none;
          transition: border-color 0.2s;
        }

        .chat-input:focus {
          border-color: var(--accent);
        }

        .send-button {
          background: var(--accent);
          border: none;
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        @keyframes messageIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
