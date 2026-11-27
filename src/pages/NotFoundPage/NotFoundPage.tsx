import {
  ArrowLeft,
  ArrowRight,
  Gamepad2,
  Medal,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import "./NotFoundPage.css";

const futureFeatures = [
  {
    title: "Torneos GAMERLIX",
    description: "Competí en desafíos especiales.",
    path: "/torneos-gamerlix",
    Icon: Trophy,
  },
  {
    title: "Comunidad Gamer",
    description: "Compartí partidas y descubrimientos.",
    path: "/comunidad-gamer",
    Icon: Users,
  },
  {
    title: "Ranking de jugadores",
    description: "Subí posiciones y ganá reconocimiento.",
    path: "/ranking-gamerlix",
    Icon: Medal,
  },
  {
    title: "GAMERLIX Rewards",
    description: "Beneficios para futuras aventuras.",
    path: "/gamerlix-rewards",
    Icon: Sparkles,
  },
] as const;

function NotFoundPage() {
  return (
    <main className="not-found">
      <div className="not-found__grid" aria-hidden="true" />
      <div className="not-found__content">
        <div className="not-found__heading" data-reveal>
          <div className="not-found__icon" aria-hidden="true">
            <Gamepad2 size={26} />
          </div>
          <p className="not-found__eyebrow">
            GAMERLIX <span>/</span> ZONA DESCONOCIDA
          </p>
          <h1>404</h1>
          <h2>TE FUISTE FUERA DEL MAPA</h2>
          <p className="not-found__description">
            Parece que esta aventura todavía no está disponible. Volvé a una
            zona conocida o explorá el catálogo.
          </p>
          <div className="not-found__actions">
            <Link to="/" className="not-found__button not-found__button--primary">
              <ArrowLeft size={17} aria-hidden="true" />
              VOLVER AL INICIO
            </Link>
            <Link
              to="/#catalogo"
              className="not-found__button not-found__button--secondary"
            >
              EXPLORAR JUEGOS
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <section
          className="not-found__future"
          aria-labelledby="not-found-future-title"
        >
          <div className="not-found__future-heading" data-reveal>
            <span>EN EL HORIZONTE</span>
            <h2 id="not-found-future-title">Próximamente en GAMERLIX</h2>
            <p>
              Estas experiencias son ideas futuras, todavía no están
              disponibles.
            </p>
          </div>
          <div className="not-found__features">
            {futureFeatures.map(({ title, description, path, Icon }) => (
              <Link
                key={path}
                to={path}
                className="not-found__feature"
                aria-label={`${title}, funcionalidad futura. Abrir página 404.`}
                data-reveal
              >
                <Icon size={22} aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                  <em>FUNCIONALIDAD FUTURA</em>
                </span>
                <ArrowRight
                  className="not-found__feature-arrow"
                  size={17}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default NotFoundPage;
