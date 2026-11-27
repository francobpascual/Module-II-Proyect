import { useEffect, useRef, useState } from "react";
import {
  detectChatIntent,
  getChatReply,
  initialChatMessage,
} from "./chatbotConfig";
import type {
  ChatIntent,
  ChatMessage,
  ChatOption,
} from "./chatbotConfig";

const RESPONSE_DELAY_MS = 420;

export function useChatConversation(isAuthenticated: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    initialChatMessage,
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const nextMessageId = useRef(1);
  const responseTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (responseTimer.current !== null) {
        window.clearTimeout(responseTimer.current);
      }
    },
    []
  );

  function sendMessage(text: string, intent?: ChatIntent): boolean {
    const trimmedText = text.trim();

    if (!trimmedText || isTyping) return false;

    const reply = getChatReply(
      intent ?? detectChatIntent(trimmedText),
      isAuthenticated
    );

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: nextMessageId.current++,
        role: "user",
        text: trimmedText,
      },
    ]);
    setIsTyping(true);

    responseTimer.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: nextMessageId.current++,
          role: "assistant",
          ...reply,
          options: reply.options?.slice(0, 3),
        },
      ]);
      setIsTyping(false);
      responseTimer.current = null;
    }, RESPONSE_DELAY_MS);

    return true;
  }

  function selectOption(option: ChatOption): void {
    sendMessage(option.label, option.intent);
  }

  function resetConversation(): void {
    if (responseTimer.current !== null) {
      window.clearTimeout(responseTimer.current);
      responseTimer.current = null;
    }

    nextMessageId.current = 1;
    setMessages([initialChatMessage]);
    setIsTyping(false);
  }

  return {
    messages,
    isTyping,
    sendMessage,
    selectOption,
    resetConversation,
  };
}
