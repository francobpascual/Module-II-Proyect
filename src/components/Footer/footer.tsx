
import { useEffect, useState } from "react";
import { Link } from "react-router";
import "./footer.css";

type Language = "es" | "en";
type SocialPlatform = "instagram" | "facebook" | "youtube" | "github";

const socialLinks: {
  name: SocialPlatform;
  label: string;
  url: string;
}[] = [
  {
    name: "instagram",
    label: "Instagram",
    url: "https://www.instagram.com/",
  },
  {
    name: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/",
  },
  {
    name: "youtube",
    label: "YouTube",
    url: "https://www.youtube.com/",
  },
  {
    name: "github",
    label: "GitHub",
    url: "https://github.com/",
  },
];

function SocialIcon({ name }: { name: SocialPlatform }) {
  switch (name) {
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle
            cx="12"
            cy="12"
            r="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" />
        </svg>
      );

    case "facebook":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M14.5 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3-.1-1.4-.2-2.5-.2-2.6 0-4.4 1.6-4.4 4.5v1.9H8V13h2.9v8h3.6Z" />
        </svg>
      );

    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect
            x="2.5"
            y="5.5"
            width="19"
            height="13"
            rx="4"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <path d="m10 9 5 3-5 3V9Z" fill="currentColor" />
        </svg>
      );

    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.14-1.1-1.44-1.1-1.44-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.36 1.08 2.94.82.09-.65.35-1.08.64-1.33-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.67-.1-.25-.45-1.26.1-2.63 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0 1 12 6.8c.85 0 1.7.11 2.5.34 1.9-1.29 2.74-1.02 2.74-1.02.55 1.37.2 2.38.1 2.63.64.69 1.02 1.58 1.02 2.67 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.81c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
        </svg>
      );
  }
}

const translations = {
  es: {
    description: "Tu próxima aventura comienza acá.",
    navigation: "EXPLORAR",
    home: "Inicio",
    store: "Tienda de juegos",
    about: "Acerca de",
    community: "SEGUINOS",
    language: "IDIOMA",
    rights: "Todos los derechos reservados.",
    made: "Diseñado para jugadores.",
  },
  en: {
    description: "Your next adventure starts here.",
    navigation: "EXPLORE",
    home: "Home",
    store: "Game store",
    about: "About us",
    community: "FOLLOW US",
    language: "LANGUAGE",
    rights: "All rights reserved.",
    made: "Designed for gamers.",
  },
};

export default function Footer() {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("site-language");
    return saved === "en" ? "en" : "es";
  });

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    localStorage.setItem("site-language", language);
    window.dispatchEvent(
      new CustomEvent("site-language-change", {
        detail: { language },
      })
    );
  }, [language]);

  return (
    <footer className="cinematic-footer">
      <div className="cinematic-footer__glow" aria-hidden="true" />

      <div className="cinematic-footer__container">
        <div className="cinematic-footer__main">
          <div className="cinematic-footer__brand-area">
            <Link to="/" className="cinematic-footer__brand">
              <span className="cinematic-footer__symbol">X</span>
              <span>GAMERLIX</span>
            </Link>

            <p className="cinematic-footer__description">
              {t.description}
            </p>
          </div>

          <div className="cinematic-footer__links-area">
            <h3 className="cinematic-footer__heading">
              {t.navigation}
            </h3>

            <nav
              className="cinematic-footer__links"
              aria-label={t.navigation}
            >
              <Link to="/">{t.home}</Link>
              <a href="/#catalogo">{t.store}</a>
              <Link to="/about">{t.about}</Link>
            </nav>
          </div>

          <div className="cinematic-footer__social-area">
            <h3 className="cinematic-footer__heading">
              {t.community}
            </h3>

            <div className="cinematic-footer__social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cinematic-footer__social-link"
                  aria-label={social.label}
                  title={social.label}
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>

            <div className="cinematic-footer__language-area">
              <label
                htmlFor="footer-language"
                className="cinematic-footer__language-label"
              >
                {t.language}
              </label>

              <select
                id="footer-language"
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as Language)
                }
                className="cinematic-footer__language-select"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <div className="cinematic-footer__bottom">
          <p>
            © {new Date().getFullYear()} GAMERLIX.
            {" "}
            {t.rights}
          </p>

          <p>{t.made}</p>
        </div>
      </div>
    </footer>
  );
}
