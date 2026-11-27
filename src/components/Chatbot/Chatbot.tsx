import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import {
  ArrowRight,
  Bot,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import { Link } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import type { ChatAction } from "./chatbotConfig";
import { useChatConversation } from "./useChatConversation";
import "./Chatbot.css";

interface FooterLayout {
  bottomOffset: number;
  panelMaxHeight: number | null;
  hideWidget: boolean;
}

const initialFooterLayout: FooterLayout = {
  bottomOffset: 0,
  panelMaxHeight: null,
  hideWidget: false,
};

function Chatbot() {
  const { isAuthenticated } = useAuth();
  const {
    messages,
    isTyping,
    sendMessage,
    selectOption,
    resetConversation,
  } = useChatConversation(isAuthenticated);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [footerLayout, setFooterLayout] =
    useState<FooterLayout>(initialFooterLayout);
  const bodyRef = useRef<HTMLDivElement>(null);
  const lastMessageId = messages[messages.length - 1]?.id;

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !bodyRef.current) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    bodyRef.current.scrollTo({
      top: bodyRef.current.scrollHeight,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [isOpen, isTyping, messages]);

  useEffect(() => {
    const footer = document.querySelector<HTMLElement>(".cinematic-footer");
    if (!footer) return;

    let frameId = 0;
    let previousLayout = initialFooterLayout;

    const updateFooterLayout = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const bounds = footer.getBoundingClientRect();
        const footerIsVisible =
          bounds.top < window.innerHeight && bounds.bottom > 0;

        const nextLayout: FooterLayout = footerIsVisible
          ? {
              bottomOffset: Math.max(
                0,
                Math.ceil(window.innerHeight - bounds.top + 20)
              ),
              panelMaxHeight: Math.max(
                0,
                Math.min(590, Math.floor(bounds.top - 104))
              ),
              hideWidget: bounds.top - 104 < 220,
            }
          : initialFooterLayout;

        if (
          previousLayout.bottomOffset !== nextLayout.bottomOffset ||
          previousLayout.panelMaxHeight !== nextLayout.panelMaxHeight ||
          previousLayout.hideWidget !== nextLayout.hideWidget
        ) {
          previousLayout = nextLayout;
          setFooterLayout(nextLayout);
        }
      });
    };

    updateFooterLayout();
    window.addEventListener("scroll", updateFooterLayout, { passive: true });
    window.addEventListener("resize", updateFooterLayout);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateFooterLayout);
      window.removeEventListener("resize", updateFooterLayout);
    };
  }, []);

  function submitMessage(): void {
    if (sendMessage(input)) setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    submitMessage();
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>): void {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      submitMessage();
    }
  }

  function handleReset(): void {
    resetConversation();
    setInput("");
  }

  function renderAction(action: ChatAction) {
    if (action.kind === "route") {
      return (
        <Link
          className="gamer-chat__action"
          to={action.href}
          onClick={() => setIsOpen(false)}
        >
          {action.label}
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      );
    }

    return (
      <a
        className="gamer-chat__action"
        href={action.href}
        target={action.kind === "external" ? "_blank" : undefined}
        rel={action.kind === "external" ? "noopener noreferrer" : undefined}
        download={action.kind === "download" ? true : undefined}
        onClick={() => setIsOpen(false)}
      >
        {action.label}
        <ArrowRight size={15} aria-hidden="true" />
      </a>
    );
  }

  const widgetStyle = {
    ...(footerLayout.bottomOffset > 0
      ? {
          bottom: `calc(${footerLayout.bottomOffset}px + env(safe-area-inset-bottom))`,
        }
      : {}),
    ...(footerLayout.hideWidget ? { visibility: "hidden" as const } : {}),
  };

  const panelStyle =
    footerLayout.panelMaxHeight === null
      ? undefined
      : { maxHeight: `${footerLayout.panelMaxHeight}px` };

  return (
    <div className="gamer-chat" style={widgetStyle}>
      {isOpen && (
        <section
          id="gamer-chat-window"
          className="gamer-chat__panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="gamer-chat-title"
          style={panelStyle}
        >
          <header className="gamer-chat__header">
            <span className="gamer-chat__avatar" aria-hidden="true">
              <Bot size={21} />
            </span>
            <div className="gamer-chat__heading">
              <h2 id="gamer-chat-title">ASISTENTE GAMERLIX</h2>
              <p>
                <span aria-hidden="true" />
                Ayuda automática
              </p>
            </div>
            <button
              type="button"
              className="gamer-chat__reset"
              onClick={handleReset}
              aria-label="Reiniciar conversación"
              title="Reiniciar conversación"
            >
              <RotateCcw size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="gamer-chat__close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar asistente"
            >
              <X size={19} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={bodyRef}
            className="gamer-chat__body"
            role="log"
            aria-label="Conversación con el asistente"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`gamer-chat__message gamer-chat__message--${message.role}`}
              >
                <p className="gamer-chat__bubble">{message.text}</p>

                {message.action && renderAction(message.action)}

                {message.role === "assistant" &&
                  message.id === lastMessageId &&
                  message.options &&
                  message.options.length > 0 && (
                    <div
                      className="gamer-chat__options"
                      role="group"
                      aria-label="Opciones de respuesta"
                    >
                      {message.options.slice(0, 3).map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => selectOption(option)}
                        >
                          {option.label}
                          <ArrowRight size={14} aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isTyping && (
              <div
                className="gamer-chat__message gamer-chat__message--assistant"
                role="status"
                aria-label="El asistente está escribiendo"
              >
                <div className="gamer-chat__typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
          </div>

          <footer className="gamer-chat__footer">
            <form
              className="gamer-chat__composer"
              onSubmit={handleSubmit}
            >
              <label className="gamer-chat__sr-only" htmlFor="gamer-chat-input">
                Escribí tu consulta...
              </label>
              <textarea
                id="gamer-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Escribí tu consulta..."
                rows={1}
                aria-label="Escribí tu consulta..."
              />
              <button
                type="submit"
                className="gamer-chat__send"
                disabled={!input.trim() || isTyping}
                aria-label="Enviar mensaje"
                title="Enviar mensaje"
              >
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
            <p className="gamer-chat__disclaimer">
              Asistente automático · respuestas locales
            </p>
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`gamer-chat__toggle ${
          isOpen ? "gamer-chat__toggle--open" : ""
        }`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
          isOpen ? "Cerrar asistente GAMERLIX" : "Abrir asistente GAMERLIX"
        }
        aria-expanded={isOpen}
        aria-controls="gamer-chat-window"
        hidden={footerLayout.hideWidget}
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}

export default Chatbot;
