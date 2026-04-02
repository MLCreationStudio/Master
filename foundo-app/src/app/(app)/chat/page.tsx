"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./chat.module.css";
import { createClient } from "@/lib/supabase/client";
import { getConversations, getMessages, sendMessage } from "@/lib/supabase/actions";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const initConvId = searchParams.get("id");

  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<string | null>(initConvId);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchConvs = useCallback(async () => {
    setLoadingConvs(true);
    try {
      const convs = await getConversations();
      setConversations(convs);
      
      // Auto-select first if none selected
      if (!activeConv && convs.length > 0) {
        setActiveConv(convs[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingConvs(false);
    }
  }, [activeConv]);

  useEffect(() => {
    // Get current user ID for message alignment
    const initUser = async () => {
      const sb = createClient();
      const { data } = await sb.auth.getUser();
      setCurrentUserId(data.user?.id || null);
    };
    initUser();
    fetchConvs();
  }, [fetchConvs]);

  useEffect(() => {
    if (!activeConv) return;

    let isMounted = true;
    
    // Load historical messages
    const loadMessages = async () => {
      const msgs = await getMessages(activeConv);
      if (isMounted) setMessages(msgs);
    };
    loadMessages();

    // Subscribe to realtime messages for this conversation
    const supabase = createClient();
    const channel = supabase
      .channel(`chat_${activeConv}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConv}`,
        },
        (payload) => {
          if (isMounted) {
            setMessages((prev) => [...prev, payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [activeConv]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;
    
    const content = newMessage.trim();
    setNewMessage(""); // Optimistic clear

    try {
      await sendMessage(activeConv, content);
      // Actual message will be appended via WebSockets
    } catch (err) {
      console.error("Failed to send:", err);
      // Restore message on failure
      setNewMessage(content); 
    }
  };

  const currentConvData = conversations.find((c) => c.id === activeConv);

  return (
    <div className={styles.chatPage}>
      {/* Conversation List */}
      <div className={styles.convList}>
        <div className={styles.convHeader}>
          <h2 className={styles.convTitle}>Conversas</h2>
        </div>
        <div className={styles.convItems}>
          {loadingConvs ? (
            <div className="p-4 text-sm text-tertiary">Carregando...</div>
          ) : conversations.length === 0 ? (
            <div className="p-4 text-sm text-tertiary">Nenhum match ainda.</div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`${styles.convItem} ${activeConv === conv.id ? styles.active : ""}`}
                onClick={() => setActiveConv(conv.id)}
              >
                <div className={styles.convAvatar}>
                  {conv.otherUser.role === "founder" ? "🚀" : "⚡"}
                </div>
                <div className={styles.convInfo}>
                  <div className={styles.convName}>{conv.otherUser.name}</div>
                  <div className={styles.convPreview}>Ver mensagens...</div>
                </div>
                <div>
                  {/* Simplification: Just show date for now */}
                  <div className={styles.convTime}>
                    {new Date(conv.time).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Window */}
      {currentConvData ? (
        <div className={styles.chatWindow}>
          <div className={styles.chatHeader}>
            <div className={styles.convAvatar}>
              {currentConvData.otherUser.role === "founder" ? "🚀" : "⚡"}
            </div>
            <div>
              <div className={styles.chatHeaderName}>{currentConvData.otherUser.name}</div>
              <div className={styles.chatHeaderProject}>
                {currentConvData.otherUser.role === "founder" ? "Founder" : "Builder"}
              </div>
            </div>
          </div>

          <div className={styles.chatMessages}>
            {messages.map((msg) => {
              const isSystem = msg.is_system_message;
              const isMe = msg.sender_id === currentUserId && !isSystem;

              return (
                <div
                  key={msg.id}
                  className={`${styles.message} ${
                    isSystem
                      ? styles.messageSystem
                      : isMe
                      ? styles.messageSent
                      : styles.messageReceived
                  }`}
                >
                  {/* Use pre-wrap to keep line breaks on system message */}
                  <div style={{ whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </div>
                  {!isSystem && (
                    <div className={styles.messageTime}>
                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className={styles.chatInput} onSubmit={handleSend}>
            <input
              type="text"
              className={styles.chatInputField}
              placeholder="Escreva uma mensagem..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              id="chat-input"
              autoComplete="off"
            />
            <button type="submit" className={styles.chatSendBtn} id="chat-send">
              Enviar
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.chatEmpty}>
          <div className={styles.chatEmptyIcon}>💬</div>
          <p>
            {conversations.length > 0 
              ? "Selecione uma conversa" 
              : "Dê 'Interesse' no deck para criar conversas"}
          </p>
        </div>
      )}
    </div>
  );
}
