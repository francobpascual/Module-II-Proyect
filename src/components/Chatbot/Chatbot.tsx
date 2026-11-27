import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bot, MessageCircle, X } from "lucide-react";
import { Link } from "react-router";
import "./Chatbot.css";

const whatsappUrl = "https://wa.me/5493813654038";
const directionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=-26.8365833%2C-65.207167";

const chatOptions = [
  { id: "buy", label: "¿Cómo comprar videojuegos?" },
  { id: "cart", label: "¿Cómo funciona el carrito?" },
  { id: "payment", label: "¿Qué métodos de pago hay?" },
  { id: "compatibility", label: "¿Cómo verificar mi PC?" },
  { id: "checker", label: "Descargar detector de PC" },
  { id: "location", label: "¿Dónde encontrarnos?" },
  { id: "whatsapp", label: "Contactar por WhatsApp" },
] as const;

type ChatTopic = (typeof chatOptions)[number]["id"];

interface ChatAction {
  label: string;
  href: string;
  external?: boolean;
  download?: boolean;
}

interface ChatAnswer {
  message: string;
  action?: ChatAction;
}

const chatAnswers: Record<ChatTopic, ChatAnswer> = {
  buy: {
    message:
      "Explorá el catálogo, elegí un juego y agregalo al carrito. Para finalizar, iniciá sesión y completá el checkout. Es una compra de demostración: no se realizan cobros reales.",
    action: { label: "Explorar el catálogo", href: "/#catalogo" },
  },
  cart: {
    message:
      "El carrito guarda los juegos de tu cuenta en este dispositivo. Desde allí podés revisar o quitar productos y continuar al checkout.",
    action: { label: "Ver mi carrito", href: "/cart" },
  },
  payment: {
    message:
      "El checkout es una simulación académica de pago con tarjeta. No se procesa ningún pago ni se realizan cobros reales.",
    action: { label: "Ir al checkout", href: "/checkout" },
  },
  compatibility: {
    message:
      "Iniciá sesión y registrá los componentes con GAMERLIX PC Checker. En la ficha de un juego con requisitos configurados vas a poder comparar tu PC. La herramienta ofrece una orientación, no mide FPS.",
    action: { label: "Ver los datos de mi PC", href: "/mi-pc" },
  },
  checker: {
    message:
      "El detector está disponible para Windows. Descargalo y ejecutalo; luego iniciá sesión para vincular los datos detectados a tu perfil.",
    action: {
      label: "Descargar detector",
      href: "/downloads/GAMERLIX_PC_Checker_v4.exe",
      download: true,
    },
  },
  location: {
    message:
      "Nos encontrás en RollingCode School, General Paz 570, Barrio Sur, San Miguel de Tucumán.",
    action: {
      label: "Cómo llegar",
      href: directionsUrl,
      external: true,
    },
  },
  whatsapp: {
    message:
      "Podés escribirnos directamente al +54 9 381 365 4038. El chat se abrirá en una nueva pestaña.",
    action: {
      label: "Abrir WhatsApp",
      href: whatsappUrl,
      external: true,
    },
  },
};

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<ChatTopic | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const selectedOption = chatOptions.find(
    (option) => option.id === selectedTopic
  );
  const selectedAnswer = selectedTopic
    ? chatAnswers[selectedTopic]
    : null;

  return (
    <div className="gamer-chat">
      {isOpen && (
        <section
          id="gamer-chat-window"
          className="gamer-chat__panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="gamer-chat-title"
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
              className="gamer-chat__close"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar asistente"
            >
              <X size={19} />
            </button>
          </header>

          <div className="gamer-chat__body" aria-live="polite">
            <p className="gamer-chat__bubble gamer-chat__bubble--bot">
              ¡Hola! Soy el asistente de GAMERLIX. ¿En qué puedo ayudarte?
            </p>

            {selectedOption && selectedAnswer ? (
              <>
                <p className="gamer-chat__bubble gamer-chat__bubble--user">
                  {selectedOption.label}
                </p>
                <p className="gamer-chat__bubble gamer-chat__bubble--bot">
                  {selectedAnswer.message}
                </p>
                {selectedAnswer.action &&
                  (selectedAnswer.action.external ||
                  selectedAnswer.action.download ? (
                    <a
                      className="gamer-chat__action"
                      href={selectedAnswer.action.href}
                      target={
                        selectedAnswer.action.external
                          ? "_blank"
                          : undefined
                      }
                      rel={
                        selectedAnswer.action.external
                          ? "noopener noreferrer"
                          : undefined
                      }
                      download={selectedAnswer.action.download || undefined}
                    >
                      {selectedAnswer.action.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </a>
                  ) : (
                    <Link
                      className="gamer-chat__action"
                      to={selectedAnswer.action.href}
                    >
                      {selectedAnswer.action.label}
                      <ArrowRight size={15} aria-hidden="true" />
                    </Link>
                  ))}
                <button
                  type="button"
                  className="gamer-chat__back"
                  onClick={() => setSelectedTopic(null)}
                >
                  <ArrowLeft size={14} aria-hidden="true" />
                  Volver al menú principal
                </button>
              </>
            ) : (
              <div
                className="gamer-chat__options"
                aria-label="Opciones de ayuda"
              >
                {chatOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedTopic(option.id)}
                  >
                    {option.label}
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <footer className="gamer-chat__footer">
            Asistente automático · GAMERLIX
          </footer>
        </section>
      )}

      <button
        type="button"
        className={`gamer-chat__toggle ${
          isOpen ? "gamer-chat__toggle--open" : ""
        }`}
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Cerrar asistente GAMERLIX" : "Abrir asistente GAMERLIX"}
        aria-expanded={isOpen}
        aria-controls="gamer-chat-window"
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={23} />}
      </button>
    </div>
  );
}

export default Chatbot;
