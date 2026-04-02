"use client";

import { useState } from "react";
import styles from "./chat.module.css";

interface DemoMessage {
  id: string;
  content: string;
  sender: "me" | "other" | "system";
  time: string;
}

interface DemoConversation {
  id: string;
  name: string;
  project: string;
  avatar: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: DemoMessage[];
}

const DEMO_CONVERSATIONS: DemoConversation[] = [
  {
    id: "1",
    name: "Ana Ribeiro",
    project: "HealthTrack",
    avatar: "🚀",
    preview: "Obrigada pela resposta! Vamos marcar uma call?",
    time: "14:32",
    unread: true,
    messages: [
      {
        id: "s1",
        sender: "system",
        content:
          "Matheus apresenta Ana Ribeiro para você.\n\nAna está construindo o HealthTrack — \"Pacientes crônicos não conseguem acompanhar tratamentos de forma integrada\" — e está em estágio de Construção. Busca um co-founder técnico.\n\nVocê oferece sua experiência em engenharia full-stack.\n\nVocês dois demonstraram interesse mútuo. Uma boa primeira mensagem é simples: conte um pouco mais sobre onde o projeto está agora.",
        time: "10:00",
      },
      {
        id: "m1",
        sender: "other",
        content: "Oi! Vi que você tem experiência com React e infra cloud. O HealthTrack precisa exatamente desse perfil. Posso contar mais sobre o projeto?",
        time: "10:15",
      },
      {
        id: "m2",
        sender: "me",
        content: "Oi Ana! Sim, achei o problema muito relevante. Vi que vocês já têm 30 beta testers — como está a retenção?",
        time: "11:42",
      },
      {
        id: "m3",
        sender: "other",
        content: "Obrigada pela resposta! Retenção de 68% em 30 dias. Vamos marcar uma call para eu mostrar o protótipo?",
        time: "14:32",
      },
    ],
  },
  {
    id: "2",
    name: "Mariana Costa",
    project: "EduConnect",
    avatar: "🚀",
    preview: "Matheus apresenta Mariana Costa para você.",
    time: "Ontem",
    unread: false,
    messages: [
      {
        id: "s2",
        sender: "system",
        content:
          "Matheus apresenta Mariana Costa para você.\n\nMariana está construindo o EduConnect — \"Escolas particulares não conseguem engajar pais\" — em estágio de Tração com 12 escolas piloto.\n\nVocês dois demonstraram interesse mútuo.",
        time: "Ontem",
      },
    ],
  },
];

export default function ChatPage() {
  const [activeConv, setActiveConv] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");

  const currentConv = DEMO_CONVERSATIONS.find((c) => c.id === activeConv);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    // TODO: integrate with Supabase Realtime
    setNewMessage("");
  };

  return (
    <div className={styles.chatPage}>
      {/* Conversation List */}
      <div className={styles.convList}>
        <div className={styles.convHeader}>
          <h2 className={styles.convTitle}>Conversas</h2>
        </div>
        <div className={styles.convItems}>
          {DEMO_CONVERSATIONS.map((conv) => (
            <div
              key={conv.id}
              className={`${styles.convItem} ${activeConv === conv.id ? styles.active : ""}`}
              onClick={() => setActiveConv(conv.id)}
            >
              <div className={styles.convAvatar}>{conv.avatar}</div>
              <div className={styles.convInfo}>
                <div className={styles.convName}>{conv.name}</div>
                <div className={styles.convPreview}>{conv.preview}</div>
              </div>
              <div>
                <div className={styles.convTime}>{conv.time}</div>
                {conv.unread && <div className={styles.convUnread} />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      {currentConv ? (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.convAvatar}>{currentConv.avatar}</div>
            <div>
              <div className={styles.chatHeaderName}>{currentConv.name}</div>
              <div className={styles.chatHeaderProject}>{currentConv.project}</div>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {currentConv.messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.message} ${
                  msg.sender === "system"
                    ? styles.messageSystem
                    : msg.sender === "me"
                    ? styles.messageSent
                    : styles.messageReceived
                }`}
              >
                {msg.content}
                {msg.sender !== "system" && (
                  <div className={styles.messageTime}>{msg.time}</div>
                )}
              </div>
            ))}
          </div>

          <form className={styles.chatInput} onSubmit={handleSend}>
            <input
              type="text"
              className={styles.chatInputField}
              placeholder="Escreva uma mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              id="chat-input"
            />
            <button type="submit" className={styles.chatSendBtn} id="chat-send">
              Enviar
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.chatEmpty}>
          <div className={styles.chatEmptyIcon}>💬</div>
          <p>Selecione uma conversa</p>
        </div>
      )}
    </div>
  );
}
