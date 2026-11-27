export type ChatIntent =
  | "buy"
  | "purchase-guide"
  | "catalog"
  | "cart"
  | "payment"
  | "payment-details"
  | "compatibility"
  | "pc-data"
  | "checker"
  | "help"
  | "contact"
  | "whatsapp"
  | "location"
  | "login"
  | "register"
  | "main-menu"
  | "greeting"
  | "unknown";

export interface ChatAction {
  label: string;
  href: string;
  kind: "route" | "external" | "download";
}

export interface ChatOption {
  id: string;
  label: string;
  intent: ChatIntent;
}

export interface ChatMessage {
  id: number;
  role: "assistant" | "user";
  text: string;
  action?: ChatAction;
  options?: ChatOption[];
}

export interface ChatReply {
  text: string;
  action?: ChatAction;
  options?: ChatOption[];
}

export const initialChatMessage: ChatMessage = {
  id: 0,
  role: "assistant",
  text: "¡Hola! Soy el asistente de GAMERLIX. ¿En qué puedo ayudarte?",
};

const mainOptions: ChatOption[] = [
  { id: "main-buy", label: "Compras", intent: "buy" },
  {
    id: "main-computer",
    label: "Mi computadora",
    intent: "compatibility",
  },
  { id: "main-contact", label: "Contacto", intent: "contact" },
];

const unknownOptions: ChatOption[] = [
  { id: "unknown-buy", label: "Compras", intent: "buy" },
  {
    id: "unknown-compatibility",
    label: "Compatibilidad de juegos",
    intent: "compatibility",
  },
  { id: "unknown-contact", label: "Contacto", intent: "contact" },
];

const purchaseOptions: ChatOption[] = [
  {
    id: "purchase-guide",
    label: "Cómo comprar un videojuego",
    intent: "purchase-guide",
  },
  { id: "purchase-catalog", label: "Ver catálogo", intent: "catalog" },
  { id: "purchase-cart", label: "Consultar carrito", intent: "cart" },
];

const compatibilityOptions: ChatOption[] = [
  {
    id: "compatibility-pc",
    label: "Ver datos de mi PC",
    intent: "pc-data",
  },
  {
    id: "compatibility-checker",
    label: "Descargar detector de PC",
    intent: "checker",
  },
  {
    id: "compatibility-catalog",
    label: "Explorar videojuegos",
    intent: "catalog",
  },
];

const paymentOptions: ChatOption[] = [
  { id: "payment-cart", label: "Ver carrito", intent: "cart" },
  {
    id: "payment-details",
    label: "Cómo funciona el pago",
    intent: "payment-details",
  },
];

const followUpOptions: ChatOption[] = [
  { id: "follow-up-buy", label: "Compras", intent: "buy" },
  { id: "follow-up-contact", label: "Contacto", intent: "contact" },
  { id: "follow-up-menu", label: "Menú principal", intent: "main-menu" },
];

const contactOptions: ChatOption[] = [
  { id: "contact-whatsapp", label: "Contactar por WhatsApp", intent: "whatsapp" },
  { id: "contact-location", label: "Ver ubicación", intent: "location" },
  { id: "contact-menu", label: "Menú principal", intent: "main-menu" },
];

const whatsappAction: ChatAction = {
  label: "Abrir WhatsApp",
  href: "https://wa.me/5493813654038",
  kind: "external",
};

const directionsAction: ChatAction = {
  label: "Cómo llegar",
  href: "https://www.google.com/maps/dir/?api=1&destination=-26.8365833%2C-65.207167",
  kind: "external",
};

const catalogAction: ChatAction = {
  label: "Explorar el catálogo",
  href: "/#catalogo",
  kind: "route",
};

function routeAction(label: string, href: string): ChatAction {
  return { label, href, kind: "route" };
}

function protectedAction(
  isAuthenticated: boolean,
  label: string,
  href: string
): ChatAction {
  return isAuthenticated
    ? routeAction(label, href)
    : routeAction("Iniciar sesión", "/login");
}

function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function detectChatIntent(text: string): ChatIntent {
  const query = normalizeText(text);

  if (/\b(whatsapp|wsp|wasap)\b/.test(query)) return "whatsapp";
  if (/\b(donde|direccion|ubicacion|mapa|llegar)\b/.test(query)) {
    return "location";
  }
  if (/\b(pagar|pago|checkout|tarjeta|metodo de pago)\b/.test(query)) {
    return "payment";
  }
  if (/\b(carrito)\b/.test(query)) return "cart";
  if (/\b(detector|descargar)\b/.test(query)) return "checker";
  if (
    /\b(datos|perfil)\b/.test(query) &&
    /\b(pc|computadora)\b/.test(query)
  ) {
    return "pc-data";
  }
  if (
    /\b(pc|computadora|ejecutar|compatibilidad|compatible|requisitos)\b/.test(
      query
    )
  ) {
    return "compatibility";
  }
  if (/\b(registrarme|registro|crear cuenta)\b/.test(query)) {
    return "register";
  }
  if (/\b(login|iniciar sesion|iniciar|ingresar|acceder)\b/.test(query)) {
    return "login";
  }
  if (/\b(comprar|compra|compras|catalogo|juego|videojuego|tienda)\b/.test(query)) {
    return "buy";
  }
  if (/\b(contacto|contactar|telefono|comunicarme)\b/.test(query)) {
    return "contact";
  }
  if (/\b(ayuda|ayudar|soporte|opciones)\b/.test(query)) return "help";
  if (/\b(hola|buenas|buenos dias|buenas tardes)\b/.test(query)) {
    return "greeting";
  }
  if (/\b(menu principal|volver al menu|menu)\b/.test(query)) {
    return "main-menu";
  }

  return "unknown";
}

export function getChatReply(
  intent: ChatIntent,
  isAuthenticated: boolean
): ChatReply {
  switch (intent) {
    case "buy":
      return {
        text: "¡Perfecto! ¿Qué necesitás saber sobre las compras?",
        options: purchaseOptions,
      };
    case "purchase-guide":
      return {
        text:
          "Elegí un videojuego del catálogo, agregalo al carrito y, al terminar, iniciá sesión para continuar al checkout. Es una compra de demostración: no se realizan cobros reales.",
        action: catalogAction,
        options: [
          purchaseOptions[1],
          purchaseOptions[2],
          { id: "guide-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "catalog":
      return {
        text:
          "En el catálogo podés explorar los videojuegos y abrir cada ficha para ver sus detalles y requisitos.",
        action: catalogAction,
        options: [
          purchaseOptions[0],
          purchaseOptions[2],
          { id: "catalog-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "cart":
      return {
        text: isAuthenticated
          ? "Desde el carrito podés revisar los juegos, quitar productos y continuar al checkout."
          : "Para consultar tu carrito, primero iniciá sesión. Tus juegos se guardan asociados a tu cuenta en este dispositivo.",
        action: protectedAction(isAuthenticated, "Ver carrito", "/cart"),
        options: [
          paymentOptions[1],
          followUpOptions[0],
          { id: "cart-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "payment":
      return {
        text: "Puedo ayudarte con el proceso de compra",
        options: paymentOptions,
      };
    case "payment-details":
      return {
        text:
          "El checkout simula un pago con tarjeta para fines académicos. No procesa pagos ni realiza cobros reales.",
        action: protectedAction(isAuthenticated, "Continuar al checkout", "/checkout"),
        options: [
          paymentOptions[0],
          purchaseOptions[0],
          { id: "payment-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "compatibility":
      return {
        text:
          "Podemos comprobar los requisitos del juego con las características de tu computadora",
        options: compatibilityOptions,
      };
    case "pc-data":
      return {
        text: isAuthenticated
          ? "Desde tus datos de PC podés revisar la información vinculada a tu perfil. En las fichas de juegos configuradas, compará los requisitos con tu equipo."
          : "Para ver los datos de tu PC, primero iniciá sesión. Si todavía no registraste el equipo, podés descargar el detector.",
        action: protectedAction(isAuthenticated, "Ver datos de mi PC", "/mi-pc"),
        options: [
          compatibilityOptions[1],
          compatibilityOptions[2],
          { id: "pc-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "checker":
      return {
        text:
          "El detector está disponible para Windows. Descargalo y ejecutalo; luego iniciá sesión para vincular los datos detectados a tu perfil.",
        action: {
          label: "Descargar detector",
          href: "/downloads/GAMERLIX_PC_Checker_v5.exe",
          kind: "download",
        },
        options: [
          compatibilityOptions[0],
          compatibilityOptions[2],
          { id: "checker-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "help":
      return {
        text: "¿Con qué tema necesitás ayuda?",
        options: mainOptions,
      };
    case "contact":
      return {
        text: "¿Cómo preferís contactar a GAMERLIX?",
        options: contactOptions,
      };
    case "whatsapp":
      return {
        text:
          "Podés escribirnos directamente al +54 9 381 365 4038. El chat se abrirá en una nueva pestaña.",
        action: whatsappAction,
        options: [
          contactOptions[1],
          { id: "whatsapp-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "location":
      return {
        text:
          "Nos encontrás en RollingCode School, General Paz 570, Barrio Sur, San Miguel de Tucumán.",
        action: directionsAction,
        options: [
          contactOptions[0],
          { id: "location-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "login":
      return {
        text: "Ingresá con tu cuenta para acceder al carrito y a tus datos de PC.",
        action: routeAction("Iniciar sesión", "/login"),
        options: [
          { id: "login-register", label: "Registrarme", intent: "register" },
          { id: "login-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "register":
      return {
        text: "Podés crear una cuenta personal desde el formulario de registro.",
        action: routeAction("Crear cuenta", "/register"),
        options: [
          { id: "register-login", label: "Iniciar sesión", intent: "login" },
          { id: "register-menu", label: "Menú principal", intent: "main-menu" },
        ],
      };
    case "main-menu":
      return {
        text: "¡Hola! Soy el asistente de GAMERLIX. ¿En qué puedo ayudarte?",
        options: mainOptions,
      };
    case "greeting":
      return {
        text: "¡Hola! ¿En qué tema necesitás ayuda?",
        options: mainOptions,
      };
    case "unknown":
      return {
        text:
          "No encontré una respuesta específica para tu consulta. ¿Querés que te ayude con compras, compatibilidad de juegos o contacto?",
        options: unknownOptions,
      };
  }
}
