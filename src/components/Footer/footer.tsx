
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MapPin, X } from "lucide-react";
import InteractiveBackground from "../InteractiveBackground/InteractiveBackground";
import "./footer.css";

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

export default function Footer() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const mapDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = mapDialogRef.current;

    if (!dialog) return;

    if (isMapOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isMapOpen && dialog.open) {
      dialog.close();
    }
  }, [isMapOpen]);

  return (
    <footer className="cinematic-footer">
      <InteractiveBackground />
      <div className="cinematic-footer__glow" aria-hidden="true" />

      <div className="cinematic-footer__container">
        <div className="cinematic-footer__main">
          <div className="cinematic-footer__brand-area" data-reveal>
            <Link to="/" className="cinematic-footer__brand">
              <span className="cinematic-footer__symbol">X</span>
              <span>GAMERLIX</span>
            </Link>

            <p className="cinematic-footer__description">
              Tu próxima aventura comienza acá. Encontrá tu siguiente mundo
              para explorar.
            </p>
          </div>

          <div className="cinematic-footer__links-area" data-reveal>
            <h3 className="cinematic-footer__heading">
              EXPLORAR
            </h3>

            <nav
              className="cinematic-footer__links"
              aria-label="Explorar GAMERLIX"
            >
              <Link to="/">Inicio</Link>
              <Link to="/#catalogo">Catálogo</Link>
              <Link to="/upcoming">Próximos lanzamientos</Link>
              <Link to="/#ubicacion">Ubicación</Link>
            </nav>
          </div>

          <section
            id="ubicacion"
            className="cinematic-footer__location-area"
            aria-labelledby="footer-location-heading"
            data-reveal
          >
            <h3
              id="footer-location-heading"
              className="cinematic-footer__heading"
            >
              ¿DÓNDE ENCONTRARNOS?
            </h3>
            <button
              type="button"
              className="cinematic-footer__directions"
              onClick={() => setIsMapOpen(true)}
            >
              CÓMO LLEGAR
              <MapPin size={15} aria-hidden="true" />
            </button>
          </section>

          <div className="cinematic-footer__social-area" data-reveal>
            <h3 className="cinematic-footer__heading">
              CONECTÁ CON GAMERLIX
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

            <a
              href="https://wa.me/5493813654038"
              target="_blank"
              rel="noopener noreferrer"
              className="cinematic-footer__whatsapp"
              aria-label="Contactar a GAMERLIX por WhatsApp al +54 9 381 365 4038"
              title="Contactar por WhatsApp"
            >
              <svg
                viewBox="0 0 32 32"
                role="img"
                aria-hidden="true"
              >
                <path
                  d="M16 3.2a12.3 12.3 0 0 0-10.5 18.7L4 28l6.3-1.6A12.3 12.3 0 1 0 16 3.2Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.1 10.1c-.3-.7-.6-.7-.9-.7h-.8c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.5 1.5 3.8c.2.2 2.6 4.1 6.4 5.6 3.2 1.2 3.8.9 4.5.8.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.6.2-1.8-.1-.2-.4-.3-.9-.6-.5-.2-2.2-1.1-2.6-1.2-.4-.1-.6-.2-.9.2-.3.5-1 1.2-1.2 1.5-.2.3-.5.3-.9.1-.5-.2-1.8-.7-3.4-2.2-1.2-1.1-2.1-2.5-2.3-2.9-.2-.4 0-.6.2-.8.2-.2.4-.5.7-.8.2-.3.3-.5.5-.8.1-.3 0-.6 0-.8-.1-.2-.8-1.9-1.1-2.6Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="cinematic-footer__bottom">
          <p>
            © {new Date().getFullYear()} GAMERLIX.
            {" "}
            Todos los derechos reservados.
          </p>

          <p>Diseñado para jugadores.</p>
        </div>
      </div>

      <dialog
        ref={mapDialogRef}
        className="cinematic-footer__map-dialog"
        aria-labelledby="footer-map-title"
        onClose={() => setIsMapOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setIsMapOpen(false);
          }
        }}
      >
        <div className="cinematic-footer__map-dialog-content">
          <div className="cinematic-footer__map-dialog-header">
            <div>
              <h2
                id="footer-map-title"
                className="cinematic-footer__map-dialog-title"
              >
                ¿DÓNDE ENCONTRARNOS?
              </h2>
              <p className="cinematic-footer__address">
                <MapPin size={18} aria-hidden="true" />
                <span>
                  RollingCode School, General Paz 570, Barrio Sur,
                  San Miguel de Tucumán, Tucumán
                </span>
              </p>
            </div>
            <button
              type="button"
              className="cinematic-footer__map-close"
              aria-label="Cerrar mapa"
              onClick={() => setIsMapOpen(false)}
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <div className="cinematic-footer__map">
            <iframe
              title="Mapa de RollingCode School, San Miguel de Tucumán"
              src="https://maps.google.com/maps?q=-26.8365833%2C-65.207167&z=17&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </dialog>
    </footer>
  );
}
